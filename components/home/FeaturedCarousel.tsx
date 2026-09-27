"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from "@/components/ui/carousel";

interface Movie {
  id: number;
  title: string;
  bannerImageUrl: string | null;
  posterImageUrl: string | null;
  releaseYear: number;
}

export function FeaturedCarousel({ movies }: { movies: Movie[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!movies || movies.length === 0) return null;

  return (
    <div className="w-full flex flex-col items-center mb-10">
      <Carousel
        setApi={setApi}
        opts={{ align: "center", loop: true }}
        className="w-full max-w-[1600px]"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {movies.map((movie) => (
            <CarouselItem key={movie.id} className="pl-2 md:pl-4 basis-[90%] md:basis-[85%]">
              <Link href={`/movie/${movie.id}`}>
                <div className="relative w-full aspect-[16/9] md:aspect-[2.5/1] overflow-hidden rounded-xl group shadow-sm transition-transform duration-500 hover:scale-[1.01]">
                  {movie.bannerImageUrl || movie.posterImageUrl ? (
                    <Image
                      src={movie.bannerImageUrl || movie.posterImageUrl!}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white">
                      Sem Imagem
                    </div>
                  )}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      <div className="flex items-center gap-2 mt-6">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`rounded-full transition-all duration-300 ${
              index === current 
                ? "bg-[#7189A7] w-8 h-2.5" 
                : "bg-[#9db1c5] w-2.5 h-2.5 hover:bg-[#7189A7]"
            }`}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
