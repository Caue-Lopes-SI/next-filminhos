import Image from "next/image";
import { notFound } from "next/navigation";
import { MovieCarousel } from "@/components/home/MovieCarousel";
import { RecentReviews } from "@/components/home/RecentReviews";

async function getUser(id: string) {
  const res = await fetch(`https://tarefaapi.onrender.com/api/v1/users/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data;
}

async function getUserFavorites(id: string) {
  const res = await fetch(`https://tarefaapi.onrender.com/api/v1/users/${id}/favorites?perPage=15`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

async function getUserWatched(id: string) {
  const res = await fetch(`https://tarefaapi.onrender.com/api/v1/users/${id}/watched?perPage=15`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

async function getUserReviews(id: string) {
  const res = await fetch(`https://tarefaapi.onrender.com/api/v1/users/${id}/reviews?perPage=5`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data || [];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserProfile({ params }: PageProps) {
  const { id } = await params;

  const [user, favorites, watched, reviews] = await Promise.all([
    getUser(id),
    getUserFavorites(id),
    getUserWatched(id),
    getUserReviews(id),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="w-full pb-16 bg-[#bde0f2] min-h-screen">
      {/* Header Profile Section */}
      <div className="pt-16 pb-8 flex flex-col items-center">
        {user.avatarUrl ? (
          <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6 shadow-md border-4 border-white">
            <Image src={user.avatarUrl} alt={user.fullName} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-[#3d7dc8] to-[#60a5fa] flex items-center justify-center mb-6 shadow-md border-4 border-white">
            <span className="text-white text-5xl font-bold">{user.initials}</span>
          </div>
        )}
        <h1 className="text-[3.125rem] font-bold text-gray-900 font-['Inter']">
          {user.fullName}
        </h1>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        <MovieCarousel title="Favoritos" movies={favorites} />
        <MovieCarousel title="Assistidos" movies={watched} />
      </div>

      {reviews && reviews.length > 0 && (
        <RecentReviews reviews={reviews} />
      )}
    </div>
  );
}
