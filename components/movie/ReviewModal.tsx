"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { StarPicker } from "@/components/ui/star-rating";
import { Review } from "@/types/movie";

const API = "https://tarefaapi.onrender.com/api/v1";

export function ReviewModal({
  token,
  movieId,
  onClose,
  onSaved,
}: {
  token: string;
  movieId: number;
  onClose: () => void;
  onSaved: (review: Review) => void;
}) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!rating) { setError("Selecione uma nota."); return; }
    if (!text.trim()) { setError("Escreva uma avaliação."); return; }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieId, rating, text }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.message ?? "Erro ao salvar avaliação.");
        return;
      }
      const json = await res.json();
      onSaved(json.data);
    } catch {
      setError("Erro de conexão.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#cbe9f8] rounded-[1.25rem] p-6 shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="text-gray-800 hover:text-black mb-2 flex">
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>

        <p className="font-bold text-gray-900 mb-3 text-lg">Criar Review:</p>

        <StarPicker value={rating} onChange={setRating} />

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escrever avaliação..."
          rows={6}
          className="mt-6 w-full border border-gray-300 rounded-xl p-4 text-sm text-gray-800 placeholder:text-gray-400 resize-none focus:outline-none bg-white shadow-sm"
        />

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#1b2591] hover:bg-[#121970] disabled:opacity-60 text-white text-sm font-semibold px-8 py-2 rounded-full transition-colors"
          >
            {submitting ? "..." : "Concluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
