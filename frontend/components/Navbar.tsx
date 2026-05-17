"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/war-room", label: "⚔️ War Room" },
  { href: "/oasis", label: "🌐 OASIS" },
  { href: "/backtest", label: "🔬 Backtest" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(248, 249, 249, 0.88)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(18, 40, 60, 0.08)",
        boxShadow: "0 2px 12px rgba(18, 40, 60, 0.04)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" style={{ textDecoration: "none" }}>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: "var(--gradient-primary)" }}
          >
            🏏
          </div>
          <div>
            <p
              className="font-bold text-sm leading-none"
              style={{ fontFamily: "var(--font-display)", color: "var(--primary)", letterSpacing: "-0.02em" }}
            >
              Captain Cool
            </p>
            <p className="text-xs leading-none mt-0.5 hidden sm:block" style={{ color: "var(--outline)" }}>
              Multi-Agent Cricket Strategist
            </p>
          </div>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{ textDecoration: "none" }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active ? "" : ""
                }`}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.3rem 0.65rem",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    fontWeight: active ? "700" : "500",
                    color: active ? "var(--primary)" : "var(--secondary)",
                    background: active ? "rgba(18, 40, 60, 0.07)" : "transparent",
                    transition: "all 0.14s",
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
