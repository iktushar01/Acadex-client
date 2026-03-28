"use client";

import { CheckCircle2, XCircle, Trash2, MoreVertical, Loader2, Paperclip, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/modules/Notes/StatusBadge";
import { FileChip } from "@/components/modules/Notes/FileChip";
import { UploaderAvatar } from "@/components/modules/Notes/UploaderAvatar";
import type { INote } from "@/types/note.types";
import { formatDate } from "./NotesMainPage";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NoteCardProps {
  note: INote;
  isCR: boolean;
  isActioning: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

// ─── CardActions (internal) ───────────────────────────────────────────────────

const CardActions = ({
  note,
  isCR,
  onApprove,
  onReject,
  onDelete,
}: Pick<NoteCardProps, "note" | "isCR" | "onApprove" | "onReject" | "onDelete">) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        // Stop propagation so clicking the menu doesn't navigate to detail
        onClick={(e) => e.stopPropagation()}
        className="h-7 w-7 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted/60 shrink-0"
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="rounded-xl min-w-[148px]">
      {isCR && note.status === "PENDING" && (
        <>
          <DropdownMenuItem
            onClick={(e) => { e.stopPropagation(); onApprove(note.id); }}
            className="text-emerald-500 focus:text-emerald-500 focus:bg-emerald-500/10 cursor-pointer gap-2"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => { e.stopPropagation(); onReject(note.id); }}
            className="text-amber-500 focus:text-amber-500 focus:bg-amber-500/10 cursor-pointer gap-2"
          >
            <XCircle className="h-3.5 w-3.5" />
            Reject
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </>
      )}
      <DropdownMenuItem
        onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
        className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

// ─── NoteCard ─────────────────────────────────────────────────────────────────

export const NoteCard = ({
  note,
  isCR,
  isActioning,
  onApprove,
  onReject,
  onDelete,
}: NoteCardProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/classroom/notes/${note.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      aria-label={`Open note: ${note.title}`}
      className="
        group relative flex flex-col gap-0 cursor-pointer select-none
        rounded-2xl border border-border/50
        bg-card/40 backdrop-blur-sm
        hover:border-orange-500/30 hover:bg-card/80
        hover:shadow-xl hover:shadow-orange-500/5
        active:scale-[0.99] transition-all duration-200 overflow-hidden
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40
      "
    >
      {/* Status accent strip */}
      <div
        className={`h-0.5 w-full shrink-0 transition-all duration-300 ${
          note.status === "APPROVED"
            ? "bg-emerald-500/50"
            : note.status === "REJECTED"
            ? "bg-red-500/50"
            : "bg-amber-500/30 group-hover:bg-amber-500/60"
        }`}
      />

      {/* Action loading overlay */}
      {isActioning && (
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20">
          <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
        </div>
      )}

      {/* Open indicator — top-right corner, visible on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
        <div className="h-5 w-5 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
          <ArrowUpRight className="h-3 w-3 text-orange-500" />
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm leading-snug tracking-tight line-clamp-2 pr-1">
              {note.title}
            </h3>
            {note.description && (
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {note.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <StatusBadge status={note.status} compact />
            <CardActions
              note={note}
              isCR={isCR}
              onApprove={onApprove}
              onReject={onReject}
              onDelete={onDelete}
            />
          </div>
        </div>

        {/* Files summary (non-clickable on card — full download on detail page) */}
        {note.files.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50 font-semibold uppercase tracking-wider">
              <Paperclip className="h-2.5 w-2.5" />
              {note.files.length} attachment{note.files.length !== 1 ? "s" : ""}
            </div>
            {/* Show chips but block their link navigation so card click wins */}
            <div
              className="flex flex-wrap gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              {note.files.map((file) => (
                <FileChip key={file.id} file={file} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <UploaderAvatar uploader={note.uploader} />
          <time
            dateTime={note.createdAt}
            className="text-[10px] text-muted-foreground/40 font-medium tabular-nums"
          >
            {formatDate(note.createdAt)}
          </time>
        </div>
      </div>
    </Card>
  );
};