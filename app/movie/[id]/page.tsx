import { Suspense } from "react";
import { MovieDetailPage } from "@/components/movie/MovieDetailPage";

export default async function Movie({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movieId = Number(id);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center pt-24">
          <div className="w-10 h-10 border-4 border-[#3d7dc8] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <MovieDetailPage movieId={movieId} />
    </Suspense>
  );
}