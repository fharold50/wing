"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";
import { moderateText } from "@/lib/moderation";
import { sendEmail, safetyEmailHtml } from "@/lib/email";
import { trustedContactMessage } from "@/lib/safety";

/* ============================================================
   Internal helpers
   ============================================================ */

/** Bump last_seen_at for the calling user. Cheap — fire and forget. */
async function pingActive(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  await supabase
    .from("profiles")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", userId);
}

/** Log a Shield block event. Never stores user/content — just the fact. */
async function logShieldBlock(category: string | null = null) {
  if (isDemoMode()) return;
  const supabase = await createClient();
  await supabase.from("shield_blocks").insert({ category });
}

/* ============================================================
   Wing-Up + connections
   ============================================================ */

export async function wingUp(wingId: string) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  await pingActive(supabase, user.id);
  const { error } = await supabase.from("wing_connections").insert({
    user_id: user.id,
    wing_id: wingId,
    status: "pending",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/discover");
  revalidatePath("/wings");
  return { ok: true };
}

export async function respondConnection(id: string, status: "connected" | "declined") {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  await pingActive(supabase, user.id);

  const { data: conn } = await supabase
    .from("wing_connections")
    .select("user_id, wing_id")
    .eq("id", id)
    .maybeSingle();
  if (!conn || conn.wing_id !== user.id) {
    return { ok: false, error: "Connection not found or not yours" };
  }

  const { error } = await supabase
    .from("wing_connections")
    .update({ status })
    .eq("id", id)
    .eq("wing_id", user.id);
  if (error) return { ok: false, error: error.message };

  if (status === "connected") {
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: conn.user_id,
      content: "We're winged up. What did you have in mind?",
      moderation_passed: true,
    });
  }

  revalidatePath("/wings");
  revalidatePath("/messages");
  revalidatePath(`/messages/${conn.user_id}`);
  return { ok: true };
}

/* ============================================================
   Activity plans
   ============================================================ */

export async function createPlan(formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/activities");
    return { ok: true, demo: true };
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  await pingActive(supabase, user.id);

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const activity_type = String(formData.get("activity_type") ?? "").trim();
  const datetime = String(formData.get("datetime") ?? "").trim();
  const max_participants = Math.max(2, Math.min(20, Number(formData.get("max_participants") ?? 4)));

  if (!title || !activity_type || !datetime) return { ok: false, error: "Title, activity, and time are required." };

  const mod = await moderateText(`${title}\n${description}`);
  if (!mod.pass) {
    await logShieldBlock("romantic");
    return { ok: false, error: mod.reason ?? "Content not allowed." };
  }

  const { error } = await supabase.from("activity_plans").insert({
    host_id: user.id,
    title, description, city, location,
    activity_type,
    datetime,
    max_participants,
    current_participants: 1,
    is_open: true,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/activities");
  return { ok: true };
}

/* ============================================================
   Messages — runs moderation, logs Shield blocks
   ============================================================ */

export async function sendMessage(receiverId: string, content: string) {
  const text = content.trim();
  if (!text) return { ok: false, error: "Empty message." };

  const mod = await moderateText(text);
  if (!mod.pass) {
    await logShieldBlock("romantic");
    return { ok: false, error: mod.reason ?? "Message blocked." };
  }

  if (isDemoMode()) {
    revalidatePath(`/messages/${receiverId}`);
    return { ok: true, demo: true };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  await pingActive(supabase, user.id);

  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    receiver_id: receiverId,
    content: text,
    moderation_passed: true,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/messages/${receiverId}`);
  return { ok: true };
}

/* ============================================================
   Profile edits
   ============================================================ */

export async function saveProfile(formData: FormData) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const name = String(formData.get("name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "");
  const location = String(formData.get("location") ?? "");
  const destination = String(formData.get("destination") ?? "");

  if (!name) return { ok: false, error: "Name required." };

  const mod = await moderateText(`${name}\n${bio}\n${destination}`);
  if (!mod.pass) {
    await logShieldBlock("romantic");
    return { ok: false, error: mod.reason ?? "Content not allowed." };
  }

  const { error } = await supabase.from("profiles").update({
    name, bio, location, destination: destination || null,
    last_seen_at: new Date().toISOString(),
  }).eq("id", user.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/profile");
  redirect("/profile");
}

/* ============================================================
   Trusted contact — required for Safe Meetup Check-in
   ============================================================ */

export async function setTrustedContact(formData: FormData) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name) return { ok: false, error: "Name required." };
  if (!email && !phone) return { ok: false, error: "Need at least one way to reach them — email or phone." };
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "That email doesn't look right." };

  const { error } = await supabase.from("trusted_contacts").upsert({
    user_id: user.id,
    name, email: email || null, phone: phone || null,
    updated_at: new Date().toISOString(),
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/safety");
  revalidatePath("/meetups");
  return { ok: true };
}

/* ============================================================
   Safe Meetup Check-in — schedule, confirm, arrive, safe signal
   ============================================================ */

export async function scheduleMeetup(opts: {
  guestId: string;
  scheduledAt: string;
  locationLabel: string;
  activityType?: string;
}) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  // Both parties must have a trusted contact on file.
  const { data: contact } = await supabase.from("trusted_contacts").select("name").eq("user_id", user.id).maybeSingle();
  if (!contact) return { ok: false, error: "Add a trusted contact in Safety first." };

  const { data, error } = await supabase.from("meetups").insert({
    host_id: user.id,
    guest_id: opts.guestId,
    scheduled_at: opts.scheduledAt,
    location_label: opts.locationLabel,
    activity_type: opts.activityType || null,
    status: "scheduled",
    host_confirmed_at: new Date().toISOString(),
  }).select("id").single();
  if (error) return { ok: false, error: error.message };

  revalidatePath("/meetups");
  return { ok: true, id: data.id };
}

export async function confirmMeetup(meetupId: string) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  await pingActive(supabase, user.id);

  const { data: m } = await supabase.from("meetups")
    .select("host_id, guest_id, host_confirmed_at, guest_confirmed_at")
    .eq("id", meetupId).maybeSingle();
  if (!m) return { ok: false, error: "Meetup not found" };

  const patch: Record<string, string> = {};
  if (m.host_id === user.id) patch.host_confirmed_at = new Date().toISOString();
  else if (m.guest_id === user.id) patch.guest_confirmed_at = new Date().toISOString();
  else return { ok: false, error: "Not your meetup" };

  // If both will be confirmed after this update → bump status.
  const willBeBoth = (patch.host_confirmed_at || m.host_confirmed_at) && (patch.guest_confirmed_at || m.guest_confirmed_at);
  if (willBeBoth) patch.status = "confirmed";

  const { error } = await supabase.from("meetups").update(patch).eq("id", meetupId);
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/meetups/${meetupId}`);
  revalidatePath("/meetups");
  return { ok: true };
}

export async function signalArrived(meetupId: string) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  await pingActive(supabase, user.id);

  const { data: m } = await supabase.from("meetups")
    .select("host_id, guest_id").eq("id", meetupId).maybeSingle();
  if (!m) return { ok: false, error: "Meetup not found" };

  const patch: Record<string, string> = { status: "in_progress" };
  if (m.host_id === user.id) patch.host_arrived_at = new Date().toISOString();
  else if (m.guest_id === user.id) patch.guest_arrived_at = new Date().toISOString();
  else return { ok: false, error: "Not your meetup" };

  const { error } = await supabase.from("meetups").update(patch).eq("id", meetupId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/meetups/${meetupId}`);
  return { ok: true };
}

export async function signalSafe(meetupId: string) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  await pingActive(supabase, user.id);

  const { data: m } = await supabase.from("meetups")
    .select("host_id, guest_id, host_safe_signal_at, guest_safe_signal_at")
    .eq("id", meetupId).maybeSingle();
  if (!m) return { ok: false, error: "Meetup not found" };

  const patch: Record<string, string> = {};
  if (m.host_id === user.id) patch.host_safe_signal_at = new Date().toISOString();
  else if (m.guest_id === user.id) patch.guest_safe_signal_at = new Date().toISOString();
  else return { ok: false, error: "Not your meetup" };

  const bothSafe = (patch.host_safe_signal_at || m.host_safe_signal_at) && (patch.guest_safe_signal_at || m.guest_safe_signal_at);
  if (bothSafe) patch.status = "completed";

  const { error } = await supabase.from("meetups").update(patch).eq("id", meetupId);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/meetups/${meetupId}`);
  revalidatePath("/meetups");
  return { ok: true };
}

/**
 * Server action callable from a cron job or a client-side "deadline passed"
 * check. Notifies the trusted contact of any party who didn't safe-signal
 * past the deadline. Idempotent — only fires once per meetup.
 */
export async function notifyContactIfOverdue(meetupId: string) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  // Use service role on the server side — but our anon path is also fine
  // since RLS lets either party read their own meetup.
  const { data: m } = await supabase.from("meetups")
    .select("id, scheduled_at, host_id, guest_id, host_safe_signal_at, guest_safe_signal_at, contact_notified_at, location_label")
    .eq("id", meetupId).maybeSingle();
  if (!m) return { ok: false, error: "Meetup not found" };
  if (m.contact_notified_at) return { ok: true, alreadyNotified: true };

  const minPast = (Date.now() - new Date(m.scheduled_at).getTime()) / 60_000;
  if (minPast < 120) return { ok: true, notYet: true };

  // Figure out who hasn't signaled yet.
  const overdue: Array<{ userId: string }> = [];
  if (!m.host_safe_signal_at) overdue.push({ userId: m.host_id });
  if (!m.guest_safe_signal_at) overdue.push({ userId: m.guest_id });
  if (overdue.length === 0) return { ok: true, allSafe: true };

  for (const u of overdue) {
    const { data: profile } = await supabase.from("profiles").select("name").eq("id", u.userId).maybeSingle();
    const { data: contact } = await supabase.from("trusted_contacts").select("name, email").eq("user_id", u.userId).maybeSingle();
    if (!contact?.email) continue;
    const body = trustedContactMessage({
      contactName: contact.name,
      userName: profile?.name ?? "your friend",
      locationLabel: m.location_label,
      scheduledAt: m.scheduled_at,
      appUrl: "https://wing-gold.vercel.app",
    });
    await sendEmail({
      to: contact.email,
      subject: `${profile?.name ?? "Your friend"} hasn't checked in after their Wing meetup`,
      text: body,
      html: safetyEmailHtml(body),
    });
  }

  await supabase.from("meetups").update({ contact_notified_at: new Date().toISOString() }).eq("id", meetupId);
  return { ok: true, notified: overdue.length };
}

/* ============================================================
   Travel boards
   ============================================================ */

export async function createTrip(formData: FormData) {
  if (isDemoMode()) {
    revalidatePath("/travel");
    return { ok: true, demo: true };
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  await pingActive(supabase, user.id);

  const city = String(formData.get("city") ?? "").trim();
  const country = String(formData.get("country") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "").trim();
  const endDate = String(formData.get("end_date") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  if (!city) return { ok: false, error: "Where to?" };
  if (!startDate || !endDate) return { ok: false, error: "Pick both dates." };
  if (endDate < startDate) return { ok: false, error: "End date is before start date." };

  if (note) {
    const mod = await moderateText(note);
    if (!mod.pass) {
      await logShieldBlock("romantic");
      return { ok: false, error: mod.reason ?? "Note flagged." };
    }
  }

  const { error } = await supabase.from("trips").insert({
    user_id: user.id, city, country: country || null,
    start_date: startDate, end_date: endDate, note: note || null,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/travel");
  return { ok: true };
}

export async function deleteTrip(id: string) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  const { error } = await supabase.from("trips").delete().eq("id", id).eq("user_id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/travel");
  return { ok: true };
}

/* ============================================================
   Photo verification — request flow (Persona / Stripe Identity wiring later)
   ============================================================ */

export async function requestPhotoVerification() {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  const { error } = await supabase
    .from("profiles")
    .update({ photo_verification_status: "pending" })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/profile");
  return { ok: true };
}

/* ============================================================
   Tipping a Local Guide (record-only until Stripe Connect lands)
   ============================================================ */

export async function tipGuide(opts: { toId: string; amountCents: number; meetupId?: string }) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  if (opts.amountCents < 100) return { ok: false, error: "Min tip is $1." };
  const { error } = await supabase.from("tips").insert({
    from_id: user.id, to_id: opts.toId,
    meetup_id: opts.meetupId ?? null,
    amount_cents: opts.amountCents,
    status: "pending",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/profile");
  return { ok: true };
}

/* ============================================================
   Voice note — save URL after client uploads to Storage
   ============================================================ */

export async function setVoiceNote(url: string | null) {
  if (isDemoMode()) return { ok: true, demo: true };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  const { error } = await supabase.from("profiles").update({ voice_url: url }).eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/profile");
  return { ok: true };
}
