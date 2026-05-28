import { Compass } from "lucide-react";
import WingCard from "@/components/app/WingCard";
import { calculateMatchScore, distanceMiles } from "@/lib/matching";
import { getSession, listOtherWings } from "@/lib/session";

export const metadata = { title: "Discover · Wing" };

export default async function DiscoverPage() {
  const session = await getSession();
  if (!session) return null;
  const me = session.user;
  const others = await listOtherWings(me.id);

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
        <div className="page-eyebrow">For you, {me.name.split(" ")[0]}</div>
        <h1 className="page-title">Discover your wings</h1>
        <p className="page-sub">Ranked by Smart Wing Matching™ — shared interests, activity intent, travel style, and proximity.</p>
      </div>

      {ranked.length === 0 ? (
        <div className="empty-card">
          <div className="empty-emoji"><Compass /></div>
          <div className="empty-title">No Wings yet</div>
          <p>You&apos;re early — invite friends, or check back as more Wings join your area.</p>
        </div>
      ) : (
        <div className="wing-grid">
          {ranked.map((u) => <WingCard key={u.id} user={u} />)}
        </div>
      )}
    </>
  );
}
