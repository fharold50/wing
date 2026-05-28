"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Compass, Check } from "lucide-react";
import type { WingUser } from "@/lib/types";
import { wingUp } from "@/app/actions";

const AVATAR_COLORS = [
  "#c1262d",
  "#4a6147",
  "#7a5b3f",
  "#3a4d8a",
  "#6b3e5f",
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
          <div className="wing-meta-sub" style={{ display: "inline-flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span>{user.location}</span>
            {user.distanceMiles != null && isFinite(user.distanceMiles) && <span>· {Math.round(user.distanceMiles)} mi</span>}
            {user.isLocalGuide && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                · <Compass size={12} /> Local Guide
              </span>
            )}
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
          {sent ? (<><Check size={14} /> Sent</>) : pending ? "..." : "Wing up"}
        </button>
      </div>
    </div>
  );
}
