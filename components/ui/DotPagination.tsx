import { ChevronLeft, ChevronRight } from "lucide-react";

export function DotPagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  const MAX_DOTS = 7;
  const pages = Array.from({ length: Math.min(total, MAX_DOTS) }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="p-1 text-gray-500 disabled:opacity-30 hover:text-gray-800 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-2.5 h-2.5 rounded-full transition-all ${
            p === current ? "bg-[#3d7dc8] w-8" : "bg-gray-300 hover:bg-gray-400"
          }`}
        />
      ))}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="p-1 text-gray-500 disabled:opacity-30 hover:text-gray-800 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
