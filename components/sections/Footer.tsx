import Image from "next/image";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-logo">
            <div className="nav-mark">
              <Image src="/wing-logo.png" alt="Wing" width={30} height={30} />
            </div>
            Wing
          </div>
          <p className="footer-desc">
            The social companion app for Wingmen and Wingwomen everywhere. Real friendships, real adventures, zero dating. Find your other wing.
          </p>
          <p className="footer-tagline">&ldquo;Find your other wing.&rdquo;</p>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><a href="#how">How it works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#activities">Activity types</a></li>
            <li><a href="#safety">Local guides</a></li>
            <li><a href="/safety">Safety center</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Wing</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Community Rules</a></li>
            <li><a href="#">Safety Guidelines</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Wing. All rights reserved.</span>
        <span>Built for Wingmen and Wingwomen equally.</span>
      </div>
    </footer>
  );
}
