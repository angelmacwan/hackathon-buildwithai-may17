"""
Search router — uses Gemini + Google Search to find information for the UI.
"""

from fastapi import APIRouter, Query
from typing import List
import os
import json
import re
from google import genai
from google.genai import types

router = APIRouter(prefix="/search", tags=["Search"])

_client = None

def get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    return _client

@router.get("/players")
async def search_players(team: str = Query(..., description="The team name to search players for")):
    """
    Search for a list of players for a given IPL team using Gemini + Google Search.
    """
    client = get_client()
    prompt = (
        f"List 15 active players for the IPL team '{team}'. "
        f"Include a mix of batsmen, bowlers, and all-rounders currently in their squad. "
        f"Return ONLY a JSON list of strings (player names). No markdown, no numbering."
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            system_instruction="You are a cricket data assistant. Return only valid JSON lists.",
            tools=[types.Tool(google_search=types.GoogleSearch())],
            temperature=0.2,
        ),
    )

    raw = response.text or "[]"
    # Clean up JSON if model returns markdown
    raw = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("`").strip()

    try:
        players = json.loads(raw)
        if not isinstance(players, list):
            players = []
    except Exception:
        players = []

    return {"team": team, "players": players}
