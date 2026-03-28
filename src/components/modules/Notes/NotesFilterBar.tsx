"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FILTER_OPTIONS } from "@/lib/Noteconstants";
import type { NoteStatus } from "@/types/note.types";

interface NotesFilterBarProps {
  searchTerm: string;
  status: NoteStatus | "";
  onSearch: (val: string) => void;
  onStatus: (val: NoteStatus | "") => void;
}

export const NotesFilterBar = ({
  searchTerm,
  status,
  onSearch,
  onStatus,
}: NotesFilterBarProps) => (
  <div className="flex flex-col sm:flex-row gap-3 mb-8">
    {/* Search */}
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
      <Input
        placeholder="Search notes…"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="
          h-12 pl-11 rounded-2xl
          border-border/50 bg-card/40 backdrop-blur-md
          focus-visible:ring-1 focus-visible:ring-orange-500/30
          focus-visible:border-orange-500/30
          placeholder:text-muted-foreground/40
          transition-all
        "
      />
    </div>

    {/* Status filter pills */}
    <div className="flex items-center gap-1.5 bg-card/30 border border-border/40 rounded-2xl p-1.5 backdrop-blur-sm">
      <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground/40 ml-1.5 shrink-0" />
      {FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onStatus(opt.value)}
          className={`
            px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap
            ${
              status === opt.value
                ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);