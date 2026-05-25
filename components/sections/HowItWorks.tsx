const STEPS = [
  { n: 1, title: "Build Your Wing Profile", desc: "Your bio, interests, vibe, and what you're looking for in a wing companion. Takes 3 minutes." },
  { n: 2, title: "Set Where You're Going", desc: "Your current city, destination, and what you want to do there. Now or planning ahead." },
  { n: 3, title: "Wing Matches Appear", desc: "See nearby Wingmen & Wingwomen ranked by match %. Real people, real proximity, real intent." },
  { n: 4, title: "Wing Up & Plan", desc: "Send a Wing-Up request, chat in-app, and coordinate your activity. Safe, simple, on-platform." },
  { n: 5, title: "Go Explore Together", desc: "Meet up, have an adventure, build a real friendship. Rate your Wing after. Repeat anywhere." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="section" style={{ textAlign: "center" }}>
      <div className="section-eyebrow fade-up">Simple by design</div>
      <h2 className="section-title fade-up delay-1">
        From no one to someone<br />in five steps
      </h2>
      <p className="section-sub fade-up delay-2" style={{ margin: "0 auto" }}>
        Works for solo travelers, groups splitting off, locals, and anyone in between.
      </p>
      <div className="how-grid">
        {STEPS.map((s, i) => (
          <div key={s.n} className={`how-step fade-up ${i ? `delay-${i}` : ""}`}>
            <div className={`step-num step-num-${s.n}`}>{s.n}</div>
            <div className="step-title">{s.title}</div>
            <div className="step-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
