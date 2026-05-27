import { createClient } from "./supabase/server";
import { DEMO_USER, DEMO_WINGS, isDemoMode } from "./demo";
import type { WingUser } from "./types";

type DBRow = {
  id: string;
  name: string;
  bio: string | null;
  location: string | null;
  approx_lat: number | null;
  approx_lng: number | null;
  destination: string | null;
  trip_purpose: WingUser["tripPurpose"];
  interests: string[] | null;
  activities_wanted: string[] | null;
  wing_preference: string | null;
  is_local_guide: boolean | null;
  verification_level: WingUser["verificationLevel"];
  reputation_score: number | null;
  is_active: boolean | null;
  gender: WingUser["gender"];
  looking_for: WingUser["lookingFor"];
  last_active: string;
  created_at: string;
  photos: string[] | null;
  primary_video: string | null;
};

export function rowToUser(r: DBRow): WingUser {
  return {
    id: r.id,
    name: r.name,
    location: r.location ?? "",
    approxLat: r.approx_lat ?? undefined,
    approxLng: r.approx_lng ?? undefined,
    destination: r.destination ?? undefined,
    tripPurpose: r.trip_purpose,
    bio: r.bio ?? "",
    interests: r.interests ?? [],
    activitiesWanted: r.activities_wanted ?? [],
    wingPreference: r.wing_preference ?? "",
    isLocalGuide: r.is_local_guide ?? false,
    verificationLevel: r.verification_level,
    reputationScore: Number(r.reputation_score ?? 5),
    isActive: r.is_active ?? true,
    gender: r.gender,
    lookingFor: r.looking_for ?? ["any"],
    createdAt: r.created_at,
    lastActive: r.last_active,
    photos: r.photos ?? [],
    primaryVideo: r.primary_video ?? undefined,
  };
}

export type Session = {
  user: WingUser;
  isDemo: boolean;
};

/**
 * Get the current viewer for a server component. In demo mode (or when
 * Supabase env vars are missing), returns the canned DEMO_USER and `isDemo: true`.
 * In real mode, fetches the auth user + their profile row. Returns null if not
 * signed in.
 */
export async function getSession(): Promise<Session | null> {
  if (isDemoMode()) {
    return { user: DEMO_USER, isDemo: true };
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: row } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<DBRow>();
  if (!row) return null;
  return { user: rowToUser(row), isDemo: false };
}

/** Other Wings to show in Discover, Map etc. */
export async function listOtherWings(meId: string): Promise<WingUser[]> {
  if (isDemoMode()) return DEMO_WINGS;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .neq("id", meId)
    .eq("is_active", true)
    .order("last_active", { ascending: false })
    .limit(60);
  return (data ?? []).map((r) => rowToUser(r as DBRow));
}
