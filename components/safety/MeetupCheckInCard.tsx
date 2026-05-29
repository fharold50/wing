"use client";

import { useEffect, useState, useTransition } from "react";
import { confirmMeetup, signalArrived, signalSafe, notifyContactIfOverdue } from "@/app/actions";
import { checkInState, checkInHeadline, type ViewerSide } from "@/lib/safety";
import type { Meetup } from "@/lib/types";

type Props = {
  meetup: Meetup;
  viewer: ViewerSide;
  /** Display name of the other party. */
  otherName: string;
};

/**
 * The check-in cycle, in one card. Decides what action to surface based on
 * how far we are from `scheduledAt` and which signals are already in.
 */
export default function MeetupCheckInCard({ meetup, viewer, otherName }: Props) {
  const [now, setNow] = useState<Date | null>(null);
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  // Auto-trigger contact notification once we cross the deadline. The action
  // is idempotent on the server — only fires once per meetup.
  useEffect(() => {
    if (!now) return;
    const minPast = (now.getTime() - new Date(meetup.scheduledAt).getTime()) / 60_000;
    if (minPast >= 120 && !meetup.contactNotifiedAt && !meetup.hostSafeSignalAt && !meetup.guestSafeSignalAt) {
      notifyContactIfOverdue(meetup.id).catch(() => {});
    }
  }, [now, meetup]);

  if (!now) return null;
  const state = checkInState(meetup, viewer, now);
  const headline = checkInHeadline(state);

  function fire(action: () => Promise<{ ok: boolean; error?: string }>) {
    setErr(null);
    startTransition(async () => {
      const res = await action();
      if (!res.ok) setErr(res.error ?? "Couldn't update");
    });
  }

  return (
    <div className={`checkin-card stage-${state.stage}`}>
      <div className="checkin-head">
        <span className="checkin-eyebrow">Safe Meetup Check-in</span>
        <span className={`checkin-pill stage-${state.stage}`}>{stageLabel(state.stage)}</span>
      </div>
      <div className="checkin-with">
        With <strong>{otherName}</strong> · {new Date(meetup.scheduledAt).toLocaleString(undefined, {
          weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
        })} · {meetup.locationLabel}
      </div>
      <p className="checkin-headline">{headline}</p>

      {state.stage === "confirm" && !state.viewerConfirmed && (
        <button className="btn btn-primary" disabled={pending} onClick={() => fire(() => confirmMeetup(meetup.id))}>
          Still on
        </button>
      )}

      {(state.stage === "arrive" || state.stage === "during") && !state.viewerArrived && (
        <button className="btn btn-primary" disabled={pending} onClick={() => fire(() => signalArrived(meetup.id))}>
          I&apos;m here
        </button>
      )}

      {state.safeSignalOpen && (
        <button className="btn btn-primary" disabled={pending} onClick={() => fire(() => signalSafe(meetup.id))}>
          I&apos;m good — clear it
        </button>
      )}

      {state.stage === "overdue" && (
        <div className="checkin-overdue">
          <strong>Your trusted contact has been emailed.</strong>
          <span>Tap below the moment you&apos;re safe and we&apos;ll send them an all-clear.</span>
          {!state.viewerSafe && (
            <button className="btn btn-primary" disabled={pending} onClick={() => fire(() => signalSafe(meetup.id))}>
              I&apos;m safe — send the all-clear
            </button>
          )}
        </div>
      )}

      {state.stage === "done" && (
        <div className="checkin-done">Both of you checked in. Glad you&apos;re good.</div>
      )}

      {err && <div className="auth-err">{err}</div>}
    </div>
  );
}

function stageLabel(s: ReturnType<typeof checkInState>["stage"]): string {
  switch (s) {
    case "too_early": return "Scheduled";
    case "confirm": return "Confirm";
    case "arrive": return "Arrive";
    case "during": return "Underway";
    case "safe_signal": return "Check in";
    case "overdue": return "Overdue";
    case "done": return "Done";
  }
}
