import { Plane, MapPin } from "@/lib/icons";
import { isDemoMode } from "@/lib/demo";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/session";
import TripForm from "@/components/travel/TripForm";
import DeleteTripButton from "@/components/travel/DeleteTripButton";

export const metadata = { title: "Travel · Wing" };

type TripRow = {
  id: string;
  city: string;
  country: string | null;
  start_date: string;
  end_date: string;
  note: string | null;
  user_id: string;
  user_name: string;
};

export default async function TravelPage() {
  const session = await getSession();
  if (!session) return null;

  const today = new Date().toISOString().slice(0, 10);
  let rows: TripRow[] = [];

  if (isDemoMode()) {
    rows = [
      { id: "t1", city: "Lisbon", country: "Portugal", start_date: addDays(7), end_date: addDays(12), note: "Surf at Costa da Caparica. Open to night plans too.", user_id: "u6", user_name: "Lena F." },
      { id: "t2", city: "Mexico City", country: "Mexico", start_date: addDays(14), end_date: addDays(21), note: "Food tour week. Hosting if anyone's around.", user_id: "u8", user_name: "Sofia M." },
      { id: "t3", city: "Honolulu", country: "USA", start_date: addDays(3), end_date: addDays(10), note: "North Shore most mornings.", user_id: "u2", user_name: "Marcus K." },
      { id: "demo-mine", city: "Tokyo", country: "Japan", start_date: addDays(30), end_date: addDays(38), note: "First time. Looking for anyone who can show me ramen + jazz spots.", user_id: session.user.id, user_name: session.user.name },
    ];
  } else {
    const supabase = await createClient();
    const { data: trips } = await supabase
      .from("trips")
      .select("id, city, country, start_date, end_date, note, user_id")
      .gte("end_date", today)
      .order("start_date", { ascending: true })
      .limit(60);
    const ids = Array.from(new Set((trips ?? []).map((t) => t.user_id)));
    const names = new Map<string, string>();
    if (ids.length) {
      const { data: ps } = await supabase.from("profiles").select("id, name").in("id", ids);
      (ps ?? []).forEach((p) => names.set(p.id, p.name));
    }
    rows = (trips ?? []).map((t) => ({
      id: t.id, city: t.city, country: t.country, start_date: t.start_date,
      end_date: t.end_date, note: t.note, user_id: t.user_id,
      user_name: names.get(t.user_id) ?? "Wing",
    }));
  }

  const mine = rows.filter((r) => r.user_id === session.user.id);
  const others = rows.filter((r) => r.user_id !== session.user.id);

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow"><Plane size={12} style={{ verticalAlign: "-1px", marginRight: 4 }} /> Pre-trip planning</div>
        <h1 className="page-title">Travel</h1>
        <p className="page-sub">
          Tell Wing where you&apos;re going. Get matched with locals and other visitors before you even land —
          the lane every other social app left empty.
        </p>
      </div>

      <section className="travel-block">
        <h2 className="wings-h">Post a trip</h2>
        <TripForm />
      </section>

      {mine.length > 0 && (
        <section className="travel-block">
          <h2 className="wings-h">Your trips</h2>
          <div className="trip-grid">
            {mine.map((t) => <TripCard key={t.id} t={t} mine />)}
          </div>
        </section>
      )}

      <section className="travel-block">
        <h2 className="wings-h">Wings on the move</h2>
        {others.length === 0 ? (
          <div className="empty-card">
            <div className="empty-emoji"><MapPin size={32} /></div>
            <div className="empty-title">Nobody&apos;s shared a trip yet</div>
            <p>Post yours above and Wings traveling at the same time will surface here.</p>
          </div>
        ) : (
          <div className="trip-grid">
            {others.map((t) => <TripCard key={t.id} t={t} />)}
          </div>
        )}
      </section>
    </>
  );
}

function TripCard({ t, mine }: { t: TripRow; mine?: boolean }) {
  const start = new Date(t.start_date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const end = new Date(t.end_date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const startsIn = Math.max(0, Math.ceil((new Date(t.start_date + "T00:00:00").getTime() - Date.now()) / 86400_000));
  return (
    <div className="trip-card">
      <div className="trip-where">
        <MapPin size={14} />
        <strong>{t.city}</strong>
        {t.country && <span className="trip-country">, {t.country}</span>}
      </div>
      <div className="trip-when">
        {start} – {end} · {startsIn === 0 ? "now" : startsIn === 1 ? "tomorrow" : `in ${startsIn} days`}
      </div>
      {!mine && <div className="trip-who">{t.user_name}</div>}
      {t.note && <p className="trip-note">{t.note}</p>}
      <div className="trip-foot">
        {mine ? (
          <DeleteTripButton id={t.id} />
        ) : (
          <a href={`/messages/${t.user_id}`} className="btn btn-ghost">Message</a>
        )}
      </div>
    </div>
  );
}

function addDays(d: number): string {
  const date = new Date(Date.now() + d * 86400_000);
  return date.toISOString().slice(0, 10);
}
