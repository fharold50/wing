"use client";

import { useEffect, useState } from "react";
import { Shield } from "@/lib/icons";
import { createClient, isClientDemoMode } from "@/lib/supabase/client";

type Counts = { total: number; last_24h: number; last_30d: number };

/**
 * Public, anonymous count of messages the Anti-Hookup AI Shield removed.
 * Lives on the landing page. The point isn't the exact number — it's that
 * we publish it. Nobody else does. That's the moat.
 */
export default function ShieldTicker() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (isClientDemoMode()) {
        if (mounted) setCounts({ total: 14_822, last_24h: 41, last_30d: 1_207 });
        return;
      }
      const supabase = createClient();
      if (!supabase) return;
      const { data } = await supabase.rpc("shield_counts").single();
      if (mounted && data) setCounts(data as Counts);
    }
    load();
    const id = setInterval(load, 30_000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  return (
    <div className="shield-ticker fade-up">
      <div className="shield-ticker-icon"><Shield size={22} /></div>
      <div className="shield-ticker-text">
        <strong>{(counts?.total ?? 0).toLocaleString()}</strong> dating-style messages
        kept off Wing — and counting.{" "}
        <a href="/safety" className="shield-ticker-link">See the count, live →</a>
      </div>
    </div>
  );
}
