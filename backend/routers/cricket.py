"""
Cricket data router — wraps cricapi.com to provide live match data
and converts it into MatchStateInput-compatible dicts.
"""

import os
import re
import json
import httpx
from fastapi import APIRouter, HTTPException
from google import genai
from google.genai import types

router = APIRouter(prefix="/cricket", tags=["Cricket Data"])

_genai_client: genai.Client | None = None

def _get_genai_client() -> genai.Client | None:
    global _genai_client
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return None
    if _genai_client is None:
        _genai_client = genai.Client(api_key=api_key)
    return _genai_client

BASE = "https://api.cricapi.com/v1"


# ── helpers ──────────────────────────────────────────────────────────────────

async def _get(endpoint: str, **params) -> dict:
    api_key = os.environ.get("CRICKET_API_KEY", "")
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(f"{BASE}/{endpoint}", params={"apikey": api_key, **params})
        r.raise_for_status()
    data = r.json()
    if data.get("status") == "failure":
        raise HTTPException(400, detail=data.get("reason", "Cricket API error"))
    return data


def _parse_score(s: str) -> dict:
    """
    Parse strings like '182/3 (18.4 Ov, RR:9.89)' or '182/3 (20 Ov)'.
    Returns {runs, wickets, overs, rr}.
    """
    out = {"runs": 0, "wickets": 0, "overs": 0.0, "rr": None}
    if not s:
        return out
    try:
        m = re.match(r"(\d+)/(\d+)\s*\(([0-9.]+)\s*Ov(?:,\s*RR:([0-9.]+))?\)", s.strip())
        if m:
            out["runs"]    = int(m.group(1))
            out["wickets"] = int(m.group(2))
            out["overs"]   = float(m.group(3))
            if m.group(4):
                out["rr"] = float(m.group(4))
    except Exception:
        pass
    return out


def _over_ball(overs_float: float) -> tuple[int, int]:
    """
    18.4 → over 19, ball 5 (next delivery to be bowled).
    Returns (over_number 1-20, ball_number 1-6).
    """
    completed = int(overs_float)
    balls_done = round((overs_float - completed) * 10)
    if balls_done >= 6:
        return min(completed + 2, 20), 1
    return min(completed + 1, 20), min(balls_done + 1, 6)


def _clean_team(name: str) -> str:
    """Strip shortname suffix like ' [MI]'."""
    return re.sub(r"\s*\[[A-Z-]+\]$", "", name).strip()


def _build_state(t1: str, t2: str, t1s: str, t2s: str, venue: str, match_name: str) -> dict:
    """Map score strings + team names into a MatchStateInput-compatible dict."""
    s1 = _parse_score(t1s)
    s2 = _parse_score(t2s)

    if s2["runs"] > 0 or s2["overs"] > 0:
        # 2nd innings in progress
        innings       = 2
        batting_team  = t2
        bowling_team  = t1
        score         = s2["runs"]
        wickets       = s2["wickets"]
        overs_f       = s2["overs"]
        target        = s1["runs"] + 1 if s1["runs"] > 0 else None
        runs_needed   = (target - score) if target else None
        overs_left    = round(20 - overs_f, 1)
        rrr           = round(runs_needed / overs_left, 2) if (runs_needed and overs_left > 0) else None
    elif s1["runs"] > 0 or s1["overs"] > 0:
        # 1st innings in progress
        innings       = 1
        batting_team  = t1
        bowling_team  = t2
        score         = s1["runs"]
        wickets       = s1["wickets"]
        overs_f       = s1["overs"]
        target        = None
        rrr           = None
    else:
        # Match hasn't started yet
        innings       = 1
        batting_team  = t1
        bowling_team  = t2
        score         = 0
        wickets       = 0
        overs_f       = 0.0
        target        = None
        rrr           = None

    over, ball = _over_ball(overs_f)

    return {
        "innings":               innings,
        "over":                  over,
        "ball":                  ball,
        "current_score":         score,
        "wickets":               wickets,
        "team_batting":          batting_team,
        "team_bowling":          bowling_team,
        "striker":               "",
        "non_striker":           "",
        "bowlers_remaining":     {},
        "pitch_conditions":      "flat",
        "dew_factor":            3,
        "venue":                 venue,
        "target":                target,
        "required_run_rate":     rrr,
        "impact_player_available": True,
        "powerplay_active":      over <= 6,
        "death_overs":           over >= 16,
        "notes":                 f"Auto-imported: {match_name}",
    }


async def _fetch_playing_xi(batting_team: str, bowling_team: str, match_name: str) -> dict:
    """Use Gemini + Google Search to find the current playing XI and batting pair."""
    client = _get_genai_client()
    if not client:
        return {"striker": "", "non_striker": "", "batting_players": [], "bowling_players": []}

    prompt = (
        f"Search Google for the current cricket match: {match_name} "
        f"({batting_team} vs {bowling_team}). Find:\n"
        f"1. The current playing XI for {batting_team} (batting team)\n"
        f"2. The current playing XI for {bowling_team} (bowling team)\n"
        f"3. Who is currently batting (striker and non-striker), or the likely opening pair if the match just started\n\n"
        f"Return ONLY a JSON object with these exact fields:\n"
        f'{{"striker": "Player Name", "non_striker": "Player Name", '
        f'"batting_players": ["Name1", "Name2", ...11 names], '
        f'"bowling_players": ["Name1", "Name2", ...11 names]}}\n'
        f"No markdown, no explanation."
    )

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                tools=[types.Tool(google_search=types.GoogleSearch())],
                temperature=0.1,
            ),
        )
        raw = response.text or "{}"
        raw = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("`").strip()
        data = json.loads(raw)
        return {
            "striker": str(data.get("striker", "")),
            "non_striker": str(data.get("non_striker", "")),
            "batting_players": [str(p) for p in data.get("batting_players", [])],
            "bowling_players": [str(p) for p in data.get("bowling_players", [])],
        }
    except Exception:
        return {"striker": "", "non_striker": "", "batting_players": [], "bowling_players": []}


# ── routes ────────────────────────────────────────────────────────────────────

@router.get("/matches")
async def list_matches():
    """
    Return upcoming and live T20 matches sorted by status (live → fixture → result).
    """
    data = await _get("cricScore")
    raw  = data.get("data", [])

    ORDER = {"live": 0, "fixture": 1, "result": 2}
    t20   = [m for m in raw if m.get("matchType") == "t20"]
    t20.sort(key=lambda m: ORDER.get(m.get("ms", "fixture"), 3))

    matches = []
    for m in t20:
        matches.append({
            "id":          m["id"],
            "t1":          _clean_team(m.get("t1", "Team A")),
            "t2":          _clean_team(m.get("t2", "Team B")),
            "t1img":       m.get("t1img", ""),
            "t2img":       m.get("t2img", ""),
            "t1s":         m.get("t1s", ""),
            "t2s":         m.get("t2s", ""),
            "series":      m.get("series", ""),
            "status":      m.get("status", ""),
            "ms":          m.get("ms", "fixture"),
            "dateTimeGMT": m.get("dateTimeGMT", ""),
        })

    return {"matches": matches}


@router.get("/match/{match_id}/state")
async def get_match_state(match_id: str):
    """
    Fetch a match and return a pre-filled MatchStateInput dict.
    Player names are left blank for the user to complete.
    """
    # currentMatches has venue + score array
    cm_data  = await _get("currentMatches")
    cm       = {m["id"]: m for m in cm_data.get("data", [])}

    # cricScore has live score strings
    cs_data  = await _get("cricScore")
    cs       = {m["id"]: m for m in cs_data.get("data", [])}

    if match_id not in cm and match_id not in cs:
        raise HTTPException(404, detail="Match not found")

    match      = cm.get(match_id) or {}
    score_info = cs.get(match_id) or {}

    # Team names
    teams = match.get("teams", [])
    t1    = _clean_team(teams[0]) if len(teams) > 0 else _clean_team(score_info.get("t1", "Team A"))
    t2    = _clean_team(teams[1]) if len(teams) > 1 else _clean_team(score_info.get("t2", "Team B"))

    # Score strings — prefer cricScore live strings, fall back to building from array
    t1s = score_info.get("t1s", "")
    t2s = score_info.get("t2s", "")
    if not t1s:
        scores = match.get("score", [])
        if scores:
            s = scores[0]
            t1s = f"{s.get('r',0)}/{s.get('w',0)} ({s.get('o',0)} Ov)"
        if len(scores) > 1:
            s = scores[1]
            t2s = f"{s.get('r',0)}/{s.get('w',0)} ({s.get('o',0)} Ov)"

    venue      = match.get("venue", "")
    match_name = match.get("name", score_info.get("series", f"{t1} vs {t2}"))

    state = _build_state(t1, t2, t1s, t2s, venue, match_name)

    # Auto-fetch playing XI and current batsmen via Gemini + Google Search
    batting_team  = state["team_batting"]
    bowling_team  = state["team_bowling"]
    players       = await _fetch_playing_xi(batting_team, bowling_team, match_name)

    state["striker"]         = players["striker"]
    state["non_striker"]     = players["non_striker"]
    state["batting_players"] = players["batting_players"]
    state["bowling_players"] = players["bowling_players"]

    return {
        "state":      state,
        "match_name": match_name,
        "t1":         t1,
        "t2":         t2,
        "t1s":        t1s,
        "t2s":        t2s,
        "series":     match.get("name", score_info.get("series", "")),
    }
