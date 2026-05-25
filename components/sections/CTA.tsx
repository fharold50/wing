export default function CTA() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="section-eyebrow fade-up">Ready to fly?</div>
        <h2 className="section-title fade-up delay-1">
          Your other wing<br />is waiting for you
        </h2>
        <p className="cta-sub fade-up delay-2">
          Wingmen. Wingwomen. Locals. Travelers. Every adventure is better with someone who gets it. No dates. No pressure. Just good people and great memories.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }} className="fade-up delay-3">
          <a href="/onboarding" className="btn btn-primary btn-lg">🪶 Get Wing Free</a>
          <a href="#features" className="btn btn-outline">Explore Features</a>
        </div>
        <p style={{ marginTop: 24, fontSize: 13, color: "var(--muted2)" }} className="fade-up delay-4">
          Free on iOS · Android · Web &nbsp;·&nbsp; No credit card needed &nbsp;·&nbsp; Active in 190+ countries
        </p>
      </section>
    </div>
  );
}
