export const metadata = { title: "Safety Center · Wing" };

const ITEMS = [
  { icon: "🤖", title: "Anti-Hookup AI Moderation", body: "Every profile and message is scanned for romantic or sexual intent. Violating content is removed before it reaches anyone." },
  { icon: "🪪", title: "ID Verification", body: "Bump your verification to social or government ID for a badge — and to be shown to verified-only Wings." },
  { icon: "📍", title: "Approximate Location", body: "Wings see your distance and neighborhood — never your exact GPS pin." },
  { icon: "🚩", title: "Report & Block", body: "One tap blocks a user across all surfaces. Reports go to the moderation team within the hour." },
  { icon: "⭐", title: "Reputation System", body: "Every meetup gets mutual ratings. Below 2.0 → suspended. Above 4.8 → Super Wing badge." },
];

export default function SafetyPage() {
  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Built for trust</div>
        <h1 className="page-title">Safety center</h1>
        <p className="page-sub">Wing is built with women&apos;s safety as the foundation. Here&apos;s every layer working for you.</p>
      </div>
      <div className="safety-list" style={{ marginTop: 0 }}>
        {ITEMS.map((s) => (
          <div key={s.title} className="safety-item">
            <div className="safety-icon">{s.icon}</div>
            <div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
