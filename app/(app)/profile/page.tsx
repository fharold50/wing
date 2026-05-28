import Link from "next/link";
import { Camera, Star, Compass } from "@/lib/icons";
import { getSession } from "@/lib/session";
import MediaUploader from "@/components/app/MediaUploader";

export const metadata = { title: "Profile · Wing" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return null;
  const me = session.user;

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">You on Wing</div>
        <h1 className="page-title">{me.name}</h1>
        <p className="page-sub">{me.location || "Set your location in onboarding."}</p>
      </div>

      <div className="profile-grid">
        <div className="wing-card" style={{ gridColumn: "1 / -1" }}>
          <div className="wing-meta-name" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Camera size={18} /> Photos &amp; video
          </div>
          <p className="wing-bio">First photo becomes your cover on Discover. Add a short video to stand out.</p>
          <MediaUploader photos={me.photos ?? []} primaryVideo={me.primaryVideo} />
        </div>

        <div className="wing-card">
          <div className="wing-meta-name">About</div>
          <p className="wing-bio">{me.bio || "No bio yet."}</p>
          {me.interests.length > 0 && (
            <div className="wing-tags">
              {me.interests.map((i: string) => <span key={i} className="wing-pill">{i}</span>)}
            </div>
          )}
        </div>

        <div className="wing-card">
          <div className="wing-meta-name">Verification</div>
          <p className="wing-bio" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Star size={14} weight="fill" style={{ color: "var(--accent)" }} />
            {me.reputationScore.toFixed(2)} reputation · {me.verificationLevel} verified
          </p>
          {me.verificationLevel !== "id" && (
            <div className="wing-foot">
              <button className="btn btn-primary">Bump to ID verified</button>
            </div>
          )}
        </div>

        <div className="wing-card">
          <div className="wing-meta-name">Travel</div>
          <p className="wing-bio">Currently in <strong>{me.location || "—"}</strong>{me.destination && <> · Heading to <strong>{me.destination}</strong></>}</p>
          <div className="wing-tags">
            <span className="wing-pill">{me.tripPurpose.replace("_", " ")}</span>
            {me.isLocalGuide && (
              <span className="wing-pill" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Compass size={12} /> Local Guide
              </span>
            )}
          </div>
        </div>

        <div className="wing-card">
          <div className="wing-meta-name">Activities you want</div>
          <div className="wing-tags">
            {me.activitiesWanted.length === 0 && <p className="wing-bio">No activities picked yet.</p>}
            {me.activitiesWanted.map((a) => <span key={a} className="wing-pill">{a.replace("_", " ")}</span>)}
          </div>
        </div>

        <div className="wing-card" style={{ gridColumn: "1 / -1" }}>
          <div className="wing-meta-name">Edit profile</div>
          <p className="wing-bio">Update your interests, vibe, or destination.</p>
          <div className="wing-foot">
            <Link href="/onboarding" className="btn btn-primary">Edit profile</Link>
          </div>
        </div>
      </div>
    </>
  );
}
