"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SignOutButton from "@/components/auth/SignOutButton";

const LINKS = [
  { href: "/discover", icon: "🪶", label: "Discover" },
  { href: "/map", icon: "🗺️", label: "Nearby" },
  { href: "/activities", icon: "📅", label: "Activities" },
  { href: "/wings", icon: "🤝", label: "My Wings" },
  { href: "/messages", icon: "💬", label: "Messages" },
  { href: "/profile", icon: "👤", label: "Profile" },
  { href: "/safety", icon: "🛡️", label: "Safety" },
];

export default function Sidebar({ name, isDemo }: { name?: string; isDemo?: boolean }) {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/" className="nav-logo" style={{ marginBottom: 32 }}>
        <div className="nav-mark">🪶</div>
        W<span>ing</span>
      </Link>
      <nav className="side-nav">
        {LINKS.map((l) => {
          const active = pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link key={l.href} href={l.href} className={`side-link ${active ? "active" : ""}`}>
              <span className="side-ico">{l.icon}</span>
              <span>{l.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="sidebar-foot">
        {name && <div className="sidebar-name">Signed in as <strong>{name}</strong></div>}
        {!isDemo && <SignOutButton />}
      </div>
    </aside>
  );
}
