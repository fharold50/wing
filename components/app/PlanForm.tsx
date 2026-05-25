"use client";

import { useState, useTransition } from "react";
import { createPlan } from "@/app/actions";

const ACTIVITY_OPTIONS = [
  ["surf_water", "🏄 Surf & Water"],
  ["hiking", "🥾 Hiking"],
  ["bars_nightlife", "🍹 Bars & Nightlife"],
  ["live_music", "🎵 Live Music"],
  ["food_dining", "🍜 Food & Dining"],
  ["photography", "📸 Photography"],
  ["fitness", "🏋️ Fitness"],
  ["coffee_chill", "☕ Coffee & Chill"],
  ["arts_culture", "🎭 Arts & Culture"],
  ["beach", "🏖️ Beach"],
  ["road_trip", "🚗 Road Trip"],
  ["games_leisure", "🎲 Games"],
] as const;

export default function PlanForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function submit(formData: FormData) {
    setErr(null);
    startTransition(async () => {
      const res = await createPlan(formData);
      if (res.ok) setOpen(false);
      else setErr(res.error ?? "Failed");
    });
  }

  if (!open) {
    return (
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        ➕ Post a plan
      </button>
    );
  }

  return (
    <form action={submit} className="onb-card" style={{ marginBottom: 24 }}>
      <h2 className="onb-title">Post an activity plan</h2>
      <p className="onb-sub">Wings will see it and can request to join.</p>
      <label className="onb-field">
        <span>Activity</span>
        <select name="activity_type" required className="onb-select" defaultValue="">
          <option value="" disabled>Pick one</option>
          {ACTIVITY_OPTIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
      <label className="onb-field">
        <span>Title</span>
        <input name="title" required className="onb-input" placeholder="e.g. Sunrise surf at North Shore" />
      </label>
      <label className="onb-field">
        <span>Description</span>
        <textarea name="description" className="onb-textarea" placeholder="What's the plan? Skill level? Meeting point?" />
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label className="onb-field">
          <span>City</span>
          <input name="city" className="onb-input" placeholder="Brooklyn, NY" />
        </label>
        <label className="onb-field">
          <span>Specific location</span>
          <input name="location" className="onb-input" placeholder="Prospect Park" />
        </label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <label className="onb-field">
          <span>Date & time</span>
          <input name="datetime" type="datetime-local" required className="onb-input" />
        </label>
        <label className="onb-field">
          <span>Max wings</span>
          <input name="max_participants" type="number" min={2} max={20} defaultValue={4} className="onb-input" />
        </label>
      </div>
      {err && <div className="auth-err">{err}</div>}
      <div className="onb-buttons">
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)} disabled={pending}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Posting…" : "🪶 Post plan"}
        </button>
      </div>
    </form>
  );
}
