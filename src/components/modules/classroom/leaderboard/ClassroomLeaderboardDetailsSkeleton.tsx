"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const ClassroomLeaderboardDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-background/40 px-4 py-5 sm:px-6 sm:py-8 md:p-10 lg:p-16">
      <div className="mx-auto max-w-7xl space-y-8 sm:space-y-10 lg:space-y-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-4">
            <Skeleton className="h-10 w-36 rounded-2xl bg-card/70" />
            <Skeleton className="h-12 w-40 rounded-2xl bg-card/80 sm:h-16 sm:w-64 md:h-20 md:w-80" />
          </div>

          <div className="flex w-full items-center gap-4 rounded-[1.75rem] border border-border/50 bg-card/50 p-4 backdrop-blur-xl sm:w-auto sm:rounded-[2rem]">
            <Skeleton className="h-10 w-10 rounded-2xl bg-primary/15" />
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-3 w-20 rounded bg-muted/60" />
              <Skeleton className="h-5 w-full rounded-lg bg-muted/70 sm:w-36" />
            </div>
          </div>
        </div>

        <section className="grid items-stretch gap-4 pt-2 sm:gap-6 sm:pt-6 md:grid-cols-3 md:items-end md:pt-10">
          <PodiumSkeleton className="order-2 md:order-1 md:pt-8" />
          <PodiumSkeleton className="order-1 md:order-2 md:-mt-12" active />
          <PodiumSkeleton className="order-3 md:order-3 md:pt-10" />
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] lg:gap-10">
          <aside className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/60 p-5 shadow-2xl backdrop-blur-3xl sm:rounded-[2.5rem] sm:p-8">
              <div className="space-y-8">
                <Skeleton className="h-7 w-32 rounded-xl bg-muted/70" />

                <div className="rounded-[1.75rem] bg-primary/40 p-5 sm:rounded-[2rem] sm:p-8">
                  <Skeleton className="h-3 w-20 rounded bg-primary/20" />
                  <Skeleton className="mt-4 h-12 w-24 rounded-2xl bg-background/20 sm:h-16 sm:w-28" />
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

          <main className="flex flex-col rounded-[2rem] border border-border/50 bg-card/40 p-5 backdrop-blur-3xl sm:rounded-[2.5rem] sm:p-8">
            <div className="mb-6 flex flex-col gap-4 px-1 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:px-2">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl bg-primary/20" />
                <Skeleton className="h-7 w-40 rounded-xl bg-muted/70" />
              </div>
              <Skeleton className="h-7 w-24 rounded-full bg-muted/60" />
            </div>

            <div className="space-y-3 sm:pr-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-center gap-3 rounded-[1.4rem] border border-border/30 bg-background/20 p-3 sm:flex-nowrap sm:gap-5 sm:rounded-[1.8rem] sm:p-4"
                >
                  <Skeleton className="h-10 w-10 rounded-xl bg-muted/70 sm:h-12 sm:w-12 sm:rounded-2xl" />
                  <Skeleton className="h-10 w-10 rounded-full bg-muted/70 sm:h-12 sm:w-12" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-28 rounded-md bg-muted/70 sm:w-36" />
                    <Skeleton className="h-3 w-20 rounded bg-muted/50" />
                  </div>

                  <div className="ml-auto min-w-[68px] space-y-2 text-right">
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
      "rounded-[2rem] border border-border/50 bg-card/60 p-5 text-center shadow-xl backdrop-blur-2xl sm:rounded-[3rem] sm:p-8",
      active ? "ring-4 ring-primary/10 sm:scale-[1.02] md:scale-110 md:py-16" : "opacity-90",
      className
    )}
  >
    <div className="mb-6 flex justify-center">
      <Skeleton className="h-20 w-20 rounded-full bg-muted/70 sm:h-24 sm:w-24 md:h-28 md:w-28" />
    </div>
    <Skeleton className="mx-auto h-6 w-32 rounded-lg bg-muted/70" />
    <Skeleton className="mx-auto mt-3 h-3 w-20 rounded bg-primary/20" />
    <div className="mt-8 rounded-2xl border border-border/40 bg-background/50 px-6 py-4">
      <Skeleton className="mx-auto h-8 w-16 rounded-lg bg-muted/70" />
      <Skeleton className="mx-auto mt-3 h-3 w-20 rounded bg-muted/50" />
    </div>
  </div>
);
