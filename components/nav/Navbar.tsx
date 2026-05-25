import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="nav">
      <Link className="nav-logo" href="/">
        <div className="nav-mark">🪶</div>
        W<span>ing</span>
      </Link>
      <ul className="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#how">How It Works</a></li>
        <li><a href="#safety">Safety</a></li>
        <li><a href="#activities">Activities</a></li>
      </ul>
      <div className="nav-cta">
        <Link href="/signin" className="btn btn-ghost">Sign In</Link>
        <Link href="/onboarding" className="btn btn-primary">Get Wing Free</Link>
      </div>
    </nav>
  );
}
