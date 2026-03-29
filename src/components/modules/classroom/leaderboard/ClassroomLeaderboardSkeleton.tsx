"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const ClassroomLeaderboardSkeleton = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="relative flex min-h-[300px] flex-col overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/40 p-7 shadow-sm backdrop-blur-xl"
        >
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-[60px]" />

          <div className="mb-8 flex items-center justify-between">
            <Skeleton className="h-6 w-24 rounded-lg bg-background/60" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full bg-primary/15" />
              <Skeleton className="h-4 w-8 rounded bg-background/60" />
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-3/4 rounded-xl bg-background/70" />
            <Skeleton className="h-4 w-2/3 rounded-md bg-background/50" />
          </div>

          <div className="my-8 grid grid-cols-2 gap-3">
            <div className="space-y-3 rounded-3xl border border-border/40 bg-background/60 p-4">
              <Skeleton className="h-3 w-16 rounded-md bg-muted/60" />
              <Skeleton className="h-8 w-14 rounded-lg bg-muted/70" />
            </div>
            <div className="space-y-3 rounded-3xl border border-border/40 bg-background/60 p-4">
              <Skeleton className="h-3 w-16 rounded-md bg-muted/60" />
              <Skeleton className="h-5 w-20 rounded-lg bg-muted/70" />
            </div>
          </div>

          <Skeleton className="mt-auto h-14 w-full rounded-2xl bg-primary/20" />
        </div>
      ))}
    </div>
  );
};
