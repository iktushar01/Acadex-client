import { Skeleton } from "@/components/ui/skeleton";

export const EditSubjectPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-full bg-muted/60" />
          <Skeleton className="h-4 w-32 rounded-md bg-muted/60" />
        </div>

        <header className="mb-10">
          <div className="mb-3 flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full bg-orange-500/20" />
            <Skeleton className="h-3 w-20 rounded-full bg-orange-500/20" />
          </div>
          <Skeleton className="h-12 w-72 rounded-2xl bg-muted/70" />
        </header>

        <div className="space-y-10">
          <div className="space-y-4">
            <Skeleton className="ml-1 h-3 w-28 rounded-full bg-muted/60" />
            <Skeleton className="h-16 w-full rounded-[1.5rem] bg-card/80" />
          </div>

          <div className="space-y-4">
            <div className="ml-1 flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full bg-muted/60" />
              <Skeleton className="h-3 w-36 rounded-full bg-muted/60" />
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[1.5rem] border border-border/40 bg-card/40 p-1"
                >
                  <Skeleton className="aspect-[4/3] w-full rounded-[1.2rem] bg-muted/70" />
                </div>
              ))}
            </div>
          </div>

          <Skeleton className="h-16 w-full rounded-[1.5rem] bg-orange-500/20" />
        </div>
      </div>
    </div>
  );
};
