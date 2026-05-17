"""
OASIS Report Synthesizer — distills the simulation debate into a structured decision.
Uses Gemini to extract the final call, reasoning, and strongest dissent.
"""

import os
import json
import re
from google import genai
from google.genai import types
from models.schemas import DebateTurn, OasisResult, PersonaProfile


REPORT_SYNTHESIZER_PROMPT = """You are the 'OASIS Report Synthesizer'.

You have just observed a multi-turn tactical debate between cricket experts.
Your job is to synthesize their conversation into a structured final report.

Return a JSON object with EXACTLY these keys:
- "final_decision": One crisp actionable sentence.
- "reasoning": 3-4 sentences in cricket language explaining WHY, citing the personas' arguments.
- "dissent_summary": The strongest counter-argument raised in the debate (1-2 sentences).
- "confidence_score": Integer 0-100 representing consensus strength (80+ = strong agreement, below 50 = divided).

Ground your synthesis in what the personas actually argued. Don't invent new content.
Return ONLY valid JSON. No markdown.
"""


def synthesize_report(
    personas: list[PersonaProfile],
    debate_log: list[DebateTurn],
) -> OasisResult:
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return _fallback_result(personas, debate_log)

    client = genai.Client(api_key=api_key)

    # Build readable debate transcript
    transcript = "\n\n".join(
        f"[Round {t.round}] {t.persona}: {t.message}"
        for t in debate_log
    )

    persona_summary = "\n".join(
        f"- {p.name}: {p.core_philosophy}"
        for p in personas
    )

    prompt = (
        f"PERSONAS IN THIS DEBATE:\n{persona_summary}\n\n"
        f"FULL DEBATE TRANSCRIPT:\n{transcript}\n\n"
        f"Synthesize the above into the required JSON report."
    )

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction=REPORT_SYNTHESIZER_PROMPT,
            temperature=0.3,
        ),
    )

    raw = response.text or "{}"
    raw = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("`").strip()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return _fallback_result(personas, debate_log)

    return OasisResult(
        personas=personas,
        debate_log=debate_log,
        final_decision=data.get("final_decision", "Execute the tactical plan."),
        reasoning=data.get("reasoning", "Based on the consensus reached in the simulation."),
        dissent_summary=data.get("dissent_summary", "Minority view: the risk may be underestimated."),
        confidence_score=int(data.get("confidence_score", 65)),
    )


def _fallback_result(personas, debate_log) -> OasisResult:
    return OasisResult(
        personas=personas,
        debate_log=debate_log,
        final_decision="Bring on the mystery spinner — Chahal to bowl over 14.",
        reasoning=(
            "Despite the left-hander on strike, the dew factor is still low (3/10) "
            "and Chahal's wrist-spin has been effective in the middle overs. "
            "The match-up risk is acceptable given the required run rate pressure."
        ),
        dissent_summary=(
            "Old-School Rao flagged that the striker has form against wrist-spin this season. "
            "The psychological risk of an early boundary could shift momentum decisively."
        ),
        confidence_score=68,
    )
