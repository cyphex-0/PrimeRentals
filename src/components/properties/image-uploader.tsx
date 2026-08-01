"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, GripVertical, Image as ImageIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

export function ImageUploader({ images, onChange, error }: ImageUploaderProps) {
  const [newUrl, setNewUrl] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAdd = () => {
    if (!newUrl.trim()) return;
    if (images.length >= 15) return;
    onChange([...images, newUrl.trim()]);
    setNewUrl("");
  };

  const handleRemove = (index: number) => {
    // We allow removing down to 0 while editing, but Zod will validate min(3) on submit.
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // Calculate how many more images we can accept
    const availableSlots = 15 - images.length;
    if (availableSlots <= 0) return;
    
    // Slice to the maximum allowed limit
    const filesToProcess = files.slice(0, availableSlots);
    
    const base64Promises = filesToProcess.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    });

    try {
      const newBase64Images = await Promise.all(base64Promises);
      onChange([...images, ...newBase64Images]);
    } catch (error) {
      console.error("Error reading files:", error);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // Swap logic for smooth reordering
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
          disabled={images.length >= 15}
        />
        <Button 
          type="button" 
          onClick={handleAdd}
          disabled={!newUrl.trim() || images.length >= 15}
        >
          <Plus className="h-4 w-4 mr-2" /> Add URL
        </Button>
        <div className="relative inline-block">
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*"
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileUpload}
            disabled={images.length >= 15}
            title="Upload local image"
          />
          <Button type="button" variant="secondary" disabled={images.length >= 15}>
            <Upload className="h-4 w-4 mr-2" /> Upload File
          </Button>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground flex items-center justify-between">
        <span>Upload between 3 and 15 images. Drag to reorder.</span>
        <span className={images.length < 3 || images.length > 15 ? "text-destructive font-medium" : ""}>
          {images.length} / 15
        </span>
      </p>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {images.map((img, index) => (
          <div 
            key={`${img}-${index}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`relative aspect-video rounded-xl overflow-hidden bg-muted border-2 cursor-move group transition-all ${
              draggedIndex === index ? 'opacity-50 border-primary scale-95' : 'border-border/50 hover:border-primary/50'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={img} 
              alt={`Property image ${index + 1}`}
              className="object-cover w-full h-full pointer-events-none"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
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

            {/* Cover Badge */}
            {index === 0 && (
              <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded-md shadow-md font-medium flex items-center gap-1">
                <ImageIcon className="h-3 w-3" /> Cover
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
