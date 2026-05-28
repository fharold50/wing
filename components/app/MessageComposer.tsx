"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { sendMessage } from "@/app/actions";

export default function MessageComposer({ receiverId }: { receiverId: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function send() {
    if (!text.trim()) return;
    setErr(null);
    const draft = text;
    startTransition(async () => {
      const res = await sendMessage(receiverId, draft);
      if (res.ok) {
        setText("");
        router.refresh();
      } else {
        setErr(res.error ?? "Blocked");
      }
    });
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="composer">
      {err && <div className="auth-err" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><Shield size={14} /> {err}</div>}
      <div className="composer-row">
        <textarea
          className="onb-textarea composer-input"
          rows={1}
          placeholder="Message — plans, vibes, logistics. No dating talk."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
        />
        <button className="btn btn-primary" onClick={send} disabled={pending || !text.trim()}>
          {pending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}
