import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Shield } from "@/lib/icons";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";
import { isDemoMode, DEMO_USER, DEMO_WINGS } from "@/lib/demo";
import MeetupCheckInCard from "@/components/safety/MeetupCheckInCard";
import type { Meetup } from "@/lib/types";

export default async function MeetupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return null;

  let meetup: Meetup | null = null;
  let otherName = "Wing";
  let viewer: "host" | "guest" = "host";

  if (isDemoMode()) {
    // Fixture: a meetup happening 45 minutes from now with Aisha.
    meetup = {
      id,
      hostId: DEMO_USER.id,
      guestId: "u1",
      scheduledAt: new Date(Date.now() + 45 * 60_000).toISOString(),
      locationLabel: "Frenchmen Street · Spotted Cat",
      activityType: "live_music",
      status: "scheduled",
      hostConfirmedAt: new Date().toISOString(),
      guestConfirmedAt: null,
      hostArrivedAt: null,
      guestArrivedAt: null,
      hostSafeSignalAt: null,
      guestSafeSignalAt: null,
      contactNotifiedAt: null,
      createdAt: new Date().toISOString(),
    };
    otherName = DEMO_WINGS.find((w) => w.id === "u1")?.name ?? "Aisha L.";
    viewer = "host";
  } else {
    const supabase = await createClient();
    const meId = session.user.id;
    const { data } = await supabase
      .from("meetups")
      .select("id, host_id, guest_id, scheduled_at, location_label, activity_type, status, host_confirmed_at, guest_confirmed_at, host_arrived_at, guest_arrived_at, host_safe_signal_at, guest_safe_signal_at, contact_notified_at, created_at")
      .eq("id", id).maybeSingle();
    if (!data) return notFound();
    meetup = {
      id: data.id,
      hostId: data.host_id,
      guestId: data.guest_id,
      scheduledAt: data.scheduled_at,
      locationLabel: data.location_label,
      activityType: data.activity_type ?? undefined,
      status: data.status,
      hostConfirmedAt: data.host_confirmed_at,
      guestConfirmedAt: data.guest_confirmed_at,
      hostArrivedAt: data.host_arrived_at,
      guestArrivedAt: data.guest_arrived_at,
      hostSafeSignalAt: data.host_safe_signal_at,
      guestSafeSignalAt: data.guest_safe_signal_at,
      contactNotifiedAt: data.contact_notified_at,
      createdAt: data.created_at,
    };
    viewer = data.host_id === meId ? "host" : "guest";
    const otherId = data.host_id === meId ? data.guest_id : data.host_id;
    const { data: other } = await supabase.from("profiles").select("name").eq("id", otherId).maybeSingle();
    otherName = other?.name ?? "Wing";
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <Link href="/meetups" className="btn btn-ghost" style={{ padding: "8px 14px" }}>
          <ArrowLeft size={14} /> Meetups
        </Link>
        <span style={{ fontSize: 12, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Shield size={12} /> Wing has your back
        </span>
      </div>

      <MeetupCheckInCard meetup={meetup} viewer={viewer} otherName={otherName} />
    </>
  );
}
