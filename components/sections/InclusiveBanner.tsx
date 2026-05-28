import { User } from "@/lib/icons";

export default function InclusiveBanner() {
  return (
    <div className="inclusive-banner" id="inclusive">
      <div className="inclusive-inner fade-up">
        <div className="wing-type">
          <div className="wing-type-icon icon-man"><User /></div>
          <div className="wing-type-title title-blue">Wingman</div>
          <p className="wing-type-desc">
            The guy who shows up, brings good energy, and makes any adventure better. Whether you&apos;re a solo traveler or just looking for someone to explore with.
          </p>
          <div className="wing-type-tags">
            <span className="wing-tag tag-blue">Adventure Ready</span>
            <span className="wing-tag tag-blue">Good Energy</span>
            <span className="wing-tag tag-blue">Zero Pressure</span>
          </div>
        </div>
        <div className="inclusive-center">
          <div className="plus-icon" />
          <div className="center-text">Together as Wings</div>
          <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", lineHeight: 1.6, maxWidth: 140, fontStyle: "italic", fontFamily: "var(--font-display), Georgia, serif" }}>
            No dating. Just real connection.
          </div>
        </div>
        <div className="wing-type">
          <div className="wing-type-icon icon-woman"><User /></div>
          <div className="wing-type-title title-pink">Wingwoman</div>
          <p className="wing-type-desc">
            The woman who brings the spark. Confident, independent, and ready to explore — on her own terms, with people who match her energy and respect her space.
          </p>
          <div className="wing-type-tags">
            <span className="wing-tag tag-pink">Safety First</span>
            <span className="wing-tag tag-pink">Her Terms</span>
            <span className="wing-tag tag-pink">Real Friendship</span>
          </div>
        </div>
      </div>
    </div>
  );
}
