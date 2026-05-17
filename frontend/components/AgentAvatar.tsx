"use client";

import React from "react";

export const AGENTS = [
  {
    id: "strategist",
    name: "Lead Strategist",
    role: "The Captain",
    emoji: "🎯",
    color: "#12283c",
    bg: "rgba(18, 40, 60, 0.08)",
    description: "Proposes the next tactical move.",
  },
  {
    id: "analyst",
    name: "Stats Guru",
    role: "Statistical Backbone",
    emoji: "📊",
    color: "#293e53",
    bg: "rgba(41, 62, 83, 0.08)",
    description: "Delivers cold, hard match-up data.",
  },
  {
    id: "devil",
    name: "Devil's Advocate",
    role: "Risk Assessment",
    emoji: "⚡",
    color: "#ba1a1a",
    bg: "rgba(186, 26, 26, 0.07)",
    description: "Finds the flaw in every plan.",
  },
  {
    id: "pitch",
    name: "Pitch Specialist",
    role: "Environmental Context",
    emoji: "🌧️",
    color: "#2d6a4f",
    bg: "rgba(45, 106, 79, 0.07)",
    description: "Reads weather, dew & pitch conditions.",
  },
  {
    id: "commentator",
    name: "Match Commentator",
    role: "Fan Engagement",
    emoji: "🎙️",
    color: "#b45309",
    bg: "rgba(180, 83, 9, 0.07)",
    description: "Translates tactics into cricket talk.",
  },
] as const;

export type AgentId = (typeof AGENTS)[number]["id"];

interface AgentAvatarProps {
  agentId?: AgentId;
  agentName?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  pulse?: boolean;
}

export default function AgentAvatar({
  agentId,
  agentName,
  size = "md",
  showLabel = false,
  pulse = false,
}: AgentAvatarProps) {
  const agent =
    AGENTS.find((a) => a.id === agentId || a.name === agentName) ?? AGENTS[0];

  const sizePx = { sm: 32, md: 44, lg: 56 }[size];
  const fontSize = { sm: "0.95rem", md: "1.25rem", lg: "1.6rem" }[size];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
      <div
        style={{
          width: sizePx,
          height: sizePx,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize,
          background: agent.bg,
          border: `2px solid ${agent.color}30`,
          boxShadow: pulse ? `0 0 0 3px ${agent.color}20` : undefined,
          animation: pulse ? "pulse 1.8s ease-in-out infinite" : undefined,
          transition: "box-shadow 0.2s",
          flexShrink: 0,
        }}
        title={agent.role}
      >
        {agent.emoji}
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: "0.65rem",
            fontWeight: 600,
            color: "var(--secondary)",
            textAlign: "center",
            maxWidth: "72px",
            lineHeight: 1.2,
          }}
        >
          {agent.name}
        </span>
      )}
    </div>
  );
}
