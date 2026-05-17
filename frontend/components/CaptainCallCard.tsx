"use client";

import React from "react";

interface CaptainCallCardProps {
  decision: string;
  reasoning: string;
  dissent: string;
  confidence: number;
  winProbability?: number;
}

export default function CaptainCallCard({
  decision,
  reasoning,
  dissent,
  confidence,
  winProbability,
}: CaptainCallCardProps) {
  const confColor =
    confidence >= 75 ? "var(--success-color)" :
    confidence >= 50 ? "#b45309" : "var(--error)";

  return (
    <section
      id="captain-call-card"
      className="glass-card animate-fade-up"
      style={{ padding: "1.5rem", borderTop: "3px solid var(--primary)" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", marginBottom: "1.25rem" }}>
        <div style={{
          width: 44, height: 44, borderRadius: "12px", flexShrink: 0,
          background: "var(--gradient-primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.25rem",
        }}>
          🏏
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--outline)", marginBottom: "0.25rem" }}>
            Captain&apos;s Call
          </p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--primary)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            {decision}
          </p>
        </div>
      </div>

      {/* Confidence + Win Probability */}
      <div style={{ display: "grid", gridTemplateColumns: winProbability !== undefined && winProbability !== 0 ? "1fr 1fr" : "1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--outline)" }}>Confidence</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: confColor }}>{confidence}%</span>
          </div>
          <div className="conf-track">
            <div className="conf-fill" style={{ width: `${confidence}%`, background: confColor }} />
          </div>
        </div>

        {winProbability !== undefined && winProbability !== 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--outline)" }}>Win % Δ</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: winProbability >= 0 ? "var(--success-color)" : "var(--error)" }}>
                {winProbability >= 0 ? "+" : ""}{winProbability.toFixed(1)}%
              </span>
            </div>
            <div className="conf-track">
              <div className="conf-fill" style={{
                width: `${Math.min(Math.abs(winProbability) * 4, 100)}%`,
                background: winProbability >= 0 ? "var(--success-color)" : "var(--error)",
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Reasoning */}
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--outline)", marginBottom: "0.5rem" }}>
          Reasoning
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
          {reasoning}
        </p>
      </div>

      {/* Dissent */}
      <div style={{
        borderRadius: "12px",
        padding: "0.85rem 1rem",
        background: "rgba(186, 26, 26, 0.05)",
        border: "1px solid rgba(186, 26, 26, 0.14)",
      }}>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--error)", marginBottom: "0.4rem" }}>
          ⚡ Devil&apos;s Advocate
        </p>
        <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.65 }}>
          {dissent}
        </p>
      </div>
    </section>
  );
}
