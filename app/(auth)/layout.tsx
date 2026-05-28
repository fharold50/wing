import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px", position: "relative", zIndex: 1 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <Link href="/" className="nav-logo" style={{ justifyContent: "center", marginBottom: 32, display: "flex" }}>
          <div className="nav-mark">
            <Image src="/wing-logo.png" alt="Wing" width={32} height={32} priority />
          </div>
          Wing
        </Link>
        {children}
      </div>
    </main>
  );
}
