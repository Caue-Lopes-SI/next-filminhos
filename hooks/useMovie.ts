import { useState, useEffect } from "react";
import { Movie, Review } from "@/types/movie";

const API = "https://tarefaapi.onrender.com/api/v1";

export function useMovieDetails(movieId: number, token?: string) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const [movieRes, reviewsRes] = await Promise.all([
          fetch(`${API}/movies/${movieId}`, { headers }),
          fetch(`${API}/reviews?movieId=${movieId}&perPage=50`),
        ]);

        if (movieRes.ok) {
          const j = await movieRes.json();
          setMovie(j.data);
        }

        if (reviewsRes.ok) {
          const j = await reviewsRes.json();
          setReviews(j.data ?? []);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [movieId, token]);

  return { movie, setMovie, reviews, setReviews, isLoading };
}

export function useToggleFavorite(movieId: number, token?: string) {
  const [isPending, setIsPending] = useState(false);

  async function toggle(isFavorite: boolean) {
    if (!token || isPending) return false;
    setIsPending(true);
    const method = isFavorite ? "DELETE" : "POST";
    const url = isFavorite 
      ? `${API}/account/favorites/${movieId}` 
      : `${API}/account/favorites`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: isFavorite ? undefined : JSON.stringify({ movieId }),
      });
      return res.ok;
    } finally {
      setIsPending(false);
    }
  }

  return { toggle, isPending };
}

export function useToggleWatched(movieId: number, token?: string) {
  const [isPending, setIsPending] = useState(false);

  async function toggle(isWatched: boolean) {
    if (!token || isPending) return false;
    setIsPending(true);
    const method = isWatched ? "DELETE" : "POST";
    const url = isWatched
      ? `${API}/account/watched/${movieId}`
      : `${API}/account/watched`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: isWatched ? undefined : JSON.stringify({ movieId }),
      });
      return res.ok;
    } finally {
      setIsPending(false);
    }
  }

  return { toggle, isPending };
}
