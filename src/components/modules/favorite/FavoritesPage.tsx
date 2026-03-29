"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UploaderAvatar } from "@/components/modules/Notes/UploaderAvatar";
import { StatusBadge } from "@/components/modules/Notes/StatusBadge";
import { IFavoriteNoteItem } from "@/types/note.types";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  FileText,
  Heart,
  Sparkles,
  Bookmark,
  Search
} from "lucide-react";

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const FavoritesEmptyState = () => (
  <Card className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-border/60 bg-card/20 p-8 md:p-20 text-center backdrop-blur-sm">
    <div className="mx-auto mb-6 flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-primary/20 to-primary/5">
      <Heart className="h-8 w-8 md:h-10 md:w-10 text-primary animate-pulse" />
    </div>
    <h2 className="text-xl md:text-3xl font-black tracking-tight">Your library is quiet...</h2>
    <p className="mx-auto mt-2 text-sm md:text-base text-muted-foreground/80">
      Save study materials to access them instantly here.
    </p>
    <Button asChild size="lg" className="mt-6 w-full md:w-auto rounded-xl font-bold">
      <Link href="/dashboard/classroom"><Search className="mr-2 h-4 w-4" /> Browse Notes</Link>
    </Button>
  </Card>
);

const FavoriteNoteCard = ({ favorite }: { favorite: IFavoriteNoteItem }) => {
  const { note, savedAt } = favorite;

  return (
    <Link href={`/dashboard/classroom/notes/${note.id}`} className="group block h-full">
      <Card className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/40 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-primary/40 active:scale-[0.98]">
        <div className="p-5 md:p-7 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Saved Note</span>
              <StatusBadge status={note.status} compact />
            </div>
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Heart className="h-4 w-4 md:h-5 md:w-5 fill-current" />
            </div>
          </div>

          {/* Title */}
          <div className="mt-5 md:mt-8 space-y-2">
            <h3 className="text-xl md:text-2xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {note.title}
            </h3>
            <p className="line-clamp-2 text-xs md:text-sm font-medium text-muted-foreground/70">
              {note.description || "View details for full files and discussion."}
            </p>
          </div>

          {/* Tags - Mobile Scrollable/Wrap */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1 text-[10px] md:text-[11px] font-bold border border-border/20">
              <BookOpen className="h-3 w-3 text-primary" />
              <span className="truncate max-w-[80px]">{note.subject?.name ?? "General"}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg bg-muted/40 px-2.5 py-1 text-[10px] md:text-[11px] font-bold border border-border/20">
              <FileText className="h-3 w-3 text-primary" />
              <span>{note.files.length} Files</span>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="mt-auto pt-6">
            <div className="flex items-center justify-between rounded-2xl bg-muted/30 p-3 md:p-4 border border-border/20">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <UploaderAvatar uploader={note.uploader} className="h-8 w-8 md:h-10 md:w-10 ring-1 ring-primary/20" />
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-[11px] md:text-xs font-black uppercase">{note.uploader.name}</span>
                  <span className="text-[9px] md:text-[10px] text-muted-foreground">{formatDate(savedAt)}</span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const FavoritesPage = ({ favorites, error }: { favorites: IFavoriteNoteItem[]; error?: string; }) => {
  return (
    <div className="relative min-h-screen bg-background pb-10">
      {/* Background Decor */}
      <div className="fixed -left-20 top-0 -z-10 h-64 w-64 rounded-full bg-primary/5 blur-[80px] md:blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-12 md:py-12">
        {/* Page Header - Responsive padding & direction */}
        <div className="relative mb-8 overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-border/50 bg-white/40 p-6 md:p-10 backdrop-blur-2xl dark:bg-card/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 md:space-y-4">
              <Badge className="rounded-full bg-primary px-3 py-0.5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white">
                <Sparkles className="mr-1 h-3 w-3" /> Library
              </Badge>
              <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-none">
                Saved <span className="text-primary">Notes</span>
              </h1>
              <p className="text-sm md:text-lg text-muted-foreground/80 max-w-md">
                Your curated collection of important study materials.
              </p>
            </div>

            {/* Stat Box - Slimmer on mobile */}
            <div className="flex flex-row md:flex-col items-center justify-between md:justify-center rounded-2xl bg-background/80 p-4 md:p-8 border border-border/20 md:min-w-[150px]">
              <div className="flex flex-col md:items-center">
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">Total</span>
                <span className="text-3xl md:text-5xl font-black leading-none">{favorites.length}</span>
              </div>
              <Bookmark className="h-5 w-5 md:h-6 md:w-6 text-primary/40 md:mt-4" />
            </div>
          </div>
        </div>

        {/* Content */}
        {error ? (
          <div className="p-10 text-center text-destructive font-bold">{error}</div>
        ) : favorites.length === 0 ? (
          <FavoritesEmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <FavoriteNoteCard key={favorite.favoriteId} favorite={favorite} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;