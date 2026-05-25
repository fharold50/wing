"use client";

import { useRouter } from "next/navigation";
import { createClient, isClientDemoMode } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    if (isClientDemoMode()) {
      router.push("/");
      router.refresh();
      return;
    }
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <button onClick={signOut} className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }}>
      Sign out
    </button>
  );
}
