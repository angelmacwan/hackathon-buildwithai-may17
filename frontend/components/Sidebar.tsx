"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  {
    href: "/war-room",
    icon: "⚔️",
    label: "War Room",
    sub: "Live agent debate",
  },
  {
    href: "/oasis",
    icon: "🌐",
    label: "OASIS",
    sub: "Social simulation",
  },
  {
    href: "/backtest",
    icon: "🔬",
    label: "Scenario Library",
    sub: "Backtesting",
  },
];

const TECH = ["Gemini 1.5 Pro", "LangGraph", "FastAPI", "SSE"];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      position: "fixed",
      top: 0,
      left: 0,
      bottom: 0,
      width: "220px",
      background: "var(--surface-container-lowest)",
      borderRight: "1px solid var(--divider)",
      display: "flex",
      flexDirection: "column",
      zIndex: 50,
      boxShadow: "var(--shadow-sm)",
    }}>

      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none" }}>
        <div style={{
          padding: "1.5rem 1.25rem 1.25rem",
          borderBottom: "1px solid var(--divider)",
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "10px", flexShrink: 0,
            background: "var(--gradient-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem",
            boxShadow: "0 3px 10px rgba(10,30,50,0.22)",
          }}>
            🏏
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9rem", color: "var(--primary)", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Captain Cool
            </p>
            <p style={{ fontSize: "0.6rem", color: "var(--outline)", lineHeight: 1, marginTop: "0.2rem" }}>
              Multi-Agent Cricket AI
            </p>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "1rem 0.75rem", display: "flex", flexDirection: "column", gap: "0.25rem", overflowY: "auto" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--outline)", padding: "0.25rem 0.5rem 0.6rem" }}>
          Modules
        </p>

        {NAV.map(({ href, icon, label, sub }) => {
          const active = pathname === href || pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "0.6rem 0.75rem",
                borderRadius: "10px",
                background: active ? "rgba(15,34,54,0.07)" : "transparent",
                border: `1px solid ${active ? "rgba(15,34,54,0.10)" : "transparent"}`,
                transition: "all 0.12s",
              }}
            >
              <span style={{ fontSize: "1rem", lineHeight: 1, flexShrink: 0 }}>{icon}</span>
              <div>
                <p style={{ fontSize: "0.82rem", fontWeight: active ? 700 : 500, color: active ? "var(--primary)" : "var(--secondary)", lineHeight: 1.2 }}>
                  {label}
                </p>
                <p style={{ fontSize: "0.65rem", color: "var(--outline)", lineHeight: 1, marginTop: "0.15rem" }}>
                  {sub}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--divider)" }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--outline)", marginBottom: "0.6rem" }}>
          Tech Stack
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {TECH.map((t) => (
            <span key={t} style={{
              fontSize: "0.62rem", fontWeight: 600,
              padding: "0.2rem 0.5rem",
              borderRadius: "999px",
              background: "var(--surface-container-low)",
              border: "1px solid var(--divider)",
              color: "var(--secondary)",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

    </aside>
  );
}
