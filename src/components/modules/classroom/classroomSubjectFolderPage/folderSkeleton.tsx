import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const FolderSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card 
          key={i} 
          className="relative flex flex-col overflow-hidden rounded-[2.5rem] bg-card/40 border-border/50 p-7 min-h-[220px]"
        >
          {/* Top Row: Icon & Menu Placeholder */}
          <div className="flex justify-between items-start mb-8">
            <Skeleton className="h-14 w-14 rounded-2xl bg-orange-500/10 animate-pulse" />
            <Skeleton className="h-10 w-10 rounded-xl bg-muted/50" />
          </div>

          {/* Content Area Placeholder */}
          <div className="mt-auto space-y-4">
            <div className="space-y-2">
              {/* Eyebrow text skeleton */}
              <Skeleton className="h-3 w-12 rounded-full bg-orange-500/10" />
              {/* Folder Name skeleton */}
              <Skeleton className="h-8 w-3/4 rounded-xl bg-muted/80" />
            </div>

            {/* Bottom Stats bar placeholder */}
            <div className="pt-4 border-t border-border/50 flex justify-between items-center">
              <Skeleton className="h-4 w-24 rounded-md bg-muted/40" />
              <div className="flex gap-1">
                <Skeleton className="h-1 w-8 rounded-full bg-orange-500/20" />
                <Skeleton className="h-1 w-4 rounded-full bg-muted/20" />
                <Skeleton className="h-1 w-4 rounded-full bg-muted/20" />
              </div>
            </div>
          </div>

          {/* Decorative Glow Placeholder */}
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/5 blur-2xl" />
        </Card>
      ))}
    </div>
  );
};