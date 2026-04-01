"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const ClassroomLeaderboardDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-background/40 px-4 py-6 sm:px-8 sm:py-10 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-10 sm:space-y-12 lg:space-y-16">
        {/* Header Skeleton */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <Skeleton className="h-8 w-32 rounded-2xl bg-card/70" />
            <Skeleton className="h-16 w-48 rounded-2xl bg-card/80 sm:h-20 sm:w-64 md:h-24 md:w-80" />
          </div>

          <div className="flex w-full items-center gap-4 rounded-[1.75rem] border border-border/50 bg-card/50 p-4 backdrop-blur-xl sm:w-fit sm:rounded-[2rem] sm:px-6">
            <Skeleton className="h-10 w-10 rounded-2xl bg-primary/15" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 bg-muted/60" />
              <Skeleton className="h-5 w-32 bg-muted/70" />
            </div>
          </div>
        </div>

        {/* Podium Skeleton */}
        <section className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-3 md:items-end md:gap-4 md:pt-16">
          <PodiumSkeleton className="order-2 md:order-1" />
          <PodiumSkeleton className="order-1 md:order-2" active />
          <PodiumSkeleton className="order-3 md:order-3" />
        </section>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[350px_1fr] lg:gap-12">
          <aside className="space-y-6">
            <div className="rounded-[2.5rem] border border-border/50 bg-card/60 p-8 shadow-2xl backdrop-blur-3xl">
              <div className="space-y-8">
                <Skeleton className="h-7 w-32 bg-muted/70" />
                <div className="rounded-[2rem] bg-primary/40 p-8">
                  <Skeleton className="h-3 w-20 bg-primary/20" />
                  <Skeleton className="mt-4 h-16 w-28 bg-background/20" />
                  <Skeleton className="mt-6 h-8 w-24 rounded-full bg-background/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-24 rounded-[1.8rem] bg-background/50" />
                  <Skeleton className="h-24 rounded-[1.8rem] bg-background/50" />
                </div>
              </div>
            </div>
          </aside>

          <main className="rounded-[2.5rem] border border-border/50 bg-card/40 p-8 backdrop-blur-3xl">
            <div className="mb-8 flex justify-between">
              <Skeleton className="h-10 w-48 bg-muted/70" />
              <Skeleton className="h-8 w-24 rounded-full bg-muted/60" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-[2rem] bg-background/20" />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

const PodiumSkeleton = ({ className, active = false }: { className?: string; active?: boolean }) => (
  <div className={cn(
    "flex flex-col items-center rounded-[2.5rem] border border-border/50 bg-card/60 p-8 shadow-xl backdrop-blur-2xl sm:rounded-[3rem]",
    active ? "md:-mt-12 md:scale-105 md:py-12 lg:scale-110 lg:py-16" : "opacity-90",
    className
  )}>
    <Skeleton className="h-24 w-24 rounded-full bg-muted/70 md:h-28 md:w-28 lg:h-32 lg:w-32" />
    <Skeleton className="mt-6 h-6 w-32 bg-muted/70" />
    <Skeleton className="mt-2 h-3 w-20 bg-primary/20" />
    <Skeleton className="mt-8 h-20 w-full rounded-2xl bg-background/50" />
  </div>
);