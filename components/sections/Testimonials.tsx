const TESTIS = [
  {
    tag: "Wingwoman",
    tagStyle: { background: "rgba(244,114,182,0.12)", color: "var(--pink)", border: "1px solid rgba(244,114,182,0.2)" },
    quote: "Finally an app where I don't have to worry about guys treating it like a dating app. My Wing took me to the best hidden jazz bar in New Orleans. No weird vibes, just a great night.",
    initials: "AL",
    avatarStyle: { background: "linear-gradient(135deg,#f472b6,#ec4899)", color: "#fff" },
    name: "Aisha L.",
    meta: "Solo traveler · New Orleans",
    delay: "",
  },
  {
    tag: "Wingman",
    tagStyle: { background: "rgba(56,189,248,0.12)", color: "var(--sky)", border: "1px solid rgba(56,189,248,0.2)" },
    quote: "Flew into Honolulu knowing nobody. Opened Wing, found a surf buddy with 94% match, and we hit North Shore the next morning. This app is the real deal. No hookup garbage, just real connect.",
    initials: "MK",
    avatarStyle: { background: "linear-gradient(135deg,#38bdf8,#3b82f6)", color: "#fff" },
    name: "Marcus K.",
    meta: "Traveler · Honolulu, HI",
    delay: "delay-1",
  },
  {
    tag: "Local Guide",
    tagStyle: { background: "rgba(34,211,160,0.12)", color: "var(--green)", border: "1px solid rgba(34,211,160,0.2)" },
    quote: "I live in Miami and I love showing people around. Wing's Local Guide mode brings me visitors who actually want to explore, not just sit on a beach. Made some of my closest friends this way.",
    initials: "DC",
    avatarStyle: { background: "linear-gradient(135deg,#22d3a0,#14b8a6)", color: "#000" },
    name: "Diego C.",
    meta: "Local Guide · Miami, FL",
    delay: "delay-2",
  },
];

export default function Testimonials() {
  return (
    <section className="section">
      <div className="section-eyebrow fade-up">Real Wings, real stories</div>
      <h2 className="section-title fade-up delay-1">
        What your future<br />Wings are saying
      </h2>
      <div className="testimonials-grid">
        {TESTIS.map((t) => (
          <div key={t.name} className={`testi-card fade-up ${t.delay}`}>
            <span className="testi-tag" style={t.tagStyle}>{t.tag}</span>
            <div className="testi-stars">★★★★★</div>
            <p className="testi-quote">{t.quote}</p>
            <div className="testi-person">
              <div className="testi-avatar" style={t.avatarStyle}>{t.initials}</div>
              <div>
                <div className="testi-name">{t.name}</div>
                <div className="testi-meta">{t.meta}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
