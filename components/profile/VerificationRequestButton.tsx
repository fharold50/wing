"use client";

import { useState, useTransition } from "react";
import { BadgeCheck } from "@/lib/icons";
import { requestPhotoVerification } from "@/app/actions";

type Status = "none" | "pending" | "verified" | "rejected";

export default function VerificationRequestButton({ status }: { status: Status }) {
  const [pending, startTransition] = useTransition();
  const [local, setLocal] = useState<Status>(status);

  if (local === "verified") {
    return (
      <div className="verify-state verified">
        <BadgeCheck size={18} /> Verified
      </div>
    );
  }

  if (local === "pending") {
    return (
      <div className="verify-state pending">
        <BadgeCheck size={18} /> Under review — usually within 24 hours
      </div>
    );
  }

  function request() {
    startTransition(async () => {
      const res = await requestPhotoVerification();
      if (res.ok) setLocal("pending");
    });
  }

  return (
    <div>
      <p className="verify-blurb">
        Upload a clear selfie matching your profile photo. Approved Wings rank higher on Discover
        and unlock the verified-only filter that the most safety-conscious Wings use.
      </p>
      <button className="btn btn-primary" onClick={request} disabled={pending}>
        <BadgeCheck size={16} /> {pending ? "Submitting…" : "Request verification"}
      </button>
      {local === "rejected" && (
        <p className="verify-rejected">
          The last submission didn&apos;t match. Try a clearer, well-lit selfie — no filters.
        </p>
      )}
    </div>
  );
}
