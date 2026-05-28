import { Compass } from "@/lib/icons";
import WingCard from "@/components/app/WingCard";
import GoldenHourBanner from "@/components/app/GoldenHourBanner";
import { calculateMatchScore, distanceMiles } from "@/lib/matching";
import { getSession, listOtherWings } from "@/lib/session";

export const metadata = { title: "Discover · Wing" };

export default async function DiscoverPage() {
  const session = await getSession();
  if (!session) return null;
  const me = session.user;
  const others = await listOtherWings(me.id);

  // Note: we don't apply the boost here on the server, because Golden Hour is
  // local-time and we don't want to ship a stale boost from the server cache.
  // Instead the WingCard renders the base score; clients in Golden Hour see a
  // visual nudge via GoldenHourBanner, and the boost arithmetic lives in the
  // client banner. Keeping it transparent on purpose.
  const ranked = others
    .map((u) => ({
      ...u,
      matchPercentage: calculateMatchScore(me, u),
      distanceMiles: distanceMiles(me.approxLat, me.approxLng, u.approxLat, u.approxLng),
    }))
    .sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0));

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">For {me.name.split(" ")[0]}, sorted by feel</div>
        <h1 className="page-title">Discover your wings</h1>
        <p className="page-sub">
          Ranked by shared interests, activity intent, travel style, and proximity. We tell you the match score &mdash; you decide if the vibe&apos;s there.
        </p>
      </div>

      <GoldenHourBanner />

      {ranked.length === 0 ? (
        <div className="empty-card">
          <div className="empty-emoji"><Compass size={32} /></div>
          <div className="empty-title">No Wings yet</div>
          <p>You&apos;re early &mdash; invite a friend, or check back tonight during Golden Hour.</p>
        </div>
      ) : (
        <div className="wing-grid">
          {ranked.map((u) => <WingCard key={u.id} user={u} />)}
        </div>
      )}
    </>
  );
}
