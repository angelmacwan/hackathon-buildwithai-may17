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
      innings: 2, over: 19, ball: 1, current_score: 226, wickets: 9,
      team_batting: "England", team_bowling: "New Zealand",
      striker: "Ben Stokes", non_striker: "Adil Rashid",
      bowlers_remaining: { "Trent Boult": 0, "Matt Henry": 0, "Lockie Ferguson": 0, "Colin de Grandhomme": 1, "Jimmy Neesham": 1 },
      pitch_conditions: "flat", dew_factor: 5, venue: "Lord's Cricket Ground",
      target: 242, required_run_rate: 15.0,
      impact_player_available: false, powerplay_active: false, death_overs: true,
      notes: "Legendary match. England need 15 off last over. Stokes on strike.",
    },
  },
  {
    id: "ipl23final",
    label: "IPL 2023 Final — Over 16",
    emoji: "🔥",
    description: "CSK need 52 off 30. Dhoni yet to bat, dew heavy.",
    state: {
      innings: 2, over: 15, ball: 6, current_score: 114, wickets: 4,
      team_batting: "Chennai Super Kings", team_bowling: "Gujarat Titans",
      striker: "Shivam Dube", non_striker: "Ravindra Jadeja",
      bowlers_remaining: { "Mohammed Shami": 2, "Mohit Sharma": 2, "Rashid Khan": 1, "Noor Ahmad": 1 },
      pitch_conditions: "flat", dew_factor: 8, venue: "Narendra Modi Stadium",
      target: 167, required_run_rate: 10.4,
      impact_player_available: true, powerplay_active: false, death_overs: false,
      notes: "Dhoni yet to come in. Dew heavily affecting spinners.",
    },
  },
  {
    id: "t20wc24",
    label: "T20 WC 2024 — IND vs PAK, Over 14",
    emoji: "🇮🇳",
    description: "Pakistan need 8 RPO, Shadab Khan on strike vs Bumrah.",
    state: {
      innings: 2, over: 13, ball: 4, current_score: 90, wickets: 5,
      team_batting: "Pakistan", team_bowling: "India",
      striker: "Shadab Khan", non_striker: "Imad Wasim",
      bowlers_remaining: { "Jasprit Bumrah": 2, "Arshdeep Singh": 2, "Axar Patel": 2, "Kuldeep Yadav": 0 },
      pitch_conditions: "two-paced", dew_factor: 4, venue: "Nassau County International Cricket Stadium",
      target: 120, required_run_rate: 8.0,
      impact_player_available: false, powerplay_active: false, death_overs: false,
      notes: "Bumrah yet to complete his quota. Hardik Pandya not playing.",
    },
  },
];

type ScenarioId = (typeof SCENARIOS)[number]["id"];

function agentEmoji(name: string) {
  if (name.includes("Stats"))    return "📊";
  if (name.includes("Pitch"))    return "🌧️";
  if (name.includes("Devil"))    return "⚡";
  if (name.includes("Comment"))  return "🎙️";
  if (name.includes("Synthes"))  return "🏆";
  return "🎯";
}

export default function BacktestPage() {
  const [selected, setSelected]   = useState<ScenarioId | null>(null);
  const [debate, setDebate]       = useState<AgentMessage[]>([]);
  const [result, setResult]       = useState<WarRoomResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError]         = useState<string | null>(null);

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
      onResult:  (res) => setResult(res),
      onError:   (err) => { setError(err); setIsRunning(false); },
      onDone:    ()    => setIsRunning(false),
    });
  };

  const selectedScenario = SCENARIOS.find((s) => s.id === selected);
  const confColor = result
    ? result.confidence_score >= 75 ? "var(--success)"
    : result.confidence_score >= 50 ? "var(--tertiary)" : "var(--error)"
    : "var(--success)";

  return (
    <div className="page-wrapper">

      {/* ── Hero ── */}
      <div className="hero-panel">
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>
            Backtesting · Scenario Library
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.05em", color: "#fff", marginBottom: "0.6rem" }}>
            🔬 Scenario Library
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", maxWidth: "54ch", lineHeight: 1.7 }}>
            Run the War Room agents against famous match moments. Validate whether
            the system makes the &quot;right&quot; call — and understand the dissent when it doesn&apos;t.
          </p>
        </div>
      </div>

      {/* ── Scenario cards ── */}
      <section>
        <p className="section-eyebrow" style={{ marginBottom: "1rem" }}>Select a Scenario</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SCENARIOS.map((s) => {
            const isActive = selected === s.id;
            return (
              <button
                key={s.id}
                onClick={() => runScenario(s.id)}
                disabled={isRunning}
                style={{
                  textAlign: "left",
                  background: "var(--surface-container-lowest)",
                  border: `1px solid ${isActive ? "var(--tertiary-border)" : "var(--divider)"}`,
                  borderRadius: "var(--radius-lg)",
                  boxShadow: isActive ? "0 0 0 3px var(--tertiary-light)" : "var(--shadow-card)",
                  padding: "1.25rem",
                  cursor: isRunning ? "not-allowed" : "pointer",
                  opacity: isRunning && !isActive ? 0.55 : 1,
                  transition: "all 0.18s",
                  display: "flex", flexDirection: "column", gap: "0.85rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>{s.emoji}</span>
                  {isActive && isRunning && (
                    <span className="live-dot" style={{ fontSize: "0.7rem" }}>Running</span>
                  )}
                  {isActive && !isRunning && result && (
                    <span className="badge badge-success">✓ Done</span>
                  )}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--primary)", marginBottom: "0.25rem" }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "var(--secondary)", lineHeight: 1.55 }}>{s.description}</p>
                </div>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--tertiary)" }}>
                  Run scenario →
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Results ── */}
      {selected && (
        <section style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Active scenario banner */}
          {selectedScenario && (
            <div className="glass-card" style={{ padding: "1rem 1.25rem", borderLeft: "3px solid var(--tertiary)", display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <span style={{ fontSize: "1.5rem" }}>{selectedScenario.emoji}</span>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--tertiary)", marginBottom: "0.15rem" }}>
                  Active Scenario
                </p>
                <p style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>{selectedScenario.label}</p>
                <p style={{ color: "var(--secondary)", fontSize: "0.8rem" }}>{selectedScenario.description}</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="glass-card" style={{
              padding: "1rem 1.25rem",
              borderLeft: "3px solid var(--error)",
              background: "var(--error-light)",
              border: "1px solid var(--error-border)",
              borderLeftWidth: "3px",
            }}>
              <p style={{ fontSize: "0.875rem", color: "var(--error)", fontWeight: 600 }}>⚠ {error}</p>
              <p style={{ fontSize: "0.78rem", color: "var(--outline)", marginTop: "0.3rem" }}>
                Make sure the Python backend is running on port 8000.
              </p>
            </div>
          )}

          {/* Debate feed */}
          {debate.length > 0 && (
            <div className="glass-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <p className="section-eyebrow">Agent Debate</p>
                {isRunning && <span className="live-dot">Live</span>}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "420px", overflowY: "auto", paddingRight: "4px" }}>
                {debate.map((msg, i) => (
                  <div key={i} className="animate-fade-up" style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                      background: "var(--surface-container-low)",
                      border: "1px solid var(--divider)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.9rem",
                    }}>
                      {agentEmoji(msg.agent)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
                        {msg.agent}
                      </p>
                      <div className="debate-bubble">{msg.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Captain's Call */}
          {result && (
            <div className="glass-card animate-fade-up" style={{ padding: "1.5rem", borderTop: "3px solid var(--tertiary)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", marginBottom: "1.25rem" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "12px", flexShrink: 0,
                  background: "var(--gradient-primary)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.25rem",
                }}>
                  🏏
                </div>
                <div>
                  <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--tertiary)", marginBottom: "0.25rem" }}>
                    Captain&apos;s Call
                  </p>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem", color: "var(--primary)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                    {result.final_decision}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--outline)" }}>Confidence</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: confColor }}>{result.confidence_score}%</span>
                </div>
                <div className="conf-track">
                  <div className="conf-fill" style={{ width: `${result.confidence_score}%`, background: confColor }} />
                </div>
              </div>

              <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.7, marginBottom: "1rem" }}>
                {result.reasoning}
              </p>

              <div style={{ borderRadius: "var(--radius-md)", padding: "0.85rem 1rem", background: "var(--error-light)", border: "1px solid var(--error-border)" }}>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--error)", marginBottom: "0.35rem" }}>
                  ⚡ Dissent
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.65 }}>
                  {result.dissent_summary}
                </p>
              </div>
            </div>
          )}

          {isRunning && debate.length === 0 && (
            <div className="glass-card" style={{ padding: "3rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid var(--primary)", borderTopColor: "transparent", animation: "spin 0.85s linear infinite" }} />
              <p style={{ color: "var(--secondary)", fontSize: "0.875rem" }}>Agents deliberating…</p>
            </div>
          )}
        </section>
      )}

    </div>
  );
}
