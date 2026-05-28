import { calculateMatchScore, distanceMiles } from "@/lib/matching";
import { phraseDistance, phraseLastActive } from "@/lib/distance";
import { getSession, listOtherWings } from "@/lib/session";

export const metadata = { title: "Nearby · Wing" };

const BUCKET_ORDER = ["block", "walk", "bike", "ride", "city", "trip", "far"] as const;
const BUCKET_LABEL: Record<string, string> = {
  block: "On your block",
  walk: "A walk away",
  bike: "A short ride",
  ride: "Across town",
  city: "In the city",
  trip: "Worth a road trip",
  far: "Pre-trip planning",
};

const AVATAR_COLORS = [
  "linear-gradient(135deg,#b54f2c,#d97757)",
  "linear-gradient(135deg,#7d8a64,#a4b387)",
  "linear-gradient(135deg,#5b6c8f,#7f93b5)",
  "linear-gradient(135deg,#a87f50,#c8a378)",
  "linear-gradient(135deg,#8f5b8c,#b07eae)",
] as const;

function initials(s: string) {
  return s.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function pickColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export default async function MapPage() {
  const session = await getSession();
  if (!session) return null;
  const me = session.user;
  const others = await listOtherWings(me.id);

  const wings = others
    .map((u) => {
      const miles = distanceMiles(me.approxLat, me.approxLng, u.approxLat, u.approxLng);
      const phrase = phraseDistance(miles);
      return {
        id: u.id,
        name: u.name,
        photo: u.photos?.[0],
        location: u.location,
        match: calculateMatchScore(me, u),
        miles,
        phrase,
        lastActive: u.lastActive,
        isLocalGuide: u.isLocalGuide,
      };
    })
    .sort((a, b) => (isFinite(a.miles) ? a.miles : Infinity) - (isFinite(b.miles) ? b.miles : Infinity));

  // Group by bucket
  const grouped = BUCKET_ORDER.map((b) => ({
    bucket: b,
    label: BUCKET_LABEL[b],
    wings: wings.filter((w) => w.phrase.bucket === b),
  })).filter((g) => g.wings.length > 0);

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Distance Lens</div>
        <h1 className="page-title">Wings near {me.location || "you"}</h1>
        <p className="page-sub">
          We never show your pin. Just how far &mdash; in minutes, miles, or moods. Sorted from your block outward.
        </p>
      </div>

      <div className="lens-stack">
        {grouped.map((group, gi) => (
          <section key={group.bucket} className="lens-group">
            <div className="lens-group-head">
              <span className="lens-group-label">{group.label}</span>
              <span className="lens-group-count">{group.wings.length} {group.wings.length === 1 ? "wing" : "wings"}</span>
            </div>
            <div className="lens-row">
              {group.wings.map((w) => (
                <div key={w.id} className="lens-card" style={{ animationDelay: `${gi * 50 + 80}ms` }}>
                  <div className="lens-avatar" style={{ background: pickColor(w.id) }}>
                    {w.photo
                      ? <img src={w.photo} alt={w.name} />
                      : <span>{initials(w.name)}</span>}
                  </div>
                  <div className="lens-meta">
                    <div className="lens-row-1">
                      <strong>{w.name}</strong>
                      <span className="lens-match">{w.match}%</span>
                    </div>
                    <div className="lens-row-2" title={w.phrase.long}>{w.phrase.label}</div>
                    <div className="lens-row-3">
                      <span>{w.location || "—"}</span>
                      <span aria-hidden>·</span>
                      <span>{phraseLastActive(w.lastActive)}</span>
                      {w.isLocalGuide && (<><span aria-hidden>·</span><span className="lens-local">Local</span></>)}
                    </div>
                  </div>
                  <a href={`/messages/${w.id}`} className="btn btn-ghost lens-btn">Message</a>
                </div>
              ))}
            </div>
          </section>
        ))}

        {wings.length === 0 && (
          <div className="empty-card">
            <div className="empty-emoji">🪶</div>
            <div className="empty-title">No Wings nearby yet</div>
            <p>Set your location in onboarding and we&apos;ll group them by walk, bike, ride, and trip distance.</p>
          </div>
        )}
      </div>
    </>
  );
}
