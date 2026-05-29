import { createClient } from "@supabase/supabase-js";
import { isAuthorizedCron } from "@/lib/cron";
import { sendEmail } from "@/lib/email";

/**
 * Sweeps recent meetups whose scheduled time was 2+ hours ago AND have not
 * received a safe-signal from one or both parties. For each, notifies the
 * trusted contact via Resend.
 *
 * Vercel triggers this on the schedule in vercel.json — see CRON_SECRET in
 * env vars. The route uses the service-role key to read across users while
 * respecting our own application-level invariants.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MeetupRow = {
  id: string;
  scheduled_at: string;
  host_id: string;
  guest_id: string;
  host_safe_signal_at: string | null;
  guest_safe_signal_at: string | null;
  contact_notified_at: string | null;
  location_label: string;
};

type ContactRow = { user_id: string; name: string; email: string };
type ProfileRow = { id: string; name: string };

export async function GET(req: Request) {
  if (!isAuthorizedCron(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return Response.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // Look back 2-24 hours: anything older than 24h has had its chance.
  const upper = new Date(Date.now() - 2 * 3600_000).toISOString();
  const lower = new Date(Date.now() - 24 * 3600_000).toISOString();

  const { data: meetups, error } = await supabase
    .from("meetups")
    .select("id, scheduled_at, host_id, guest_id, host_safe_signal_at, guest_safe_signal_at, contact_notified_at, location_label")
    .gte("scheduled_at", lower)
    .lte("scheduled_at", upper)
    .is("contact_notified_at", null)
    .in("status", ["scheduled", "confirmed", "in_progress"]);

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  const rows = (meetups ?? []) as MeetupRow[];
  let notified = 0;
  let scanned = 0;

  for (const m of rows) {
    scanned++;
    const overdue: string[] = [];
    if (!m.host_safe_signal_at) overdue.push(m.host_id);
    if (!m.guest_safe_signal_at) overdue.push(m.guest_id);
    if (overdue.length === 0) continue;

    const { data: profiles } = await supabase
      .from("profiles").select("id, name").in("id", overdue);
    const profileMap = new Map((profiles as ProfileRow[] | null ?? []).map((p) => [p.id, p]));

    const { data: contacts } = await supabase
      .from("trusted_contacts").select("user_id, name, email").in("user_id", overdue);
    const contactMap = new Map((contacts as ContactRow[] | null ?? []).map((c) => [c.user_id, c]));

    let anySent = false;
    for (const uid of overdue) {
      const contact = contactMap.get(uid);
      if (!contact?.email) continue;
      const profile = profileMap.get(uid);
      const who = profile?.name ?? "Your friend";

      const text =
        `Hi ${contact.name || "there"},\n\n` +
        `${who} planned a Wing meetup at ${m.location_label}, ` +
        `scheduled for ${new Date(m.scheduled_at).toLocaleString()}. ` +
        `They haven't checked in safe yet.\n\n` +
        `This is the automatic note ${who} asked us to send if that happened. ` +
        `It might be nothing — phones die, brunches run long. ` +
        `If it's been a while, give them a call.\n\n` +
        `— Wing`;

      const res = await sendEmail({
        to: contact.email,
        subject: `${who} hasn't checked in after their Wing meetup`,
        text,
      });
      if (res.ok) anySent = true;
    }

    if (anySent) {
      await supabase.from("meetups")
        .update({ contact_notified_at: new Date().toISOString() })
        .eq("id", m.id);
      notified++;
    }
  }

  return Response.json({ ok: true, scanned, notified, scannedAt: new Date().toISOString() });
}
