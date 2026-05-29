"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Play, X } from "@/lib/icons";
import { createClient, isClientDemoMode } from "@/lib/supabase/client";
import { setVoiceNote } from "@/app/actions";

const MAX_SECONDS = 30;

type Props = {
  initialUrl?: string;
};

/**
 * 30-second voice note. The point isn't sound quality — it's that catfish
 * can't fake a voice, and a Wing's vibe lives in tone, not in a written bio.
 */
export default function VoiceNoteRecorder({ initialUrl }: Props) {
  const [url, setUrl] = useState<string | undefined>(initialUrl);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (tickRef.current) clearInterval(tickRef.current);
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
  }, []);

  async function startRecording() {
    setErr(null);
    if (isClientDemoMode()) { setErr("Demo mode — recording disabled. Wire Supabase to enable."); return; }
    if (typeof MediaRecorder === "undefined") { setErr("Recording isn't supported in this browser."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: pickMime() });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        void uploadBlob(blob);
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
      setElapsed(0);
      tickRef.current = setInterval(() => {
        setElapsed((e) => {
          const next = e + 1;
          if (next >= MAX_SECONDS) stopRecording();
          return next;
        });
      }, 1000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Mic access denied");
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    setRecording(false);
  }

  async function uploadBlob(blob: Blob) {
    setBusy(true);
    setErr(null);
    try {
      const supabase = createClient();
      if (!supabase) { setErr("Supabase not configured"); return; }
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setErr("Not signed in"); return; }

      const ext = blob.type.includes("webm") ? "webm" : blob.type.includes("ogg") ? "ogg" : "mp4";
      const path = `${user.id}/voice-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("media").upload(path, blob, {
        contentType: blob.type, upsert: true,
      });
      if (upErr) { setErr(upErr.message); return; }
      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
      const res = await setVoiceNote(publicUrl);
      if (!res.ok) { setErr(res.error ?? "Couldn't save URL"); return; }
      setUrl(publicUrl);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    const res = await setVoiceNote(null);
    setBusy(false);
    if (res.ok) setUrl(undefined);
    else setErr(res.error ?? "Couldn't remove");
  }

  return (
    <div className="voice-recorder">
      {url ? (
        <div className="voice-current">
          <audio src={url} controls preload="metadata" />
          <button className="btn btn-ghost" onClick={remove} disabled={busy} aria-label="Remove voice note">
            <X size={14} /> Remove
          </button>
        </div>
      ) : recording ? (
        <button className="btn btn-primary voice-stop" onClick={stopRecording}>
          <span className="voice-dot" /> Recording · {MAX_SECONDS - elapsed}s left — tap to stop
        </button>
      ) : (
        <button className="btn btn-primary" onClick={startRecording} disabled={busy}>
          <Mic size={16} /> {busy ? "Saving…" : "Record a 30s voice note"}
        </button>
      )}
      {err && <div className="auth-err" style={{ marginTop: 8 }}>{err}</div>}
      <p className="voice-hint">
        Say hi, name a place you love, or pitch your idea of a perfect Saturday.
        Real voice = real person = more Wings tap your card.
      </p>
    </div>
  );
}

function pickMime(): string {
  if (typeof MediaRecorder === "undefined") return "audio/webm";
  const tries = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
  for (const m of tries) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return "audio/webm";
}
