"use client";

import { useEffect, useState } from "react";
import { createClient, isClientDemoMode } from "@/lib/supabase/client";

type Counts = { total: number; last_24h: number; last_30d: number };

export default function ShieldStats() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (isClientDemoMode()) {
        // Pretty numbers for the demo screenshot.
        if (mounted) setCounts({ total: 14_822, last_24h: 41, last_30d: 1_207 });
        return;
      }
      const supabase = createClient();
      if (!supabase) return;
      const { data, error } = await supabase.rpc("shield_counts").single();
      if (error) setError(error.message);
      if (mounted && data) setCounts(data as Counts);
    }
    load();
    const id = setInterval(load, 30_000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  if (error) return <div className="auth-err">{error}</div>;
  if (!counts) return <div className="shield-stats shield-loading">Loading…</div>;

  return (
    <div className="shield-stats">
      <ShieldStat label="Messages blocked, all time" value={counts.total} />
      <ShieldStat label="Last 30 days"               value={counts.last_30d} />
      <ShieldStat label="Last 24 hours"              value={counts.last_24h} pulse />
    </div>
  );
}

function ShieldStat({ label, value, pulse }: { label: string; value: number; pulse?: boolean }) {
  return (
    <div className="shield-stat">
      <div className="shield-num">
        {pulse && <span className="shield-dot" />}
        {value.toLocaleString()}
      </div>
      <div className="shield-label">{label}</div>
    </div>
  );
}
