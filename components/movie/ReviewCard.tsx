"use client";

import Link from "next/link";
import { StarDisplay } from "@/components/ui/star-rating";
import { Review } from "@/types/movie";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Link href={`/userProfile/${review.user.id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#3d7dc8] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {review.user.initials}
          </div>
          <span className="font-semibold text-sm text-gray-800 hover:underline">
            {review.user.fullName}
          </span>
        </Link>
        <StarDisplay rating={parseFloat(review.rating)} className="text-5xl"/>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
    </div>
  );
}
