import { Cpu, BadgeCheck, MapPin, Star, Flag, Check, X, Feather } from "@/lib/icons";

const SAFETY_ITEMS = [
  { Icon: Cpu, title: "AI Intent Moderation", body: "Scans every profile and message for romantic or inappropriate language. Automated removal before it reaches you." },
  { Icon: BadgeCheck, title: "Multi-Step ID Verification", body: "Phone number, social media, and optional government ID. Every Wing you see is a real, verified human being." },
  { Icon: MapPin, title: "Approximate Location Only", body: "Wings see your distance and neighborhood — never your exact address or GPS pin. Your privacy, your control." },
  { Icon: Star, title: "Reputation Rating System", body: "Every meetup gets a mutual rating. Bad actors lose their score fast and get removed. The community polices itself." },
  { Icon: Flag, title: "One-Tap Reporting & Blocking", body: "Flag anyone instantly. Our moderation team responds within the hour. Zero tolerance, zero exceptions." },
];

const VS = [
  ["Anti-hookup AI moderation", "No AI moderation"],
  ["Wingman and Wingwoman framing", "Male-biased framing"],
  ["Bars and nightlife category", "Outdoor-only"],
  ["iOS, Android, and Web", "iPhone only"],
  ["Compatibility match score", "No compatibility score"],
  ["Locals and travelers", "Travelers only"],
  ["Pre-trip advance planning", "Real-time only"],
  ["Wing reputation score", "No trust system"],
  ["No dating DNA", "Built on a dating app"],
  ["Local guide mode", "No local guides"],
] as const;

export default function Safety() {
  return (
    <div className="safety-section" id="safety">
      <div className="safety-inner">
        <div>
          <div className="section-eyebrow">Safety is the foundation</div>
          <h2 className="section-title fade-up" style={{ fontSize: "clamp(32px,3.4vw,46px)" }}>
            Built safe for<br />Wingwomen first.
          </h2>
          <p style={{ fontSize: 16, color: "var(--body)", lineHeight: 1.7, marginBottom: 8 }}>
            The number-one complaint across competitor apps is men using them to seek hookups. We designed Wing from the ground up so Wingwomen feel completely safe — because when women trust a platform, everyone wins.
          </p>
          <div className="safety-list">
            {SAFETY_ITEMS.map((s, i) => (
              <div key={s.title} className={`safety-item fade-up ${i ? `delay-${i}` : ""}`}>
                <div className="safety-icon"><s.Icon /></div>
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
              <span className="vs-wing" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Feather size={12} /> Wing
              </span>
              <span className="vs-center">vs</span>
              <span className="vs-them">Others</span>
            </div>
            {VS.map(([yes, no]) => (
              <div key={yes} className="vs-row">
                <div className="vs-yes"><Check /> {yes}</div>
                <div className="vs-center">—</div>
                <div className="vs-no"><X /> {no}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
