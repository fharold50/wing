"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, PaperPlaneTilt } from "@/lib/icons";
import { createClient, isClientDemoMode } from "@/lib/supabase/client";

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm";
const MAX_BYTES = 50 * 1024 * 1024;

type Props = {
  /** Current photos URLs */
  photos: string[];
  /** Current primary video URL or undefined */
  primaryVideo?: string;
  /** Maximum photos allowed (default 6) */
  maxPhotos?: number;
};

/**
 * Drag/drop or click to add photos and one optional video.
 * Files are uploaded straight to Supabase Storage under the user's own folder,
 * then the public URLs are written back to the `profiles.photos` array (or
 * `profiles.primary_video` for the single video slot).
 */
export default function MediaUploader({ photos: initial, primaryVideo: initialVideo, maxPhotos = 6 }: Props) {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>(initial);
  const [video, setVideo] = useState<string | undefined>(initialVideo);
  const [busy, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setErr(null);
    if (isClientDemoMode()) {
      setErr("Demo mode — uploads disabled. Configure Supabase to enable.");
      return;
    }
    const supabase = createClient();
    if (!supabase) { setErr("Supabase not configured."); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("Not signed in."); return; }

    const newPhotos: string[] = [...photos];
    let newVideo = video;

    for (const file of Array.from(files)) {
      if (file.size > MAX_BYTES) { setErr(`${file.name} is too large (max 50MB).`); continue; }

      const isVideo = file.type.startsWith("video/");
      if (!isVideo && newPhotos.length >= maxPhotos) { setErr(`Max ${maxPhotos} photos.`); continue; }

      const ext = file.name.split(".").pop()?.toLowerCase() ?? (isVideo ? "mp4" : "jpg");
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
        contentType: file.type, upsert: false,
      });
      if (upErr) { setErr(upErr.message); continue; }

      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
      if (isVideo) newVideo = publicUrl;
      else newPhotos.push(publicUrl);
    }

    // Persist back to profiles
    const { error: updErr } = await supabase
      .from("profiles")
      .update({ photos: newPhotos, primary_video: newVideo ?? null })
      .eq("id", user.id);
    if (updErr) { setErr(updErr.message); return; }

    setPhotos(newPhotos);
    setVideo(newVideo);
    router.refresh();
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;
    const files = e.target.files;
    startTransition(() => handleFiles(files));
  }

  async function remove(url: string, kind: "photo" | "video") {
    setErr(null);
    if (isClientDemoMode()) return;
    const supabase = createClient();
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Extract the storage path from the public URL.
    const pathMatch = url.match(/\/media\/(.+)$/);
    if (pathMatch) {
      await supabase.storage.from("media").remove([pathMatch[1]]);
    }

    const nextPhotos = kind === "photo" ? photos.filter((p) => p !== url) : photos;
    const nextVideo = kind === "video" ? undefined : video;
    await supabase.from("profiles").update({
      photos: nextPhotos,
      primary_video: nextVideo ?? null,
    }).eq("id", user.id);

    setPhotos(nextPhotos);
    setVideo(nextVideo);
    router.refresh();
  }

  return (
    <div className="media-uploader">
      <div className="media-grid">
        {photos.map((url, i) => (
          <div key={url} className="media-tile">
            <img src={url} alt={`photo ${i + 1}`} />
            {i === 0 && <span className="media-badge">Primary</span>}
            <button type="button" className="media-remove" onClick={() => remove(url, "photo")} aria-label="Remove"><X size={14} /></button>
          </div>
        ))}
        {video && (
          <div className="media-tile">
            <video src={video} muted playsInline />
            <span className="media-badge" style={{ background: "var(--forest)", color: "#fff", display: "inline-flex", alignItems: "center", gap: 4 }}><PaperPlaneTilt size={11} /> Video</span>
            <button type="button" className="media-remove" onClick={() => remove(video, "video")} aria-label="Remove"><X size={14} /></button>
          </div>
        )}
        {photos.length < maxPhotos && (
          <button type="button" className="media-add" onClick={() => inputRef.current?.click()} disabled={busy}>
            <Plus size={26} />
            <span style={{ fontSize: 11, color: "var(--muted)" }}>
              {busy ? "Uploading…" : "Add photo or video"}
            </span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={onPick}
        style={{ display: "none" }}
      />
      {err && <div className="auth-err" style={{ marginTop: 8 }}>{err}</div>}
      <p className="media-hint">
        Up to {maxPhotos} photos + 1 video. JPG, PNG, WebP, GIF, MP4, MOV, WebM. Max 50MB each.
      </p>
    </div>
  );
}
