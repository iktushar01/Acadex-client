"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ClassroomSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card
          key={i}
          className="rounded-[2rem] border-border/40 bg-card/60 p-4 backdrop-blur-xl sm:p-6"
        >
          <div className="flex h-full animate-pulse flex-col">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <Skeleton className="h-12 w-12 rounded-2xl bg-muted/50 sm:h-14 sm:w-14" />
              <div className="flex w-full flex-row items-start justify-between gap-3 sm:w-auto sm:flex-col sm:items-end">
                <div className="flex flex-wrap gap-1.5 sm:justify-end">
                  <Skeleton className="h-5 w-20 rounded-full bg-muted/50" />
                  <Skeleton className="h-5 w-14 rounded-full bg-muted/50" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full bg-muted/50" />
              </div>
            </div>

            <div className="mt-4 flex-1 space-y-4 sm:mt-6">
              <div className="space-y-3">
                <Skeleton className="h-7 w-3/4 rounded-xl bg-muted/50 sm:h-8" />
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-5 w-12 rounded-md bg-muted/50" />
                  <Skeleton className="h-4 w-24 rounded-md bg-muted/50" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Skeleton className="h-20 rounded-2xl bg-muted/50" />
                <Skeleton className="h-20 rounded-2xl bg-muted/50" />
                <Skeleton className="h-20 rounded-2xl bg-muted/50" />
                <Skeleton className="h-20 rounded-2xl bg-muted/50" />
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border/30 bg-secondary/20 p-3">
                <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded-md bg-muted/50" />
                  <Skeleton className="h-3 w-24 rounded-md bg-muted/50" />
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-border/50 pt-4 sm:mt-8 sm:pt-5">
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                {i % 2 !== 0 && <Skeleton className="h-11 w-full rounded-2xl bg-muted/50" />}
                <Skeleton
                  className={`h-11 w-full rounded-2xl bg-muted/50 ${i % 2 === 0 ? "sm:col-span-2" : ""}`}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
