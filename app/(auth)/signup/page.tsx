import Link from "next/link";
import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export const metadata = { title: "Sign Up · Wing" };

export default function SignUpPage() {
  return (
    <div className="auth-card">
      <h1 className="auth-title">Create your Wing</h1>
      <p className="auth-sub">For Wingmen & Wingwomen everywhere. No dating, just real connections.</p>
      <Suspense fallback={null}>
        <AuthForm mode="signup" />
      </Suspense>
      <p className="auth-foot">
        Already have an account? <Link href="/signin">Sign in</Link>
      </p>
    </div>
  );
}
