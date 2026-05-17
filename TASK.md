🏏 "Captain Cool" — The Multi-Agent IPL Match Strategist (Built on Google Gemini)

  Build an agentic AI system that acts as a virtual IPL captain — making the next tactical decision in a live match the way Dhoni, Rohit, or Hardik would.

  A user inputs the current match state. Your system replies with:
  1. The next decision — who bowls the next over, who comes in to bat, field setup, when to take the strategic timeout, when to bring in the Impact Player, etc.
  2. The reasoning — explained in cricket-language a real captain or commentator would use ("the leggie is wasted against a left-handed pinch-hitter on a turning pitch in dew").
  3. What the dissenting agent said — your system must include an internal debate before committing to the call.

  ⚠ MANDATORY TECH STACK — APL IS GOOGLE'S HOUSE

Your submission MUST be built on the Google Gemini stack. Solutions using OpenAI, Anthropic Claude, Mistral, Llama, Groq, etc. will be DISQUALIFIED regardless of how good they are.

  You must use a combination of these (the more, the better):
  • Gemini API — gemini-2.5-pro or gemini-2.5-flash via @google/genai (JS/TS) or google-genai (Python)
  • Google Antigravity — Google's agentic IDE — for your 3-hour vibe-coding session. We expect to see traces of it in your repo (commit history, .antigravity/ folder, agent traces, etc.)
  • Agent Development Kit (ADK) — Google's open-source multi-agent framework — strongly recommended for orchestrating the agent debate
  • Google AI Studio — for prompt prototyping; share your AI Studio prompt link in the blog
  • Vertex AI Agent Builder / Agent Engine — for hosting (optional, scores bonus)
  • Gemini function calling / built-in tools — for the tool-use requirement
  • Veo / Imagen / Lyria — optional multimodal flair (highlight clips, commentary voice, cover art)

  Inputs (any reasonable format — UI, form, JSON, voice)
  • Innings (1 or 2), over, ball, current score, wickets
  • Team batting, team bowling, who's on strike, who's at non-striker end
  • Bowlers remaining (overs used per bowler)
  • Pitch conditions (turning / flat / two-paced) + dew factor + venue
  • Required run rate / target (if 2nd innings)
  • Impact Player still available? Powerplay/death-overs context

  Hard requirements (what makes it "agentic" — all four are mandatory)

  1. Three or more distinct, named Gemini-powered agents that genuinely collaborate. Example: Stats Analyst, Strategist, Devil's Advocate, Match Commentator. Each must have its own system prompt and a clear
  role. A single Gemini call wearing four hats does NOT count.

  2. At least one real tool call from inside an agent — Gemini function calling, ADK tools, web search, a cricket stats API (Cricbuzz/ESPN/Sportmonks), win-probability calculation, or weather lookup. Hardcoded
   JSON gets partial credit; live fetch wins.

  3. A multi-turn reasoning loop where the Strategist proposes, the Devil's Advocate challenges, and the Strategist either defends or revises. The output must show this back-and-forth — don't hide it.

  4. Explainability for non-technical fans — the final decision must read like cricket talk, not ML jargon. Bonus for why-this-not-that.

  Stretch goals (raise your score, not required to pass)
  • Real-time mode: paste a Cricbuzz / ESPNCricinfo URL and the system scrapes live state itself (Gemini's URL context tool works beautifully here)
  • Voice in/out using Web Speech API + Gemini Live API so the captain talks back
  • Confidence score + counterfactual ("if you'd bowled X instead, win prob drops 8%")
  • Memory across overs — Gemini context caching for cheap, fast multi-turn play
  • Multimodal: feed Gemini the pitch image / scorecard screenshot directly

  Evaluation rubric — scored out of 1000

  • Relevance (250) — Does this actually solve the captain-strategist problem? Or is it a generic chatbot with cricket lipstick?
  • Technical depth (250) — Real Gemini multi-agent orchestration, real tool use, working code, not just prompt-stuffing. Non-Gemini stacks = 0 here.
  • Innovation & agentic design (250) — Is the agent debate genuinely interesting? Roles well-decomposed? Did you go beyond the obvious? Bonus for clever ADK / function calling usage.
  • Documentation & blog (250) — Your dev.to blog must explain your architecture (diagram), show the prompts you wrote for each agent, link your AI Studio prompts if any, and walk through one match scenario
  end-to-end with screenshots.

  Constraints
  • Submission: public GitHub repo + dev.to
  • 3-hour build window
  • Vibe-code your heart out using Google Antigravity (or any Gemini-powered IDE / CLI)

  
Cricket is a captain's game. Built on Gemini. Bring the heat. 🏆