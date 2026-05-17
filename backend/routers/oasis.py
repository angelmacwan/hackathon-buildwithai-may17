"""
OASIS Router — /oasis

POST /oasis/simulate runs the full OASIS social simulation pipeline.
"""

from fastapi import APIRouter
from models.schemas import MatchStateInput, OasisResult
from agents.persona_synthesizer import synthesize_personas
from agents.simulation_loop import run_simulation
from agents.report_synthesizer import synthesize_report

router = APIRouter(prefix="/oasis", tags=["OASIS Simulation"])


@router.post("/simulate", response_model=OasisResult)
async def run_oasis_simulation(match_state: MatchStateInput) -> OasisResult:
    """
    Full OASIS pipeline:
    1. Synthesize 3 grounded personas from match state (Gemini)
    2. Run multi-turn social simulation debate (3 rounds × 3 personas)
    3. Synthesize debate log into final structured decision (Gemini)
    """
    personas = synthesize_personas(match_state)
    debate_log = run_simulation(match_state, personas)
    result = synthesize_report(personas, debate_log)
    return result
