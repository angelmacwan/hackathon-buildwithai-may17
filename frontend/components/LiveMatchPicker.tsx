"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fetchCricMatches, fetchMatchState, CricMatch, MatchStateImport } from "@/lib/api";

interface LiveMatchPickerProps {
  onImport: (data: MatchStateImport) => void;
  onClose: () => void;
}

function MatchStatus({ ms }: { ms: string }) {
  if (ms === "live") {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "0.3rem",
        fontSize: "0.65rem", fontWeight: 700,
        color: "var(--success)", padding: "0.2rem 0.55rem",
        borderRadius: "999px", background: "var(--success-light)",
        border: "1px solid var(--success-border)",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block", animation: "pulse 1.8s ease-in-out infinite" }} />
        LIVE
      </span>
    );
  }
  if (ms === "result") {
    return (
      <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--outline)", padding: "0.2rem 0.55rem", borderRadius: "999px", background: "var(--surface-container-low)", border: "1px solid var(--divider)" }}>
        Result
      </span>
    );
  }
  return (
    <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--secondary)", padding: "0.2rem 0.55rem", borderRadius: "999px", background: "var(--surface-container-low)", border: "1px solid var(--divider)" }}>
      Upcoming
    </span>
  );
}

export default function LiveMatchPicker({ onImport, onClose }: LiveMatchPickerProps) {
  const [matches, setMatches]         = useState<CricMatch[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [importing, setImporting]     = useState<string | null>(null);
  const [query, setQuery]             = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCricMatches();
      setMatches(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load matches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleImport = async (match: CricMatch) => {
    setImporting(match.id);
    try {
      const data = await fetchMatchState(match.id);
      onImport(data);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to import match");
      setImporting(null);
    }
  };

  const filtered = matches.filter((m) => {
    const q = query.toLowerCase();
    return !q || m.t1.toLowerCase().includes(q) || m.t2.toLowerCase().includes(q) || m.series.toLowerCase().includes(q);
  });

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(10, 20, 30, 0.45)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Panel */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 101,
        width: "min(540px, calc(100vw - 2rem))",
        maxHeight: "80vh",
        display: "flex", flexDirection: "column",
        background: "var(--surface-container-lowest)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-xl)",
        border: "1px solid var(--divider)",
        overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--divider)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem", color: "var(--primary)", letterSpacing: "-0.02em" }}>
              Import Live Match
            </p>
            <p style={{ fontSize: "0.75rem", color: "var(--outline)", marginTop: "0.15rem" }}>
              Select a match to pre-fill the form with live data
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: "8px", border: "1px solid var(--divider)",
              background: "var(--surface-container-low)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", color: "var(--outline)", flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--divider)" }}>
          <input
            type="text"
            placeholder="Search team or series…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="field-input"
            style={{ fontSize: "0.875rem" }}
            autoFocus
          />
        </div>

        {/* Match list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0.5rem" }}>
          {loading && (
            <div style={{ padding: "2.5rem", textAlign: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px solid var(--primary)", borderTopColor: "transparent", animation: "spin 0.85s linear infinite", margin: "0 auto 0.75rem" }} />
              <p style={{ fontSize: "0.82rem", color: "var(--secondary)" }}>Fetching live matches…</p>
            </div>
          )}

          {error && (
            <div style={{ margin: "0.75rem", padding: "1rem", borderRadius: "var(--radius-md)", background: "var(--error-light)", border: "1px solid var(--error-border)" }}>
              <p style={{ fontSize: "0.82rem", color: "var(--error)", fontWeight: 600 }}>⚠ {error}</p>
              <button onClick={load} style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                Retry →
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p style={{ padding: "2.5rem", textAlign: "center", color: "var(--outline)", fontSize: "0.82rem" }}>
              No matches found
            </p>
          )}

          {!loading && filtered.map((m) => {
            const isImporting = importing === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleImport(m)}
                disabled={!!importing}
                style={{
                  width: "100%", textAlign: "left",
                  display: "flex", alignItems: "center", gap: "0.85rem",
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid transparent",
                  background: "transparent",
                  cursor: importing ? "wait" : "pointer",
                  opacity: importing && !isImporting ? 0.5 : 1,
                  transition: "all 0.12s",
                  marginBottom: "2px",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface-container-low)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--divider)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent"; }}
              >
                {/* Team icons */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", flexShrink: 0 }}>
                  {[m.t1img, m.t2img].map((img, i) => (
                    img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={i} src={img} alt="" width={20} height={20} style={{ borderRadius: "4px", objectFit: "contain" }} />
                    ) : (
                      <div key={i} style={{ width: 20, height: 20, borderRadius: "4px", background: "var(--surface-container)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem" }}>🏏</div>
                    )
                  ))}
                </div>

                {/* Match info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)", lineHeight: 1.2, marginBottom: "0.2rem" }}>
                    {m.t1} <span style={{ fontWeight: 400, color: "var(--outline)" }}>vs</span> {m.t2}
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "var(--outline)", lineHeight: 1.2, marginBottom: "0.3rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {m.series}
                  </p>
                  {(m.t1s || m.t2s) && (
                    <p style={{ fontSize: "0.7rem", color: "var(--secondary)", fontWeight: 500 }}>
                      {m.t1s && <span>{m.t1}: {m.t1s}</span>}
                      {m.t1s && m.t2s && <span style={{ margin: "0 0.35rem", color: "var(--outline)" }}>·</span>}
                      {m.t2s && <span>{m.t2}: {m.t2s}</span>}
                    </p>
                  )}
                </div>

                {/* Status + action */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                  <MatchStatus ms={m.ms} />
                  {isImporting ? (
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid var(--primary)", borderTopColor: "transparent", animation: "spin 0.85s linear infinite" }} />
                  ) : (
                    <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--secondary)" }}>Import →</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{ padding: "0.75rem 1.5rem", borderTop: "1px solid var(--divider)", background: "var(--surface-container-low)" }}>
          <p style={{ fontSize: "0.68rem", color: "var(--outline)", lineHeight: 1.5 }}>
            Scores from CricAPI. Playing XIs and current batsmen auto-fetched via Google Search.
          </p>
        </div>
      </div>
    </>
  );
}
