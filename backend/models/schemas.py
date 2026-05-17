"""Pydantic schemas shared across the Captain Cool backend."""

from typing import Optional, List
from pydantic import BaseModel


# ---------------------------------------------------------------------------
# Input
# ---------------------------------------------------------------------------

class MatchStateInput(BaseModel):
    innings: int
    over: int
    ball: int
    current_score: int
    wickets: int
    team_batting: str
    team_bowling: str
    striker: str
    non_striker: str
    bowlers_remaining: Optional[dict] = {}
    pitch_conditions: str = "flat"
    dew_factor: int = 3
    venue: str = ""
    target: Optional[int] = None
    required_run_rate: Optional[float] = None
    impact_player_available: bool = True
    powerplay_active: bool = False
    death_overs: bool = False
    notes: Optional[str] = None


# ---------------------------------------------------------------------------
# War Room (Module 1)
# ---------------------------------------------------------------------------

class AgentMessage(BaseModel):
    agent: str
    message: str


class WarRoomResult(BaseModel):
    final_decision: str
    reasoning: str
    internal_debate: List[AgentMessage]
    dissent_summary: str
    confidence_score: int
    win_probability: Optional[float] = None


# ---------------------------------------------------------------------------
# OASIS Simulation (Module 2)
# ---------------------------------------------------------------------------

class PersonaProfile(BaseModel):
    name: str
    background: str
    core_philosophy: str
    bias: str


class DebateTurn(BaseModel):
    persona: str
    message: str
    round: int


class OasisResult(BaseModel):
    personas: List[PersonaProfile]
    debate_log: List[DebateTurn]
    final_decision: str
    reasoning: str
    dissent_summary: str
    confidence_score: int
