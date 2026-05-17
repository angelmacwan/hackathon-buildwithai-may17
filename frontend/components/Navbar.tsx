"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/war-room", label: "War Room" },
  { href: "/oasis",    label: "OASIS" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(247, 248, 248, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--divider)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.25rem", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "9px", flexShrink: 0,
            background: "var(--gradient-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1rem",
            boxShadow: "0 2px 8px rgba(10,30,50,0.20)",
          }}>
            🏏
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.875rem", color: "var(--primary)", letterSpacing: "-0.03em", lineHeight: 1 }}>
              Captain Cool
            </p>
            <p style={{ fontSize: "0.65rem", color: "var(--outline)", lineHeight: 1, marginTop: "0.2rem", display: "none" }} className="sm:block">
              Multi-Agent Cricket AI
            </p>
          </div>
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: active ? 700 : 500,
                  color: active ? "var(--primary)" : "var(--secondary)",
                  background: active ? "rgba(15,34,54,0.07)" : "transparent",
                  transition: "all 0.12s",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}
