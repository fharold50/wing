export default function CTA() {
  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <section className="cta-section">
        <div className="section-eyebrow fade-up">Ready to fly</div>
        <h2 className="section-title fade-up delay-1">
          Your other wing<br /><em>is waiting for you.</em>
        </h2>
        <p className="cta-sub fade-up delay-2">
          Wingmen, Wingwomen, locals, and travelers. Every adventure is better with someone who gets it. No dates, no pressure — just good people and great memories.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }} className="fade-up delay-3">
          <a href="/onboarding" className="btn btn-primary btn-lg">Get Wing free</a>
          <a href="#features" className="btn btn-outline">Explore features</a>
        </div>
        <p style={{ marginTop: 28, fontSize: 13, color: "var(--muted)" }} className="fade-up delay-4">
          Free on iOS, Android, and Web · No credit card required · Active in 190+ countries
        </p>
      </section>
    </div>
  );
}
