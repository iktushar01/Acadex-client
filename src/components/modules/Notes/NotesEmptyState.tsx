"use client";
  
import { FileQuestion, AlertCircle, RefreshCw, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
  
interface EmptyStateProps {
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}
  
export const NotesEmptyState = ({
  hasActiveFilters,
  onClearFilters,
}: EmptyStateProps) => {
  return (
    <Card className="p-12 text-center border-dashed border-2 border-border/40 bg-muted/5 rounded-[2rem] flex flex-col items-center gap-6 max-w-2xl mx-auto mt-10 transition-all hover:bg-muted/10">
      <div className="relative group">
        <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative h-20 w-20 rounded-3xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner">
          {hasActiveFilters ? (
            <FilterX className="h-10 w-10 text-orange-500/60" />
          ) : (
            <FileQuestion className="h-10 w-10 text-orange-500/60" />
          )}
        </div>
      </div>
  
      <div className="space-y-2">
        <h3 className="text-2xl font-black tracking-tight">
          {hasActiveFilters ? "No matches found" : "No notes yet"}
        </h3>
        <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto leading-relaxed">
          {hasActiveFilters
            ? "Try adjusting your search or status filters to find what you're looking for."
            : "This space is waiting for knowledge. Be the first to share a note!"}
        </p>
      </div>
  
      {hasActiveFilters && (
        <Button
          onClick={onClearFilters}
          variant="outline"
          className="rounded-xl px-6 font-bold gap-2 hover:bg-orange-500/5 hover:text-orange-500 hover:border-orange-500/30 transition-all active:scale-95"
        >
          Clear all filters
        </Button>
      )}
    </Card>
  );
};
  
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}
  
export const NotesErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <Card className="p-10 text-center border-destructive/20 bg-destructive/5 rounded-3xl flex flex-col items-center gap-5 max-w-lg mx-auto mt-10 shadow-sm">
      <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center border border-destructive/20 mb-1">
        <AlertCircle className="h-7 w-7 text-destructive/60" />
      </div>
  
      <div className="space-y-1.5">
        <p className="font-black text-destructive tracking-tight text-lg">Load error</p>
        <p className="text-sm text-muted-foreground font-medium">{message}</p>
      </div>
  
      <Button
        onClick={onRetry}
        variant="ghost"
        className="rounded-xl px-6 font-bold gap-2 text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95 border border-transparent hover:border-destructive/20 px-5"
      >
        <RefreshCw className="h-4 w-4" />
        Try again
      </Button>
    </Card>
  );
};
