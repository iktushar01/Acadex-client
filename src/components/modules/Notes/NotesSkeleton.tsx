export const NotesSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="rounded-2xl border border-border/30 bg-card/30 overflow-hidden animate-pulse"
        style={{ animationDelay: `${i * 60}ms` }}
      >
        {/* accent strip */}
        <div className="h-0.5 bg-muted/40" />

        <div className="p-5 flex flex-col gap-4">
          {/* header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-muted/40 rounded-lg w-3/4" />
              <div className="h-2.5 bg-muted/30 rounded-lg w-full" />
              <div className="h-2.5 bg-muted/20 rounded-lg w-2/3" />
            </div>
            <div className="h-5 w-16 bg-muted/30 rounded-full shrink-0" />
          </div>

          {/* files */}
          <div className="flex gap-2">
            <div className="h-7 bg-muted/25 rounded-xl w-28" />
            <div className="h-7 bg-muted/20 rounded-xl w-24" />
          </div>

          {/* footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border/20">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted/30" />
              <div className="h-2.5 bg-muted/25 rounded w-20" />
            </div>
            <div className="h-2 bg-muted/15 rounded w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);