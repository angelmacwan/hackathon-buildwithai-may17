"use client";

import React, { useEffect, useRef } from "react";
import AgentAvatar, { AGENTS } from "./AgentAvatar";

interface AgentMessage {
  agent: string;
  message: string;
}

interface AgentDebatePanelProps {
  debate: AgentMessage[];
  isStreaming?: boolean;
  activeAgent?: string | null;
}

export default function AgentDebatePanel({
  debate,
  isStreaming = false,
  activeAgent = null,
}: AgentDebatePanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [debate.length]);

  return (
    <section
      id="agent-debate-panel"
      className="glass-card"
      style={{ padding: "1.25rem" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--outline)" }}>
          Internal Debate
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {debate.length > 0 && (
            <span style={{ fontSize: "0.72rem", color: "var(--outline)" }}>
              {debate.length} message{debate.length !== 1 ? "s" : ""}
            </span>
          )}
          {isStreaming && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.72rem", color: "var(--success-color)", fontWeight: 600 }}>
              <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "var(--success-color)", animation: "pulse 1.8s ease-in-out infinite" }} />
              Live
            </span>
          )}
        </div>
      </div>

      {/* Agent roster */}
      <div style={{ display: "flex", gap: "0.75rem", paddingBottom: "0.75rem", marginBottom: "0.75rem", overflowX: "auto", borderBottom: "1px solid rgba(18,40,60,0.06)" }}>
        {AGENTS.map((a) => (
          <AgentAvatar key={a.id} agentId={a.id} size="sm" showLabel />
        ))}
      </div>

      {/* Debate feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxHeight: "480px", overflowY: "auto", paddingRight: "4px" }}>
        {debate.length === 0 && !isStreaming && (
          <p style={{ textAlign: "center", color: "var(--outline)", fontSize: "0.875rem", padding: "2rem 0" }}>
            Waiting for agents to deliberate…
          </p>
        )}

        {debate.map((turn, idx) => {
          const agentConfig = AGENTS.find((a) => a.name === turn.agent);
          const isActive = isStreaming && activeAgent === turn.agent && idx === debate.length - 1;

          return (
            <div
              key={idx}
              className="animate-fade-up"
              style={{
                display: "flex",
                gap: "0.65rem",
                alignItems: "flex-start",
                animationDelay: `${Math.min(idx * 0.04, 0.4)}s`,
              }}
            >
              <AgentAvatar agentName={turn.agent} size="sm" pulse={isActive} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: agentConfig?.color ?? "var(--secondary)",
                    marginBottom: "0.25rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {turn.agent}
                </p>
                <div
                  className="debate-bubble"
                  style={
                    isActive
                      ? { borderColor: `${agentConfig?.color ?? "var(--outline)"}35` }
                      : {}
                  }
                >
                  {turn.message}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isStreaming && (
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", paddingLeft: "4px" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "var(--surface-container)",
              border: "1px solid rgba(18,40,60,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem"
            }}>
              🤖
            </div>
            <span style={{ fontSize: "0.72rem", color: "var(--outline)", marginRight: "0.25rem" }}>
              {activeAgent ?? "Agents"} thinking
            </span>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  width: 5, height: 5,
                  borderRadius: "50%",
                  background: "var(--outline-variant)",
                  animation: `bounce 1.2s ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </section>
  );
}
