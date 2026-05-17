"""
OASIS Simulation Loop — multi-turn persona debate using Gemini.
Each persona takes turns responding to the match situation and prior arguments.
"""

import os
from google import genai
from google.genai import types
from models.schemas import MatchStateInput, PersonaProfile, DebateTurn

NUM_ROUNDS = 3


def _build_persona_prompt(persona: PersonaProfile, is_devil: bool = False) -> str:
    base = (
        f"You are {persona.name}. {persona.background}\n"
        f"Your philosophy: {persona.core_philosophy}\n"
        f"Your known bias: {persona.bias}\n\n"
        f"You are in a tactical debate about the next IPL decision. "
        f"Speak in character — use cricket language, reference your philosophy, show your bias.\n"
        f"Keep each response to 2-3 sentences. Be direct and opinionated."
    )
    if is_devil:
        base += "\nYour role in this simulation is to challenge the consensus. Find the flaw in the majority view."
    return base


def run_simulation(
    match_state: MatchStateInput,
    personas: list[PersonaProfile],
) -> list[DebateTurn]:
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key or not personas:
        return _fallback_debate(personas)

    client = genai.Client(api_key=api_key)
    ms = match_state.model_dump()

    batting_players = ms.get("batting_players") or []
    bowling_players = ms.get("bowling_players") or []
    striker         = ms.get("striker", "") or "unknown"
    non_striker     = ms.get("non_striker", "") or "unknown"

    player_context = ""
    if batting_players:
        player_context += f" Batting XI: {', '.join(batting_players)}."
    if bowling_players:
        player_context += f" Bowling XI: {', '.join(bowling_players)}."

    match_context = (
        f"Match situation: {ms['team_batting']} batting against {ms['team_bowling']}. "
        f"Score: {ms['current_score']}/{ms['wickets']} after {ms['over']}.{ms['ball']} overs. "
        f"Striker: {striker}, Non-striker: {non_striker}. "
        f"Pitch: {ms['pitch_conditions']}, Dew: {ms['dew_factor']}/10, Venue: {ms.get('venue', 'IPL venue')}. "
        f"{'Chasing ' + str(ms['target']) + ' (RRR: ' + str(round(ms.get('required_run_rate') or 0, 2)) + ')' if ms.get('target') else '1st innings'}."
        f"{player_context}"
    )

    debate_log: list[DebateTurn] = []
    conversation_history = f"MATCH SITUATION:\n{match_context}\n\nDebate begins:\n"

    for round_num in range(1, NUM_ROUNDS + 1):
        for i, persona in enumerate(personas):
            is_devil = (i == len(personas) - 1)  # Last persona is devil's advocate
            system_prompt = _build_persona_prompt(persona, is_devil=is_devil)

            user_message = (
                f"{conversation_history}\n"
                f"[Round {round_num}] It's your turn, {persona.name}. "
                f"{'What is your tactical recommendation?' if round_num == 1 else 'How do you respond to the above arguments?'}"
            )

            try:
                response = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=user_message,
                    config=types.GenerateContentConfig(
                        system_instruction=system_prompt,
                        temperature=0.8,
                    ),
                )
                message = response.text or f"[{persona.name} is thinking…]"
            except Exception as e:
                message = f"[{persona.name} couldn't connect: {str(e)[:60]}]"

            debate_log.append(DebateTurn(
                persona=persona.name,
                message=message,
                round=round_num,
            ))
            conversation_history += f"\n{persona.name}: {message}"

    return debate_log


def _fallback_debate(personas: list[PersonaProfile]) -> list[DebateTurn]:
    stubs = [
        "I think we should bring on the mystery spinner — dew hasn't set in yet and the batsman is vulnerable.",
        "The data backs up the leggie: SR 142 against wrist spin in middle overs. The risk is manageable.",
        "Classic over-confidence. The left-hander is in prime form — this is exactly the match-up he wants.",
    ]
    log = []
    for r in range(1, NUM_ROUNDS + 1):
        for i, persona in enumerate(personas or []):
            log.append(DebateTurn(
                persona=persona.name,
                message=f"[Round {r}] {stubs[i % len(stubs)]}",
                round=r,
            ))
    return log
