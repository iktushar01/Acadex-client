"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ClassroomSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card
          key={i}
          className="rounded-[2.5rem] border-border bg-card/50 p-4 sm:p-6"
        >
          <div className="flex h-full animate-pulse flex-col">
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl bg-muted/50 sm:h-14 sm:w-14" />
              <div className="flex flex-col items-end gap-2">
                <div className="flex flex-wrap justify-end gap-1.5">
                  <Skeleton className="h-5 w-20 rounded-full bg-muted/50" />
                  <Skeleton className="h-5 w-14 rounded-full bg-muted/50" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full bg-muted/50" />
              </div>
            </div>

            <div className="mt-4 flex-1 space-y-4 sm:mt-8 sm:space-y-5">
              <div className="space-y-3">
                <Skeleton className="h-7 w-3/4 rounded-xl bg-muted/50 sm:h-8" />
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-5 w-12 rounded-md bg-muted/50" />
                  <Skeleton className="h-4 w-24 rounded-md bg-muted/50" />
                </div>
              </div>

              <div className="hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2">
                <Skeleton className="h-12 rounded-xl bg-muted/50" />
                <Skeleton className="h-12 rounded-xl bg-muted/50" />
              </div>

              <div className="hidden items-center justify-between rounded-xl border border-border/30 bg-secondary/20 px-3 py-2.5 sm:flex">
                <Skeleton className="h-3 w-28 rounded-full bg-muted/50" />
                <Skeleton className="h-5 w-8 rounded-md bg-muted/50" />
              </div>

              <div className="hidden items-center gap-3 sm:flex">
                <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 rounded-md bg-muted/50" />
                  <Skeleton className="h-3 w-24 rounded-md bg-muted/50" />
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-border/50 pt-4 sm:mt-8 sm:pt-5">
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <Skeleton className="h-11 w-full rounded-2xl bg-muted/50" />
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
