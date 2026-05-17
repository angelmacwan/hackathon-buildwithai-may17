Acai411001
ACAI411001
- use langraph or langchain
- gemini ai API (API key goes in env file)
- gemini models with google search grounding
- next js
- Public API to getch cricket data
- NO USER MANAGEMENT REQUIRED RN
- A pure analytics platform
- a little back testing to validate the program

## OVERVIEW
A user inputs the current match state. Your system replies with:
1. The next decision — who bowls the next over, who comes in to bat, field setup, when to take the strategic timeout, when to bring in the Impact Player, etc.
2. The reasoning — explained in cricket-language a real captain or commentator would use ("the leggie is wasted against a left-handed pinch-hitter on a turning pitch in dew").
3. What the dissenting agent said — your system must include an internal debate before committing to the call.

## Inputs (any reasonable format — UI, form, JSON, voice)
- Innings (1 or 2), over, ball, current score, wickets
- Team batting, team bowling, who's on strike, who's at non-striker end
- Bowlers remaining (overs used per bowler)
- Pitch conditions (turning / flat / two-paced) + dew factor + venue
- Required run rate / target (if 2nd innings)
- Impact Player still available? Powerplay/death-overs context

## Hard requirements (what makes it "agentic" — all four are mandatory)

1. Three or more distinct, named Gemini-powered agents that genuinely collaborate. Example: Stats Analyst, Strategist, Devil's Advocate, Match Commentator. Each must have its own system prompt and a clear
role. A single Gemini call wearing four hats does NOT count.

2. At least one real tool call from inside an agent — Gemini function calling, ADK tools, web search, a cricket stats API (Cricbuzz/ESPN/Sportmonks), win-probability calculation, or weather lookup. Hardcoded
JSON gets partial credit; live fetch wins.

3. A multi-turn reasoning loop where the Strategist proposes, the Devil's Advocate challenges, and the Strategist either defends or revises. The output must show this back-and-forth — don't hide it.

4. Explainability for non-technical fans — the final decision must read like cricket talk, not ML jargon. Bonus for why-this-not-that.


## GOOD TO HAVE
- Real-time mode: paste a Cricbuzz / ESPNCricinfo URL and the system scrapes live state itself (Gemini's URL context tool works beautifully here)
- Voice in/out using Web Speech API + Gemini Live API so the captain talks back
- Confidence score + counterfactual ("if you'd bowled X instead, win prob drops 8%")


---
This are the evalutaion criteria:
  Evaluation rubric — scored out of 1000

• Relevance (250) — Does this actually solve the captain-strategist problem? Or is it a generic chatbot with cricket lipstick?
• Technical depth (250) — Real Gemini multi-agent orchestration, real tool use, working code, not just prompt-stuffing. Non-Gemini stacks = 0 here.
• Innovation & agentic design (250) — Is the agent debate genuinely interesting? Roles well-decomposed? Did you go beyond the obvious? Bonus for clever ADK / function calling usage.
• Documentation & blog (250) — Your dev.to blog must explain your architecture (diagram), show the prompts you wrote for each agent, link your AI Studio prompts if any, and walk through one match scenario
end-to-end with screenshots.

---

I need you to make a new MD file with the prompt in it
i will be usign that prompt to build the app

make sure we create MORE agents

Add a simulation module a well where we use OASIS to run social simulations where we:

  1. Ingest & Ontology (The Grounding)
   * The Match State: You can use the Ingest stage to feed the current match state (scorecard, pitch report,
     player stats) as the "seed document."
   * Cricket Domain Knowledge: The Ontology derivation can help the agents understand the relationships between
     match variables (e.g., "Dew" → "Spinners become less effective").

  2. Agent Profiles (The Persona Synthesis)
   * Thallus's ability to synthesize grounded personas is perfect for creating the 3+ distinct agents required:
       * The Analyst: Grounded in the stats part of the knowledge graph.
       * The Tactical Strategist: Grounded in aggressive T20 win-probability logic.
       * The Devil’s Advocate (Dissenting Agent): Specifically tasked with challenging the consensus, fulfilling
         your "dissenting agent" requirement.

  3. Simulation (The Internal Debate)
   * This is where Thallus shines for this task. Instead of a single-turn prompt, you run an OASIS simulation. 
   * The Strategist proposes a bowling change (e.g., "Bring on the leggie").
   * The Dissenting Agent uses the Thallus simulation loop to counter (e.g., "The left-hander is on strike; the
     stats show he destroys leg-spin in the Powerplay").
   * The agents "debate" over 2-3 rounds until a refined decision is reached.

  4. Report Q&A (The Output)
   * The final Report phase can synthesize the simulation history into the required format:
       1. The Decision.
       2. The Reasoning (using the "cricket-language" learned from the ingest/persona stage).
       3. The Dissent (extracting the most valid counter-argument from the simulation logs).

OASIS will be a diffrent module
AKA we 2 modules 
1st is the normal approach
2nd is the OASIS simulation

i wanna use fast api and next js for this

I neeed you to come up with a PROMPT and a execution plan 
this prompt will be used to build the product