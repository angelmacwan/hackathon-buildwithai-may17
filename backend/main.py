"""
Captain Cool — FastAPI Backend
================================
Dual-module cricket AI engine:
  Module 1: Tactical War Room  — LangGraph multi-agent debate (SSE streaming)
  Module 2: OASIS Simulation   — Social simulation with grounded personas

Run:
    uvicorn main:app --reload --port 8000
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import oasis, war_room, cricket, search

load_dotenv()

app = FastAPI(
    title="Captain Cool — AI Cricket Strategist",
    description=(
        "Multi-agent IPL decision engine powered by Gemini. "
        "Module 1: LangGraph War Room with 6 agents + SSE streaming. "
        "Module 2: OASIS social simulation with dynamic personas."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(war_room.router)
app.include_router(oasis.router)
app.include_router(cricket.router)
app.include_router(search.router)


@app.get("/health", tags=["Meta"])
async def health_check():
    return {
        "status": "ok",
        "modules": ["War Room (LangGraph + SSE)", "OASIS Simulation"],
        "gemini_key_set": bool(os.environ.get("GEMINI_API_KEY")),
    }
