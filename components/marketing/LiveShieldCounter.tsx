"use client";

import { useEffect, useState } from "react";

type Counts = { total: number; last_24h: number; last_30d: number };

/**
 * Live-updating counter for the Anti-Hookup AI Shield. Renders three numbers
 * with subtle tick animation. Falls back to a static line if the endpoint is
 * unreachable so it never blocks the landing page from rendering.
 */
export default function LiveShieldCounter({ inverse = false }: { inverse?: boolean }) {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchCounts = async () => {
      try {
        const r = await fetch("/api/shield/count", { cache: "no-store" });
        if (!r.ok) return;
        const j = (await r.json()) as Counts;
        if (!cancelled) setCounts(j);
      } catch {
        // network blip — keep the previous value
      }
    };
    fetchCounts();
    const id = setInterval(fetchCounts, 30_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return (
    <div className={`shield-counter ${inverse ? "inverse" : ""}`}>
      <Stat label="Blocked today" value={counts?.last_24h} />
      <Stat label="Last 30 days" value={counts?.last_30d} />
      <Stat label="All time" value={counts?.total} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  const shown = value == null ? "—" : value.toLocaleString();
  return (
    <div className="shield-stat">
      <div className="shield-stat-num">{shown}</div>
      <div className="shield-stat-label">{label}</div>
    </div>
  );
}
