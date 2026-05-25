import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="orb orb1" />
      <div className="orb orb2" />
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <Link href="/" className="nav-logo" style={{ justifyContent: "center", marginBottom: 32, display: "flex" }}>
            <div className="nav-mark">🪶</div>
            W<span>ing</span>
          </Link>
          {children}
        </div>
      </main>
    </>
  );
}
