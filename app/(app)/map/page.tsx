import { Compass } from "lucide-react";
import { calculateMatchScore, distanceMiles } from "@/lib/matching";
import { getSession, listOtherWings } from "@/lib/session";

export const metadata = { title: "Nearby · Wing" };

/**
 * No-API-key fallback "map" — a stylized neighborhood radar. When NEXT_PUBLIC_MAPBOX_TOKEN
 * is set, swap this for a real Mapbox view (TODO).
 */
export default async function MapPage() {
  const session = await getSession();
  if (!session) return null;
  const me = session.user;
  const others = await listOtherWings(me.id);

  const wings = others
    .map((u) => {
      const miles = distanceMiles(me.approxLat, me.approxLng, u.approxLat, u.approxLng);
      return {
        id: u.id,
        name: u.name,
        match: calculateMatchScore(me, u),
        miles,
        isLocalGuide: u.isLocalGuide,
        gender: u.gender,
      };
    })
    .filter((w) => isFinite(w.miles))
    .sort((a, b) => a.miles - b.miles);

  const RADAR = 320;
  const MAX_R = RADAR / 2 - 24;
  const maxMiles = Math.max(1, ...wings.map((w) => w.miles));

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Real-time</div>
        <h1 className="page-title">Wings near you</h1>
        <p className="page-sub">Approximate locations only — never exact GPS. Filter by activity and distance.</p>
      </div>

      <div className="map-grid">
        <div className="radar-wrap">
          <div className="radar" style={{ width: RADAR, height: RADAR }}>
            <div className="radar-ring" style={{ inset: 0 }} />
            <div className="radar-ring" style={{ inset: "20%" }} />
            <div className="radar-ring" style={{ inset: "40%" }} />
            <div className="radar-ring" style={{ inset: "60%" }} />
            <div className="radar-sweep" />
            <div className="radar-me"><Compass /></div>
            {wings.slice(0, 14).map((w) => {
              let h = 0;
              for (let i = 0; i < w.id.length; i++) h = (h * 31 + w.id.charCodeAt(i)) | 0;
              const angle = ((Math.abs(h) % 360) * Math.PI) / 180;
              const r = (Math.sqrt(Math.min(w.miles, maxMiles) / maxMiles)) * MAX_R;
              const x = Math.cos(angle) * r;
              const y = Math.sin(angle) * r;
              const color = w.gender === "woman" ? "var(--accent)" : w.gender === "man" ? "var(--forest)" : "var(--ink)";
              return (
                <div
                  key={w.id}
                  className="radar-pin"
                  style={{ left: `calc(50% + ${x}px - 7px)`, top: `calc(50% + ${y}px - 7px)`, background: color }}
                  title={`${w.name} · ${Math.round(w.miles)} mi`}
                />
              );
            })}
          </div>
          <div className="radar-legend">
            <span><i style={{ background: "var(--forest)" }} /> Wingmen</span>
            <span><i style={{ background: "var(--accent)" }} /> Wingwomen</span>
            <span><i style={{ background: "var(--ink)" }} /> Nonbinary</span>
          </div>
        </div>

        <div className="nearby-list">
          <h3 className="nearby-h">Closest Wings</h3>
          {wings.slice(0, 8).map((w) => (
            <div key={w.id} className="nearby-row">
              <div className="nearby-left">
                <strong>{w.name}</strong>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {Math.round(w.miles)} mi
                  {w.isLocalGuide && <><span>·</span><Compass size={12} /> Local</>}
                </span>
              </div>
              <div className="nearby-match">{w.match}%</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
