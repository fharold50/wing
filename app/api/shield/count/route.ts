import { createClient } from "@supabase/supabase-js";

/**
 * Public stats for the Anti-Hookup AI Shield. Used by the landing-page
 * counter + the in-app /safety page. Read-only, cached for 60s — no auth
 * needed and the shape never contains anything personal.
 */
export const runtime = "nodejs";
export const revalidate = 60;

type Row = { total: number; last_24h: number; last_30d: number };

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // No Supabase yet — return demo-friendly zeros instead of erroring.
    return Response.json({ total: 0, last_24h: 0, last_30d: 0, source: "stub" });
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase.rpc("shield_counts");
  if (error || !data) {
    return Response.json({ total: 0, last_24h: 0, last_30d: 0, source: "stub" });
  }
  const row = (Array.isArray(data) ? data[0] : data) as Row;
  return Response.json({
    total: Number(row.total ?? 0),
    last_24h: Number(row.last_24h ?? 0),
    last_30d: Number(row.last_30d ?? 0),
    source: "live",
  });
}
