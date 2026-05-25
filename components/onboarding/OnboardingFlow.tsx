"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, isClientDemoMode } from "@/lib/supabase/client";

const INTEREST_OPTIONS = [
  "surfing", "hiking", "photography", "live music", "jazz", "bars", "rooftops",
  "coffee", "yoga", "running", "food tours", "art", "museums", "beaches",
  "road trips", "cycling", "diving", "skiing", "language exchange", "books",
];

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
  ["beach", "🏖️ Beach Days"],
  ["road_trip", "🚗 Road Trips"],
  ["games_leisure", "🎲 Games & Leisure"],
] as const;

type FormState = {
  name: string;
  bio: string;
  interests: string[];
  activities_wanted: string[];
  gender: string;
  looking_for: string[];
  location: string;
  destination: string;
  trip_purpose: string;
  is_local_guide: boolean;
  wing_preference: string;
};

const STEPS = ["You", "Vibe", "Going", "Wings"] as const;

export default function OnboardingFlow({ initial }: { initial: FormState }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initial);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggle = (key: "interests" | "activities_wanted" | "looking_for", val: string) =>
    setForm((f) => {
      const cur = f[key];
      return { ...f, [key]: cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val] };
    });

  async function save() {
    setBusy(true);
    setErr(null);

    // Demo mode: no backend, just bounce to /discover. Use a hard navigation
    // (window.location) instead of router.push so we never get stuck if the
    // router is in a weird state.
    if (isClientDemoMode()) {
      window.location.href = "/discover";
      return;
    }

    const supabase = createClient();
    if (!supabase) {
      // No Supabase configured but also not demo — treat as demo and still navigate
      // so the user is never stranded on a dead Save button.
      window.location.href = "/discover";
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Not signed in — send to signup rather than getting stuck.
      window.location.href = "/signup?next=/onboarding";
      return;
    }

    const { error } = await supabase.from("profiles").update({
      name: form.name,
      bio: form.bio,
      interests: form.interests,
      activities_wanted: form.activities_wanted,
      gender: form.gender || "prefer_not_to_say",
      looking_for: form.looking_for.length ? form.looking_for : ["any"],
      location: form.location,
      destination: form.destination || null,
      trip_purpose: form.trip_purpose,
      is_local_guide: form.is_local_guide,
      wing_preference: form.wing_preference,
      last_active: new Date().toISOString(),
    }).eq("id", user.id);

    if (error) { setErr(error.message); setBusy(false); return; }
    window.location.href = "/discover";
  }

  return (
    <div className="onb-wrap">
      <div className="onb-step-track">
        {STEPS.map((_, i) => (
          <div key={i} className={`onb-step-pip ${i <= step ? "done" : ""}`} />
        ))}
      </div>
      <div className="onb-card">
        {step === 0 && (
          <>
            <h1 className="onb-title">Tell us about you</h1>
            <p className="onb-sub">The basics. Takes 30 seconds.</p>
            <label className="onb-field">
              <span>Display name</span>
              <input className="onb-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="What should Wings call you?" />
            </label>
            <label className="onb-field">
              <span>Gender</span>
              <div className="chip-grid">
                {[["man", "Wingman"], ["woman", "Wingwoman"], ["nonbinary", "Nonbinary"], ["prefer_not_to_say", "Prefer not to say"]].map(([v, l]) => (
                  <button key={v} type="button" className={`chip ${form.gender === v ? "selected" : ""}`} onClick={() => set("gender", v)}>{l}</button>
                ))}
              </div>
            </label>
            <label className="onb-field">
              <span>Looking to wing up with</span>
              <div className="chip-grid">
                {[["wingmen", "Wingmen"], ["wingwomen", "Wingwomen"], ["any", "Anyone"]].map(([v, l]) => (
                  <button key={v} type="button" className={`chip ${form.looking_for.includes(v) ? "selected" : ""}`} onClick={() => toggle("looking_for", v)}>{l}</button>
                ))}
              </div>
            </label>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="onb-title">Your vibe</h1>
            <p className="onb-sub">Pick what you&apos;re into — Wings will see this on your profile.</p>
            <label className="onb-field">
              <span>Interests</span>
              <div className="chip-grid">
                {INTEREST_OPTIONS.map((i) => (
                  <button key={i} type="button" className={`chip ${form.interests.includes(i) ? "selected" : ""}`} onClick={() => toggle("interests", i)}>{i}</button>
                ))}
              </div>
            </label>
            <label className="onb-field">
              <span>Bio</span>
              <textarea className="onb-textarea" value={form.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Two sentences. Who are you, and what kind of energy do you bring?" />
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="onb-title">Where are you going?</h1>
            <p className="onb-sub">Set your current city and optional destination.</p>
            <label className="onb-field">
              <span>Current city</span>
              <input className="onb-input" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Brooklyn, NY" />
            </label>
            <label className="onb-field">
              <span>Destination (optional)</span>
              <input className="onb-input" value={form.destination} onChange={(e) => set("destination", e.target.value)} placeholder="e.g. Miami, FL" />
            </label>
            <label className="onb-field">
              <span>I&apos;m a…</span>
              <div className="chip-grid">
                {[
                  ["solo_traveler", "Solo traveler"],
                  ["local_guide", "Local"],
                  ["group_trip", "Group trip"],
                  ["business", "Business trip"],
                ].map(([v, l]) => (
                  <button key={v} type="button" className={`chip ${form.trip_purpose === v ? "selected" : ""}`} onClick={() => set("trip_purpose", v)}>{l}</button>
                ))}
              </div>
            </label>
            <label className="onb-field">
              <span>Activities I want</span>
              <div className="chip-grid">
                {ACTIVITY_OPTIONS.map(([v, l]) => (
                  <button key={v} type="button" className={`chip ${form.activities_wanted.includes(v) ? "selected" : ""}`} onClick={() => toggle("activities_wanted", v)}>{l}</button>
                ))}
              </div>
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="onb-title">What you want in a Wing</h1>
            <p className="onb-sub">Last step. Helps the algorithm find your other wing.</p>
            <label className="onb-field">
              <span>I&apos;m looking for a Wing who…</span>
              <textarea className="onb-textarea" value={form.wing_preference} onChange={(e) => set("wing_preference", e.target.value)} placeholder="e.g. surfs in the mornings, knows the food scene, and doesn't take themselves too seriously." />
            </label>
            <label className="onb-field" style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <input type="checkbox" checked={form.is_local_guide} onChange={(e) => set("is_local_guide", e.target.checked)} style={{ width: 18, height: 18 }} />
              <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--text)", fontWeight: 500 }}>
                Activate Local Guide mode — show me to travelers visiting my city
              </span>
            </label>
            {err && <div className="auth-err">{err}</div>}
          </>
        )}

        <div className="onb-buttons">
          {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(step - 1)} disabled={busy}>Back</button>}
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>Next</button>
          ) : (
            <button className="btn btn-primary" onClick={save} disabled={busy}>
              {busy ? "Saving…" : "🪶 Finish"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
