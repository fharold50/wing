import { Calendar } from "@/lib/icons";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode, DEMO_PLANS } from "@/lib/demo";
import PlanForm from "@/components/app/PlanForm";
import { ActivityIcon } from "@/lib/activity-icons";

export const metadata = { title: "Activities · Wing" };

export default async function ActivitiesPage() {
  let plans: Array<{
    id: string; title: string; description: string | null; city: string | null;
    location: string | null; datetime: string; activity_type: string;
    current_participants: number; max_participants: number;
    host_name?: string;
  }> = [];

  if (isDemoMode()) {
    plans = DEMO_PLANS.map((p) => ({
      id: p.id, title: p.title, description: p.description,
      city: p.city, location: p.location, datetime: p.datetime,
      activity_type: p.activityType,
      current_participants: p.currentParticipants,
      max_participants: p.maxParticipants,
      host_name: p.host?.name,
    }));
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("activity_plans")
      .select("id, title, description, city, location, datetime, activity_type, current_participants, max_participants, profiles(name)")
      .eq("is_open", true)
      .gte("datetime", new Date().toISOString())
      .order("datetime", { ascending: true })
      .limit(30);
    plans = (data ?? []).map((p) => ({
      id: p.id, title: p.title, description: p.description,
      city: p.city, location: p.location, datetime: p.datetime,
      activity_type: p.activity_type,
      current_participants: p.current_participants,
      max_participants: p.max_participants,
      host_name: (p as { profiles?: { name?: string } }).profiles?.name,
    }));
  }

  return (
    <>
      <div className="page-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div className="page-eyebrow">Plans</div>
          <h1 className="page-title">Activity plans</h1>
          <p className="page-sub">Post a plan, join one, or browse what&apos;s happening nearby.</p>
        </div>
        <PlanForm />
      </div>

      {plans.length === 0 ? (
        <div className="empty-card">
          <div className="empty-emoji"><Calendar size={32} /></div>
          <div className="empty-title">No active plans yet</div>
          <p>Be the first to post — surf at six, jazz bar at nine, hike Saturday. Wings will join.</p>
        </div>
      ) : (
        <div className="wing-grid">
          {plans.map((p) => (
            <div key={p.id} className="wing-card">
              <div className="wing-card-head">
                <div className="plan-emoji"><ActivityIcon type={p.activity_type} size={22} /></div>
                <div>
                  <div className="wing-meta-name">{p.title}</div>
                  <div className="wing-meta-sub">
                    {new Date(p.datetime).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    {" · "}{p.city ?? p.location ?? ""}
                  </div>
                </div>
              </div>
              {p.description && <p className="wing-bio">{p.description}</p>}
              <div className="wing-tags">
                <span className="wing-pill">{p.current_participants}/{p.max_participants} wings</span>
                {p.host_name && <span className="wing-pill">Host: {p.host_name}</span>}
              </div>
              <div className="wing-foot">
                <button className="btn btn-primary">Join</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
