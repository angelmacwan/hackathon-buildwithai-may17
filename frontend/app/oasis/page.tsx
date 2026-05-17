"use client";

import React, { useState } from "react";
import MatchStateForm, { MatchStateFormValues } from "@/components/MatchStateForm";
import OasisSimPanel from "@/components/OasisSimPanel";
import { runOasis, OasisResult } from "@/lib/api";

export default function OasisPage() {
  const [result, setResult] = useState<OasisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: MatchStateFormValues) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await runOasis(values);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* ── Header ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-violet-400 font-semibold uppercase tracking-widest">
          <span>🌐</span> Module 2
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          OASIS Simulation
        </h1>
        <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
          Synthesises 3 distinct grounded personas from the match state, then runs
          a 3-round multi-turn social simulation. The Python FastAPI backend handles
          this module via sequential Gemini calls.
        </p>

        {/* Pipeline steps */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            "① Ingest & Ontology",
            "② Persona Synthesis",
            "③ Simulation Loop (3 rounds)",
            "④ Report Synthesis",
          ].map((step) => (
            <span
              key={step}
              className="text-xs px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-medium"
            >
              {step}
            </span>
          ))}
        </div>

        {/* How it works */}
        <div className="glass-card rounded-xl p-4 max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            How OASIS Works
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unlike the War Room&apos;s fixed agent roles, OASIS dynamically generates
            3 coaching personas grounded in the match context (e.g. an aggressive
            Aussie coach, a data analyst, an old-school Indian captain). These
            personas then debate over 3 rounds, with the Devil&apos;s Advocate role
            rotating. The final synthesis extracts consensus and dissent.
          </p>
        </div>
      </div>

      {/* ── Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <MatchStateForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel="Run Simulation →"
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {error && (
            <div className="glass-card rounded-2xl p-5 border border-rose-500/30 bg-rose-950/20 text-rose-300 text-sm">
              <span className="font-semibold">⚠ Error: </span>{error}
              <p className="mt-1 text-rose-400/70 text-xs">
                Ensure FastAPI is running:{" "}
                <code className="font-mono">cd backend && uvicorn main:app --reload --port 8000</code>
              </p>
            </div>
          )}
          <OasisSimPanel result={result} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
