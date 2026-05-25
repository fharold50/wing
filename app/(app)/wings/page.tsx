import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode, DEMO_CONNECTIONS, DEMO_WINGS, DEMO_USER } from "@/lib/demo";
import { getSession } from "@/lib/session";
import ConnectionActions from "@/components/app/ConnectionActions";

export const metadata = { title: "My Wings · Wing" };

type ConnRow = {
  id: string;
  status: "pending" | "connected" | "declined";
  createdAt: string;
  /** the "other" user (not me) */
  otherId: string;
  otherName: string;
  otherLocation: string;
  /** true if I'm the receiver of this Wing-Up (so I can accept/decline) */
  iAmReceiver: boolean;
};

function pickColor(id: string) {
  const cols = ["#ff6b1a", "#38bdf8", "#f472b6", "#22d3a0", "#a78bfa"];
  let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return cols[Math.abs(h) % cols.length];
}

function initials(s: string) {
  return s.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

export default async function WingsPage() {
  const session = await getSession();
  if (!session) return null;
  const meId = session.user.id;

  let rows: ConnRow[] = [];
  if (isDemoMode()) {
    rows = DEMO_CONNECTIONS.map((c) => {
      const otherId = c.userId === DEMO_USER.id ? c.wingId : c.userId;
      const other = DEMO_WINGS.find((w) => w.id === otherId);
      return {
        id: c.id, status: c.status, createdAt: c.createdAt,
        otherId, otherName: other?.name ?? otherId,
        otherLocation: other?.location ?? "",
        iAmReceiver: c.wingId === DEMO_USER.id,
      };
    });
  } else {
    const supabase = await createClient();
    const { data } = await supabase
      .from("wing_connections")
      .select("id, status, created_at, user_id, wing_id")
      .or(`user_id.eq.${meId},wing_id.eq.${meId}`)
      .order("created_at", { ascending: false });
    const ids = Array.from(new Set((data ?? []).flatMap((d) => [d.user_id, d.wing_id]).filter((x) => x !== meId)));
    const { data: ps } = ids.length
      ? await supabase.from("profiles").select("id, name, location").in("id", ids)
      : { data: [] as Array<{ id: string; name: string; location: string | null }> };
    const map = new Map((ps ?? []).map((p) => [p.id, p]));
    rows = (data ?? []).map((c) => {
      const otherId = c.user_id === meId ? c.wing_id : c.user_id;
      const other = map.get(otherId);
      return {
        id: c.id, status: c.status, createdAt: c.created_at,
        otherId, otherName: other?.name ?? otherId,
        otherLocation: other?.location ?? "",
        iAmReceiver: c.wing_id === meId,
      };
    });
  }

  const incoming = rows.filter((r) => r.status === "pending" && r.iAmReceiver);
  const sent = rows.filter((r) => r.status === "pending" && !r.iAmReceiver);
  const connected = rows.filter((r) => r.status === "connected");

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">Your network</div>
        <h1 className="page-title">My wings</h1>
        <p className="page-sub">Pending requests, sent invites, and your connected wings.</p>
      </div>

      {incoming.length > 0 && (
        <>
          <h3 className="wings-h">📥 Incoming Wing-Ups</h3>
          <div className="wing-grid" style={{ marginBottom: 32 }}>
            {incoming.map((r) => (
              <div key={r.id} className="wing-card">
                <div className="wing-card-head">
                  <div className="wing-avatar" style={{ background: pickColor(r.otherId), color: "#fff" }}>{initials(r.otherName)}</div>
                  <div>
                    <div className="wing-meta-name">{r.otherName}</div>
                    <div className="wing-meta-sub">{r.otherLocation} · {new Date(r.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <p className="wing-bio">Wants to wing up with you.</p>
                <ConnectionActions id={r.id} />
              </div>
            ))}
          </div>
        </>
      )}

      {connected.length > 0 && (
        <>
          <h3 className="wings-h">🪶 Connected</h3>
          <div className="wing-grid" style={{ marginBottom: 32 }}>
            {connected.map((r) => (
              <div key={r.id} className="wing-card">
                <div className="wing-card-head">
                  <div className="wing-avatar" style={{ background: pickColor(r.otherId), color: "#fff" }}>{initials(r.otherName)}</div>
                  <div>
                    <div className="wing-meta-name">{r.otherName}</div>
                    <div className="wing-meta-sub">{r.otherLocation}</div>
                  </div>
                </div>
                <div className="wing-foot">
                  <Link href={`/messages/${r.otherId}`} className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>💬 Message</Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {sent.length > 0 && (
        <>
          <h3 className="wings-h">📤 Sent</h3>
          <div className="wing-grid">
            {sent.map((r) => (
              <div key={r.id} className="wing-card">
                <div className="wing-card-head">
                  <div className="wing-avatar" style={{ background: pickColor(r.otherId), color: "#fff" }}>{initials(r.otherName)}</div>
                  <div>
                    <div className="wing-meta-name">{r.otherName}</div>
                    <div className="wing-meta-sub">Waiting for response</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {rows.length === 0 && (
        <div className="empty-card">
          <div className="empty-emoji">🤝</div>
          <div className="empty-title">No wings yet</div>
          <p>Head to Discover and send your first Wing-Up.</p>
        </div>
      )}
    </>
  );
}
