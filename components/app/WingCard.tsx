"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Check } from "@/lib/icons";
import type { WingUser } from "@/lib/types";
import { wingUp } from "@/app/actions";
import { boostScore, getBoostState } from "@/lib/boostHour";
import { phraseDistance, phraseLastActive } from "@/lib/distance";
import VerifiedBadge from "@/components/profile/VerifiedBadge";
import VoiceNotePlayer from "@/components/profile/VoiceNotePlayer";

const AVATAR_COLORS = [
  "linear-gradient(135deg,#b54f2c,#d97757)",
  "linear-gradient(135deg,#7d8a64,#a4b387)",
  "linear-gradient(135deg,#5b6c8f,#7f93b5)",
  "linear-gradient(135deg,#a87f50,#c8a378)",
  "linear-gradient(135deg,#8f5b8c,#b07eae)",
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

  // Client-side Golden Hour boost — purely cosmetic.
  const [boosted, setBoosted] = useState(false);
  useEffect(() => {
    setBoosted(getBoostState().active);
    const id = setInterval(() => setBoosted(getBoostState().active), 30_000);
    return () => clearInterval(id);
  }, []);

  const cover = user.photos?.[0];
  const extras = (user.photos ?? []).slice(1, 5);
  const baseScore = user.matchPercentage;
  const score = baseScore != null ? boostScore(baseScore, boosted) : null;
  const distance = user.distanceMiles != null ? phraseDistance(user.distanceMiles) : null;

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
    <div className={`wing-card ${cover ? "has-cover" : ""}`}>
      {score != null && (
        <div className="wing-match" title={boosted ? `Golden Hour boost (+15% display)` : undefined}>
          {score}% match{boosted ? " ↑" : ""}
        </div>
      )}
      {cover && (
        <div className="wing-cover">
          <img src={cover} alt={user.name} />
          <div className="wing-cover-gradient" />
        </div>
      )}
      <div className="wing-card-head">
        {!cover && (
          <div className="wing-avatar" style={{ background: pickColor(user.id), color: "#fff" }}>
            {initials(user.name)}
          </div>
        )}
        <div>
          <div className="wing-meta-name" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            {user.name}
            {user.photoVerificationStatus === "verified" && <VerifiedBadge iconOnly />}
          </div>
          <div className="wing-meta-sub">
            {user.location}
            {distance && distance.bucket !== "far" && (
              <> · <span title={distance.long}>{distance.label}</span></>
            )}
            {user.isLocalGuide && " · Local Guide"}
          </div>
          <div className="wing-meta-sub" style={{ fontSize: 11, marginTop: 2 }}>
            {phraseLastActive(user.lastSeenAt ?? user.lastActive)}
          </div>
        </div>
        {user.voiceUrl && <div style={{ marginLeft: "auto" }}><VoiceNotePlayer url={user.voiceUrl} /></div>}
      </div>
      {extras.length > 0 && (
        <div className="wing-photo-strip">
          {extras.map((p) => <img key={p} src={p} alt="" />)}
        </div>
      )}
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
