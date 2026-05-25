import Link from "next/link";
import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export const metadata = { title: "Sign In · Wing" };

export default function SignInPage() {
  return (
    <div className="auth-card">
      <h1 className="auth-title">Welcome back, Wing</h1>
      <p className="auth-sub">Sign in to find your other wing.</p>
      <Suspense fallback={null}>
        <AuthForm mode="signin" />
      </Suspense>
      <p className="auth-foot">
        New here? <Link href="/signup">Create an account</Link>
      </p>
    </div>
  );
}
