export default function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="stats-inner">
        <div className="fade-up">
          <div className="stat-num">2.4M+</div>
          <div className="stat-label">Wings Connected</div>
        </div>
        <div className="fade-up delay-1">
          <div className="stat-num">190+</div>
          <div className="stat-label">Countries</div>
        </div>
        <div className="fade-up delay-2">
          <div className="stat-num">50/50</div>
          <div className="stat-label">Men &amp; Women</div>
        </div>
        <div className="fade-up delay-3">
          <div className="stat-num">4.9★</div>
          <div className="stat-label">App Store Rating</div>
        </div>
      </div>
    </div>
  );
}
