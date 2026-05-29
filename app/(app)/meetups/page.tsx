import Link from "next/link";
import { Shield, Calendar } from "@/lib/icons";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";
import { isDemoMode } from "@/lib/demo";

export const metadata = { title: "Meetups · Wing" };

type Row = {
  id: string;
  scheduled_at: string;
  location_label: string;
  status: string;
  host_id: string;
  guest_id: string;
  other_name: string;
};

export default async function MeetupsPage() {
  const session = await getSession();
  if (!session) return null;

  let rows: Row[] = [];
  if (isDemoMode()) {
    rows = [
      {
        id: "demo-1",
        scheduled_at: new Date(Date.now() + 45 * 60_000).toISOString(),
        location_label: "Frenchmen Street · Spotted Cat",
        status: "scheduled",
        host_id: session.user.id,
        guest_id: "u1",
        other_name: "Aisha L.",
      },
      {
        id: "demo-2",
        scheduled_at: new Date(Date.now() - 5 * 86400_000).toISOString(),
        location_label: "Sunset Beach",
        status: "completed",
        host_id: "u2",
        guest_id: session.user.id,
        other_name: "Marcus K.",
      },
    ];
  } else {
    const supabase = await createClient();
    const meId = session.user.id;
    const { data: meetups } = await supabase
      .from("meetups")
      .select("id, scheduled_at, location_label, status, host_id, guest_id")
      .or(`host_id.eq.${meId},guest_id.eq.${meId}`)
      .order("scheduled_at", { ascending: false })
      .limit(40);
    const otherIds = Array.from(new Set((meetups ?? []).map((m) => m.host_id === meId ? m.guest_id : m.host_id)));
    const names = new Map<string, string>();
    if (otherIds.length) {
      const { data: ps } = await supabase.from("profiles").select("id, name").in("id", otherIds);
      (ps ?? []).forEach((p) => names.set(p.id, p.name));
    }
    rows = (meetups ?? []).map((m) => ({
      id: m.id,
      scheduled_at: m.scheduled_at,
      location_label: m.location_label,
      status: m.status,
      host_id: m.host_id,
      guest_id: m.guest_id,
      other_name: names.get(m.host_id === meId ? m.guest_id : m.host_id) ?? "Wing",
    }));
  }

  const now = Date.now();
  const upcoming = rows.filter((r) => new Date(r.scheduled_at).getTime() > now - 3 * 3600_000 && r.status !== "completed" && r.status !== "cancelled");
  const past = rows.filter((r) => !upcoming.includes(r));

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow"><Shield size={12} style={{ verticalAlign: "-1px", marginRight: 4 }} /> Safe Meetup Check-in</div>
        <h1 className="page-title">Meetups</h1>
        <p className="page-sub">
          Every meetup runs through a quiet check-in cycle. We don&apos;t bother anyone unless you don&apos;t tap &ldquo;I&apos;m good&rdquo; within two hours.
        </p>
      </div>

      {upcoming.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <h2 className="wings-h">Upcoming</h2>
          <div className="meetup-list">
            {upcoming.map((r) => <MeetupRow key={r.id} row={r} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="wings-h">Past</h2>
          <div className="meetup-list">
            {past.map((r) => <MeetupRow key={r.id} row={r} muted />)}
          </div>
        </section>
      )}

      {rows.length === 0 && (
        <div className="empty-card">
          <div className="empty-emoji"><Calendar size={32} /></div>
          <div className="empty-title">No meetups yet</div>
          <p>Schedule one from a thread once you&apos;ve winged up.</p>
        </div>
      )}
    </>
  );
}

function MeetupRow({ row, muted }: { row: Row; muted?: boolean }) {
  const when = new Date(row.scheduled_at).toLocaleString(undefined, {
    weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  });
  return (
    <Link href={`/meetups/${row.id}`} className={`meetup-row ${muted ? "is-past" : ""}`}>
      <div className="meetup-when">{when}</div>
      <div className="meetup-mid">
        <strong>{row.other_name}</strong>
        <span>{row.location_label}</span>
      </div>
      <span className={`meetup-status status-${row.status}`}>{row.status.replace("_", " ")}</span>
    </Link>
  );
}
