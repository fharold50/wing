"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Globe } from "@/lib/icons";
import { createClient, isClientDemoMode } from "@/lib/supabase/client";

export default function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/discover";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // Demo mode: no real auth. Just bounce to the requested page.
    if (isClientDemoMode()) {
      router.push(next);
      router.refresh();
      return;
    }

    setBusy(true);
    setErr(null);
    const supabase = createClient();
    if (!supabase) {
      setErr("Supabase not configured. See SETUP.md.");
      setBusy(false);
      return;
    }
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
          },
        });
        if (error) throw error;
        router.push("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(next);
      }
      router.refresh();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    if (isClientDemoMode()) {
      router.push(next);
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      setErr("Supabase not configured. See SETUP.md.");
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  }

  return (
    <form onSubmit={submit} className="auth-form">
      <button type="button" onClick={google} className="btn btn-ghost auth-google">
        <Globe size={16} /> Continue with Google
      </button>
      <div className="auth-divider"><span>or</span></div>
      {mode === "signup" && (
        <label className="auth-field">
          <span>Name</span>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="What should Wings call you?" />
        </label>
      )}
      <label className="auth-field">
        <span>Email</span>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </label>
      <label className="auth-field">
        <span>Password</span>
        <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
      </label>
      {err && <div className="auth-err">{err}</div>}
      {isClientDemoMode() && (
        <div className="auth-foot" style={{ marginTop: 0, textAlign: "left", fontSize: 12 }}>
          <strong>Demo mode</strong> — any email or password will bounce you straight into the app. See <code>SETUP.md</code> to wire up real Supabase auth.
        </div>
      )}
      <button type="submit" disabled={busy} className="btn btn-primary btn-lg auth-submit">
        {busy ? "..." : mode === "signup" ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}
