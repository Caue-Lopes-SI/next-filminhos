"use client";

import styles from "./star-rating.module.css";
import { cn } from "@/lib/utils";

// ─── Read-only display ────────────────────────────────────────────────────────
export function StarDisplay({ rating, max = 5, className }: { rating: number; max?: number; className?: string }) {
  const safeRating = Math.max(0, Math.min(rating, max));
  const fullStars = Math.floor(safeRating);
  const hasHalfStar = safeRating % 1 !== 0;
  const emptyStars = max - Math.ceil(safeRating);

  return (
    <span className={cn("text-[#2e9b4e] text-xl tracking-widest leading-none drop-shadow-sm select-none", className)}>
      {"★".repeat(fullStars)}
      {hasHalfStar ? "⯨" : ""}
      {"☆".repeat(Math.max(0, emptyStars))}
    </span>
  );
}

// ─── Interactive picker ───────────────────────────────────────────────────────
interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function StarPicker({ value, onChange, className }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  function handleClick(starIndex: number, isHalf: boolean) {
    const newValue = isHalf ? starIndex - 0.5 : starIndex;
    onChange(newValue);
  }

  return (
    <div className={cn("text-[#2e9b4e] text-3xl drop-shadow-sm", styles.starRating, className)}>
      {stars.map((star) => {
        const filled = value >= star;
        const halfFilled = value >= star - 0.5 && value < star;

        return (
          <div key={star} className={styles.starWrapper}>
            <span
              className={styles.halfLeft}
              onClick={() => handleClick(star, true)}
            />
            <span
              className={styles.halfRight}
              onClick={() => handleClick(star, false)}
            />
            <span className={styles.star}>
              {filled ? "★" : halfFilled ? "⯨" : "☆"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
