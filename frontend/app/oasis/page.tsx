"use client";

import React, { useState } from "react";
import MatchStateForm, { MatchStateFormValues } from "@/components/MatchStateForm";
import OasisSimPanel from "@/components/OasisSimPanel";
import { runOasis, OasisResult } from "@/lib/api";

const PIPELINE_STEPS = [
  "① Ingest & Ontology",
  "② Persona Synthesis",
  "③ Simulation Loop (3 rounds)",
  "④ Report Synthesis",
];

export default function OasisPage() {
  const [result, setResult] = useState<OasisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: MatchStateFormValues) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await runOasis(values);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">

      {/* ── Hero ── */}
      <div className="hero-panel">
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>
            Module 2 · Social Simulation
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.05em", color: "#fff", marginBottom: "0.6rem" }}>
            🌐 OASIS Simulation
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", maxWidth: "54ch", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Synthesises 3 distinct grounded coaching personas from match context,
            then runs a 3-round structured social debate. Consensus and dissent
            are scored and extracted via the Python FastAPI backend.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {PIPELINE_STEPS.map((step) => (
              <span key={step} className="stat-chip" style={{ fontSize: "0.72rem" }}>{step}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="glass-card" style={{ padding: "1.25rem 1.5rem", maxWidth: "44rem" }}>
        <p className="section-eyebrow" style={{ marginBottom: "0.5rem" }}>How OASIS Works</p>
        <p style={{ fontSize: "0.84rem", color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
          Unlike the War Room&apos;s fixed agent roles, OASIS dynamically generates
          3 coaching personas grounded in the match context — e.g. an aggressive
          Aussie coach, a data analyst, an old-school Indian captain. These personas
          debate over 3 rounds with a rotating Devil&apos;s Advocate role. The final
          synthesis extracts consensus and dissent.
        </p>
      </div>

      {/* ── Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 grid-responsive">
        <div className="lg:col-span-2 glass-card" style={{ padding: "1.5rem" }}>
          <MatchStateForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Run Simulation →"
          />
        </div>

        <div className="lg:col-span-3" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {error && (
            <div className="glass-card" style={{
              padding: "1rem 1.25rem",
              borderLeft: "3px solid var(--error)",
              background: "var(--error-light)",
              borderTop: "1px solid var(--error-border)",
              borderRight: "1px solid var(--error-border)",
              borderBottom: "1px solid var(--error-border)",
            }}>
              <p style={{ fontSize: "0.875rem", color: "var(--error)", fontWeight: 600, marginBottom: "0.25rem" }}>
                ⚠ Connection Error
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--secondary)" }}>{error}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--outline)", marginTop: "0.4rem" }}>
                Ensure FastAPI is running:{" "}
                <code style={{ fontFamily: "monospace", background: "var(--surface-container)", padding: "1px 5px", borderRadius: "4px" }}>
                  cd backend && uvicorn main:app --reload --port 8000
                </code>
              </p>
            </div>
          )}
          <OasisSimPanel result={result} isLoading={isLoading} />
        </div>
      </div>

    </div>
  );
}
