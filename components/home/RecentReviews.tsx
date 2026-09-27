import Image from "next/image";
import Link from "next/link";
import { StarDisplay } from "@/components/ui/star-rating";

interface MovieLite {
  id: number;
  title: string;
  posterImageUrl: string | null;
  releaseYear: number;
}

interface UserLite {
  id: number;
  fullName: string;
  avatarUrl: string | null;
  initials: string;
}

interface Review {
  id: number;
  rating: string;
  text: string;
  createdAt: string;
  user: UserLite;
  movie: MovieLite;
}

import styles from "./recent-reviews.module.css";

export function RecentReviews({ reviews }: { reviews: Review[] }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className={styles.reviewsSection}>
      <h2 className={styles.reviewsTitle}>Reviews</h2>
      
      {reviews.map((review) => (
        <div key={review.id} className={styles.reviewCard}>
          {/* Left: Movie Poster */}
          <Link href={`/movie/${review.movie.id}`} className="shrink-0 group">
            {review.movie.posterImageUrl ? (
              <Image
                src={review.movie.posterImageUrl}
                alt={review.movie.title}
                width={184}
                height={245}
                className={styles.reviewPoster}
              />
            ) : (
              <div className={`${styles.reviewPoster} bg-slate-200`} />
            )}
          </Link>

          {/* Right: Review Info */}
          <div className={styles.reviewContent}>
            <div className={styles.reviewHeader}>
              <Link href={`/movie/${review.movie.id}`} className="hover:underline">
                <strong>{review.movie.title}</strong>
              </Link>
              <span className={styles.reviewYear}>{review.movie.releaseYear}</span>
              <div className={styles.reviewRating}>
                <StarDisplay rating={parseFloat(review.rating)} max={5} />
              </div>
            </div>

            <Link href={`/userProfile/${review.user.id}`} className={styles.reviewUser}>
              {review.user.avatarUrl ? (
                <Image src={review.user.avatarUrl} alt={review.user.fullName} width={32} height={32} className={styles.reviewAvatarFallback} />
              ) : (
                <div className={styles.reviewAvatarFallback}>
                  {review.user.initials}
                </div>
              )}
              <span className={styles.reviewUsername}>
                {review.user.fullName}
              </span>
            </Link>

            <p className={styles.reviewText}>
              {review.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
