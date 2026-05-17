"use client";

import React, { useState } from "react";
import { streamWarRoom, AgentMessage, WarRoomResult } from "@/lib/api";

const SCENARIOS = [
  {
    id: "wc19",
    label: "2019 WC Final — Last Over",
    emoji: "🏆",
    description: "England need 15 off the last over. Ben Stokes on strike.",
    state: {
      innings: 2,
      over: 19,
      ball: 1,
      current_score: 226,
      wickets: 9,
      team_batting: "England",
      team_bowling: "New Zealand",
      striker: "Ben Stokes",
      non_striker: "Adil Rashid",
      bowlers_remaining: { "Trent Boult": 0, "Matt Henry": 0, "Lockie Ferguson": 0, "Colin de Grandhomme": 1, "Jimmy Neesham": 1 },
      pitch_conditions: "flat",
      dew_factor: 5,
      venue: "Lord's Cricket Ground",
      target: 242,
      required_run_rate: 15.0,
      impact_player_available: false,
      powerplay_active: false,
      death_overs: true,
      notes: "Legendary match. England need 15 off last over. Stokes on strike.",
    },
  },
  {
    id: "ipl23final",
    label: "IPL 2023 Final — Over 16",
    emoji: "🔥",
    description: "CSK need 52 off 30. Dhoni yet to bat, dew heavy.",
    state: {
      innings: 2,
      over: 15,
      ball: 6,
      current_score: 114,
      wickets: 4,
      team_batting: "Chennai Super Kings",
      team_bowling: "Gujarat Titans",
      striker: "Shivam Dube",
      non_striker: "Ravindra Jadeja",
      bowlers_remaining: { "Mohammed Shami": 2, "Mohit Sharma": 2, "Rashid Khan": 1, "Noor Ahmad": 1 },
      pitch_conditions: "flat",
      dew_factor: 8,
      venue: "Narendra Modi Stadium",
      target: 167,
      required_run_rate: 10.4,
      impact_player_available: true,
      powerplay_active: false,
      death_overs: false,
      notes: "Dhoni yet to come in. Dew heavily affecting spinners.",
    },
  },
  {
    id: "t20wc24",
    label: "T20 WC 2024 — IND vs PAK, Over 14",
    emoji: "🇮🇳",
    description: "Pakistan need 8 RPO, Shadab Khan on strike vs Bumrah.",
    state: {
      innings: 2,
      over: 13,
      ball: 4,
      current_score: 90,
      wickets: 5,
      team_batting: "Pakistan",
      team_bowling: "India",
      striker: "Shadab Khan",
      non_striker: "Imad Wasim",
      bowlers_remaining: { "Jasprit Bumrah": 2, "Arshdeep Singh": 2, "Axar Patel": 2, "Kuldeep Yadav": 0 },
      pitch_conditions: "two-paced",
      dew_factor: 4,
      venue: "Nassau County International Cricket Stadium",
      target: 120,
      required_run_rate: 8.0,
      impact_player_available: false,
      powerplay_active: false,
      death_overs: false,
      notes: "Bumrah yet to complete his quota. Hardik Pandya not playing.",
    },
  },
];

type ScenarioId = (typeof SCENARIOS)[number]["id"];

export default function BacktestPage() {
  const [selected, setSelected] = useState<ScenarioId | null>(null);
  const [debate, setDebate] = useState<AgentMessage[]>([]);
  const [result, setResult] = useState<WarRoomResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runScenario = (scenarioId: ScenarioId) => {
    const scenario = SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setSelected(scenarioId);
    setDebate([]);
    setResult(null);
    setError(null);
    setIsRunning(true);

    streamWarRoom(scenario.state as Parameters<typeof streamWarRoom>[0], {
      onMessage: (msg) => setDebate((prev) => [...prev, msg]),
      onResult: (res) => setResult(res),
      onError: (err) => { setError(err); setIsRunning(false); },
      onDone: () => setIsRunning(false),
    });
  };

  const selectedScenario = SCENARIOS.find((s) => s.id === selected);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-widest">
          <span>🔬</span> Backtesting
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Scenario Library
        </h1>
        <p className="text-slate-400 max-w-xl text-sm">
          Run the War Room against famous match moments. See if the agents would
          have made the &quot;right&quot; call — and understand why they might not.
        </p>
      </div>

      {/* Scenario cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => runScenario(s.id)}
            disabled={isRunning}
            className={`glass-card rounded-2xl p-5 text-left space-y-3 border transition-all duration-200
              hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed
              ${selected === s.id ? "border-amber-500/50 glow-indigo" : "border-slate-700/40 hover:border-amber-500/30"}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{s.emoji}</span>
              {selected === s.id && isRunning && (
                <span className="flex items-center gap-1 text-xs text-amber-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                  Running
                </span>
              )}
              {selected === s.id && !isRunning && result && (
                <span className="text-xs text-lime-400">✓ Done</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-white text-sm">{s.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.description}</p>
            </div>
            <span className="text-xs text-amber-400 font-medium">Run scenario →</span>
          </button>
        ))}
      </div>

      {/* Results */}
      {selected && (
        <div className="space-y-6">
          {selectedScenario && (
            <div className="glass-card rounded-xl p-4 border border-amber-500/20">
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-1">
                Active Scenario
              </p>
              <p className="text-white font-bold">{selectedScenario.label}</p>
              <p className="text-slate-400 text-sm">{selectedScenario.description}</p>
            </div>
          )}

          {error && (
            <div className="glass-card rounded-xl p-4 border border-rose-500/30 bg-rose-950/20 text-rose-300 text-sm">
              ⚠ {error} — Make sure the Python backend is running on port 8000.
            </div>
          )}

          {/* Debate */}
          {debate.length > 0 && (
            <div className="glass-card rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                Agent Debate
                {isRunning && (
                  <span className="ml-2 text-xs text-cyan-400 font-normal normal-case">
                    ● Live
                  </span>
                )}
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {debate.map((msg, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-700/80 border border-slate-600/40
                      flex items-center justify-center text-sm shrink-0">
                      {msg.agent.includes("Stats") ? "📊" :
                       msg.agent.includes("Pitch") ? "🌧️" :
                       msg.agent.includes("Devil") ? "⚡" :
                       msg.agent.includes("Comment") ? "🎙️" :
                       msg.agent.includes("Synthes") ? "🏆" : "🎯"}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-300 mb-0.5">{msg.agent}</p>
                      <p className="text-sm text-slate-400 bg-slate-800/40 rounded-lg px-3 py-2 border border-slate-700/30 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Captain's Call */}
          {result && (
            <div className="glass-card rounded-2xl p-6 space-y-5 border border-amber-500/30">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏏</span>
                <div>
                  <p className="text-xs text-amber-400 font-semibold uppercase tracking-widest">
                    Captain&apos;s Call
                  </p>
                  <p className="text-lg font-bold text-white">{result.final_decision}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Confidence</span>
                  <span className="font-semibold text-amber-400">{result.confidence_score}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-700">
                  <div className="h-2 rounded-full bg-amber-400/80" style={{ width: `${result.confidence_score}%` }} />
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{result.reasoning}</p>
              <div className="rounded-xl bg-rose-950/30 border border-rose-500/30 p-4">
                <p className="text-xs text-rose-400 font-semibold uppercase tracking-widest mb-1">Dissent</p>
                <p className="text-sm text-slate-300">{result.dissent_summary}</p>
              </div>
            </div>
          )}

          {isRunning && debate.length === 0 && (
            <div className="glass-card rounded-2xl p-8 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
              <p className="text-slate-400 text-sm">Agents deliberating…</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
