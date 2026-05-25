import { Star } from "lucide-react";

const TESTIS = [
  {
    tag: "Wingwoman",
    quote: "Finally an app where I don't have to worry about guys treating it like a dating app. My Wing took me to the best hidden jazz bar in New Orleans. No weird vibes, just a great night.",
    initials: "AL",
    avatarStyle: { background: "var(--accent-tint)", color: "var(--accent)", border: "1px solid var(--accent-soft)" },
    name: "Aisha L.",
    meta: "Solo traveler · New Orleans",
    delay: "",
  },
  {
    tag: "Wingman",
    quote: "Flew into Honolulu knowing nobody. Opened Wing, found a surf buddy with a 94% match, and we hit North Shore the next morning. This app is the real deal — no hookup garbage, just real connection.",
    initials: "MK",
    avatarStyle: { background: "var(--forest-soft)", color: "var(--forest)", border: "1px solid var(--forest)" },
    name: "Marcus K.",
    meta: "Traveler · Honolulu, HI",
    delay: "delay-1",
  },
  {
    tag: "Local Guide",
    quote: "I live in Miami and I love showing people around. Wing's Local Guide mode brings me visitors who actually want to explore, not just sit on a beach. Made some of my closest friends this way.",
    initials: "DC",
    avatarStyle: { background: "var(--paper-2)", color: "var(--ink)", border: "1px solid var(--line-strong)" },
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
        What your future<br />Wings are saying.
      </h2>
      <div className="testimonials-grid">
        {TESTIS.map((t) => (
          <div key={t.name} className={`testi-card fade-up ${t.delay}`}>
            <span className="testi-tag">{t.tag}</span>
            <div className="testi-stars" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
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
