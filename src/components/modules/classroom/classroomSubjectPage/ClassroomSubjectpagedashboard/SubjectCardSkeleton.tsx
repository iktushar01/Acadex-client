"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export const SubjectCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-card border-none p-0 shadow-sm h-full">
        {/* Matches Image Section (h-48) */}
        <Skeleton className="h-48 w-full rounded-none shrink-0" />

        {/* Matches Content Section Padding (p-6 pt-5) */}
        <div className="flex flex-col flex-grow px-6 pb-6 pt-5 bg-card">
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              {/* Matches "Subject" Label Tag */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-1 w-6 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>

              {/* Matches Large Subject Title */}
              <Skeleton className="h-8 w-[85%] rounded-lg" />

              {/* Matches Resource Count Section */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex -space-x-1">
                  <Skeleton className="h-4 w-4 rounded-full border border-card" />
                  <Skeleton className="h-4 w-4 rounded-full border border-card" />
                </div>
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            </div>
          </div>

          {/* Matches Bottom Button (h-12 rounded-full) */}
          <div className="mt-auto">
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};