import { Cpu, BadgeCheck, MapPin, Flag, Star } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export const metadata = { title: "Safety Center · Wing" };

type Item = { Icon: ComponentType<SVGProps<SVGSVGElement>>; title: string; body: string };

const ITEMS: Item[] = [
  { Icon: Cpu, title: "Anti-Hookup AI Moderation", body: "Every profile and message is scanned for romantic or sexual intent. Violating content is removed before it reaches anyone." },
  { Icon: BadgeCheck, title: "ID Verification", body: "Bump your verification to social or government ID for a badge — and to be shown to verified-only Wings." },
  { Icon: MapPin, title: "Approximate Location", body: "Wings see your distance and neighborhood — never your exact GPS pin." },
  { Icon: Flag, title: "Report & Block", body: "One tap blocks a user across all surfaces. Reports go to the moderation team within the hour." },
  { Icon: Star, title: "Reputation System", body: "Every meetup gets mutual ratings. Below 2.0 and you are suspended. Above 4.8 and you earn a Super Wing badge." },
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
            <div className="safety-icon"><s.Icon /></div>
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
