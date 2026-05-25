import type { TripPurpose, WingUser } from "./types";

/**
 * Jaccard-style overlap between two string sets, normalized 0..1.
 * Returns 0 if either side is empty.
 */
function overlapScore(a: string[] = [], b: string[] = []): number {
  if (!a.length || !b.length) return 0;
  const setA = new Set(a.map((x) => x.toLowerCase()));
  const setB = new Set(b.map((x) => x.toLowerCase()));
  let inter = 0;
  setA.forEach((x) => {
    if (setB.has(x)) inter++;
  });
  const union = setA.size + setB.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** Trip-style compatibility matrix, 0..1. */
function tripStyleCompatibility(a: TripPurpose, b: TripPurpose): number {
  if (a === b) return 1;
  // Local guides pair best with solo travelers.
  if ((a === "local_guide" && b === "solo_traveler") || (b === "local_guide" && a === "solo_traveler")) return 0.95;
  // Group trips pair OK with solo travelers.
  if ((a === "group_trip" && b === "solo_traveler") || (b === "group_trip" && a === "solo_traveler")) return 0.7;
  // Business with anyone is lukewarm.
  if (a === "business" || b === "business") return 0.4;
  return 0.6;
}

/** Haversine distance in miles. Returns Infinity if either coord missing. */
export function distanceMiles(
  aLat?: number,
  aLng?: number,
  bLat?: number,
  bLng?: number,
): number {
  if (aLat == null || aLng == null || bLat == null || bLng == null) return Infinity;
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Proximity score: 1.0 at 0mi, 0 at ≥100mi, linear in between. */
function proximityScore(miles: number): number {
  if (!isFinite(miles)) return 0.3; // unknown location → neutral-low
  if (miles <= 0) return 1;
  if (miles >= 100) return 0;
  return 1 - miles / 100;
}

/**
 * Calculate match % between two users. 0..100.
 * Weights: interests 30%, activity intent 30%, trip style 20%, proximity 20%.
 */
export function calculateMatchScore(a: WingUser, b: WingUser): number {
  const interests = overlapScore(a.interests, b.interests);
  const activities = overlapScore(a.activitiesWanted, b.activitiesWanted);
  const style = tripStyleCompatibility(a.tripPurpose, b.tripPurpose);
  const miles = distanceMiles(a.approxLat, a.approxLng, b.approxLat, b.approxLng);
  const prox = proximityScore(miles);

  const score = interests * 0.3 + activities * 0.3 + style * 0.2 + prox * 0.2;
  return Math.round(score * 100);
}
