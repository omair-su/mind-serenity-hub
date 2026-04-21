// Avatar uploader: file picker + camera capture, client-side resize to 512x512,
// uploads to the public `avatars` bucket under the user's own folder, and
// returns the public URL via onUploaded.
import { useRef, useState } from "react";
import { Camera, Loader2, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  userId: string;
  currentUrl?: string | null;
  fallbackEmoji?: string;
  onUploaded: (publicUrl: string | null) => void;
}

async function resizeToSquare(file: File, size = 512): Promise<Blob> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  // Cover-fit crop
  const scale = Math.max(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(b => (b ? resolve(b) : reject(new Error("Failed to encode image"))), "image/jpeg", 0.9);
  });
}

export default function AvatarUploader({ userId, currentUrl, fallbackEmoji = "🧘", onUploaded }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB");
      return;
    }
    setUploading(true);
    try {
      const blob = await resizeToSquare(file, 512);
      const path = `${userId}/avatar-${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, blob, { contentType: "image/jpeg", upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      onUploaded(data.publicUrl);
      toast.success("Photo updated");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Couldn't upload photo");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      if (cameraRef.current) cameraRef.current.value = "";
    }
  };

  const removePhoto = async () => {
    if (!currentUrl) return;
    onUploaded(null);
    toast.success("Photo removed");
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/15 to-sage/20 ring-2 ring-border flex items-center justify-center text-3xl flex-shrink-0">
        {currentUrl ? (
          <img src={currentUrl} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span>{fallbackEmoji}</span>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-xs font-body font-medium text-foreground transition-all disabled:opacity-60"
          >
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-xs font-body font-medium text-foreground transition-all disabled:opacity-60"
          >
            <Camera className="w-3.5 h-3.5" /> Camera
          </button>
          {currentUrl && (
            <button
              type="button"
              onClick={removePhoto}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-xs font-body font-medium text-destructive transition-all disabled:opacity-60"
            >
              <Trash2 className="w-3.5 h-3.5" /> Remove
            </button>
          )}
        </div>
        <p className="text-[11px] font-body text-muted-foreground">JPG or PNG, up to 8MB. Resized to 512×512.</p>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      <input ref={cameraRef} type="file" accept="image/*" capture="user" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
    </div>
  );
}
