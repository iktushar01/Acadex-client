import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const FolderSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="rounded-[2rem] p-6 bg-card/40 border-border overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <Skeleton className="h-14 w-14 rounded-2xl bg-orange-500/10" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-7 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
        </Card>
      ))}
    </div>
  );
};