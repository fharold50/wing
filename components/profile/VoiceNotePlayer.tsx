"use client";

import { useRef, useState } from "react";
import { Mic } from "@/lib/icons";

/** Compact "tap to hear" pill. Used on Discover cards. */
export default function VoiceNotePlayer({ url }: { url: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const el = ref.current;
    if (!el) return;
    if (playing) { el.pause(); el.currentTime = 0; setPlaying(false); }
    else { el.play().then(() => setPlaying(true)).catch(() => {}); }
  }

  return (
    <button className={`voice-pill ${playing ? "playing" : ""}`} onClick={toggle} aria-label="Play voice note">
      <Mic size={12} />
      <span>{playing ? "Playing…" : "Hear them"}</span>
      <audio ref={ref} src={url} onEnded={() => setPlaying(false)} preload="none" />
    </button>
  );
}
