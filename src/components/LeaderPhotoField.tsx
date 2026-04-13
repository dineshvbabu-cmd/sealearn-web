"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, Link as LinkIcon, X } from "lucide-react";

interface Props {
  defaultValue?: string;
  currentImageUrl?: string;
}

export default function LeaderPhotoField({ defaultValue = "", currentImageUrl }: Props) {
  const [url, setUrl] = useState(defaultValue || currentImageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      // Get presigned upload URL from our API
      const res = await fetch("/api/upload/leader-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const { uploadUrl, publicUrl } = await res.json();

      // Upload directly to R2
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      setUrl(publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Paste a URL instead.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-navy uppercase tracking-wide">Photo</label>

      {/* Preview */}
      {url && (
        <div className="flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold flex-shrink-0">
            <Image src={url} alt="Preview" fill className="object-cover" unoptimized />
          </div>
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <X size={12} /> Remove photo
          </button>
        </div>
      )}

      {/* Hidden input that gets submitted with the form */}
      <input type="hidden" name="imageUrl" value={url} />

      {/* URL input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://… paste image URL"
            className="w-full pl-8 pr-3 py-2.5 border border-border rounded-lg text-sm outline-none focus:border-teal"
          />
        </div>

        {/* File upload button */}
        <label className="flex items-center gap-1.5 px-3 py-2.5 border border-border rounded-lg text-sm text-muted hover:bg-surface cursor-pointer transition-colors">
          <Upload size={14} />
          {uploading ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {uploadError && (
        <p className="text-xs text-red-600">{uploadError}</p>
      )}
      <p className="text-xs text-muted">Paste an image URL or upload a photo (JPG/PNG, square recommended).</p>
    </div>
  );
}
