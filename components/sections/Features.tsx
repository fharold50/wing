type Feat = {
  emoji: string;
  title: string;
  body: string;
  bg: string;
  border: string;
  featured?: boolean;
  delay?: string;
};

const FEATS: Feat[] = [
  { emoji: "🎯", title: "Smart Wing Matching™", body: "Our algorithm scores compatibility based on shared interests, activity intent, travel style, and energy. You see a match % before you even connect — no more guessing.", bg: "linear-gradient(135deg,rgba(255,107,26,0.2),rgba(255,179,71,0.1))", border: "rgba(255,107,26,0.25)", featured: true },
  { emoji: "🗺️", title: "Real-Time Nearby Map", body: "See active Wings around you right now — not just registered users, but people who are out, available, and looking to connect today. Live activity map with filters.", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)", delay: "delay-1" },
  { emoji: "🛡️", title: "Anti-Hookup AI Shield", body: "Our AI actively scans profiles and messages for romantic intent. The #1 failure of competing apps — we solve it at the infrastructure level, not just in policy.", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.2)", delay: "delay-2" },
  { emoji: "📅", title: "Activity Plan Creator", body: "Post your plan before you go — surf at 6am, jazz bar at 9pm, hike Saturday. Others join. You arrive with a Wing already lined up. Simple, no friction.", bg: "rgba(34,211,160,0.1)", border: "rgba(34,211,160,0.2)" },
  { emoji: "🍹", title: "Nightlife Mode", body: "The only companion app that covers bars, lounges, rooftops, and night scenes. Find a wingman or wingwoman for a night out — something no competitor does at all.", bg: "rgba(255,179,71,0.1)", border: "rgba(255,179,71,0.2)", delay: "delay-1" },
  { emoji: "🧭", title: "Local Guide Mode", body: "Live somewhere great? Activate Local Guide mode and show visitors around. Travelers get insider access. Locals make new friends. Both sides win every time.", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)", delay: "delay-2" },
  { emoji: "✈️", title: "Pre-Trip Planning", body: "Traveling to Miami next week? Set your destination in advance. Wing shows you people already there or visiting the same time — connect before you even land.", bg: "rgba(255,107,26,0.1)", border: "rgba(255,107,26,0.2)" },
  { emoji: "⭐", title: "Wing Reputation Score", body: "After every meetup, wings rate each other. Build a trusted community score over time. No bad actors, no bots, no catfish. Real people with real track records.", bg: "rgba(244,114,182,0.1)", border: "rgba(244,114,182,0.2)", delay: "delay-1" },
  { emoji: "📱", title: "iPhone + Android + Web", body: "The closest competitor is iPhone only. Wing works everywhere — App Store, Google Play, and full web app — so no one gets left behind based on their phone.", bg: "rgba(34,211,160,0.1)", border: "rgba(34,211,160,0.2)", delay: "delay-2" },
];

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="section-eyebrow fade-up">Built different</div>
      <h2 className="section-title fade-up delay-1">
        Every feature your competitors<br />forgot to build
      </h2>
      <p className="section-sub fade-up delay-2">
        We studied every weakness in every competitor and built Wing to fix all of them. This is what a companion app actually looks like when done right.
      </p>
      <div className="features-grid">
        {FEATS.map((f) => (
          <div key={f.title} className={`feat-card fade-up ${f.delay ?? ""} ${f.featured ? "featured" : ""}`}>
            <div className="feat-icon" style={{ background: f.bg, border: `1px solid ${f.border}` }}>{f.emoji}</div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
