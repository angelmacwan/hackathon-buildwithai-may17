"use client";

import React, { useState } from "react";
import LiveMatchPicker from "@/components/LiveMatchPicker";
import OasisSimPanel from "@/components/OasisSimPanel";
import { runOasis, OasisResult, MatchStateImport } from "@/lib/api";
import { MatchStateFormValues } from "@/components/MatchStateForm";

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
  const [showPicker, setShowPicker] = useState(false);
  const [activeMatch, setActiveMatch] = useState<string | null>(null);

  const handleImport = (data: MatchStateImport) => {
    setShowPicker(false);
    setActiveMatch(data.match_name);
    if (data.state) {
      handleSubmit(data.state as MatchStateFormValues);
    }
  };

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
            Synthesises 3 distinct grounded coaching personas from live match context,
            then runs a 3-round structured social debate. Consensus and dissent
            are scored and extracted.
          </p>
          
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {PIPELINE_STEPS.map((step) => (
                <span key={step} className="stat-chip" style={{ fontSize: "0.72rem" }}>{step}</span>
              ))}
            </div>
            
            <button
              onClick={() => setShowPicker(true)}
              disabled={isLoading}
              className="btn-primary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", borderRadius: "8px", boxShadow: "none" }}
            >
              🎯 {activeMatch ? "Change Match" : "Select Live Match"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Match Status Banner ── */}
      {activeMatch && (
        <div className="glass-card animate-fade-up" style={{ padding: "0.85rem 1.25rem", borderLeft: "4px solid var(--tertiary)", display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🏏</span>
          <div>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--tertiary)", marginBottom: "0.1rem" }}>
              Simulating Match
            </p>
            <p style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>{activeMatch}</p>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {error && (
          <div className="glass-card" style={{
            padding: "1rem 1.25rem",
            borderLeft: "3px solid var(--error)",
            background: "var(--error-light)",
            border: "1px solid var(--error-border)",
          }}>
            <p style={{ fontSize: "0.875rem", color: "var(--error)", fontWeight: 600, marginBottom: "0.25rem" }}>
              ⚠ Simulation Error
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--secondary)" }}>{error}</p>
          </div>
        )}

        {result || isLoading ? (
          <OasisSimPanel result={result} isLoading={isLoading} />
        ) : (
          <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
            <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🌐</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--primary)", marginBottom: "0.5rem" }}>
              OASIS Ready
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--secondary)", maxWidth: "40ch", margin: "0 auto 1.5rem" }}>
              Select a live match to generate coaching personas and start the multi-round simulation.
            </p>
            <button
              onClick={() => setShowPicker(true)}
              className="btn-primary"
              style={{ alignSelf: "center" }}
            >
              🎯 Select Match
            </button>
          </div>
        )}
      </div>

      {/* ── Live match picker modal ── */}
      {showPicker && (
        <LiveMatchPicker
          onImport={handleImport}
          onClose={() => setShowPicker(false)}
        />
      )}

    </div>
  );
}

