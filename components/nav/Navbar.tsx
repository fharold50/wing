import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="nav">
      <Link className="nav-logo" href="/">
        <div className="nav-mark">
          <Image src="/wing-logo.png" alt="Wing" width={32} height={32} priority />
        </div>
        Wing
      </Link>
      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#how">How It Works</a></li>
        <li><a href="#safety">Safety</a></li>
        <li><a href="#activities">Activities</a></li>
      </ul>
      <div className="nav-cta">
        <Link href="/signin" className="btn btn-ghost">Sign in</Link>
        <Link href="/onboarding" className="btn btn-primary">Get started</Link>
      </div>
    </nav>
  );
}
