const SAFETY_ITEMS = [
  { icon: "🤖", title: "AI Intent Moderation", body: "Scans every profile and message for romantic or inappropriate language. Automated removal before it reaches you." },
  { icon: "🪪", title: "Multi-Step ID Verification", body: "Phone number + social media + optional government ID. Every Wing you see is a real, verified human being." },
  { icon: "📍", title: "Approximate Location Only", body: "Wings see your distance and neighborhood — never your exact address or GPS pin. Your privacy, your control." },
  { icon: "⭐", title: "Reputation Rating System", body: "Every meetup gets a mutual rating. Bad actors lose their score fast and get removed. Community polices itself." },
  { icon: "🚩", title: "One-Tap Reporting & Blocking", body: "Flag anyone instantly. Our moderation team responds within the hour. Zero tolerance, zero exceptions." },
];

const VS = [
  ["Anti-hookup AI", "No AI moderation"],
  ["Wingman + Wingwoman", "Male-biased framing"],
  ["Bars & nightlife category", "Outdoor-only"],
  ["iOS + Android + Web", "iPhone only (Nomax)"],
  ["Match % score", "No compatibility score"],
  ["Locals + travelers", "Travelers only"],
  ["Pre-trip advance planning", "Real-time only"],
  ["Wing reputation score", "No trust system"],
  ["No dating DNA", "Built on dating app"],
  ["Local guide mode", "No local guides"],
] as const;

export default function Safety() {
  return (
    <div className="safety-section" id="safety">
      <div className="safety-inner">
        <div>
          <div className="section-eyebrow">Safety is the foundation</div>
          <h2 className="section-title fade-up" style={{ fontSize: "clamp(32px,3.5vw,48px)" }}>
            Built safe for<br />Wingwomen first.
          </h2>
          <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.7, marginBottom: 8, fontWeight: 300 }}>
            The #1 complaint across competitor apps is men using them to seek hookups. We designed Wing from the ground up so Wingwomen feel completely safe — because when women trust a platform, everyone wins.
          </p>
          <div className="safety-list">
            {SAFETY_ITEMS.map((s, i) => (
              <div key={s.title} className={`safety-item fade-up ${i ? `delay-${i}` : ""}`}>
                <div className="safety-icon">{s.icon}</div>
                <div>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="vs-box fade-up delay-1">
            <div className="vs-row header">
              <span className="vs-wing">🪶 Wing</span>
              <span className="vs-center">vs</span>
              <span className="vs-them">Others</span>
            </div>
            {VS.map(([yes, no]) => (
              <div key={yes} className="vs-row">
                <div className="vs-yes">✓ {yes}</div>
                <div className="vs-center">—</div>
                <div className="vs-no">✗ {no}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
