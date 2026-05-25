"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { WingUser } from "@/lib/types";
import { wingUp } from "@/app/actions";

const AVATAR_COLORS = [
  "linear-gradient(135deg,#ff6b1a,#ffb347)",
  "linear-gradient(135deg,#38bdf8,#3b82f6)",
  "linear-gradient(135deg,#f472b6,#ec4899)",
  "linear-gradient(135deg,#22d3a0,#14b8a6)",
  "linear-gradient(135deg,#a78bfa,#7c3aed)",
] as const;

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("") || "W";
}

function pickColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export default function WingCard({ user }: { user: WingUser }) {
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function send() {
    setErr(null);
    startTransition(async () => {
      try {
        const res = await wingUp(user.id);
        if (res.ok) setSent(true);
        else setErr(res.error ?? "Failed");
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed");
      }
    });
  }

  return (
    <div className="wing-card">
      {user.matchPercentage != null && (
        <div className="wing-match">{user.matchPercentage}% match</div>
      )}
      <div className="wing-card-head">
        <div className="wing-avatar" style={{ background: pickColor(user.id), color: "#fff" }}>
          {initials(user.name)}
        </div>
        <div>
          <div className="wing-meta-name">{user.name}</div>
          <div className="wing-meta-sub">
            {user.location}
            {user.distanceMiles != null && isFinite(user.distanceMiles) && ` · ${Math.round(user.distanceMiles)} mi`}
            {user.isLocalGuide && " · 🧭 Local Guide"}
          </div>
        </div>
      </div>
      {user.bio && <p className="wing-bio">{user.bio}</p>}
      {user.interests.length > 0 && (
        <div className="wing-tags">
          {user.interests.slice(0, 5).map((i) => (
            <span key={i} className="wing-pill">{i}</span>
          ))}
        </div>
      )}
      {err && <div className="auth-err" style={{ fontSize: 12, padding: "6px 10px" }}>{err}</div>}
      <div className="wing-foot">
        <Link href={`/messages/${user.id}`} className="btn btn-ghost">Message</Link>
        <button className="btn btn-primary" onClick={send} disabled={pending || sent}>
          {sent ? "✓ Sent" : pending ? "..." : "🪶 Wing Up"}
        </button>
      </div>
    </div>
  );
}
