"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const ClassroomLeaderboardDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-background/40 p-4 md:p-10 lg:p-16">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-4">
            <Skeleton className="h-10 w-36 rounded-2xl bg-card/70" />
            <Skeleton className="h-16 w-64 rounded-2xl bg-card/80 md:h-20 md:w-80" />
          </div>

          <div className="flex items-center gap-4 rounded-[2rem] border border-border/50 bg-card/50 p-4 backdrop-blur-xl">
            <Skeleton className="h-10 w-10 rounded-2xl bg-primary/15" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 rounded bg-muted/60" />
              <Skeleton className="h-5 w-36 rounded-lg bg-muted/70" />
            </div>
          </div>
        </div>

        <section className="grid items-end gap-6 pt-10 md:grid-cols-3">
          <PodiumSkeleton className="order-2 md:order-1 md:pt-8" />
          <PodiumSkeleton className="order-1 md:order-2 md:-mt-12" active />
          <PodiumSkeleton className="order-3 md:order-3 md:pt-10" />
        </section>

        <div className="grid gap-10 lg:grid-cols-[380px_1fr]">
          <aside className="space-y-6">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/60 p-8 shadow-2xl backdrop-blur-3xl">
              <div className="space-y-8">
                <Skeleton className="h-7 w-32 rounded-xl bg-muted/70" />

                <div className="rounded-[2rem] bg-primary/40 p-8">
                  <Skeleton className="h-3 w-20 rounded bg-primary/20" />
                  <Skeleton className="mt-4 h-16 w-28 rounded-2xl bg-background/20" />
                  <Skeleton className="mt-4 h-7 w-24 rounded-full bg-background/30" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-[1.8rem] border border-border/50 bg-background/50 p-5"
                    >
                      <Skeleton className="mb-3 h-3 w-12 rounded bg-muted/60" />
                      <Skeleton className="h-8 w-12 rounded-lg bg-muted/70" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="flex flex-col rounded-[2.5rem] border border-border/50 bg-card/40 p-8 backdrop-blur-3xl">
            <div className="mb-10 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl bg-primary/20" />
                <Skeleton className="h-7 w-40 rounded-xl bg-muted/70" />
              </div>
              <Skeleton className="h-7 w-24 rounded-full bg-muted/60" />
            </div>

            <div className="space-y-3 pr-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-5 rounded-[1.8rem] border border-border/30 bg-background/20 p-4"
                >
                  <Skeleton className="h-12 w-12 rounded-2xl bg-muted/70" />
                  <Skeleton className="h-12 w-12 rounded-full bg-muted/70" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-36 rounded-md bg-muted/70" />
                    <Skeleton className="h-3 w-20 rounded bg-muted/50" />
                  </div>

                  <div className="space-y-2 text-right">
                    <Skeleton className="ml-auto h-6 w-12 rounded-md bg-primary/20" />
                    <Skeleton className="ml-auto h-3 w-10 rounded bg-muted/50" />
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const PodiumSkeleton = ({
  className,
  active = false,
}: {
  className?: string;
  active?: boolean;
}) => (
  <div
    className={cn(
      "rounded-[3rem] border border-border/50 bg-card/60 p-8 text-center shadow-xl backdrop-blur-2xl",
      active ? "ring-4 ring-primary/10 md:scale-110 md:py-16" : "opacity-90",
      className
    )}
  >
    <div className="mb-6 flex justify-center">
      <Skeleton className="h-24 w-24 rounded-full bg-muted/70 md:h-28 md:w-28" />
    </div>
    <Skeleton className="mx-auto h-6 w-32 rounded-lg bg-muted/70" />
    <Skeleton className="mx-auto mt-3 h-3 w-20 rounded bg-primary/20" />
    <div className="mt-8 rounded-2xl border border-border/40 bg-background/50 px-6 py-4">
      <Skeleton className="mx-auto h-8 w-16 rounded-lg bg-muted/70" />
      <Skeleton className="mx-auto mt-3 h-3 w-20 rounded bg-muted/50" />
    </div>
  </div>
);
