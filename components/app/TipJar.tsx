"use client";

import { useState, useTransition } from "react";
import { Check } from "@/lib/icons";
import { tipGuide } from "@/app/actions";

type Props = {
  toId: string;
  toName: string;
  meetupId?: string;
};

const PRESETS = [500, 1000, 2000, 5000] as const;

/**
 * Tip jar for Local Guides. Records the tip immediately and shows a thank-you;
 * Stripe Connect wires up the actual money movement in a follow-up.
 */
export default function TipJar({ toId, toName, meetupId }: Props) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [custom, setCustom] = useState("");

  function tip(amountCents: number) {
    setErr(null);
    startTransition(async () => {
      const res = await tipGuide({ toId, amountCents, meetupId });
      if (res.ok) setDone(amountCents);
      else setErr(res.error ?? "Couldn't process tip");
    });
  }

  if (done != null) {
    return (
      <div className="tip-thanks">
        <Check size={16} /> ${(done / 100).toFixed(2)} on its way to {toName}. Real money lands once Stripe Connect is wired.
      </div>
    );
  }

  return (
    <div className="tip-jar">
      <p className="tip-blurb">
        {toName} hosted you well? Drop a tip. Wing takes 0% during early access — every dollar goes to them.
      </p>
      <div className="tip-presets">
        {PRESETS.map((cents) => (
          <button key={cents} className="tip-preset" disabled={pending} onClick={() => tip(cents)}>
            ${cents / 100}
          </button>
        ))}
      </div>
      <div className="tip-custom">
        <span>$</span>
        <input
          type="number" min={1} step={1}
          value={custom} onChange={(e) => setCustom(e.target.value)}
          placeholder="Other"
        />
        <button
          className="btn btn-primary"
          disabled={pending || !custom || Number(custom) < 1}
          onClick={() => tip(Math.round(Number(custom) * 100))}
        >
          Tip
        </button>
      </div>
      {err && <div className="auth-err">{err}</div>}
    </div>
  );
}
