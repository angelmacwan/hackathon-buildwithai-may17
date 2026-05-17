# Captain Cool — Multi-Agent Cricket Strategist

An AI-powered IPL decision engine that acts as a virtual cricket captain, providing real-time tactical decisions through a multi-agent debate architecture powered by Google Gemini.

## Architecture

Two modules run in parallel:

- **Tactical War Room** — A LangGraph multi-agent pipeline where 6 specialist agents (Ingestor, Analyst, Pitch Specialist, Strategist, Devil's Advocate, Refiner) debate and produce a final "Captain's Call", streamed live via SSE.
- **OASIS Simulation** — A social simulation that synthesizes grounded personas (coaches, analysts, captains) and runs a multi-turn debate to surface dissenting views before issuing a final recommendation.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Python 3.10+ |
| Orchestration | LangGraph |
| AI | Google Gemini 1.5 Pro / Flash |
| Streaming | Server-Sent Events (SSE) |

## Prerequisites

- [conda](https://docs.conda.io/en/latest/) with a `dev` environment
- Node.js 18+
- A Google Gemini API key
- A Cricket Data API key (optional, for live stats)

## Setup

### 1. Clone & configure environment variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in your keys:

```
GEMINI_API_KEY=your_gemini_api_key_here
CRICKET_API_KEY=your_cricket_api_key_here
```

### 2. Backend

```bash
conda activate dev
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Visit `http://localhost:8000/docs` for the interactive Swagger UI.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Usage

1. Open `http://localhost:3000`
2. Fill in the **Match State** form (innings, score, wickets, batsmen, bowlers, pitch conditions)
3. Choose a mode:
   - **War Room** — watch 6 agents debate in real-time with SSE streaming
   - **OASIS** — run the social simulation with synthesized personas
4. Review the Captain's Call, internal debate, dissent summary, and confidence score

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/war-room/analyze` | Trigger a War Room debate (SSE stream) |
| POST | `/oasis/simulate` | Run an OASIS social simulation |
