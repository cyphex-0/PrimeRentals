"use client";

import { useState } from "react";
import Image from "next/image";
import { Grid, Image as ImageIcon } from "lucide-react";
import { Lightbox } from "@/components/ui/lightbox";
import { Button } from "@/components/ui/button";

interface PropertyGalleryProps {
  images: string[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const len = images.length;

  // Render a specific image cell
  const renderImage = (img: string, index: number, className: string, isLastVisible = false, hiddenCount = 0) => (
    <div 
      key={index}
      className={`relative group cursor-pointer overflow-hidden bg-muted ${className}`}
      onClick={() => openLightbox(index)}
    >
      <Image
        src={img}
        alt={`Property photo ${index + 1}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
      
      {isLastVisible && hiddenCount > 0 && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors hover:bg-black/50">
          <span className="text-white font-semibold text-lg md:text-xl flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            +{hiddenCount} more
          </span>
        </div>
      )}
    </div>
  );

  // Layout 1: 3 images (1 large left, 2 stacked right)
  if (len === 3) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          {renderImage(images[0], 0, "md:col-span-2 h-full")}
          <div className="hidden md:flex flex-col gap-2 h-full">
            {renderImage(images[1], 1, "flex-1 rounded-tr-2xl")}
            {renderImage(images[2], 2, "flex-1 rounded-br-2xl")}
          </div>
        </div>
        <Lightbox images={images} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
      </>
    );
  }

  // Layout 2: 4 images (1 large left, 1 top right, 2 bottom right)
  if (len === 4) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
          {renderImage(images[0], 0, "md:col-span-2 h-full")}
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 h-full">
            {renderImage(images[1], 1, "col-span-2 rounded-tr-2xl")}
            {renderImage(images[2], 2, "col-span-1")}
            {renderImage(images[3], 3, "col-span-1 rounded-br-2xl")}
          </div>
        </div>
        <Lightbox images={images} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
      </>
    );
  }

  // Layout 3: 5 images (Airbnb style - 1 large, 4 small 2x2 grid)
  if (len === 5) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden relative">
          {renderImage(images[0], 0, "md:col-span-2 h-full")}
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 col-span-2 h-full">
            {renderImage(images[1], 1, "")}
            {renderImage(images[2], 2, "rounded-tr-2xl")}
            {renderImage(images[3], 3, "")}
            {renderImage(images[4], 4, "rounded-br-2xl")}
          </div>
          
          <Button 
            variant="secondary" 
            className="absolute bottom-4 right-4 shadow-md bg-white/90 hover:bg-white text-black"
            onClick={() => setLightboxOpen(true)}
          >
            <Grid className="h-4 w-4 mr-2" />
            Show all photos
          </Button>
        </div>
        <Lightbox images={images} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
      </>
    );
  }

  // Layout 4: 6-8 images (Grid pattern, 2 large, rest small)
  if (len >= 6 && len <= 8) {
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 h-[500px] md:h-[600px] rounded-2xl overflow-hidden">
          {renderImage(images[0], 0, "col-span-2 row-span-2")}
          {renderImage(images[1], 1, "col-span-2 row-span-1")}
          {images.slice(2, 6).map((img, i) => {
             // For lengths 6, 7, 8 we just fill available slots. If we only show up to 6 images in the grid:
             const index = i + 2;
             const isLastSlot = i === 3; // 6th image is the last visible
             const hidden = len - 6;
             return renderImage(img, index, "", isLastSlot, hidden);
          })}
        </div>
        <Lightbox images={images} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
      </>
    );
  }

  // Layout 5: 9 images (3x3 grid)
  if (len === 9) {
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-[500px] md:h-[700px] rounded-2xl overflow-hidden">
          {images.map((img, index) => renderImage(img, index, ""))}
        </div>
        <Lightbox images={images} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
      </>
    );
  }

  // Layout 6: 10-15 images (Display 5 in Airbnb style, and rest inside lightbox)
  // Because showing 15 images on screen is crowded, Airbnb style with "+X more" is best.
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden relative">
        {renderImage(images[0], 0, "md:col-span-2 h-full")}
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-2 col-span-2 h-full">
          {renderImage(images[1], 1, "")}
          {renderImage(images[2], 2, "rounded-tr-2xl")}
          {renderImage(images[3], 3, "")}
          {renderImage(images[4], 4, "rounded-br-2xl", true, len - 5)}
        </div>
      </div>
      <Lightbox images={images} initialIndex={lightboxIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </>
  );
}
