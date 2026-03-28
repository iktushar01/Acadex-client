import { FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ─── Empty State ──────────────────────────────────────────────────────────────

interface NotesEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export const NotesEmptyState = ({
  hasActiveFilters,
  onClearFilters,
}: NotesEmptyStateProps) => (
  <div className="text-center py-20 border-2 border-dashed border-border/30 rounded-2xl bg-card/10 backdrop-blur-sm">
    <div className="relative inline-flex mb-5">
      <FileText className="h-14 w-14 text-muted-foreground/15" />
      {hasActiveFilters && (
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center">
          !
        </span>
      )}
    </div>
    <h3 className="text-lg font-bold text-muted-foreground mb-1">
      {hasActiveFilters ? "No Matching Notes" : "No Notes Yet"}
    </h3>
    <p className="text-sm text-muted-foreground/50 mb-6 max-w-xs mx-auto">
      {hasActiveFilters
        ? "Try adjusting your search or filter to find what you're looking for."
        : "Be the first to share your study notes with the class!"}
    </p>
    {hasActiveFilters && (
      <Button
        variant="outline"
        size="sm"
        onClick={onClearFilters}
        className="rounded-xl text-xs"
      >
        Clear Filters
      </Button>
    )}
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────

interface NotesErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const NotesErrorState = ({
  message,
  onRetry,
}: NotesErrorStateProps) => (
  <Card className="p-10 text-center border-destructive/20 bg-destructive/5 rounded-2xl">
    <AlertCircle className="h-10 w-10 text-destructive/60 mx-auto mb-3" />
    <p className="text-destructive font-bold mb-1">Something went wrong</p>
    <p className="text-sm text-muted-foreground mb-5">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="outline" size="sm" className="rounded-xl">
        Try Again
      </Button>
    )}
  </Card>
);