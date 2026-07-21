import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingStars({ rating, count, size = "sm", className }: RatingStarsProps) {
  const dimension = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const rounded = Math.round(rating);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              dimension,
              i < rounded
                ? "fill-gold text-gold drop-shadow-[0_0_3px_rgba(217,164,65,0.3)]"
                : "text-neutral-700",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-neutral-400 font-medium">
        {rating.toFixed(1)}
        {typeof count === "number" ? (
          <span className="text-neutral-600 font-normal"> ({count})</span>
        ) : (
          ""
        )}
      </span>
    </div>
  );
}
