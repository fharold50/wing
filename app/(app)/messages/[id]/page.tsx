import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode, DEMO_WINGS, DEMO_THREADS, DEMO_USER } from "@/lib/demo";
import { getSession } from "@/lib/session";
import MessageComposer from "@/components/app/MessageComposer";

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return null;

  let wingName = "Wing";
  let messages: Array<{ id: string; senderId: string; content: string; createdAt: string }> = [];

  if (isDemoMode()) {
    const w = DEMO_WINGS.find((x) => x.id === id);
    if (!w) return notFound();
    wingName = w.name;
    messages = (DEMO_THREADS[id] ?? []).map((m) => ({ ...m }));
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: wing } = await supabase.from("profiles").select("name").eq("id", id).maybeSingle();
    if (!wing) return notFound();
    wingName = wing.name;
    const { data: msgs } = await supabase
      .from("messages")
      .select("id, sender_id, content, created_at")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${id}),and(sender_id.eq.${id},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true })
      .limit(200);
    messages = (msgs ?? []).map((m) => ({
      id: m.id, senderId: m.sender_id, content: m.content, createdAt: m.created_at,
    }));
  }

  const meId = isDemoMode() ? DEMO_USER.id : session.user.id;

  return (
    <div className="thread-wrap">
      <div className="thread-head">
        <Link href="/messages" className="btn btn-ghost" style={{ padding: "8px 14px" }}>← Back</Link>
        <div>
          <h1 className="thread-title">{wingName}</h1>
          <div className="thread-sub">🛡️ Moderated thread · no dating, just wings</div>
        </div>
      </div>

      <div className="thread-msgs">
        {messages.length === 0 && (
          <div className="empty-card" style={{ padding: 28 }}>
            <div className="empty-emoji">🪶</div>
            <div className="empty-title">Say hi</div>
            <p>Threads are end-to-end moderated. Stick to plans and vibes.</p>
          </div>
        )}
        {messages.map((m) => {
          const mine = m.senderId === meId;
          return (
            <div key={m.id} className={`msg ${mine ? "me" : "them"}`}>
              <div className="msg-bubble">{m.content}</div>
              <div className="msg-when">{new Date(m.createdAt).toLocaleString(undefined, { hour: "numeric", minute: "2-digit" })}</div>
            </div>
          );
        })}
      </div>

      <MessageComposer receiverId={id} />
    </div>
  );
}
