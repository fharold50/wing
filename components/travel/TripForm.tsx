"use client";

import { useState, useTransition } from "react";
import { Plus } from "@/lib/icons";
import { createTrip } from "@/app/actions";

export default function TripForm() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function submit(formData: FormData) {
    setErr(null);
    startTransition(async () => {
      const res = await createTrip(formData);
      if (res.ok) setOpen(false);
      else setErr(res.error ?? "Couldn't save");
    });
  }

  if (!open) {
    return (
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        <Plus size={16} /> Post a trip
      </button>
    );
  }

  return (
    <form action={submit} className="onb-card" style={{ marginBottom: 8 }}>
      <h3 className="onb-title">Where to?</h3>
      <p className="onb-sub">Wings at the same time + place will see you.</p>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
        <label className="onb-field">
          <span>City</span>
          <input name="city" required className="onb-input" placeholder="Lisbon" />
        </label>
        <label className="onb-field">
          <span>Country</span>
          <input name="country" className="onb-input" placeholder="Portugal" />
        </label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <label className="onb-field">
          <span>Arriving</span>
          <input name="start_date" type="date" required className="onb-input" />
        </label>
        <label className="onb-field">
          <span>Leaving</span>
          <input name="end_date" type="date" required className="onb-input" />
        </label>
      </div>
      <label className="onb-field">
        <span>One line about the trip (optional)</span>
        <input name="note" className="onb-input" placeholder="Surf at Costa da Caparica, fado at night. Open to plans." />
      </label>
      {err && <div className="auth-err">{err}</div>}
      <div className="onb-buttons">
        <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)} disabled={pending}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Posting…" : "Post trip"}
        </button>
      </div>
    </form>
  );
}
