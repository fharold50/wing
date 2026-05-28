"use client";

import { useEffect, useState } from "react";
import { getBoostState } from "@/lib/boostHour";

/**
 * Live-updating banner that ticks down to / through Golden Hour.
 * Renders nothing more than 4 hours from the window — keeps Discover clean.
 */
export default function GoldenHourBanner() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;
  const state = getBoostState(now);

  // Hide if not active and more than 4 hours away.
  if (!state.active && (state.minutesUntilStart ?? 0) > 240) return null;

  if (state.active) {
    const min = state.minutesUntilEnd ?? 0;
    return (
      <div className="golden-banner active">
        <div className="golden-dot" />
        <div className="golden-text">
          <strong>Golden Hour is live.</strong>
          <span>Match scores get a boost. {min} min left.</span>
        </div>
      </div>
    );
  }

  const min = state.minutesUntilStart ?? 0;
  const friendly = min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min} min`;
  return (
    <div className="golden-banner">
      <div className="golden-text">
        <strong>Golden Hour in {friendly}.</strong>
        <span>Tonight, {state.windowLabel}. Everyone gets a boost.</span>
      </div>
    </div>
  );
}
