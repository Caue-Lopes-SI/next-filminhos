"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Heart, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DotPagination } from "@/components/ui/DotPagination";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Movie {
  id: number;
  title: string;
  posterImageUrl: string | null;
  releaseYear: number;
}

interface Metadata {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export type ListType = "liked" | "watched";

interface Props {
  type: ListType;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API = "https://tarefaapi.onrender.com/api/v1";
const PER_PAGE = 15;

const CONFIG = {
  liked: {
    title: "Curtidos",
    endpoint: "/account/favorites",
    Icon: Heart,
    iconClass: "fill-red-500 text-red-500",
    removeEndpoint: (id: number) => `/account/favorites/${id}`,
  },
  watched: {
    title: "Assistidos",
    endpoint: "/account/watched",
    Icon: Minus,
    iconClass: "text-red-500",
    removeEndpoint: (id: number) => `/account/watched/${id}`,
  },
} as const;

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchList(
  endpoint: string,
  token: string,
  page: number,
  search: string
): Promise<{ movies: Movie[]; meta: Metadata | null }> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      perPage: String(PER_PAGE),
    });
    if (search) params.set("search", search);

    const res = await fetch(`${API}${endpoint}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return { movies: [], meta: null };
    const json = await res.json();
    return { movies: json.data ?? [], meta: json.metadata ?? null };
  } catch {
    return { movies: [], meta: null };
  }
}

async function removeFromList(
  endpoint: string,
  token: string
): Promise<boolean> {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

// ─── Main component ───────────────────────────────────────────────────────────

export function MovieListPage({ type }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const cfg = CONFIG[type];

  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [meta, setMeta] = useState<Metadata | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const token = session?.user?.token;

  const load = useCallback(
    async (p: number, q: string) => {
      if (!token) return;
      setLoading(true);
      const { movies: data, meta: m } = await fetchList(
        cfg.endpoint,
        token,
        p,
        q
      );
      setMovies(data);
      setMeta(m);
      setLoading(false);
    },
    [token, cfg.endpoint]
  );

  // Reload on page change
  useEffect(() => {
    load(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, load]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load(1, search);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleRemove(movieId: number) {
    if (!session?.user?.token) return;
    const endpoint = cfg.removeEndpoint(movieId);
    const ok = await removeFromList(endpoint, session.user.token);
    if (ok) {
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
      setMeta((prev) => prev ? { ...prev, total: prev.total - 1 } : prev);
    }
  }

  const { Icon } = cfg;

  if (status === "loading") {
    return (
      <div className="flex justify-center pt-24">
        <div className="w-10 h-10 border-4 border-[#3d7dc8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#bde0f2] pb-12">
      <div className="w-full max-w-[77.5rem] mx-auto px-4 pt-8 space-y-5">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800">{cfg.title}</h1>

        {/* Search */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-500 pointer-events-none" />
          <Input
            type="search"
            placeholder="Pesquisar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-green-500 bg-white shadow-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="w-full max-w-[77.5rem] mx-auto px-4 mt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#3d7dc8] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : movies.length === 0 ? (
          <p className="text-center text-gray-500 mt-20 text-lg">
            {search
              ? "Nenhum filme encontrado."
              : type === "liked"
              ? "Você ainda não curtiu nenhum filme."
              : "Você ainda não assistiu nenhum filme."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {movies.map((movie) => (
                <div key={movie.id} className="relative group">
                  {/* Remove button overlay */}
                  <button
                    onClick={() => handleRemove(movie.id)}
                    aria-label={`Remover ${movie.title}`}
                    className="absolute top-1.5 left-1.5 z-10 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow hover:scale-110 transition-transform"
                  >
                    <Icon className={`w-4 h-4 ${cfg.iconClass}`} />
                  </button>

                  <Link href={`/movie/${movie.id}`}>
                    <div className="relative w-55 h-87.25 overflow-hidden rounded-lg">
                      {movie.posterImageUrl ? (
                        <Image
                          src={movie.posterImageUrl}
                          alt={movie.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105 "
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-300 flex items-center justify-center p-2 text-center text-slate-500">
                          <span className="text-xs font-semibold">{movie.title}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.lastPage > 1 && (
              <DotPagination
                current={page}
                total={meta.lastPage}
                onChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
