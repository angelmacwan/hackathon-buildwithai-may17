"use client";

import React from "react";

interface PersonaProfile {
  name: string;
  background: string;
  core_philosophy: string;
  bias: string;
}

interface DebateTurn {
  persona: string;
  message: string;
  round: number;
}

interface OasisResult {
  personas: PersonaProfile[];
  debate_log: DebateTurn[];
  final_decision: string;
  reasoning: string;
  dissent_summary: string;
  confidence_score: number;
}

interface OasisSimPanelProps {
  result: OasisResult | null;
  isLoading?: boolean;
}

export default function OasisSimPanel({ result, isLoading = false }: OasisSimPanelProps) {
  if (isLoading) {
    return (
      <div id="oasis-sim-panel" className="glass-card" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "3px solid var(--primary)",
          borderTopColor: "transparent",
          animation: "spin 0.9s linear infinite",
        }} />
        <p style={{ color: "var(--secondary)", fontSize: "0.875rem" }}>
          Running OASIS Social Simulation…
        </p>
        <p style={{ color: "var(--outline)", fontSize: "0.78rem" }}>
          Synthesising personas → Running 3 rounds → Extracting consensus
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div id="oasis-sim-panel" className="glass-card" style={{ padding: "2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>🌐</p>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--primary)", marginBottom: "0.5rem" }}>
          OASIS Simulation
        </h3>
        <p style={{ color: "var(--secondary)", fontSize: "0.875rem", maxWidth: "32ch", margin: "0 auto", lineHeight: 1.6 }}>
          Submit a match state to synthesise personas and run the social simulation debate.
        </p>
      </div>
    );
  }

  const rounds = Array.from(new Set(result.debate_log.map((t) => t.round))).sort();

  // Assign a color to each persona
  const personaColors: Record<string, string> = {};
  const colors = ["#12283c", "#2d6a4f", "#ba1a1a", "#b45309", "#293e53"];
  result.personas.forEach((p, i) => {
    personaColors[p.name] = colors[i % colors.length];
  });

  const confColor =
    result.confidence_score >= 75 ? "var(--success-color)" :
    result.confidence_score >= 50 ? "#b45309" : "var(--error)";

  return (
    <div id="oasis-sim-panel" className="space-y-5" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Personas */}
      <section className="glass-card" style={{ padding: "1.25rem" }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--outline)", marginBottom: "0.75rem" }}>
          Synthesised Personas
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
          {result.personas.map((p) => (
            <div
              key={p.name}
              style={{
                padding: "0.85rem",
                borderRadius: "14px",
                background: "var(--surface-container-low)",
                border: "1px solid rgba(18,40,60,0.07)",
              }}
            >
              <p style={{ fontWeight: 700, fontSize: "0.85rem", color: personaColors[p.name] ?? "var(--primary)", marginBottom: "0.3rem" }}>
                {p.name}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--secondary)", marginBottom: "0.4rem", lineHeight: 1.5 }}>
                {p.background}
              </p>
              <p style={{ fontSize: "0.72rem", color: "var(--on-surface-variant)", fontStyle: "italic", marginBottom: "0.35rem", lineHeight: 1.5 }}>
                &ldquo;{p.core_philosophy}&rdquo;
              </p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
                padding: "0.2rem 0.55rem", borderRadius: "999px",
                background: "rgba(180,83,9,0.08)", border: "1px solid rgba(180,83,9,0.18)",
                fontSize: "0.65rem", color: "#b45309", fontWeight: 600,
              }}>
                ⚠ {p.bias}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Debate by round */}
      <section className="glass-card" style={{ padding: "1.25rem" }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--outline)", marginBottom: "0.75rem" }}>
          Simulation Debate
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {rounds.map((round) => (
            <div key={round}>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--outline)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Round {round}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {result.debate_log.filter((t) => t.round === round).map((turn, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: `${personaColors[turn.persona] ?? "var(--primary)"}15`,
                      border: `2px solid ${personaColors[turn.persona] ?? "var(--primary)"}30`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.7rem", fontWeight: 700,
                      color: personaColors[turn.persona] ?? "var(--primary)",
                    }}>
                      {turn.persona.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: personaColors[turn.persona] ?? "var(--primary)", marginBottom: "0.2rem" }}>
                        {turn.persona}
                      </p>
                      <div className="debate-bubble">{turn.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final decision */}
      <section className="glass-card" style={{ padding: "1.5rem", borderTop: "3px solid var(--primary)" }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--outline)", marginBottom: "0.75rem" }}>
          OASIS Verdict
        </p>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.05rem", color: "var(--primary)", marginBottom: "0.85rem", letterSpacing: "-0.02em" }}>
          {result.final_decision}
        </p>

        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--outline)" }}>Confidence</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: confColor }}>{result.confidence_score}%</span>
          </div>
          <div className="conf-track">
            <div className="conf-fill" style={{ width: `${result.confidence_score}%`, background: confColor }} />
          </div>
        </div>

        <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.65, marginBottom: "1rem" }}>
          {result.reasoning}
        </p>

        <div style={{
          borderRadius: "12px", padding: "0.85rem 1rem",
          background: "rgba(186,26,26,0.05)", border: "1px solid rgba(186,26,26,0.14)",
        }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--error)", marginBottom: "0.4rem" }}>
            ⚡ Dissent
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.65 }}>
            {result.dissent_summary}
          </p>
        </div>
      </section>
    </div>
  );
}
