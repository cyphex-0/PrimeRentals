import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  onRatingChange, 
  interactive = false,
  className 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: maxRating }).map((_, i) => {
        const starValue = i + 1;
        const active = (hoverRating || rating) >= starValue;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            className={cn(
              "focus:outline-none transition-transform duration-200",
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            )}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onRatingChange?.(starValue)}
          >
            <Star 
              className={cn(
                "h-5 w-5",
                active ? "fill-amber-400 text-amber-400" : "fill-transparent text-muted-foreground"
              )} 
            />
          </button>
        )
      })}
    </div>
  )
}