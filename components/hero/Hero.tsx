import { Waves, Mountain, Wine, Music, Camera, Fish, Apple, Play, Globe } from "@/lib/icons";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-inner">
        <div className="hero-badge fade-up">
          <div className="hero-badge-dot" />
          For Wingmen &amp; Wingwomen everywhere
        </div>
        <h1 className="hero-title fade-up delay-1">
          Find your<br />
          <span className="gradient-text">other wing.</span>
        </h1>
        <p className="hero-slogan fade-up delay-2">
          Whether you&apos;re a <em>wingman</em> or a <em>wingwoman</em> — your adventure partner is already out there.
        </p>
        <p className="hero-sub fade-up delay-3">
          Wing connects solo travelers, locals, and explorers with people who share the same interests, the same vibe, and the same destination — for real friendships and real adventures. No strings attached.
        </p>
        <div className="hero-pills fade-up delay-4">
          <span className="hero-pill"><Waves /> Surf together</span>
          <span className="hero-pill"><Mountain /> Hike together</span>
          <span className="hero-pill"><Fish /> Fish together</span>
          <span className="hero-pill"><Wine /> Bar-hop together</span>
          <span className="hero-pill"><Music /> Hit shows together</span>
          <span className="hero-pill"><Camera /> Explore together</span>
        </div>
        <div className="hero-buttons fade-up delay-5">
          <a href="/onboarding" className="btn btn-primary btn-lg">Find my Wing</a>
          <a href="#how" className="btn btn-outline">See how it works</a>
        </div>
        <div className="hero-stores fade-up delay-5" style={{ transitionDelay: "0.6s" }}>
          <div className="store-badge">
            <Apple />
            <div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 1 }}>Download on the</div>
              <strong>App Store</strong>
            </div>
          </div>
          <div className="store-badge">
            <Play />
            <div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 1 }}>Get it on</div>
              <strong>Google Play</strong>
            </div>
          </div>
          <div className="store-badge">
            <Globe />
            <div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 1 }}>Launch on</div>
              <strong>Web App</strong>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}
