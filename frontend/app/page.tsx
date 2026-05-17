import React from "react";
import Link from "next/link";

const MODULES = [
  {
    href: "/war-room",
    icon: "⚔️",
    title: "Tactical War Room",
    subtitle: "Module 1 · LangGraph",
    description:
      "6 Gemini agents debate in real time via LangGraph. Stats Guru uses function calling, Pitch Specialist grounds in live data, Strategist proposes, Devil challenges, Commentator translates — streamed live via SSE.",
    badgeLabel: "SSE Streaming",
    accent: "#12283c",
    accentBg: "rgba(18, 40, 60, 0.06)",
    cta: "Enter War Room →",
  },
  {
    href: "/oasis",
    icon: "🌐",
    title: "OASIS Simulation",
    subtitle: "Module 2 · Social Simulation",
    description:
      "Synthesises 3 grounded coaching personas from the match state and runs a 3-round multi-turn social debate. Consensus and dissent are extracted and scored.",
    badgeLabel: "Persona Synthesis",
    accent: "#293e53",
    accentBg: "rgba(41, 62, 83, 0.06)",
    cta: "Run Simulation →",
  },
  {
    href: "/backtest",
    icon: "🔬",
    title: "Scenario Library",
    subtitle: "Backtesting",
    description:
      "Run the War Room agents against famous match moments — 2019 WC Final last over, IPL 2023 Final, T20 WC 2024. Validate the system against known outcomes.",
    badgeLabel: "3 Scenarios",
    accent: "#b45309",
    accentBg: "rgba(180, 83, 9, 0.06)",
    cta: "Backtest →",
  },
];

const AGENTS = [
  { emoji: "📊", name: "Stats Guru", role: "Function Calling", color: "rgba(18,40,60,0.08)" },
  { emoji: "🌧️", name: "Pitch Specialist", role: "Search Grounding", color: "rgba(18,40,60,0.06)" },
  { emoji: "🎯", name: "Lead Strategist", role: "Gemini 1.5 Pro", color: "rgba(18,40,60,0.09)" },
  { emoji: "⚡", name: "Devil's Advocate", role: "Gemini 1.5 Pro", color: "rgba(186,26,26,0.07)" },
  { emoji: "🎙️", name: "Commentator", role: "Cricket Language", color: "rgba(180,83,9,0.07)" },
  { emoji: "🌐", name: "OASIS Engine", role: "Social Simulation", color: "rgba(41,62,83,0.08)" },
];

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(255, 220, 197, 0.55), transparent 32%), linear-gradient(180deg, #f7f4ef 0%, #eef2f0 54%, #e8eceb 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-14">

        {/* ── Hero ── */}
        <section className="hero-panel">
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Eyebrow */}
            <p
              className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "0.06em",
              }}
            >
              🏆 Gemini 1.5 Pro · LangGraph · FastAPI · Google Search Grounding
            </p>

            <h1
              className="mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.055em",
                lineHeight: 0.96,
                color: "#ffffff",
              }}
            >
              Captain Cool
            </h1>

            <p
              style={{
                maxWidth: "52ch",
                color: "rgba(255,255,255,0.82)",
                fontSize: "1rem",
                lineHeight: 1.7,
                marginBottom: "2rem",
              }}
            >
              Your virtual IPL captain. Multi-agent AI debates the next bowling change,
              batting promotion, and field setup — in cricket language, with full dissent
              visible.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <Link href="/war-room" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ fontSize: "0.875rem" }}>
                  ⚔️ Enter War Room
                </button>
              </Link>
              <Link href="/oasis" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.7rem 1.25rem",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.92)",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  🌐 OASIS Simulation
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Agents ── */}
        <section>
          <p className="section-eyebrow mb-4">6 Distinct Gemini Agents</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {AGENTS.map((a) => (
              <div
                key={a.name}
                className="glass-card p-4 text-center space-y-2"
                style={{ boxShadow: "var(--shadow-sm)" }}
              >
                <div
                  className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-xl"
                  style={{ background: a.color }}
                >
                  {a.emoji}
                </div>
                <p
                  className="font-semibold text-xs leading-tight"
                  style={{ color: "var(--primary)" }}
                >
                  {a.name}
                </p>
                <p className="text-xs" style={{ color: "var(--outline)" }}>
                  {a.role}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Modules ── */}
        <section>
          <p className="section-eyebrow mb-4">Two Modules</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {MODULES.map((mod) => (
              <Link key={mod.href} href={mod.href} style={{ textDecoration: "none" }}>
                <div
                  className="glass-card p-6 h-full space-y-4 transition-all duration-200"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(18,40,60,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-card)";
                  }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{mod.icon}</span>
                    <span
                      className="badge"
                      style={{ background: mod.accentBg, borderColor: "transparent", color: mod.accent }}
                    >
                      {mod.badgeLabel}
                    </span>
                  </div>
                  <div>
                    <p
                      className="font-bold text-base"
                      style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}
                    >
                      {mod.title}
                    </p>
                    <p className="text-xs mb-2" style={{ color: "var(--outline)" }}>
                      {mod.subtitle}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--on-surface-variant)" }}>
                      {mod.description}
                    </p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: mod.accent }}>
                    {mod.cta}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Requirements checklist ── */}
        <section className="glass-card p-6">
          <p className="section-eyebrow mb-4">Agentic Requirements</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { ok: true, text: "6 distinct named Gemini agents — each with its own system prompt" },
              { ok: true, text: "Real tool calls: function calling (stats) + Google Search grounding (pitch)" },
              { ok: true, text: "Multi-turn debate loop: Strategist → Devil's Advocate → Strategist revises" },
              { ok: true, text: "Cricket-language output — full dissent visible (Commentator agent)" },
              { ok: true, text: "OASIS social simulation with dynamic persona synthesis (Module 2)" },
              { ok: true, text: "Backtesting: Scenario Library with 3 famous match moments" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-start gap-2.5 p-3 rounded-xl text-sm"
                style={{ background: "rgba(45,106,79,0.05)", border: "1px solid rgba(45,106,79,0.12)" }}
              >
                <span className="shrink-0 mt-0.5 font-bold" style={{ color: "var(--success-color)" }}>✓</span>
                <span style={{ color: "var(--on-surface-variant)" }}>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
