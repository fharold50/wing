"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Compass, Map, Calendar, Users, MessageCircle, User, Shield } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import SignOutButton from "@/components/auth/SignOutButton";

type LinkDef = { href: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; label: string };

const LINKS: LinkDef[] = [
  { href: "/discover", Icon: Compass, label: "Discover" },
  { href: "/map", Icon: Map, label: "Nearby" },
  { href: "/activities", Icon: Calendar, label: "Activities" },
  { href: "/wings", Icon: Users, label: "My Wings" },
  { href: "/messages", Icon: MessageCircle, label: "Messages" },
  { href: "/profile", Icon: User, label: "Profile" },
  { href: "/safety", Icon: Shield, label: "Safety" },
];

export default function Sidebar({ name, isDemo }: { name?: string; isDemo?: boolean }) {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/" className="nav-logo" style={{ marginBottom: 32 }}>
        <div className="nav-mark">
          <Image src="/wing-logo.png" alt="Wing" width={32} height={32} priority />
        </div>
        Wing
      </Link>
      <nav className="side-nav">
        {LINKS.map((l) => {
          const active = pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link key={l.href} href={l.href} className={`side-link ${active ? "active" : ""}`}>
              <l.Icon />
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
