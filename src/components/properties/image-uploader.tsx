"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, GripVertical, Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadMultipleImages } from "@/lib/utils/upload-image";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_IMAGES = 15;

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

export function ImageUploader({ images, onChange, error }: ImageUploaderProps) {
  const [newUrl, setNewUrl] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [imageMeta, setImageMeta] = useState<Record<string, { name: string; size: number }>>({});
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Add image via URL ---
  const handleAdd = () => {
    if (!newUrl.trim()) return;
    if (images.length >= MAX_IMAGES) return;
    onChange([...images, newUrl.trim()]);
    setNewUrl("");
  };

  // --- Remove an image ---
  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  // --- Upload files via ImgBB ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadErrors([]);

    const validFiles: File[] = [];
    const newErrors: string[] = [];

    // 1. Validate every selected file
    files.forEach((file) => {
      let isValid = true;
      if (!ALLOWED_TYPES.includes(file.type)) {
        newErrors.push(`Only JPG, JPEG, PNG, and WebP images are allowed. (${file.name})`);
        isValid = false;
      }
      if (file.size > MAX_FILE_SIZE) {
        newErrors.push(`Image '${file.name}' exceeds the 5 MB limit.`);
        isValid = false;
      }
      if (isValid) {
        validFiles.push(file);
      }
    });

    // 2. Enforce total 15 limit
    const availableSlots = MAX_IMAGES - images.length;
    let filesToProcess = validFiles;

    if (availableSlots <= 0) {
      newErrors.push(`You can upload a maximum of ${MAX_IMAGES} images.`);
      filesToProcess = [];
    } else if (validFiles.length > availableSlots) {
      newErrors.push(
        `You can upload a maximum of ${MAX_IMAGES} images. Only ${availableSlots} valid file(s) were added.`
      );
      filesToProcess = validFiles.slice(0, availableSlots);
    }

    if (newErrors.length > 0) {
      setUploadErrors(newErrors);
    }

    if (filesToProcess.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 3. Upload to ImgBB
    setIsUploading(true);
    try {
      const { successes, errors: uploadErrs } = await uploadMultipleImages(filesToProcess);

      if (uploadErrs.length > 0) {
        setUploadErrors((prev) => [...prev, ...uploadErrs]);
      }

      if (successes.length > 0) {
        const newUrls = successes.map((r) => r.url);

        // Save metadata for UI display
        const newMeta = { ...imageMeta };
        successes.forEach((r) => {
          newMeta[r.url] = { name: r.name, size: r.size };
        });
        setImageMeta(newMeta);

        onChange([...images, ...newUrls]);
      }
    } catch (err) {
      setUploadErrors((prev) => [...prev, "An unexpected error occurred during upload."]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // --- Drag and drop reordering ---
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    onChange(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="https://example.com/image.jpg"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          disabled={images.length >= MAX_IMAGES || isUploading}
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!newUrl.trim() || images.length >= MAX_IMAGES || isUploading}
        >
          <Plus className="h-4 w-4 mr-2" /> Add URL
        </Button>
        <div className="relative inline-block">
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileUpload}
            disabled={images.length >= MAX_IMAGES || isUploading}
            title="Upload local images"
          />
          <Button type="button" variant="secondary" disabled={images.length >= MAX_IMAGES || isUploading}>
            {isUploading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="h-4 w-4 mr-2" /> Upload Files</>
            )}
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground flex items-center justify-between">
        <span>Upload between 3 and 15 images. Drag to reorder.</span>
        <span className={images.length < 3 || images.length > MAX_IMAGES ? "text-destructive font-medium" : ""}>
          {images.length} / {MAX_IMAGES} images selected
        </span>
      </p>

      {/* Upload Errors */}
      {uploadErrors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm space-y-1">
          {uploadErrors.map((err, i) => (
            <p key={i}>• {err}</p>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive font-medium">{error}</p>}

      {/* Uploading indicator */}
      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Uploading images to cloud hosting...</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {images.map((img, index) => (
          <div
            key={`${img}-${index}`}
            draggable={!isUploading}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative aspect-video rounded-xl overflow-hidden bg-muted border-2 cursor-move group transition-all ${
              draggedIndex === index
                ? "opacity-50 border-primary scale-95"
                : "border-border/50 hover:border-primary/50"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`Property image ${index + 1}`}
              className="object-cover w-full h-full pointer-events-none"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
              }}
            />

            {/* Drag Handle Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-start justify-between p-2 opacity-0 group-hover:opacity-100">
              <div className="bg-black/50 text-white p-1.5 rounded cursor-grab active:cursor-grabbing backdrop-blur-sm">
                <GripVertical className="h-4 w-4" />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="h-8 w-8 rounded-full opacity-90 hover:opacity-100 shadow-md"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Metadata Overlay for uploaded images */}
            {imageMeta[img] && (
              <div className="absolute top-2 left-2 right-12 bg-black/60 text-white text-[10px] sm:text-xs px-2 py-1 rounded truncate pointer-events-none backdrop-blur-sm z-10">
                <span className="font-semibold">{imageMeta[img].name}</span>
                <span className="opacity-75 ml-1 hidden sm:inline">
                  ({formatBytes(imageMeta[img].size)})
                </span>
              </div>
            )}

            {/* Cover Badge */}
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded-md shadow-md font-medium flex items-center gap-1 z-10">
                <ImageIcon className="h-3 w-3" /> Cover
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
