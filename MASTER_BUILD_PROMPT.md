# MASTER BUILD PROMPT: Captain Cool - Multi-Agent Cricket Strategist

## MISSION
Build a high-fidelity, agentic cricket analytics platform named **"Captain Cool"**. The system acts as a virtual IPL captain, providing real-time tactical decisions (bowling changes, batting order, field setups) using a multi-agent debate architecture powered by Google Gemini.

## TECH STACK
- **Frontend:** Next.js (App Router), Tailwind CSS, Lucide Icons, Framer Motion (for debate animations).
- **Backend:** FastAPI (Python 3.10+).
- **Orchestration:** LangGraph / LangChain.
- **AI Models:** Gemini 1.5 Pro (for complex reasoning) and Gemini 1.5 Flash (for fast analysis/tools).
- **Grounding:** Google Search Grounding via Gemini.
- **Tools:** `google-search-results`, `requests` (for Cricket Data API like Sportmonks/Cricbuzz scraper), `weather-api`.

---

## ARCHITECTURE: DUAL-MODULE ENGINE

### MODULE 1: The Tactical War Room (Standard Agentic Loop)
**Orchestration:** LangGraph StateGraph.
**Workflow:**
1. **The Ingestor:** Parses match state (Overs, wickets, RRR, pitch, dew, match-ups).
2. **The Analyst (Data Agent):** Calls tools to fetch player stats and historical match-ups (e.g., "How does Kohli perform against leg-spin in the first 10 balls?").
3. **The Pitch Specialist:** Uses Google Search to get live weather/pitch reports and interprets grounding data.
4. **The Strategist (Lead):** Proposes a decision (e.g., "Bring on the mystery spinner").
5. **The Devil’s Advocate (Dissent):** Challenges the Strategist with counter-data or risk analysis.
6. **The Refiner:** Resolves the debate and produces the final "Captain's Call".

### MODULE 2: OASIS Social Simulation (Thallus-inspired)
**Orchestration:** Sequential Pipeline.
**Workflow:**
1. **Ingest & Ontology:** Ground the simulation in the current match "Seed Document". Define relationships (e.g., "High Humidity -> Ball gets wet -> Spinners lose grip").
2. **Persona Synthesis:** Dynamically generate 3-5 grounded personas (e.g., "The Aggressive Aussie Coach", "The Data-Driven Analyst", "The Old-School Indian Captain").
3. **Social Simulation:** Run a 3-turn "Social Exchange" where personas debate the decision in a grounded environment.
4. **Report Q&A:** Synthesize the simulation logs into a final decision with "The Dissent" highlighted.

---

## CORE REQUIREMENTS & FEATURES

### 1. Agent Personas
- **The Stats Guru:** Cold, hard numbers. Uses tools.
- **The Tactical Mastermind:** High-level strategy, momentum, and psychological factors.
- **The Devil’s Advocate:** Specifically designed to find flaws in the "obvious" choice.
- **The Match Commentator:** Translates jargon into "Cricket Talk" (e.g., "He's throwing the kitchen sink at it").

### 2. Live Tooling
- **Cricket Stats Tool:** Function calling to fetch live/historical data.
- **Search Tool:** Google Search grounding for "Real-time pitch/weather/injury news".
- **Win Probability:** A simulated/tool-based calculation of win-chance delta.

### 3. Output Format (JSON/UI)
- `final_decision`: String (Clear, actionable).
- `reasoning`: Markdown (Cricket language).
- `internal_debate`: List of {agent, message} showing the back-and-forth.
- `dissent_summary`: The strongest argument against the final choice.
- `confidence_score`: 0-100.

---

## EXECUTION PLAN

### Phase 1: Backend Foundation
1. Setup FastAPI environment.
2. Initialize LangGraph with Gemini 1.5.
3. Implement the `CricketDataTool` (Mocked initially, then real API/Scraper).
4. Build Module 1 (The War Room) with a 3-agent debate loop.

### Phase 2: OASIS Simulation
1. Implement the Ingest/Ontology layer.
2. Build the Persona Synthesis engine using Gemini.
3. Create the Simulation Loop (Multi-turn exchange).
4. Add the Report Synthesis module.

### Phase 3: Frontend Dashboard
1. Create a "Match State Entry" form (Innings, Score, Wickets, Batsmen, Bowlers).
2. Build the "War Room" UI: Animated agent icons and "Thinking" bubbles.
3. Display the "Live Debate" as it streams from the backend.
4. Add a toggle for "Standard vs. OASIS Mode".

### Phase 4: Refinement & Validation
1. Add "Cricket Language" system prompts to ensure the output sounds like Harsha Bhogle or Ravi Shastri.
2. Implement back-testing: Run a "Scenario Library" (e.g., 2019 WC Final last over) to see if the agents make the "right" call.

---

## PROMPT FOR BUILDING THE APP
*"You are an expert AI Engineer. Build a FastAPI + Next.js application based on the 'Captain Cool' master spec. Focus on the LangGraph orchestration first. Ensure all agents have distinct system prompts. Use Gemini 1.5 Pro for the 'Strategist' and 'Devil's Advocate'. The frontend must show the agent debate in real-time using Server-Sent Events (SSE). Use the OASIS simulation logic for the second module. Make the UI look like a premium sports analytics dashboard."*
