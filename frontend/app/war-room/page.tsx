"use client";

import React, { useState, useRef, useEffect } from "react";
import MatchStateForm, { MatchStateFormValues } from "@/components/MatchStateForm";
import AgentDebatePanel from "@/components/AgentDebatePanel";
import CaptainCallCard from "@/components/CaptainCallCard";
import LiveMatchPicker from "@/components/LiveMatchPicker";
import AgentAvatar, { AGENTS } from "@/components/AgentAvatar";
import { streamWarRoom, AgentMessage, WarRoomResult, MatchStateImport } from "@/lib/api";

type Status = "idle" | "streaming" | "done" | "error";

export default function WarRoomPage() {
  const [result, setResult]           = useState<WarRoomResult | null>(null);
  const [debate, setDebate]           = useState<AgentMessage[]>([]);
  const [status, setStatus]           = useState<Status>("idle");
  const [error, setError]             = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [showPicker, setShowPicker]   = useState(false);
  const [formKey, setFormKey]         = useState(0);
  const [importedState, setImportedState] = useState<Partial<MatchStateFormValues> | undefined>();
  const [importBanner, setImportBanner]   = useState<string | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => () => { stopRef.current?.(); }, []);

  const handleImport = (data: MatchStateImport) => {
    setImportedState(data.state);
    setFormKey((k) => k + 1);
    setImportBanner(data.match_name);
    setResult(null);
    setDebate([]);
    setError(null);
    setShowPicker(false);
    
    // Auto-start analysis on import
    if (data.state) {
      handleSubmit(data.state as MatchStateFormValues);
    }
  };

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
    <div className="page-wrapper">

      {/* ── Hero ── */}
      <div className="hero-panel">
        <div style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.13em", color: "rgba(255,255,255,0.5)", marginBottom: "0.5rem" }}>
            Module 1 · LangGraph · SSE Streaming
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.05em", color: "#fff", marginBottom: "0.5rem" }}>
            ⚔️ Tactical War Room
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.9rem", maxWidth: "54ch", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Six Gemini agents deliberate in real time using automated data feeds. 
            Stats Guru uses function calling, Pitch Specialist uses Google Search grounding, 
            streamed live via SSE.
          </p>

          {/* Agent row + Start button */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
              {AGENTS.map((a) => (
                <div key={a.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: isStreaming && activeAgent === a.name ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)",
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

            <button
              onClick={() => setShowPicker(true)}
              disabled={isStreaming}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.45rem",
                padding: "0.65rem 1.25rem",
                borderRadius: "10px",
                background: isStreaming ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "rgba(255,255,255,0.95)",
                fontWeight: 800, fontSize: "0.85rem",
                cursor: isStreaming ? "not-allowed" : "pointer", 
                transition: "all 0.14s",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => { if(!isStreaming) e.currentTarget.style.background = "rgba(255,255,255,0.22)"; }}
              onMouseLeave={(e) => { if(!isStreaming) e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
            >
              {isStreaming ? "⌛ Analysis in Progress..." : "🎯 Select Match & Analyze"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Pipeline steps ── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {["① Auto-Fetch Match State", "② Pitch Search Grounding", "③ Multi-Agent Debate", "④ Final Captain's Call"].map((step) => (
          <span key={step} className="step-badge">{step}</span>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {importBanner && (
          <div className="glass-card animate-fade-up" style={{ padding: "1rem 1.25rem", borderLeft: "4px solid var(--success)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <span style={{ fontSize: "1.2rem" }}>📡</span>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--success)", marginBottom: "0.1rem" }}>
                  Live Data Ingested
                </p>
                <p style={{ fontWeight: 700, color: "var(--primary)", fontSize: "0.9rem" }}>{importBanner}</p>
              </div>
            </div>
            <button 
              className="badge" 
              onClick={() => setShowPicker(true)} 
              disabled={isStreaming}
              style={{ cursor: "pointer" }}
            >
              Change Match
            </button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="grid-responsive">
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {error && (
              <div className="glass-card" style={{
                padding: "1rem 1.25rem",
                background: "var(--error-light)",
                border: "1px solid var(--error-border)",
                borderLeftWidth: "3px",
                borderLeftColor: "var(--error)",
              }}>
                <p style={{ fontSize: "0.875rem", color: "var(--error)", fontWeight: 600, marginBottom: "0.25rem" }}>
                  ⚠ Connection Error
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--secondary)" }}>{error}</p>
              </div>
            )}

            <AgentDebatePanel debate={debate} isStreaming={isStreaming} activeAgent={activeAgent} />
          </div>

          <div>
            {result ? (
              <CaptainCallCard
                decision={result.final_decision}
                reasoning={result.reasoning}
                dissent={result.dissent_summary}
                confidence={result.confidence_score}
                winProbability={result.win_probability}
              />
            ) : status === "idle" ? (
              <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>📡</p>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--primary)", marginBottom: "0.5rem" }}>
                  No Active Session
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--secondary)", maxWidth: "30ch", margin: "0 auto 1.5rem" }}>
                  Select a live match from the dashboard to start the multi-agent deliberation.
                </p>
                <button
                  onClick={() => setShowPicker(true)}
                  className="btn-primary"
                  style={{ alignSelf: "center" }}
                >
                  🎯 Select Match
                </button>
              </div>
            ) : isStreaming && (
              <div className="glass-card" style={{ padding: "4rem 2rem", textAlign: "center", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", border: "4px solid var(--primary)", borderTopColor: "transparent", animation: "spin 0.85s linear infinite", margin: "0 auto 1.5rem" }} />
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--primary)", marginBottom: "0.5rem" }}>
                  Deliberating...
                </h2>
                <p style={{ fontSize: "0.875rem", color: "var(--secondary)" }}>
                  Agents are analyzing live data and pitch conditions.
                </p>
              </div>
            )}
          </div>
        </div>
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
