"use client";

import { ArrowLeft, BookOpen, FolderOpen, Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/modules/Notes/StatusBadge";
import { UploaderAvatar } from "@/components/modules/Notes/UploaderAvatar";
import { useNoteFavorite } from "@/hooks/Usenotefavorite";
import type { INote } from "@/types/note.types";
import { formatDate } from "../NotesMainPage";

interface NoteDetailHeaderProps {
  note: INote;
  backHref: string;
}

export const NoteDetailHeader = ({ note, backHref }: NoteDetailHeaderProps) => {
  const { isFavorited, loading: favLoading, toggling, toggle } = useNoteFavorite(note.id);

  return (
    <header className="mb-10">
      {/* Back */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 mb-7 text-xs text-muted-foreground/60 font-semibold hover:text-orange-500 transition-colors group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Back to notes
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[11px] text-orange-500/70 font-bold uppercase tracking-widest mb-3 flex-wrap">
            <BookOpen className="h-3 w-3 shrink-0" />
            <span>{note.subject?.name ?? "Subject"}</span>
            {note.folder?.name && (
              <>
                <span className="opacity-30">›</span>
                <FolderOpen className="h-3 w-3 shrink-0" />
                <span>{note.folder.name}</span>
              </>
            )}
            <span className="opacity-30">›</span>
            <span className="text-foreground/60 normal-case tracking-normal font-medium truncate max-w-[200px]">
              {note.title}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight mb-3">
            {note.title}
          </h1>

          {/* Description */}
          {note.description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-4">
              {note.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={note.status} />
            <span className="text-muted-foreground/20">·</span>
            <UploaderAvatar uploader={note.uploader} />
            <span className="text-muted-foreground/20">·</span>
            <time
              dateTime={note.createdAt}
              className="text-xs text-muted-foreground/50 tabular-nums"
            >
              {formatDate(note.createdAt)}
            </time>
          </div>
        </div>

        {/* Favorite button */}
        <div className="shrink-0">
          <Button
            variant="outline"
            onClick={toggle}
            disabled={favLoading || toggling}
            className={`
              h-10 px-5 rounded-2xl gap-2 font-bold text-sm transition-all
              ${isFavorited
                ? "border-rose-500/40 bg-rose-500/8 text-rose-500 hover:bg-rose-500/15 hover:border-rose-500/60"
                : "border-border/50 hover:border-rose-500/30 hover:text-rose-500 hover:bg-rose-500/5"
              }
            `}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          >
            {toggling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart
                className={`h-4 w-4 transition-all ${
                  isFavorited ? "fill-rose-500 text-rose-500 scale-110" : ""
                }`}
              />
            )}
            {isFavorited ? "Favorited" : "Favorite"}
          </Button>
        </div>
      </div>
    </header>
  );
};