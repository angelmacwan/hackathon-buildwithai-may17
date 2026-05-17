"use client";

import React, { useState } from "react";

export interface MatchStateFormValues {
  innings: number;
  over: number;
  ball: number;
  current_score: number;
  wickets: number;
  team_batting: string;
  team_bowling: string;
  striker: string;
  non_striker: string;
  pitch_conditions: string;
  dew_factor: number;
  venue: string;
  target?: number;
  required_run_rate?: number;
  impact_player_available: boolean;
  notes?: string;
}

const DEFAULT_VALUES: MatchStateFormValues = {
  innings: 1,
  over: 1,
  ball: 1,
  current_score: 0,
  wickets: 0,
  team_batting: "",
  team_bowling: "",
  striker: "",
  non_striker: "",
  pitch_conditions: "flat",
  dew_factor: 3,
  venue: "",
  target: undefined,
  required_run_rate: undefined,
  impact_player_available: true,
  notes: "",
};

interface MatchStateFormProps {
  onSubmit: (values: MatchStateFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}

function Section({ title, color = "var(--outline)", children }: {
  title: string; color?: string; children: React.ReactNode;
}) {
  return (
    <fieldset
      style={{
        border: "1px solid rgba(18, 40, 60, 0.08)",
        borderRadius: "14px",
        padding: "1rem",
        background: "rgba(248,249,249,0.6)",
      }}
    >
      <legend
        style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color,
          padding: "0 0.35rem",
        }}
      >
        {title}
      </legend>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </fieldset>
  );
}

export default function MatchStateForm({
  onSubmit,
  isLoading = false,
  submitLabel = "Analyse Now",
}: MatchStateFormProps) {
  const [values, setValues] = useState<MatchStateFormValues>(DEFAULT_VALUES);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setValues((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Match Context */}
      <Section title="Match Context" color="var(--primary)">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="field">
            <label htmlFor="innings" className="field-label">Innings</label>
            <select id="innings" name="innings" value={values.innings}
              onChange={handleChange} className="field-input">
              <option value={1}>1st Innings</option>
              <option value={2}>2nd Innings</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="over" className="field-label">Over</label>
            <input id="over" name="over" type="number" min={1} max={20}
              value={values.over} onChange={handleChange} className="field-input" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="field">
            <label className="field-label">Score</label>
            <div className="flex gap-1 items-center">
              <input name="current_score" type="number" min={0} value={values.current_score}
                onChange={handleChange} className="field-input" placeholder="Runs" />
              <span style={{ color: "var(--outline)", fontSize: "0.9rem" }}>/</span>
              <input name="wickets" type="number" min={0} max={10} value={values.wickets}
                onChange={handleChange} className="field-input" placeholder="Wkts" />
            </div>
          </div>
          <div className="field">
            <label htmlFor="ball" className="field-label">Ball</label>
            <input id="ball" name="ball" type="number" min={1} max={6}
              value={values.ball} onChange={handleChange} className="field-input" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="field">
            <label htmlFor="team_batting" className="field-label">Batting Team</label>
            <input id="team_batting" name="team_batting" type="text"
              value={values.team_batting} onChange={handleChange} className="field-input"
              placeholder="e.g. Mumbai Indians" />
          </div>
          <div className="field">
            <label htmlFor="team_bowling" className="field-label">Bowling Team</label>
            <input id="team_bowling" name="team_bowling" type="text"
              value={values.team_bowling} onChange={handleChange} className="field-input"
              placeholder="e.g. Chennai Super Kings" />
          </div>
          <div className="field">
            <label htmlFor="striker" className="field-label">Striker</label>
            <input id="striker" name="striker" type="text"
              value={values.striker} onChange={handleChange} className="field-input"
              placeholder="On strike" />
          </div>
          <div className="field">
            <label htmlFor="non_striker" className="field-label">Non-Striker</label>
            <input id="non_striker" name="non_striker" type="text"
              value={values.non_striker} onChange={handleChange} className="field-input"
              placeholder="Other end" />
          </div>
        </div>
      </Section>

      {/* Conditions */}
      <Section title="Pitch & Conditions" color="var(--secondary)">
        <div className="grid grid-cols-1 gap-3">
          <div className="field">
            <label htmlFor="venue" className="field-label">Venue</label>
            <input id="venue" name="venue" type="text" value={values.venue}
              onChange={handleChange} className="field-input" placeholder="e.g. Wankhede Stadium" />
          </div>
          <div className="field">
            <label htmlFor="pitch_conditions" className="field-label">Pitch</label>
            <select id="pitch_conditions" name="pitch_conditions"
              value={values.pitch_conditions} onChange={handleChange} className="field-input">
              <option value="flat">Flat</option>
              <option value="turning">Turning</option>
              <option value="two-paced">Two-Paced</option>
              <option value="seaming">Seaming</option>
              <option value="dusty">Dusty</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="dew_factor" className="field-label">
              Dew Factor — {values.dew_factor} / 10
            </label>
            <input id="dew_factor" name="dew_factor" type="range" min={0} max={10}
              value={values.dew_factor} onChange={handleChange}
              style={{ width: "100%", accentColor: "var(--primary)", marginTop: "0.25rem" }} />
          </div>
        </div>
      </Section>

      {/* 2nd Innings */}
      {values.innings === 2 && (
        <Section title="Chase Context" color="var(--error)">
          <div className="grid grid-cols-2 gap-3">
            <div className="field">
              <label htmlFor="target" className="field-label">Target</label>
              <input id="target" name="target" type="number" min={0}
                value={values.target ?? ""} onChange={handleChange} className="field-input" />
            </div>
            <div className="field">
              <label htmlFor="required_run_rate" className="field-label">RRR</label>
              <input id="required_run_rate" name="required_run_rate" type="number"
                step={0.01} min={0} value={values.required_run_rate ?? ""}
                onChange={handleChange} className="field-input" />
            </div>
          </div>
        </Section>
      )}

      {/* Extras */}
      <Section title="Extras">
        <label className="flex items-center gap-2.5 cursor-pointer mb-3">
          <input id="impact_player_available" name="impact_player_available" type="checkbox"
            checked={values.impact_player_available} onChange={handleChange}
            style={{ width: "16px", height: "16px", accentColor: "var(--primary)", cursor: "pointer" }} />
          <span style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)" }}>
            Impact Player still available
          </span>
        </label>
        <div className="field">
          <label htmlFor="notes" className="field-label">Additional Notes</label>
          <textarea id="notes" name="notes" rows={2}
            value={values.notes ?? ""} onChange={handleChange}
            className="field-input"
            style={{ resize: "none" }}
            placeholder="Any extra context (injury, momentum shift, umpiring calls…)" />
        </div>
      </Section>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
        style={{ width: "100%", justifyContent: "center" }}
      >
        {isLoading ? (
          <>
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            Analysing…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}
