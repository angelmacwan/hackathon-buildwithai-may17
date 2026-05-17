"""
War Room — LangGraph multi-agent orchestration.

Agent pipeline:
  stats_analyst → pitch_specialist → strategist → devils_advocate
                                               ↘
                                          strategist_refine → commentator → synthesizer
"""

import os
import json
import re
from typing import TypedDict, Annotated, List, Optional
import operator

from google import genai
from google.genai import types

from agents.tools import get_player_stats, get_bowler_stats, calculate_win_probability
from langgraph.graph import StateGraph, START, END


# ---------------------------------------------------------------------------
# Gemini client (shared across all agents)
# ---------------------------------------------------------------------------

_client: Optional[genai.Client] = None

def get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    return _client


# ---------------------------------------------------------------------------
# LangGraph state
# ---------------------------------------------------------------------------

class Message(TypedDict):
    agent: str
    message: str


class WarRoomState(TypedDict):
    match_state: dict
    stats_analysis: str
    pitch_report: str
    strategy_proposal: str
    devils_challenge: str
    strategy_revised: str
    commentary: str
    debate_log: Annotated[List[Message], operator.add]
    final_decision: str
    reasoning: str
    dissent_summary: str
    confidence_score: int
    win_probability: float


# ---------------------------------------------------------------------------
# System prompts
# ---------------------------------------------------------------------------

STATS_ANALYST_PROMPT = """You are the 'Stats Guru' for an IPL team. You deliver cold, hard cricket analytics.

Your job:
- Analyse the batsmen currently at the crease and their match-ups against available bowlers.
- Fetch player stats using the tools available to you.
- Identify the most dangerous match-up the bowling team faces right now.
- Highlight which bowling type the striker is most vulnerable against.

Rules:
- ALWAYS use the get_player_stats tool for the striker before making any recommendation.
- ALWAYS use the calculate_win_probability tool to give current odds.
- Cite every number you use (e.g., "SR 145 vs leg-spin in last 5 seasons").
- Remove emotion from the equation. Numbers only.
- Keep your output to 3-4 crisp sentences.
- Use cricket terminology: "match-up advantage", "dot ball percentage", "powerplay vs middle overs".
"""

PITCH_SPECIALIST_PROMPT = """You are the 'Pitch & Conditions Specialist' for an IPL team. You read the environment like a seasoned groundskeeper.

Your job:
- Interpret the current pitch conditions, dew factor, and venue details.
- Translate environmental factors into tactical constraints.
- Warn about dew impact on spin bowling (dew > 6 = serious concern for spinners).
- Advise on whether seamers or spinners benefit from current conditions.

Rules:
- Always reference the dew_factor and pitch_conditions from the match state.
- Use vivid, specific language: "the ball will skid through under lights", "turn will flatten once dew sets in".
- Keep to 2-3 sentences. Be definitive, not vague.
"""

STRATEGIST_PROMPT = """You are the 'Lead Strategist' — the virtual captain. You win IPL matches by making bold, data-backed calls.

You have received:
1. Stats analysis from the Stats Guru (hard numbers, match-ups).
2. Pitch and conditions report from the Pitch Specialist.

Your job:
- Propose ONE clear tactical decision: bowling change, batting promotion, field setup change, strategic timeout, or impact player call.
- Defend it with evidence from the stats and conditions reports.
- Use captain's language: "maintaining the squeeze", "targeting the fifth stump", "death over specialist".

Rules:
- Be decisive. No "it depends". Name specific players.
- Acknowledge risk but explain why your call maximises win probability.
- Keep your proposal to 3-4 sentences ending with a clear action statement.
"""

DEVILS_ADVOCATE_PROMPT = """You are the 'Devil's Advocate'. Your sole purpose is to find the flaw in the Lead Strategist's plan.

You MUST challenge the proposal. Even if it seems sound, find the risk.

Challenge angles:
- "What if the dew worsens faster than expected?"
- "What if the batsman has been working on exactly this match-up in the nets?"
- "Are we burning our best death bowler two overs too early?"
- "What if the pitch two-paces and the spinner actually grips?"

Rules:
- Never agree outright. Always find AT LEAST one critical flaw.
- Be relentless but logical — pure emotion doesn't count.
- Counter with specific data or a credible scenario.
- Keep to 2-3 sharp, provocative sentences.
"""

STRATEGIST_REFINE_PROMPT = """You are the 'Lead Strategist'. The Devil's Advocate has just challenged your call.

Review their counter-argument carefully. Then:
- If their argument has statistical or tactical merit → REVISE your decision and explain the pivot.
- If their argument is speculative → DEFEND your original call with additional evidence.

Rules:
- Be decisive. "Sticking to the plan" must come with a reason.
- A pivot must also come with a reason.
- Use precise cricket language.
- Keep to 2-3 sentences.
"""

COMMENTATOR_PROMPT = """You are the 'Match Commentator' — think Harsha Bhogle meets Ravi Shastri in a high-stakes final.

You have watched the entire tactical debate in the war room. Now translate it for the fans.

Your job:
- Explain the final captain's call in vivid cricket language a casual fan would understand.
- Use a metaphor, a classic cricket phrase, or a comparison to a famous match moment.
- Make it exciting. The crowd is on the edge of their seats.
- Reference the dissent: "Despite the doubts, the skipper has chosen to..."

Rules:
- No ML jargon. No "win probability metric". Say "the odds are firmly in their favour".
- Colourful, energetic, 2-3 sentences max.
- Must end with the final decision restated in plain English.
"""

SYNTHESIZER_PROMPT = """You are the 'Report Synthesizer'. You read the full war room debate and produce the final structured output.

Produce a JSON object with EXACTLY these keys:
- "final_decision": One crisp actionable sentence (e.g., "Bring on Bumrah for over 17 and set a leg-side trap").
- "reasoning": 3-4 sentences in cricket language explaining WHY, citing the stats and conditions.
- "dissent_summary": The Devil's Advocate's strongest counter-argument in 1-2 sentences.
- "confidence_score": Integer 0-100 (100 = certainty, 50 = coin flip).
- "win_probability_delta": Estimated change in win % if this call works (+ve = improves odds).

Return ONLY valid JSON. No markdown, no extra text.
"""


# ---------------------------------------------------------------------------
# Node implementations
# ---------------------------------------------------------------------------

def stats_analyst_node(state: WarRoomState) -> dict:
    ms = state["match_state"]
    client = get_client()

    prompt = (
        f"Match state:\n"
        f"- {ms['team_batting']} vs {ms['team_bowling']}\n"
        f"- Score: {ms['current_score']}/{ms['wickets']} after {ms['over']}.{ms['ball']} overs\n"
        f"- Striker: {ms['striker']} | Non-striker: {ms['non_striker']}\n"
        f"- Venue: {ms.get('venue', 'Unknown')}\n"
        f"- Pitch: {ms['pitch_conditions']} | Dew: {ms['dew_factor']}/10\n"
        f"- Context: {'2nd innings, target ' + str(ms.get('target')) if ms.get('target') else '1st innings'}\n"
        f"\nAnalyse the current batting match-ups. Use get_player_stats for the striker. "
        f"Also calculate win probability with calculate_win_probability."
    )

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=STATS_ANALYST_PROMPT,
            tools=[get_player_stats, get_bowler_stats, calculate_win_probability],
            automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=False),
            temperature=0.4,
        ),
    )

    analysis = response.text or "Stats analysis unavailable."
    return {
        "stats_analysis": analysis,
        "debate_log": [{"agent": "Stats Guru", "message": analysis}],
    }


def pitch_specialist_node(state: WarRoomState) -> dict:
    ms = state["match_state"]
    client = get_client()

    prompt = (
        f"Venue: {ms.get('venue', 'IPL venue')}\n"
        f"Pitch conditions: {ms['pitch_conditions']}\n"
        f"Dew factor: {ms['dew_factor']}/10\n"
        f"Over: {ms['over']} of 20\n"
        f"Time context: {'evening/night match — dew likely' if ms['dew_factor'] > 3 else 'afternoon match'}\n"
        f"\nProvide your environmental and pitch assessment for tactical decision-making."
    )

    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=PITCH_SPECIALIST_PROMPT,
                tools=[types.Tool(google_search=types.GoogleSearch())],
                temperature=0.3,
            ),
        )
    except Exception:
        # Fallback if grounding unavailable
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=PITCH_SPECIALIST_PROMPT,
                temperature=0.3,
            ),
        )

    report = response.text or "Pitch report unavailable."
    return {
        "pitch_report": report,
        "debate_log": [{"agent": "Pitch Specialist", "message": report}],
    }


def strategist_node(state: WarRoomState) -> dict:
    ms = state["match_state"]
    client = get_client()

    prompt = (
        f"STATS GURU REPORT:\n{state['stats_analysis']}\n\n"
        f"PITCH SPECIALIST REPORT:\n{state['pitch_report']}\n\n"
        f"MATCH STATE:\n"
        f"{ms['team_bowling']} bowling to {ms['team_batting']}. "
        f"Over {ms['over']}.{ms['ball']}, score {ms['current_score']}/{ms['wickets']}. "
        f"Striker: {ms['striker']}. Available bowlers: {json.dumps(ms.get('bowlers_remaining', {}))}. "
        f"Impact player available: {ms.get('impact_player_available', False)}.\n\n"
        f"Propose your tactical decision now."
    )

    response = client.models.generate_content(
        model="gemini-1.5-pro",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=STRATEGIST_PROMPT,
            temperature=0.7,
        ),
    )

    proposal = response.text or "Strategy proposal unavailable."
    return {
        "strategy_proposal": proposal,
        "debate_log": [{"agent": "Lead Strategist", "message": proposal}],
    }


def devils_advocate_node(state: WarRoomState) -> dict:
    ms = state["match_state"]
    client = get_client()

    prompt = (
        f"THE LEAD STRATEGIST JUST PROPOSED:\n{state['strategy_proposal']}\n\n"
        f"SUPPORTING DATA:\n{state['stats_analysis']}\n\n"
        f"MATCH CONTEXT: Over {ms['over']}.{ms['ball']}, "
        f"{ms['current_score']}/{ms['wickets']}, dew {ms['dew_factor']}/10.\n\n"
        f"Find the flaw. Challenge this decision."
    )

    response = client.models.generate_content(
        model="gemini-1.5-pro",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=DEVILS_ADVOCATE_PROMPT,
            temperature=0.8,
        ),
    )

    challenge = response.text or "No challenge raised."
    return {
        "devils_challenge": challenge,
        "debate_log": [{"agent": "Devil's Advocate", "message": challenge}],
    }


def strategist_refine_node(state: WarRoomState) -> dict:
    client = get_client()

    prompt = (
        f"YOUR ORIGINAL PROPOSAL:\n{state['strategy_proposal']}\n\n"
        f"DEVIL'S ADVOCATE COUNTER:\n{state['devils_challenge']}\n\n"
        f"Respond to the counter-argument. Revise if warranted, defend if not."
    )

    response = client.models.generate_content(
        model="gemini-1.5-pro",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=STRATEGIST_REFINE_PROMPT,
            temperature=0.6,
        ),
    )

    revised = response.text or "Sticking with the original call."
    return {
        "strategy_revised": revised,
        "debate_log": [{"agent": "Lead Strategist (Final)", "message": revised}],
    }


def commentator_node(state: WarRoomState) -> dict:
    client = get_client()

    prompt = (
        f"FULL WAR ROOM DEBATE:\n"
        f"Stats Guru: {state['stats_analysis']}\n"
        f"Pitch Specialist: {state['pitch_report']}\n"
        f"Lead Strategist: {state['strategy_proposal']}\n"
        f"Devil's Advocate: {state['devils_challenge']}\n"
        f"Captain's Final Word: {state['strategy_revised']}\n\n"
        f"Now commentate on this decision for the fans!"
    )

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=COMMENTATOR_PROMPT,
            temperature=0.9,
        ),
    )

    commentary = response.text or "And the captain has made his call!"
    return {
        "commentary": commentary,
        "debate_log": [{"agent": "Match Commentator", "message": commentary}],
    }


def synthesizer_node(state: WarRoomState) -> dict:
    client = get_client()

    prompt = (
        f"Full war room debate to synthesize:\n\n"
        f"Stats Guru: {state['stats_analysis']}\n\n"
        f"Pitch Specialist: {state['pitch_report']}\n\n"
        f"Lead Strategist (initial): {state['strategy_proposal']}\n\n"
        f"Devil's Advocate: {state['devils_challenge']}\n\n"
        f"Lead Strategist (final): {state['strategy_revised']}\n\n"
        f"Match Commentator: {state['commentary']}\n\n"
        f"Synthesize into the required JSON output."
    )

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=SYNTHESIZER_PROMPT,
            temperature=0.2,
        ),
    )

    raw = response.text or "{}"
    # Strip markdown code fences if present
    raw = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("`").strip()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        # Fallback if JSON parse fails
        data = {
            "final_decision": state["strategy_revised"].split(".")[0] + ".",
            "reasoning": state["strategy_revised"],
            "dissent_summary": state["devils_challenge"].split(".")[0] + ".",
            "confidence_score": 65,
            "win_probability_delta": 5,
        }

    return {
        "final_decision": data.get("final_decision", "Execute the captain's call."),
        "reasoning": data.get("reasoning", state["strategy_revised"]),
        "dissent_summary": data.get("dissent_summary", state["devils_challenge"]),
        "confidence_score": int(data.get("confidence_score", 65)),
        "win_probability": float(data.get("win_probability_delta", 0)),
    }


# ---------------------------------------------------------------------------
# Build the LangGraph
# ---------------------------------------------------------------------------

def build_war_room_graph():
    builder = StateGraph(WarRoomState)

    builder.add_node("stats_analyst", stats_analyst_node)
    builder.add_node("pitch_specialist", pitch_specialist_node)
    builder.add_node("strategist", strategist_node)
    builder.add_node("devils_advocate", devils_advocate_node)
    builder.add_node("strategist_refine", strategist_refine_node)
    builder.add_node("commentator", commentator_node)
    builder.add_node("synthesizer", synthesizer_node)

    builder.add_edge(START, "stats_analyst")
    builder.add_edge("stats_analyst", "pitch_specialist")
    builder.add_edge("pitch_specialist", "strategist")
    builder.add_edge("strategist", "devils_advocate")
    builder.add_edge("devils_advocate", "strategist_refine")
    builder.add_edge("strategist_refine", "commentator")
    builder.add_edge("commentator", "synthesizer")
    builder.add_edge("synthesizer", END)

    return builder.compile()


# Singleton graph
_graph = None

def get_war_room_graph():
    global _graph
    if _graph is None:
        _graph = build_war_room_graph()
    return _graph


def build_initial_state(match_state_dict: dict) -> WarRoomState:
    return WarRoomState(
        match_state=match_state_dict,
        stats_analysis="",
        pitch_report="",
        strategy_proposal="",
        devils_challenge="",
        strategy_revised="",
        commentary="",
        debate_log=[],
        final_decision="",
        reasoning="",
        dissent_summary="",
        confidence_score=0,
        win_probability=50.0,
    )
