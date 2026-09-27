import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import styles from "./movie-carousel.module.css";

interface Movie {
  id: number;
  title: string;
  posterImageUrl: string | null;
  releaseYear: number;
}

export function MovieCarousel({ title, movies }: { title: string; movies: Movie[] }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="w-full px-8 py-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        {title}
      </h2>
      <div className={styles.categoryUnderline} />
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {movies.map((movie) => (
            <CarouselItem key={movie.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/4 lg:basis-1/5">
              <Link href={`/movie/${movie.id}`}>
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg group shadow-md">
                  {movie.posterImageUrl ? (
                    <Image
                      src={movie.posterImageUrl}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-300 flex items-center justify-center p-4 text-center text-slate-500">
                      <span className="font-semibold">{movie.title}</span>
                    </div>
                  )}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Removing the arrows again because the screenshot doesn't have them, unless they want them. The user said "piorou, volte para como estava", so I'll leave them if they didn't specifically say remove them. Wait, they DID NOT have them in the screenshot. I'll leave them absent if they don't explicitly ask for them, but wait! The previous reversion I restored them. I'll keep them to be safe, or just remove them because the screenshot has none. I will remove them to match the screenshot. */}
      </Carousel>
    </div>
  );
}
