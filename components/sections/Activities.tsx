import { Waves, Mountain, Wine, Music, UtensilsCrossed, Camera, Dumbbell, Coffee, Theater, Sun, Car, Dices } from "@/lib/icons";
import type { ComponentType, SVGProps } from "react";

type Activity = [ComponentType<SVGProps<SVGSVGElement>>, string, string];

const ACTIVITIES: readonly Activity[] = [
  [Waves, "Surf & Water", "Waves, kayak, paddleboard"],
  [Mountain, "Hiking", "Trails, peaks, nature walks"],
  [Wine, "Bars & Nightlife", "Lounges, rooftops, clubs"],
  [Music, "Live Music", "Jazz, concerts, open mic"],
  [UtensilsCrossed, "Food & Dining", "Local spots, food tours"],
  [Camera, "Photography", "Streets, landscapes, golden hour"],
  [Dumbbell, "Fitness", "Gym, yoga, running"],
  [Coffee, "Coffee & Chill", "Cafés, parks, beaches"],
  [Theater, "Arts & Culture", "Museums, galleries, shows"],
  [Sun, "Beach Days", "Sun, sand, good company"],
  [Car, "Road Trips", "Drives, pit stops, views"],
  [Dices, "Games & Leisure", "Arcade, bowling, pool"],
] as const;

export default function Activities() {
  return (
    <section id="activities" className="section">
      <div className="section-eyebrow fade-up">Every kind of adventure</div>
      <h2 className="section-title fade-up delay-1">
        Whatever you&apos;re into,<br />there&apos;s a Wing for that.
      </h2>
      <p className="section-sub fade-up delay-2">
        From sunrise surfs to late-night jazz bars — Wing covers every activity category your competitors ignored.
      </p>
      <div className="activities-scroll fade-up delay-2">
        {ACTIVITIES.map(([Icon, name, count]) => (
          <div key={name} className="act-card">
            <span className="act-emoji"><Icon /></span>
            <div className="act-name">{name}</div>
            <div className="act-count">{count}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
