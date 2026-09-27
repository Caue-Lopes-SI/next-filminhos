"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Plus, Minus, X, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  posterImageUrl: string | null;
  releaseYear: number;
}

// ─── API helpers ─────────────────────────────────────────────────────────────

const API = "https://tarefaapi.onrender.com/api/v1";

async function fetchGenres(): Promise<Genre[]> {
  try {
    const res = await fetch(`${API}/genres`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function fetchMovies(query: string, genreIds: number[]): Promise<Movie[]> {
  try {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    genreIds.forEach((id) => params.append("genreIds[]", String(id)));
    params.set("perPage", "50");

    const res = await fetch(`${API}/movies?${params.toString()}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

// ─── Filter Modal ─────────────────────────────────────────────────────────────

function FilterModal({
  genres,
  selectedIds,
  onClose,
  onConfirm,
}: {
  genres: Genre[];
  selectedIds: number[];
  onClose: () => void;
  onConfirm: (ids: number[]) => void;
}) {
  const [pending, setPending] = useState<number[]>(selectedIds);

  function toggle(id: number) {
    setPending((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function clearAll() {
    setPending([]);
  }

  return (
    /* backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60"
      onClick={onClose}
    >
      {/* card */}
      <div
        className="relative w-full max-w-lg bg-[#cbe9f8] rounded-[1.25rem] shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onClose} className="text-gray-800 hover:text-black">
            <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
          </button>
          <button onClick={onClose} className="text-gray-800 hover:text-black">
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>

        <p className="font-bold text-gray-900 mb-4 text-lg">Gênero:</p>

        {/* Genre chips */}
        <div className="flex flex-wrap gap-3 mb-8">
          {genres.map((g) => {
            const active = pending.includes(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggle(g.id)}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-full border border-[1.5px] text-sm font-bold transition-colors ${
                  active
                    ? "bg-[#289128] border-[#289128] text-white"
                    : "bg-white border-[#289128] text-[#289128] hover:bg-green-50"
                }`}
              >
                {active ? (
                  <Minus className="w-4 h-4" strokeWidth={3} />
                ) : (
                  <Plus className="w-4 h-4" strokeWidth={3} />
                )}
                {g.name}
              </button>
            );
          })}
        </div>

        {/* actions */}
        <div className="flex justify-end items-center gap-4 mt-2">
          <button
            onClick={clearAll}
            className="bg-[#8b2323] hover:bg-[#6b1b1b] text-white text-sm font-bold px-6 py-2 rounded-full transition-colors shadow-sm"
          >
            Apagar Todos os Filtros
          </button>
          <button
            onClick={() => onConfirm(pending)}
            className="bg-[#1b2591] hover:bg-[#121970] text-white text-sm font-bold px-8 py-2 rounded-full transition-colors shadow-sm"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Load genres once
  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  // Fetch movies whenever query or filters change (debounced on query)
  const load = useCallback(async (q: string, ids: number[]) => {
    setLoading(true);
    const data = await fetchMovies(q, ids);
    setMovies(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      load(query, selectedGenreIds);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, selectedGenreIds, load]);

  function handleConfirm(ids: number[]) {
    setSelectedGenreIds(ids);
    setModalOpen(false);
  }

  function removeFilter(id: number) {
    setSelectedGenreIds((prev) => prev.filter((x) => x !== id));
  }

  const selectedGenres = genres.filter((g) => selectedGenreIds.includes(g.id));

  return (
    <div className="w-full min-h-screen bg-[#bde0f2] pb-12">
      {/* Search bar + filters row */}
      <div className="max-w-2xl mx-auto px-4 pt-8 space-y-4">
        {/* Search input */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-500 pointer-events-none" />
          <Input
            type="search"
            placeholder="Pesquisar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full bg-white border-none shadow-sm text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {/* Filter row */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#2e9b4e] hover:bg-[#257a3e] text-white font-semibold text-sm px-4 py-2 rounded-full transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Filtro
          </button>

          {/* Active filter tags */}
          {selectedGenres.map((g) => (
            <button
              key={g.id}
              onClick={() => removeFilter(g.id)}
              className="flex items-center gap-1.5 bg-[#3d7dc8] hover:bg-[#2d6db8] text-white font-semibold text-sm px-4 py-2 rounded-full transition-colors"
            >
              <Minus className="w-4 h-4" />
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Movie grid */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#3d7dc8] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : movies.length === 0 ? (
          <p className="text-center text-gray-500 mt-20 text-lg">
            {query || selectedGenreIds.length > 0
              ? "Nenhum filme encontrado."
              : "Pesquise por um filme."}
          </p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {movies.map((movie) => (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg group">
                  {movie.posterImageUrl ? (
                    <Image
                      src={movie.posterImageUrl}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-300 flex items-center justify-center p-2 text-center text-slate-500">
                      <span className="text-xs font-semibold">{movie.title}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {modalOpen && (
        <FilterModal
          genres={genres}
          selectedIds={selectedGenreIds}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
