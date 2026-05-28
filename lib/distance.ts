/**
 * Human-friendly distance phrasing. Designed to NOT feel like a dating app
 * pinpointing your exact GPS — instead it reads like a friend texting you
 * "I'm 20 minutes away on the L."
 */

export type DistancePhrase = {
  /** Short label for the card chip, e.g. "0.8 mi · 16 min walk". */
  label: string;
  /** A more conversational version for hover/details, e.g.
   *  "Roughly 16 minutes on foot. About a Spotify song and a half." */
  long: string;
  /** Bucket name used for grouping on the Distance Lens. */
  bucket:
    | "block"
    | "walk"
    | "bike"
    | "ride"
    | "city"
    | "trip"
    | "far";
};

export function phraseDistance(miles: number | null | undefined): DistancePhrase {
  if (miles == null || !isFinite(miles)) {
    return { label: "elsewhere", long: "We don't know exactly where they are.", bucket: "far" };
  }

  if (miles < 0.25) {
    return {
      label: "Same block",
      long: "Practically next door. If you yell loud enough they might hear you.",
      bucket: "block",
    };
  }

  if (miles < 1.2) {
    const walk = Math.max(5, Math.round(miles * 20));
    return {
      label: `${miles.toFixed(1)} mi · ${walk} min walk`,
      long: `About ${walk} minutes on foot — roughly two coffees and a podcast intro.`,
      bucket: "walk",
    };
  }

  if (miles < 4) {
    const bike = Math.round(miles * 5);
    return {
      label: `${miles.toFixed(1)} mi · ${bike} min bike`,
      long: `Easy bike ride, or a short rideshare if the weather's mean.`,
      bucket: "bike",
    };
  }

  if (miles < 12) {
    const ride = Math.round(miles * 3);
    return {
      label: `${Math.round(miles)} mi · ~${ride} min ride`,
      long: `Across town. A train, a Lyft, or a long determined walk.`,
      bucket: "ride",
    };
  }

  if (miles < 60) {
    return {
      label: `${Math.round(miles)} mi · across the city`,
      long: "Same metro, different side. Worth the trip for the right Wing.",
      bucket: "city",
    };
  }

  if (miles < 400) {
    return {
      label: `${Math.round(miles)} mi · road trip`,
      long: "Day trip distance. Pack a playlist.",
      bucket: "trip",
    };
  }

  return {
    label: `${Math.round(miles).toLocaleString()} mi away`,
    long: "Far enough that you'd plan around it — but pre-trip planning is what Wing does best.",
    bucket: "far",
  };
}

/** Human-friendly "last seen" phrase. */
export function phraseLastActive(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 0) return "Active now";
  const sec = ms / 1000;
  if (sec < 60) return "Active now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `Active ${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `Active ${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `Active ${d}d ago`;
  return "Active over a week ago";
}
