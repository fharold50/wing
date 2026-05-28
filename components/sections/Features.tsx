import { Target, Map, Shield, Calendar, Wine, Compass, Plane, Star, Smartphone } from "@/lib/icons";
import type { ComponentType, SVGProps } from "react";

type Feat = {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
  featured?: boolean;
  delay?: string;
};

const FEATS: Feat[] = [
  { Icon: Target, title: "Smart Wing Matching", body: "Our algorithm scores compatibility based on shared interests, activity intent, travel style, and energy. You see a match score before you even connect — no more guessing.", featured: true },
  { Icon: Map, title: "Real-Time Nearby Map", body: "See active Wings around you right now — not just registered users, but people who are out, available, and looking to connect today. Live activity map with filters.", delay: "delay-1" },
  { Icon: Shield, title: "Anti-Hookup AI Shield", body: "Our AI actively scans profiles and messages for romantic intent. The number-one failure of competing apps — we solve it at the infrastructure level, not just in policy.", delay: "delay-2" },
  { Icon: Calendar, title: "Activity Plan Creator", body: "Post your plan before you go — surf at six, jazz bar at nine, hike Saturday. Others join. You arrive with a Wing already lined up. Simple, no friction." },
  { Icon: Wine, title: "Nightlife Mode", body: "The only companion app that covers bars, lounges, rooftops, and night scenes. Find a wingman or wingwoman for a night out — something no competitor does at all.", delay: "delay-1" },
  { Icon: Compass, title: "Local Guide Mode", body: "Live somewhere great? Activate Local Guide mode and show visitors around. Travelers get insider access, locals make new friends. Both sides win every time.", delay: "delay-2" },
  { Icon: Plane, title: "Pre-Trip Planning", body: "Traveling to Miami next week? Set your destination in advance. Wing shows you people already there or visiting at the same time — connect before you even land." },
  { Icon: Star, title: "Wing Reputation Score", body: "After every meetup, Wings rate each other. Build a trusted community score over time. No bad actors, no bots, no catfish. Real people with real track records.", delay: "delay-1" },
  { Icon: Smartphone, title: "iPhone, Android, Web", body: "The closest competitor is iPhone only. Wing works everywhere — App Store, Google Play, and a full web app — so no one gets left behind based on their phone.", delay: "delay-2" },
];

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="section-eyebrow fade-up">Built different</div>
      <h2 className="section-title fade-up delay-1">
        Every feature your competitors<br />forgot to build.
      </h2>
      <p className="section-sub fade-up delay-2">
        We studied every weakness in every competitor and built Wing to fix them. This is what a companion app actually looks like when it&apos;s done right.
      </p>
      <div className="features-grid">
        {FEATS.map((f) => (
          <div key={f.title} className={`feat-card fade-up ${f.delay ?? ""} ${f.featured ? "featured" : ""}`}>
            <div className="feat-icon"><f.Icon /></div>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
