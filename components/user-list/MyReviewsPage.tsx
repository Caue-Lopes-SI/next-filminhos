"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Pencil, X } from "lucide-react";
import { StarDisplay, StarPicker } from "@/components/ui/star-rating";
import { DotPagination } from "@/components/ui/DotPagination";
import styles from "@/components/home/recent-reviews.module.css";

const API = "https://tarefaapi.onrender.com/api/v1";
const PER_PAGE = 15;

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
interface Metadata {
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

function DeleteModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#cbe9f8] rounded-[1.25rem] shadow-xl p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="text-gray-800 hover:text-black mb-4 flex">
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <p className="font-bold text-gray-900 text-center text-lg mb-8 leading-tight">
          Deseja apagar essa avaliação? Esta<br />ação é <span className="text-red-500">irreversível!</span>
        </p>
        <div className="flex justify-center items-center gap-4">
          <button onClick={onClose} className="bg-[#fc2b2b] hover:bg-[#d92222] text-white text-sm font-bold px-6 py-2 rounded-full transition-colors shadow-sm">
            Cancelar
          </button>
          <button onClick={onConfirm} className="bg-[#1b2591] hover:bg-[#121970] text-white text-sm font-bold px-6 py-2 rounded-full transition-colors shadow-sm">
            Apagar avaliação
          </button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ review, token, onClose, onSaved }: { review: Review; token: string; onClose: () => void; onSaved: (r: Review) => void }) {
  const [rating, setRating] = useState(parseFloat(review.rating));
  const [text, setText] = useState(review.text);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/reviews/${review.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, text }),
      });
      if (res.ok) {
        const json = await res.json();
        onSaved(json.data);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60" onClick={onClose}>
      <div className="w-full max-w-lg bg-[#cbe9f8] rounded-[1.25rem] shadow-xl p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="text-gray-800 hover:text-black mb-2 flex">
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <p className="font-bold text-gray-900 mb-3 text-lg">
          Editar Review: <span className="text-[#22c55e]">{review.movie.title}</span>
        </p>
        <StarPicker value={rating} onChange={setRating} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="mt-6 w-full border border-gray-300 rounded-xl p-4 text-sm text-gray-800 resize-none focus:outline-none bg-white shadow-sm"
        />
        <div className="flex justify-end mt-4">
          <button onClick={handleSubmit} disabled={submitting} className="bg-[#1b2591] hover:bg-[#121970] disabled:opacity-60 text-white text-sm font-bold px-8 py-2 rounded-full transition-colors shadow-sm">
            {submitting ? "..." : "Concluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function MyReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [meta, setMeta] = useState<Metadata | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [reviewToEdit, setReviewToEdit] = useState<Review | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const userId = session?.user?.id;
  const token = session?.user?.token;

  const load = useCallback(async (p: number) => {
    if (!userId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p),
        perPage: String(PER_PAGE),
      });

      const res = await fetch(`${API}/users/${userId}/reviews?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });

      if (res.ok) {
        const json = await res.json();
        setReviews(json.data ?? []);
        setMeta(json.metadata ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  useEffect(() => {
    load(page);
  }, [page, load]);

  async function confirmDelete() {
    if (!token || !reviewToDelete) return;
    const res = await fetch(`${API}/reviews/${reviewToDelete.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
      setMeta((prev) => prev ? { ...prev, total: prev.total - 1 } : prev);
      setReviewToDelete(null);
    }
  }

  function onEditSaved(updatedReview: Review) {
    setReviews((prev) => prev.map((r) => r.id === updatedReview.id ? updatedReview : r));
    setReviewToEdit(null);
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center pt-24">
        <div className="w-10 h-10 border-4 border-[#3d7dc8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#bde0f2] pb-12">
      <div className="w-full max-w-[77.5rem] mx-auto px-4 pt-12 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 ml-2">Minhas Avaliações</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#3d7dc8] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500 mt-20 text-lg">
            Você ainda não fez nenhuma avaliação.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div key={review.id} className={`${styles.reviewCard} relative pr-16`}>
                <div className="absolute top-4 right-4 flex items-center gap-3">
                  <button onClick={() => setReviewToEdit(review)} className="text-gray-600 hover:text-gray-900 transition-colors">
                    <Pencil className="w-8 h-8" strokeWidth={1.5} />
                  </button>
                  <button onClick={() => setReviewToDelete(review)} className="text-red-500 hover:text-red-700 transition-colors">
                    <Trash2 className="w-8 h-8" strokeWidth={1.5} />
                  </button>
                </div>

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

                <div className={styles.reviewContent}>
                  <div className={styles.reviewHeader}>
                    <Link href={`/movie/${review.movie.id}`} className="hover:underline">
                      <strong>{review.movie.title}</strong>
                    </Link>
                    <span className={styles.reviewYear}>{review.movie.releaseYear}</span>
                    <StarDisplay rating={parseFloat(review.rating)} max={5} className={styles.reviewRating} />
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

                  <p className={styles.reviewText}>{review.text}</p>
                </div>
              </div>
            ))}

            {meta && meta.lastPage > 1 && (
              <div className="mt-8 flex justify-center">
                <DotPagination
                  current={page}
                  total={meta.lastPage}
                  onChange={(p: number) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {reviewToDelete && (
        <DeleteModal onClose={() => setReviewToDelete(null)} onConfirm={confirmDelete} />
      )}
      
      {reviewToEdit && token && (
        <EditModal review={reviewToEdit} token={token} onClose={() => setReviewToEdit(null)} onSaved={onEditSaved} />
      )}
    </div>
  );
}
