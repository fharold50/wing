/**
 * Safe Meetup Check-in — the schedule of nudges Wing runs around a meetup.
 *
 * Pure functions. They take a Meetup + the current time and decide what UI
 * to surface and whether the trusted contact has earned a notification.
 *
 * Why the constants live here and not as DB columns:
 *   The cadence is a product decision, not a per-meetup setting. Users
 *   shouldn't be tweaking "remind me 27 min before instead of 30." That
 *   path leads to a Bumble-style flood of options that nobody touches.
 */

import type { Meetup } from "./types";

/** Minutes before scheduledAt we ping both parties to confirm. */
export const CONFIRM_LEAD_MIN = 30;
/** Minutes after scheduledAt before we expect an "arrived" signal. */
export const ARRIVAL_GRACE_MIN = 20;
/** Minutes after scheduledAt for the "you good?" check. */
export const SAFE_SIGNAL_AT_MIN = 90;
/** Minutes after scheduledAt before we text your trusted contact if no signal. */
export const CONTACT_DEADLINE_MIN = 120;

export type CheckInStage =
  | "too_early"      // > CONFIRM_LEAD_MIN before
  | "confirm"        // within CONFIRM_LEAD_MIN, not yet at scheduledAt
  | "arrive"         // between scheduledAt and ARRIVAL_GRACE_MIN after
  | "during"         // between arrival and SAFE_SIGNAL_AT_MIN after
  | "safe_signal"    // window where we ask "you good?"
  | "overdue"        // past CONTACT_DEADLINE_MIN with no safe signal — contact notified
  | "done";          // both parties signaled safe, or meetup completed

export type ViewerSide = "host" | "guest";

export interface CheckInState {
  stage: CheckInStage;
  /** Minutes until next user action is due (negative = past due). */
  minutesUntilNext: number;
  /** Has THIS viewer (host or guest) confirmed yet? */
  viewerConfirmed: boolean;
  /** Has THIS viewer arrived? */
  viewerArrived: boolean;
  /** Has THIS viewer signaled safe? */
  viewerSafe: boolean;
  /** True if any party should now signal safe (window open). */
  safeSignalOpen: boolean;
  /** True if contact-notification deadline has passed without a safe signal. */
  pastContactDeadline: boolean;
}

function diffMin(a: Date, b: Date): number {
  return (a.getTime() - b.getTime()) / 60_000;
}

export function checkInState(meetup: Meetup, viewer: ViewerSide, now: Date = new Date()): CheckInState {
  const scheduled = new Date(meetup.scheduledAt);
  const minPast = diffMin(now, scheduled); // negative if scheduled is in future

  const myConfirmed = !!(viewer === "host" ? meetup.hostConfirmedAt : meetup.guestConfirmedAt);
  const myArrived = !!(viewer === "host" ? meetup.hostArrivedAt : meetup.guestArrivedAt);
  const mySafe = !!(viewer === "host" ? meetup.hostSafeSignalAt : meetup.guestSafeSignalAt);
  const bothSafe = !!(meetup.hostSafeSignalAt && meetup.guestSafeSignalAt);
  const bothArrived = !!(meetup.hostArrivedAt && meetup.guestArrivedAt);

  let stage: CheckInStage;
  let minutesUntilNext: number;

  if (bothSafe || meetup.status === "completed") {
    stage = "done";
    minutesUntilNext = 0;
  } else if (minPast < -CONFIRM_LEAD_MIN) {
    stage = "too_early";
    minutesUntilNext = -minPast - CONFIRM_LEAD_MIN;
  } else if (minPast < 0) {
    stage = "confirm";
    minutesUntilNext = -minPast;
  } else if (minPast < ARRIVAL_GRACE_MIN && !myArrived) {
    stage = "arrive";
    minutesUntilNext = ARRIVAL_GRACE_MIN - minPast;
  } else if (minPast < SAFE_SIGNAL_AT_MIN) {
    stage = bothArrived ? "during" : "arrive";
    minutesUntilNext = SAFE_SIGNAL_AT_MIN - minPast;
  } else if (minPast < CONTACT_DEADLINE_MIN) {
    stage = "safe_signal";
    minutesUntilNext = CONTACT_DEADLINE_MIN - minPast;
  } else {
    stage = "overdue";
    minutesUntilNext = 0;
  }

  return {
    stage,
    minutesUntilNext: Math.round(minutesUntilNext),
    viewerConfirmed: myConfirmed,
    viewerArrived: myArrived,
    viewerSafe: mySafe,
    safeSignalOpen: minPast >= SAFE_SIGNAL_AT_MIN - 30 && !mySafe,
    pastContactDeadline: minPast >= CONTACT_DEADLINE_MIN,
  };
}

/** Human-friendly headline for the check-in card. No "AI" voice — direct, plain. */
export function checkInHeadline(state: CheckInState): string {
  switch (state.stage) {
    case "too_early":
      return "We'll ping you both 30 minutes before.";
    case "confirm":
      return state.viewerConfirmed
        ? "You're confirmed. We'll prompt you when you arrive."
        : "Confirm you're still on. One tap.";
    case "arrive":
      return state.viewerArrived
        ? "Got it — enjoy. We'll check in afterward."
        : "Tap when you get there.";
    case "during":
      return "Have a good one. We'll check on you in a bit.";
    case "safe_signal":
      return state.viewerSafe
        ? "Glad you're good."
        : "All good? One tap — your trusted contact won't be bothered.";
    case "overdue":
      return "We texted your trusted contact. Tap if you're okay so we can clear it.";
    case "done":
      return "Meetup wrapped. Rate your Wing if you've got a sec.";
  }
}

/** The message Wing sends to a no-signal user's trusted contact. */
export function trustedContactMessage(opts: {
  contactName: string;
  userName: string;
  locationLabel: string;
  scheduledAt: string;
  appUrl: string;
}): string {
  // Plain-language, no marketing voice. Sounds like a friend texting.
  const time = new Date(opts.scheduledAt).toLocaleString(undefined, {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
  return (
    `Hi ${opts.contactName} — this is Wing, an app ${opts.userName} uses to meet up safely. ` +
    `They had a Wing meetup at ${opts.locationLabel} (${time}) and haven't checked in afterward. ` +
    `It's probably nothing. But ${opts.userName} listed you as their trusted contact, so we're letting you know. ` +
    `If you can, give them a quick text. More info: ${opts.appUrl}`
  );
}
