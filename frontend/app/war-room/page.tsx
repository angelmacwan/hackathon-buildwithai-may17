"use client";

import React, { useState, useRef, useEffect } from "react";
import MatchStateForm, { MatchStateFormValues } from "@/components/MatchStateForm";
import AgentDebatePanel from "@/components/AgentDebatePanel";
import CaptainCallCard from "@/components/CaptainCallCard";
import AgentAvatar, { AGENTS } from "@/components/AgentAvatar";
import { streamWarRoom, AgentMessage, WarRoomResult } from "@/lib/api";

type Status = "idle" | "streaming" | "done" | "error";

export default function WarRoomPage() {
  const [result, setResult] = useState<WarRoomResult | null>(null);
  const [debate, setDebate] = useState<AgentMessage[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => () => { stopRef.current?.(); }, []);

  const handleSubmit = (values: MatchStateFormValues) => {
    stopRef.current?.();
    setStatus("streaming");
    setError(null);
    setResult(null);
    setDebate([]);
    setActiveAgent(null);

    const stop = streamWarRoom(values, {
      onMessage: (msg) => {
        setActiveAgent(msg.agent);
        setDebate((prev) => [...prev, msg]);
      },
      onResult: (res) => {
        setResult(res);
        setActiveAgent(null);
      },
      onError: (err) => {
        setError(err);
        setStatus("error");
        setActiveAgent(null);
      },
      onDone: () => {
        setStatus("done");
        setActiveAgent(null);
      },
    });

    stopRef.current = stop;
  };

  const isStreaming = status === "streaming";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* ── Hero ── */}
      <div className="hero-panel">
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.65)", marginBottom: "0.4rem" }}>
            Module 1 · LangGraph
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.05em", color: "#fff", marginBottom: "0.5rem" }}>
            ⚔️ Tactical War Room
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "0.9rem", maxWidth: "54ch", lineHeight: 1.65, marginBottom: "1.25rem" }}>
            Six Gemini agents deliberate in real time. Stats Guru uses function calling,
            Pitch Specialist uses Google Search grounding, Strategist proposes,
            Devil&apos;s Advocate challenges — streamed live via SSE.
          </p>

          {/* Agent row */}
          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
            {AGENTS.map((a) => (
              <div
                key={a.id}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: isStreaming && activeAgent === a.name
                    ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)",
                  border: `2px solid ${isStreaming && activeAgent === a.name ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1rem",
                  animation: isStreaming && activeAgent === a.name ? "pulse 1.8s ease-in-out infinite" : undefined,
                  transition: "all 0.2s",
                }}>
                  {a.emoji}
                </div>
                <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.65)", fontWeight: 600, maxWidth: "56px", textAlign: "center", lineHeight: 1.2 }}>
                  {a.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pipeline badges ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {["① Stats Analyst", "② Pitch Specialist", "③ Lead Strategist", "④ Devil's Advocate", "⑤ Strategist Refines", "⑥ Commentator"].map((step) => (
          <span key={step} className="badge">{step}</span>
        ))}
      </div>

      {/* ── Layout ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 3fr", gap: "1.5rem" }}
        className="grid-responsive">

        {/* Form */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <MatchStateForm onSubmit={handleSubmit} isLoading={isStreaming} submitLabel="Deliberate →" />
        </div>

        {/* Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {error && (
            <div
              className="glass-card"
              style={{ padding: "1rem 1.25rem", borderLeft: "4px solid var(--error)", background: "rgba(186,26,26,0.04)" }}
            >
              <p style={{ fontSize: "0.875rem", color: "var(--error)", fontWeight: 600, marginBottom: "0.25rem" }}>
                ⚠ Connection Error
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--secondary)" }}>{error}</p>
              <p style={{ fontSize: "0.72rem", color: "var(--outline)", marginTop: "0.4rem" }}>
                Ensure the backend is running:{" "}
                <code style={{ fontFamily: "monospace", background: "var(--surface-container)", padding: "1px 4px", borderRadius: "4px" }}>
                  cd backend && uvicorn main:app --reload --port 8000
                </code>
              </p>
            </div>
          )}

          <AgentDebatePanel debate={debate} isStreaming={isStreaming} activeAgent={activeAgent} />

          {result && (
            <CaptainCallCard
              decision={result.final_decision}
              reasoning={result.reasoning}
              dissent={result.dissent_summary}
              confidence={result.confidence_score}
              winProbability={result.win_probability}
            />
          )}

          {status === "idle" && (
            <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
              <p style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🏏</p>
              <p style={{ fontSize: "0.875rem", color: "var(--secondary)", marginBottom: "0.25rem" }}>
                Fill the match state and hit <strong style={{ color: "var(--primary)" }}>Deliberate</strong> to start.
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--outline)" }}>
                Agents stream live via Server-Sent Events
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
