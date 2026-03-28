import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { INotesMeta } from "@/types/note.types";

interface NotesPaginationProps {
  meta: INotesMeta;
  onPage: (page: number) => void;
}

export const NotesPagination = ({ meta, onPage }: NotesPaginationProps) => {
  if (meta.totalPages <= 1) return null;

  const pages = Array.from({ length: meta.totalPages }, (_, i) => i + 1);
  const showEllipsis = meta.totalPages > 7;

  // Which page numbers to show
  const visiblePages = showEllipsis
    ? [
        1,
        ...(meta.page > 3 ? ["…"] : []),
        ...pages.slice(
          Math.max(1, meta.page - 2),
          Math.min(meta.totalPages - 1, meta.page + 1)
        ),
        ...(meta.page < meta.totalPages - 2 ? ["…"] : []),
        meta.totalPages,
      ]
    : pages;

  return (
    <nav
      aria-label="Notes pagination"
      className="mt-8 flex items-center justify-center gap-1.5"
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-xl"
        disabled={meta.page <= 1}
        onClick={() => onPage(meta.page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((p, i) =>
        p === "…" ? (
          <span
            key={`ellipsis-${i}`}
            className="text-muted-foreground/40 text-sm w-8 text-center select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            className={`h-8 min-w-[2rem] px-2.5 rounded-xl text-xs font-bold transition-all ${
              meta.page === p
                ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
            aria-current={meta.page === p ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-xl"
        disabled={meta.page >= meta.totalPages}
        onClick={() => onPage(meta.page + 1)}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};