"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const ClassroomSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="rounded-[2.5rem] border-border bg-card/50 p-6 space-y-6">
          {/* Top Row: Icon and Badge */}
          <div className="flex justify-between items-start">
            <Skeleton className="h-12 w-12 rounded-2xl bg-muted/50" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-lg bg-muted/50" />
              <Skeleton className="h-8 w-8 rounded-full bg-muted/50" />
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="space-y-3">
            <Skeleton className="h-7 w-3/4 rounded-lg bg-muted/50" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2 rounded-md bg-muted/50" />
              <Skeleton className="h-3 w-1/3 rounded-md bg-muted/50" />
            </div>
          </div>

          {/* Bottom Row: Avatar and Button */}
          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full bg-muted/50" />
              <Skeleton className="h-3 w-20 rounded-md bg-muted/50" />
            </div>
            <Skeleton className="h-9 w-24 rounded-xl bg-muted/50" />
          </div>
        </Card>
      ))}
    </div>
  );
};