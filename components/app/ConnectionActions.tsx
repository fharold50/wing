"use client";

import { useState, useTransition } from "react";
import { respondConnection } from "@/app/actions";

export default function ConnectionActions({ id }: { id: string }) {
  const [resolved, setResolved] = useState<null | "connected" | "declined">(null);
  const [pending, startTransition] = useTransition();

  function go(status: "connected" | "declined") {
    startTransition(async () => {
      const res = await respondConnection(id, status);
      if (res.ok) setResolved(status);
    });
  }

  if (resolved === "connected") {
    return <div className="wing-foot" style={{ color: "var(--green)", fontSize: 13, fontWeight: 600 }}>✓ Connected</div>;
  }
  if (resolved === "declined") {
    return <div className="wing-foot" style={{ color: "var(--muted)", fontSize: 13 }}>Declined</div>;
  }

  return (
    <div className="wing-foot">
      <button className="btn btn-ghost" onClick={() => go("declined")} disabled={pending}>Decline</button>
      <button className="btn btn-primary" onClick={() => go("connected")} disabled={pending}>🪶 Accept</button>
    </div>
  );
}
