const ACTIVITIES = [
  ["🏄", "Surf & Water", "Waves, kayak, paddleboard"],
  ["🥾", "Hiking", "Trails, peaks, nature walks"],
  ["🍹", "Bars & Nightlife", "Lounges, rooftops, clubs"],
  ["🎵", "Live Music", "Jazz, concerts, open mic"],
  ["🍜", "Food & Dining", "Local spots, food tours"],
  ["📸", "Photography", "Streets, landscapes, golden hour"],
  ["🏋️", "Fitness", "Gym, yoga, running"],
  ["☕", "Coffee & Chill", "Cafés, parks, beaches"],
  ["🎭", "Arts & Culture", "Museums, galleries, shows"],
  ["🏖️", "Beach Days", "Sun, sand, good company"],
  ["🚗", "Road Trips", "Drives, pit stops, views"],
  ["🎲", "Games & Leisure", "Arcade, bowling, pool"],
] as const;

export default function Activities() {
  return (
    <section id="activities" className="section">
      <div className="section-eyebrow fade-up">Every kind of adventure</div>
      <h2 className="section-title fade-up delay-1">
        Whatever you&apos;re into,<br />there&apos;s a Wing for that
      </h2>
      <p className="section-sub fade-up delay-2">
        From sunrise surfs to late-night jazz bars — Wing covers every activity category your competitors ignored.
      </p>
      <div className="activities-scroll fade-up delay-2">
        {ACTIVITIES.map(([emoji, name, count]) => (
          <div key={name} className="act-card">
            <span className="act-emoji">{emoji}</span>
            <div className="act-name">{name}</div>
            <div className="act-count">{count}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
