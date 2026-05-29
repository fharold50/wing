"use client";

import { useState, useTransition } from "react";
import { setTrustedContact } from "@/app/actions";

type Props = {
  initial?: { name?: string; email?: string; phone?: string } | null;
};

export default function TrustedContactForm({ initial }: Props) {
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  function submit(formData: FormData) {
    setErr(null);
    startTransition(async () => {
      const res = await setTrustedContact(formData);
      if (res.ok) setSavedAt(new Date());
      else setErr(res.error ?? "Couldn't save");
    });
  }

  return (
    <form action={submit} className="trusted-form">
      <p className="trusted-blurb">
        One person Wing texts if you don&apos;t check in after a meetup. Your sister, your best friend,
        your mom — whoever you&apos;d actually want a heads-up to.
      </p>
      <div className="trusted-grid">
        <label className="onb-field">
          <span>Their name</span>
          <input name="name" required defaultValue={initial?.name ?? ""} className="onb-input" placeholder="Maya" />
        </label>
        <label className="onb-field">
          <span>Email</span>
          <input name="email" type="email" defaultValue={initial?.email ?? ""} className="onb-input" placeholder="maya@example.com" />
        </label>
        <label className="onb-field">
          <span>Phone (SMS — coming soon)</span>
          <input name="phone" type="tel" defaultValue={initial?.phone ?? ""} className="onb-input" placeholder="+1 555 0100" />
        </label>
      </div>
      {err && <div className="auth-err">{err}</div>}
      {savedAt && !err && <div className="trusted-saved">Saved. Wing has them on file now.</div>}
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Saving…" : initial?.name ? "Update contact" : "Save contact"}
      </button>
    </form>
  );
}
