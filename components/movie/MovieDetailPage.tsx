"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Heart, Eye } from "lucide-react";
import { ReviewModal } from "./ReviewModal";
import { ReviewCard } from "./ReviewCard";
import { StarDisplay } from "@/components/ui/star-rating";
import { useMovieDetails, useToggleFavorite, useToggleWatched } from "@/hooks/useMovie";
import { Review } from "@/types/movie";
import { getAgeRatingColor } from "../utils/ageRatingColor";

function formatDuration(minutes: number | null): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}min`;
}

export function MovieDetailPage({ movieId }: { movieId: number }) {
  const { data: session } = useSession();
  const token = session?.user?.token;

  const { movie, setMovie, reviews, setReviews, isLoading } = useMovieDetails(movieId, token);
  const favoriteHook = useToggleFavorite(movieId, token);
  const watchedHook = useToggleWatched(movieId, token);

  const [showReviewModal, setShowReviewModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center pt-24">
        <div className="w-10 h-10 border-4 border-[#3d7dc8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center pt-24">
        <p className="text-gray-500 text-lg">Filme não encontrado.</p>
      </div>
    );
  }

  const handleToggleFavorite = async () => {
    const success = await favoriteHook.toggle(movie.isFavorite);
    if (success) setMovie({ ...movie, isFavorite: !movie.isFavorite });
  };

  const handleToggleWatched = async () => {
    const success = await watchedHook.toggle(movie.isWatched);
    if (success) setMovie({ ...movie, isWatched: !movie.isWatched });
  };

  const handleReviewSaved = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
    setShowReviewModal(false);
  };

  const avgRating = movie.avgRating ? parseFloat(movie.avgRating) : null;

  return (
    <div className="w-full bg-[#bde0f2] pb-12">
      {/* Banner */}
      <div className="relative w-full aspect-[16/7] overflow-hidden">
        {movie.bannerImageUrl ? (
          <Image
            src={movie.bannerImageUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-slate-400" />
        )}
      </div>

      {/* Info Section */}
      <div className="mx-24 px-4 mt-8 space-y-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-6xl font-bold text-gray-900 ">
            {movie.title}
          </h1>
          <div className="flex items-center gap-4 shrink-0 mt-1">
            <button
              onClick={handleToggleFavorite}
              disabled={!token || favoriteHook.isPending}
              title={movie.isFavorite ? "Remover dos curtidos" : "Curtir"}
              className={`transition-all hover:scale-110 disabled:opacity-40 ${movie.isFavorite ? "opacity-100" : "opacity-60"}`}
            >
              <Heart className={`w-10 h-10 transition-colors ${movie.isFavorite ? "fill-red-500 text-red-500" : "text-black"}`} strokeWidth={1.5} />
            </button>
            <button
              onClick={handleToggleWatched}
              disabled={!token || watchedHook.isPending}
              title={movie.isWatched ? "Remover dos assistidos" : "Marcar como assistido"}
              className={`transition-all hover:scale-110 disabled:opacity-40 ${movie.isWatched ? "opacity-100" : "opacity-60"}`}
            >
              <Eye className={`w-10 h-10 transition-colors ${movie.isWatched ? "text-[#1419AE]" : "text-black"}`} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div className="flex flex-col">

          {/* Metadata */}
          <div className="flex flex-col gap-4 text-sm text-black mt-13.25 ">
            <div className="flex justify-between">
              <div>
                <p className="font-bold text-3xl">Ano: {movie.releaseYear}</p>
                {movie.durationMinutes && (
                  <p className="font-bold text-3xl">Duração: {formatDuration(movie.durationMinutes)}</p>
                )}
              </div>
              <div className="text-xs text-gray-600 space-y-1 col-span-1">
              {movie.cast && (
                <p className="font-bold text-2xl text-black">Elenco:{movie.cast}</p>
              )}
              {movie.genres.length > 0 && (
                <p className="font-normal text-2xl text-black"><span className="font-bold">Gêneros:</span> {movie.genres.map((g) => g.name).join(", ")}</p>
              )}
            </div>
            </div>
            {movie.ageRating && (
              <span className="inline-flex items-center gap-1 mt-1">
                <span style={{backgroundColor: getAgeRatingColor(movie.ageRating)}} className="text-gray-900 w-8 h-8 text-2xl font-bold px-1.5 py-0.5 rounded flex justify-center items-center">
                  {movie.ageRating}
                </span>
                {movie.contentWarning && (
                  <span className="text-black text-3xl font-normal">{movie.contentWarning}</span>
                )}
              </span>
            )}
          </div>

          {/* Synopsis*/}
          <div className="grid grid-cols-2 gap-4 ml-0">
            <p className="text-black text-3xl font-normal">
              {movie.synopsis}
            </p>
          </div>
        </div>

        {/* Average Rating */}
        {avgRating !== null ? (
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <StarDisplay rating={avgRating} className="text-7xl"/>
              <span className="text-6xl font-bold text-gray-800">
                {avgRating.toFixed(1)}
              </span>
            </div>
            <p className="text-[32px]">
              {movie.reviewCount} avaliações
            </p>
          </div>
        ) : (
          <div className="flex justify-end">
            <p className="text-sm text-gray-400">Sem avaliações ainda</p>
          </div>
        )}

        {/* Action Button */}
        {token && (
          <div className="flex justify-end">
            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-blue-700 hover:bg-blue-600 text-white text-4xl font-semibold w-114.5 h-25.25 rounded-full transition-colors"
            >
              Criar uma review
            </button>
          </div>
        )}

        {/* Reviews */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xl font-bold text-gray-800">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhuma review ainda. Seja o primeiro!</p>
          ) : (
            reviews.map((r) => <ReviewCard key={r.id} review={r}/>)
          )}
        </div>
      </div>

      {showReviewModal && token && (
        <ReviewModal
          token={token}
          movieId={movieId}
          onClose={() => setShowReviewModal(false)}
          onSaved={handleReviewSaved}
        />
      )}
    </div>
  );
}
