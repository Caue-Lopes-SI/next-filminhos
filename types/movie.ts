export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  synopsis: string | null;
  posterImageUrl: string | null;
  bannerImageUrl: string | null;
  releaseYear: number;
  durationMinutes: number | null;
  ageRating: string | null;
  contentWarning: string | null;
  cast: string | null;
  avgRating: string | null;
  reviewCount: number;
  isFavorite: boolean;
  isWatched: boolean;
  genres: Genre[];
}

export interface Review {
  id: number;
  rating: string;
  text: string;
  user: {
    id: number;
    fullName: string;
    avatarUrl: string | null;
    initials: string;
  };
  createdAt: string;
}
