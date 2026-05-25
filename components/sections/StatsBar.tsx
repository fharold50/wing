import { Star } from "lucide-react";

export default function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="stats-inner">
        <div className="fade-up">
          <div className="stat-num">2.4M+</div>
          <div className="stat-label">Wings connected</div>
        </div>
        <div className="fade-up delay-1">
          <div className="stat-num">190+</div>
          <div className="stat-label">Countries</div>
        </div>
        <div className="fade-up delay-2">
          <div className="stat-num">50 / 50</div>
          <div className="stat-label">Men and women</div>
        </div>
        <div className="fade-up delay-3">
          <div className="stat-num" style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            4.9 <Star size={28} fill="currentColor" strokeWidth={0} style={{ color: "var(--accent)" }} />
          </div>
          <div className="stat-label">App Store rating</div>
        </div>
      </div>
    </div>
  );
}
