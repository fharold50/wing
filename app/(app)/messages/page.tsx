import Link from "next/link";
import { MessageCircle } from "@/lib/icons";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode, DEMO_WINGS, DEMO_THREADS, DEMO_USER } from "@/lib/demo";

export const metadata = { title: "Messages · Wing" };

type Convo = {
  wingId: string;
  wingName: string;
  preview: string;
  when: string;
  unread?: boolean;
};

function initials(s: string) {
  return s.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function pickColor(id: string) {
  const cols = ["#c1262d", "#4a6147", "#7a5b3f", "#3a4d8a", "#6b3e5f"];
  let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return cols[Math.abs(h) % cols.length];
}

export default async function MessagesPage() {
  let convos: Convo[] = [];

  if (isDemoMode()) {
    convos = Object.entries(DEMO_THREADS).map(([wingId, msgs]) => {
      const wing = DEMO_WINGS.find((w) => w.id === wingId);
      const last = msgs[msgs.length - 1];
      return {
        wingId,
        wingName: wing?.name ?? wingId,
        preview: last.content,
        when: last.createdAt,
        unread: last.senderId !== DEMO_USER.id,
      };
    });
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("messages")
      .select("id, content, created_at, sender_id, receiver_id, read")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(200);
    const byWing = new Map<string, Convo>();
    for (const m of data ?? []) {
      const wingId = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      if (!byWing.has(wingId)) {
        byWing.set(wingId, {
          wingId, wingName: wingId.slice(0, 6),
          preview: m.content, when: m.created_at,
          unread: !m.read && m.receiver_id === user.id,
        });
      }
    }
    convos = Array.from(byWing.values());
    // Fill names
    const ids = convos.map((c) => c.wingId);
    if (ids.length) {
      const { data: ps } = await supabase.from("profiles").select("id, name").in("id", ids);
      const map = new Map((ps ?? []).map((p) => [p.id, p.name]));
      convos.forEach((c) => { c.wingName = map.get(c.wingId) ?? c.wingId; });
    }
  }

  return (
    <>
      <div className="page-head">
        <div className="page-eyebrow">In-app</div>
        <h1 className="page-title">Messages</h1>
        <p className="page-sub">Realtime threads with your wings. Every message runs through the Anti-Hookup AI Shield before delivery.</p>
      </div>

      {convos.length === 0 ? (
        <div className="empty-card">
          <div className="empty-emoji"><MessageCircle size={32} /></div>
          <div className="empty-title">No conversations yet</div>
          <p>Send a Wing-Up from Discover and start a thread.</p>
        </div>
      ) : (
        <div className="convo-list">
          {convos.map((c) => (
            <Link key={c.wingId} href={`/messages/${c.wingId}`} className="convo-item">
              <div className="wing-avatar" style={{ background: pickColor(c.wingId), color: "#fff", width: 44, height: 44, fontSize: 14 }}>
                {initials(c.wingName)}
              </div>
              <div className="convo-body">
                <div className="convo-row">
                  <strong>{c.wingName}</strong>
                  <span className="convo-when">{new Date(c.when).toLocaleString(undefined, { hour: "numeric", minute: "2-digit" })}</span>
                </div>
                <div className="convo-preview">{c.preview}</div>
              </div>
              {c.unread && <span className="convo-dot" />}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
