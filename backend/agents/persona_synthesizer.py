"""
OASIS Persona Synthesizer — generates 3 grounded personas from the match state.
Uses Gemini to dynamically create distinct coaching/analyst archetypes.
"""

import os
import json
import re
from google import genai
from google.genai import types
from models.schemas import MatchStateInput, PersonaProfile


PERSONA_SYNTHESIZER_PROMPT = """You are the 'OASIS Persona Synthesizer'.

Given the current cricket match state, generate exactly 3 distinct personas who will debate tactical decisions.
Each persona must reflect a genuinely different coaching philosophy grounded in cricket culture.

Return a JSON array with exactly 3 objects. Each object must have:
- "name": A memorable name (e.g., "Coach Baz", "Data Dravid", "Old-School Rao")
- "background": 1 sentence on their cricket background and personality.
- "core_philosophy": Their tactical philosophy in one pithy sentence.
- "bias": Their specific blind spot or tendency (e.g., "Overuses pace in death overs").

Ground the personas in the match context:
- If it's a chase, create a risk-taker, a conservative, and a data-purist.
- If dew is high, one persona must factor this heavily.
- Make them genuinely different — not 3 variations of "aggressive batting".

Return ONLY a valid JSON array. No markdown, no explanation.
"""


def synthesize_personas(match_state: MatchStateInput) -> list[PersonaProfile]:
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return _fallback_personas()

    client = genai.Client(api_key=api_key)

    ms = match_state.model_dump()

    batting_players = ms.get("batting_players") or []
    bowling_players = ms.get("bowling_players") or []
    striker         = ms.get("striker", "")

    striker_line = f"Striker: {striker}" if striker else "Striker: not confirmed"
    batting_xi   = f"Batting XI: {', '.join(batting_players)}" if batting_players else ""
    bowling_xi   = f"Bowling XI: {', '.join(bowling_players)}" if bowling_players else ""

    context = (
        f"Match: {ms['team_batting']} vs {ms['team_bowling']}\n"
        f"Score: {ms['current_score']}/{ms['wickets']} after {ms['over']}.{ms['ball']} overs\n"
        f"Venue: {ms.get('venue', 'IPL venue')} | Pitch: {ms['pitch_conditions']} | Dew: {ms['dew_factor']}/10\n"
        f"{'2nd innings chasing ' + str(ms['target']) if ms.get('target') else '1st innings'}\n"
        f"{striker_line}"
        + (f"\n{batting_xi}" if batting_xi else "")
        + (f"\n{bowling_xi}" if bowling_xi else "")
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Generate 3 distinct coaching personas for this match situation:\n\n{context}",
        config=types.GenerateContentConfig(
            system_instruction=PERSONA_SYNTHESIZER_PROMPT,
            temperature=0.85,
        ),
    )

    raw = response.text or "[]"
    raw = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("`").strip()

    try:
        personas_data = json.loads(raw)
        return [PersonaProfile(**p) for p in personas_data[:3]]
    except (json.JSONDecodeError, Exception):
        return _fallback_personas()


def _fallback_personas() -> list[PersonaProfile]:
    return [
        PersonaProfile(
            name="Coach Baz",
            background="Former Australian batsman turned IPL franchise director. Loves controlled aggression.",
            core_philosophy="Attack is the best form of defence — score at 10+ RPO or go home.",
            bias="Favours young, fearless stroke-players over experienced grinders.",
        ),
        PersonaProfile(
            name="Data Dravid",
            background="Ex-BCCI analytics head. Believes every decision can be modelled.",
            core_philosophy="Match-ups and sample-size data trump gut feeling every time.",
            bias="Overweights historical averages even when current form contradicts them.",
        ),
        PersonaProfile(
            name="Old-School Rao",
            background="Former Indian captain from the 90s. Respects conditions and experience.",
            core_philosophy="Respect the pitch. Let the ball do the talking before sending in pinch-hitters.",
            bias="Distrusts spinners in dew conditions; always calls for seamers after over 15.",
        ),
    ]
