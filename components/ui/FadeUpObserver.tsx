"use client";

import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that reveals .fade-up elements as they
 * scroll into view, plus a scroll listener that toggles .scrolled on the navbar
 * and animates the stat counters once.
 */
export default function FadeUpObserver() {
  useEffect(() => {
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );
    document.querySelectorAll(".fade-up").forEach((el) => fadeObserver.observe(el));

    const onScroll = () => {
      const nav = document.querySelector(".nav");
      if (!nav) return;
      nav.classList.toggle("scrolled", window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Animated stat counters
    const stats = Array.from(document.querySelectorAll<HTMLElement>(".stat-num"));
    const targets = [
      { target: 2.4, suffix: "M+", decimals: 1 },
      { target: 190, suffix: "+", decimals: 0 },
      null,
      { target: 4.9, suffix: "", decimals: 1 },
    ];
    const statsBar = document.querySelector(".stats-bar");
    let started = false;
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || started) return;
          started = true;
          stats.forEach((el, i) => {
            const cfg = targets[i];
            if (!cfg) return;
            const startTime = performance.now();
            const duration = 1500;
            const animate = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = (cfg.target * eased).toFixed(cfg.decimals) + cfg.suffix;
              if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          });
        });
      },
      { threshold: 0.5 },
    );
    if (statsBar) statsObserver.observe(statsBar);

    return () => {
      fadeObserver.disconnect();
      statsObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
