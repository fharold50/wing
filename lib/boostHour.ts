/**
 * Golden Hour — the daily window where Wing turns the volume up.
 *
 * Why: dating-style apps die when nobody's online at the same time. By
 * concentrating attention into a predictable window every evening, we
 * get a "BeReal moment" — people open the app together, match faster,
 * and chats start with momentum.
 *
 * Implementation: 7:00pm → 8:30pm in the *viewer's local timezone*.
 * Match scores get a small visible boost, and we surface a countdown
 * banner on /discover. No server-side magic — purely client-side timing,
 * which means even our demo wings benefit.
 */

export const GOLDEN_HOUR_START = 19; // 7pm
export const GOLDEN_HOUR_END_MIN = 90; // 90 minutes long
/** % multiplier added to match scores while active (display only). */
export const GOLDEN_HOUR_BOOST = 0.15;

export type BoostState = {
  active: boolean;
  /** Minutes until window starts (when inactive). */
  minutesUntilStart?: number;
  /** Minutes until window ends (when active). */
  minutesUntilEnd?: number;
  /** Human label like "7:00pm – 8:30pm". */
  windowLabel: string;
};

export function getBoostState(now: Date = new Date()): BoostState {
  const start = new Date(now);
  start.setHours(GOLDEN_HOUR_START, 0, 0, 0);
  const end = new Date(start.getTime() + GOLDEN_HOUR_END_MIN * 60_000);

  const fmt = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }).toLowerCase().replace(" ", "");
  const windowLabel = `${fmt(start)} – ${fmt(end)}`;

  const t = now.getTime();
  if (t >= start.getTime() && t < end.getTime()) {
    return {
      active: true,
      minutesUntilEnd: Math.ceil((end.getTime() - t) / 60_000),
      windowLabel,
    };
  }

  // If we're past today's window, point to tomorrow's.
  const nextStart = t >= end.getTime()
    ? new Date(start.getTime() + 24 * 3600_000)
    : start;
  return {
    active: false,
    minutesUntilStart: Math.ceil((nextStart.getTime() - t) / 60_000),
    windowLabel,
  };
}

/** Apply boost to a match score (0-100). Caps at 100. */
export function boostScore(score: number, active: boolean): number {
  if (!active) return score;
  return Math.min(100, Math.round(score * (1 + GOLDEN_HOUR_BOOST)));
}
