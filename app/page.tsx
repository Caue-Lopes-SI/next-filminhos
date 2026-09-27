import { MovieCarousel } from "@/components/home/MovieCarousel";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { RecentReviews } from "@/components/home/RecentReviews";

async function getFeaturedMovies() {
  const res = await fetch("https://tarefaapi.onrender.com/api/v1/movies/featured?count=5", { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

async function getMoviesByGenre(genreId: number) {
  const res = await fetch(`https://tarefaapi.onrender.com/api/v1/movies?genreIds[]=${genreId}&perPage=10`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

async function getGenres() {
  const res = await fetch("https://tarefaapi.onrender.com/api/v1/genres", { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

async function getRecentReviews() {
  const res = await fetch("https://tarefaapi.onrender.com/api/v1/reviews?perPage=5", { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

export default async function Home() {
  const featuredMovies = await getFeaturedMovies();
  const genres = await getGenres();
  const recentReviews = await getRecentReviews();
  
  // Pegar filmes das 3 primeiras categorias para não sobrecarregar
  const displayGenres = genres.slice(0, 3);
  
  const categoryMovies = await Promise.all(
    displayGenres.map(async (genre: any) => {
      const movies = await getMoviesByGenre(genre.id);
      return { genre, movies };
    })
  );

  return (
    <div className="w-full pb-16">
      <FeaturedCarousel movies={featuredMovies} />
      
      <div className="max-w-7xl mx-auto mt-8">
        {categoryMovies.map(({ genre, movies }) => (
          <MovieCarousel key={genre.id} title={genre.name} movies={movies} />
        ))}
      </div>

      <RecentReviews reviews={recentReviews} />
    </div>
  );
}
