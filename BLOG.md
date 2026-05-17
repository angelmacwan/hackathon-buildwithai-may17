# Captain Cool: A Multi-Agent AI That Thinks Like an IPL Captain

*What happens when you give six AI agents a live cricket match and ask them to argue about it?*

---

Cricket is decided in moments. A bowling change at the wrong over, a misjudged pitch, a batsman promoted too early — the margins are razor thin and the decisions are made in seconds. Yet even the sharpest captains have one brain working against twenty variables at once.

Captain Cool is a multi-agent AI system built to change that. Feed it a live IPL match state and it deliberates — with real dissent, real data, and real cricket language — producing a confident tactical recommendation before the next ball is bowled.

It does this two ways. The first is a **deliberation pipeline**: a sequence of specialist AI agents, each with a distinct role, debating in structured turns. The second is an **OASIS social simulation**: a crowd of dynamically generated coaching personas who argue freely across multiple rounds until a consensus emerges. Two fundamentally different architectures, one goal — give a captain the best possible call.

---

## The Technology Stack

Before diving into how each mode works, here is what powers the system under the hood:

- **Gemini 2.5 Flash** — the LLM backbone for all agents, chosen for its speed and reasoning depth
- **Google Search Grounding** — live web search injected directly into agent context at inference time
- **Function Calling** — structured tool use so agents can invoke a physics-based win probability calculator mid-reasoning
- **LangGraph** — a graph-based orchestration framework that defines the agent pipeline as an explicit state machine
- **FastAPI + Server-Sent Events (SSE)** — the backend streams each agent's output to the frontend the moment it is produced, so the user watches the debate unfold live
- **Next.js** — a responsive frontend that renders the live debate panel, confidence scores, and final captain's call

---

## Mode 1: The Deliberation Pipeline

The War Room is a seven-node LangGraph graph. Each node is a Gemini 2.5 Flash model instance with a distinct system prompt, and together they form a structured chain of reasoning where every agent builds directly on the output of the one before it.

Here is the full pipeline:

```
Stats Guru → Pitch Specialist → Lead Strategist → Devil's Advocate
                                                        ↓
                             Synthesizer ← Commentator ← Lead Strategist (Revised)
```

### How Each Agent Thinks

**Stats Guru** opens the deliberation. It receives the raw match state — current score, wickets, over, striker, pitch — and immediately calls two tools. First, it invokes `calculate_win_probability`, a custom function that runs a physics-informed model accounting for run rate, wickets in hand, overs remaining, and dew factor. Second, it fires a live Google Search query for the striker's recent IPL form and match-up history against specific bowling types. Every number it cites is real. No hallucinated averages.

**Pitch Specialist** takes the stage next. It does not care about batsmen or bowlers — only the environment. Dew factor, pitch conditions (flat, turning, two-paced, seaming, dusty), venue history, time of day. It also uses Google Search grounding to pull real venue data. Its output is blunt: *"The ball will skid through under lights. Dew is at 7/10 — spinners are bowling with soap."* This forces the downstream agents to factor in conditions they might otherwise ignore.

**Lead Strategist** receives both reports and makes a call. One call. Not "it depends." It names a player, names an over, names an action — a bowling change, a batting promotion, a field adjustment, a timeout. It writes in captain's language and defends the decision with evidence from what the Stats Guru and Pitch Specialist surfaced.

**Devil's Advocate** exists to break that call apart. Its system prompt explicitly forbids agreement. It must find a flaw — whether that is an overlooked matchup, a premature use of a death-over specialist, an underestimation of dew impact, or a left-hander's recent form against exactly this bowling type. It is relentless and specific, not vague.

**Lead Strategist (Revised)** reads the challenge and responds. If the Devil's Advocate raised a point with statistical merit, it pivots and explains why. If the challenge was speculative, it defends the original call with additional reasoning. This is the agent that resolves the debate — and it has to commit.

**Match Commentator** translates the entire exchange into cricket fan language. No ML jargon, no "win probability metric." Instead: *"Despite the doubts in the dugout, the skipper has backed his instinct — Bumrah for the 17th, with a leg-side trap set for a batsman who has never looked comfortable against late swing."* The commentator makes the AI's reasoning legible to anyone who watches cricket.

**Synthesizer** closes the pipeline by extracting a structured JSON response: the final decision, the reasoning in full, the strongest dissent raised, a confidence score from 0 to 100, and the estimated win probability delta if the call works.

### Why This Architecture?

LangGraph models the pipeline as an explicit directed graph with typed state. Every agent writes into a shared `WarRoomState` object and reads from fields populated by prior agents. The state is immutable between writes — no agent can silently overwrite another's reasoning. This makes the deliberation traceable: every output in the final report can be traced back to a specific node in the graph.

SSE streaming means the user does not wait for all seven agents to finish. The moment the Stats Guru completes its analysis, that message appears in the debate panel. Each agent's output lights up in real time. The experience is watching a war room in session, not waiting for a PDF.

---

## Mode 2: The OASIS Social Simulation

The second mode takes a fundamentally different approach. Instead of a fixed sequence of specialist agents, it builds a crowd of domain-specific personas from scratch — tailored to the exact match situation — and lets them argue in unstructured, multi-round debate.

The name comes from the [OASIS paper](https://arxiv.org/abs/2411.11581), which demonstrated that large language models can simulate realistic social dynamics when given distinct identities, philosophies, and biases. Captain Cool applies this to cricket strategy.

### Stage 1: Persona Synthesis

Before any debate begins, a **Persona Synthesizer** agent reads the match state and generates three coaching personas from scratch. The prompt is grounded in the specific context: is this a chase? How high is the dew? What stage of the innings? The synthesizer then crafts personas that genuinely differ in philosophy.

A typical output for a second-innings chase with heavy dew might be:

- **Coach Baz** — ex-Australian batsman, controlled aggression, scores at 10+ RPO or goes home, biased toward fearless stroke-players
- **Data Dravid** — ex-BCCI analytics head, match-ups and sample-size data over gut feeling, overweights historical averages
- **Old-School Rao** — Indian captain from the 90s, respects conditions, distrusts spinners in dew, always calls for seamers after over 15

These are not fixed archetypes. They are generated fresh each time from the match context. A first-innings powerplay against a strong bowling attack will produce entirely different personas than a death-over chase. The system ensures that at minimum one persona factors heavily in the dew, and that no two personas are variations of the same philosophy.

### Stage 2: The Simulation Loop

The three personas are then placed in a structured multi-round debate. The simulation runs for three rounds. In each round, every persona speaks in turn — in character, in their own voice, referencing their philosophy and bias. The last persona in each round is designated the Devil's Advocate role, ensuring there is always dissent even when the other two are converging.

Crucially, the entire conversation history is passed to each persona before they speak. They are not responding to a prompt in isolation — they are reading the full transcript of everything said so far and arguing from it. This produces genuine evolution of positions across rounds: a persona that advocated aggressively in round one may concede a specific point in round two after another persona cited a stat that undercuts their argument.

The conversation history grows like this:

```
[Match Context]

Round 1: Coach Baz → Data Dravid → Old-School Rao
Round 2: Coach Baz → Data Dravid → Old-School Rao  (each reads prior two rounds)
Round 3: Coach Baz → Data Dravid → Old-School Rao  (each reads all five prior turns)
```

Each persona's temperature is set to 0.8 — high enough to produce distinct, opinionated voices, low enough to stay grounded in the cricket context.

### Stage 3: Report Synthesis

Once the three rounds complete, a **Report Synthesizer** agent reads the full transcript and produces a structured output: the final decision the simulation converged on, the reasoning citing which personas' arguments drove it, the strongest dissent that was raised, and a consensus confidence score. A score above 80 means the three personas largely agreed. A score below 50 means the debate was genuinely divided — and the report surfaces that division explicitly rather than pretending consensus exists.

### Why This Architecture?

Where the deliberation pipeline is precise and hierarchical, the OASIS simulation is emergent. The deliberation pipeline gives you one answer with one chain of reasoning. The OASIS simulation gives you a map of the argument space — what different philosophical approaches recommend, where they agree, where they conflict, and how confident the overall consensus is.

For a captain, that second perspective is often more valuable. Knowing that three independently-reasoning agents with different biases all converged on the same call is more persuasive than a single structured analysis. Knowing they are evenly divided is equally valuable — it flags that this is a genuinely uncertain decision.

---

## How You Would Use This

**During a live IPL match:**

1. Open Captain Cool. Select the live match from the integrated match picker, which auto-fetches the current score, wickets, over, and players.
2. Choose your mode: War Room for a rapid, structured deliberation with live streaming; OASIS for a deeper, multi-round simulation with persona-level reasoning.
3. The system runs in under 30 seconds for War Room (streamed live as each agent completes) or around 45 seconds for OASIS.
4. Read the captain's call, the reasoning, and the dissent summary. The confidence score tells you how certain the system is. The dissent summary tells you the best argument against the call — so you can weigh it yourself.

**Practical applications beyond broadcast:**

- **Franchise coaching staff** running pre-match scenario analysis against likely opponents
- **Fantasy cricket** players who want multi-agent consensus on next-over outcomes before setting their teams
- **Cricket commentary** augmentation where the AI debate becomes the pre-ball content

---

## What Makes This Different

Most cricket AI tools output a number — a win probability, a projected score. Captain Cool outputs an argument. The agents disagree with each other. The Devil's Advocate finds the flaw. The Commentator translates it for fans. The OASIS personas hold different philosophical positions and defend them across three rounds.

This matters because decisions under uncertainty are not solved by a single number. They are solved by pressure-testing an argument until the weakest parts collapse and the strongest parts hold. Captain Cool does that pressure-testing automatically, in real cricket language, in the time between deliveries.

The deliberation pipeline gives you speed and structure. The OASIS simulation gives you depth and emergence. Together, they make Captain Cool the closest thing cricket has to a virtual war room that actually argues back.

---

*Built at Build with AI Hackathon, May 2026. Powered by Gemini 2.5 Flash, LangGraph, and a genuine love for IPL cricket.*
