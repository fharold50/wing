"use client";

import { useTransition } from "react";
import { X } from "@/lib/icons";
import { deleteTrip } from "@/app/actions";

export default function DeleteTripButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button className="btn btn-ghost" onClick={() => startTransition(() => deleteTrip(id).then(() => {}))} disabled={pending}>
      <X size={14} /> {pending ? "Removing…" : "Remove"}
    </button>
  );
}
