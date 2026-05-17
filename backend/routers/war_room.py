"""
War Room Router — /war-room

SSE endpoint that streams the LangGraph multi-agent debate in real time.
"""

import json
import asyncio
from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from models.schemas import MatchStateInput
from agents.war_room import get_war_room_graph, build_initial_state

router = APIRouter(prefix="/war-room", tags=["War Room"])


@router.post("/analyze")
async def war_room_analyze(match_state: MatchStateInput):
    """
    Run the full LangGraph War Room pipeline and stream agent messages via SSE.

    Events:
    - event: "message"  data: {"agent": str, "message": str}
    - event: "result"   data: {final_decision, reasoning, dissent_summary, confidence_score, win_probability}
    - event: "error"    data: {"message": str}
    """
    graph = get_war_room_graph()
    initial_state = build_initial_state(match_state.model_dump())

    async def event_generator():
        try:
            # Stream LangGraph state updates node by node
            for chunk in graph.stream(initial_state, stream_mode="updates"):
                for node_name, update in chunk.items():
                    # Stream each new debate message as it arrives
                    new_messages = update.get("debate_log", [])
                    for msg in new_messages:
                        yield {
                            "event": "message",
                            "data": json.dumps({
                                "agent": msg["agent"],
                                "message": msg["message"],
                            }),
                        }
                        await asyncio.sleep(0.05)  # Small breathing room for client

                    # Stream final result when synthesizer completes
                    if node_name == "synthesizer" and update.get("final_decision"):
                        yield {
                            "event": "result",
                            "data": json.dumps({
                                "final_decision": update.get("final_decision", ""),
                                "reasoning": update.get("reasoning", ""),
                                "dissent_summary": update.get("dissent_summary", ""),
                                "confidence_score": update.get("confidence_score", 50),
                                "win_probability": update.get("win_probability", 50.0),
                                "internal_debate": initial_state.get("debate_log", []),
                            }),
                        }

            yield {"event": "done", "data": "{}"}

        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps({"message": str(e)}),
            }

    return EventSourceResponse(event_generator())
