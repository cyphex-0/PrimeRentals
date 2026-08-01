"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when opened with a new initial index
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialIndex]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleNext, handlePrevious, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-in fade-in duration-200">
      {/* Header Controls */}
      <div className="absolute top-0 w-full flex items-center justify-between p-4 z-50 bg-gradient-to-b from-black/60 to-transparent">
        <div className="text-white/80 font-medium tracking-wide text-sm">
          {currentIndex + 1} / {images.length}
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 z-50 text-white/70 hover:text-white transition-all p-3 rounded-full hover:bg-white/10 hover:scale-110 active:scale-95"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 z-50 text-white/70 hover:text-white transition-all p-3 rounded-full hover:bg-white/10 hover:scale-110 active:scale-95"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Main Image */}
      <div 
        className="relative w-full h-full flex items-center justify-center px-12 md:px-24"
        onClick={onClose} // Clicking outside closes it
      >
        <div 
          className="relative w-full h-[85vh] max-w-6xl mx-auto"
          onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
        >
          <Image
            src={images[currentIndex]}
            alt={`Property image ${currentIndex + 1}`}
            fill
            className="object-contain animate-in fade-in zoom-in-95 duration-200"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
