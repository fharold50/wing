import { redirect } from "next/navigation";
import Sidebar from "@/components/app/Sidebar";
import { getSession } from "@/lib/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/signin");

  return (
    <div className="app-shell">
      <div className="orb orb1" />
      <div className="orb orb2" />
      <Sidebar name={session.user.name} isDemo={session.isDemo} />
      <main className="app-main">
        {session.isDemo && (
          <div className="demo-banner">
            <strong>🎭 Demo mode</strong> — you&apos;re browsing with sample data. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and unset <code>NEXT_PUBLIC_DEMO</code> to switch to live.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
