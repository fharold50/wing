"use client";

import { createBrowserClient } from "@supabase/ssr";

/** True when we don't have Supabase configured — used by client handlers to short-circuit. */
export function isClientDemoMode() {
  return (
    process.env.NEXT_PUBLIC_DEMO === "1" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Browser Supabase client. Returns `null` when env vars are missing or
 * NEXT_PUBLIC_DEMO=1 — callers MUST check before using to avoid the
 * "@supabase/ssr: Your project's URL and API key are required" crash.
 */
export function createClient() {
  if (isClientDemoMode()) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
