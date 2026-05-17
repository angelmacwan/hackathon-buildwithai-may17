import React from "react";
import Link from "next/link";

const MODULES = [
  {
    href: "/war-room",
    icon: "⚔️",
    title: "Tactical War Room",
    tag: "Module 1",
    tech: "LangGraph · SSE",
    description:
      "Six Gemini agents deliberate live — Stats Guru uses function calling, Pitch Specialist grounds in real search data, Strategist proposes, Devil's Advocate challenges, Commentator translates.",
    accent: "#0f2236",
    accentBg: "rgba(15, 34, 54, 0.06)",
    cta: "Open War Room",
  },
  {
    href: "/oasis",
    icon: "🌐",
    title: "OASIS Simulation",
    tag: "Module 2",
    tech: "Social Simulation",
    description:
      "Synthesises 3 grounded coaching personas from match context, then runs a 3-round structured debate. Consensus and dissent are scored and extracted.",
    accent: "#1e3448",
    accentBg: "rgba(30, 52, 72, 0.06)",
    cta: "Run Simulation",
  },
];

const AGENTS = [
  { emoji: "🎯", name: "Lead Strategist",    role: "Proposes tactics",         color: "rgba(15,34,54,0.07)"  },
  { emoji: "📊", name: "Stats Guru",          role: "Function calling",         color: "rgba(30,52,72,0.07)"  },
  { emoji: "⚡", name: "Devil's Advocate",    role: "Risk assessment",          color: "rgba(185,28,28,0.06)" },
  { emoji: "🌧️", name: "Pitch Specialist",   role: "Search grounding",         color: "rgba(22,101,52,0.07)" },
  { emoji: "🎙️", name: "Match Commentator",  role: "Cricket language",         color: "rgba(180,83,9,0.07)"  },
];

const REQUIREMENTS = [
  "6 distinct named Gemini agents, each with its own system prompt",
  "Real tool calls — function calling (stats) + Google Search grounding (pitch)",
  "Multi-turn debate loop: Strategist → Devil's Advocate → Strategist revises",
  "Cricket-language output — full dissent visible via Commentator agent",
  "OASIS social simulation with dynamic persona synthesis (Module 2)",
];

export default function HomePage() {
  return (
    <div style={{ background: "linear-gradient(180deg, #f4f6f7 0%, #f7f8f8 100%)", minHeight: "100vh" }}>
      <div className="page-wrapper">

        {/* ── Hero ── */}
        <section className="hero-panel">
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>
                Multi-Agent Cricket AI
              </span>
              <span style={{ width: "1px", height: "10px", background: "rgba(255,255,255,0.2)" }} />
              <span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,183,131,0.85)" }}>
                Gemini 1.5 Pro · LangGraph
              </span>
            </div>

            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem, 5vw, 4.2rem)",
              fontWeight: 800,
              letterSpacing: "-0.055em",
              lineHeight: 0.95,
              color: "#ffffff",
              marginBottom: "1rem",
            }}>
              Captain Cool
            </h1>

            <p style={{
              maxWidth: "50ch",
              color: "rgba(255,255,255,0.72)",
              fontSize: "0.975rem",
              lineHeight: 1.75,
              marginBottom: "2rem",
            }}>
              Your virtual IPL captain. A six-agent AI system debates bowling changes,
              batting promotions, and field setups — in real cricket language, with
              full dissent visible.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "2rem" }}>
              <Link href="/war-room" style={{ textDecoration: "none" }}>
                <button className="btn-primary">⚔️ Enter War Room</button>
              </Link>
              <Link href="/oasis" style={{ textDecoration: "none" }}>
                <button className="btn-ghost">🌐 OASIS Simulation</button>
              </Link>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {["6 Gemini Agents", "Live SSE Streaming", "Google Search Grounding", "Function Calling"].map((s) => (
                <span key={s} className="stat-chip">{s}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Modules ── */}
        <section>
          <div style={{ marginBottom: "1.25rem" }}>
            <p className="section-eyebrow">Modules</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MODULES.map((mod) => (
              <Link
                key={mod.href}
                href={mod.href}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  className="glass-card hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(10,20,30,0.12)] transition-all duration-200"
                  style={{ padding: "1.5rem", height: "100%", display: "flex", flexDirection: "column", gap: "1rem", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <div style={{ fontSize: "1.75rem", lineHeight: 1 }}>{mod.icon}</div>
                    <div style={{
                      padding: "0.25rem 0.6rem",
                      borderRadius: "999px",
                      background: mod.accentBg,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: mod.accent,
                      border: `1px solid ${mod.accentBg.replace('0.06', '0.15')}`,
                    }}>
                      {mod.tag}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.0rem", color: "var(--primary)", letterSpacing: "-0.02em", marginBottom: "0.2rem" }}>
                      {mod.title}
                    </p>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--outline)", marginBottom: "0.65rem" }}>
                      {mod.tech}
                    </p>
                    <p style={{ fontSize: "0.82rem", color: "var(--on-surface-variant)", lineHeight: 1.7 }}>
                      {mod.description}
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: mod.accent }}>
                    {mod.cta}
                    <span style={{ fontSize: "0.9rem" }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Agents ── */}
        <section className="glass-card" style={{ padding: "1.5rem 1.75rem" }}>
          <p className="section-eyebrow" style={{ marginBottom: "1.1rem" }}>Agent Roster</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.75rem" }}>
            {AGENTS.map((a) => (
              <div key={a.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem", textAlign: "center" }}>
                <div style={{
                  width: 44, height: 44,
                  borderRadius: "12px",
                  background: a.color,
                  border: "1px solid var(--divider)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.2rem",
                }}>
                  {a.emoji}
                </div>
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary)", lineHeight: 1.3 }}>{a.name}</p>
                  <p style={{ fontSize: "0.65rem", color: "var(--outline)", marginTop: "0.15rem" }}>{a.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Requirements ── */}
        <section className="glass-card" style={{ padding: "1.5rem 1.75rem" }}>
          <p className="section-eyebrow" style={{ marginBottom: "1.1rem" }}>Agentic Requirements</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {REQUIREMENTS.map((text) => (
              <div key={text} style={{
                display: "flex", alignItems: "flex-start", gap: "0.65rem",
                padding: "0.75rem 0.9rem",
                borderRadius: "10px",
                background: "var(--success-light)",
                border: "1px solid var(--success-border)",
              }}>
                <span style={{ color: "var(--success)", fontWeight: 800, fontSize: "0.8rem", lineHeight: 1.5, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: "0.82rem", color: "var(--on-surface-variant)", lineHeight: 1.55 }}>{text}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
