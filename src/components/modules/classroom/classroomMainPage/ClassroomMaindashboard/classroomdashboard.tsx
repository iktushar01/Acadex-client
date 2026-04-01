"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Membership } from "@/types/classroom.types";
import type { Notice } from "@/types/notice.types";

// Components
import { ClassroomCard } from "@/components/modules/classroom/classroomMainPage/ClassroomMaindashboard/ClassroomCard";
import { ClassroomHeader } from "@/components/modules/classroom/classroomMainPage/ClassroomMaindashboard/ClassroomHeader";
import { ClassroomSkeleton } from "@/components/modules/classroom/classroomMainPage/ClassroomMaindashboard/ClassroomSkeleton";
import ClassroomNoticeCenter from "@/components/modules/classroom/classroomMainPage/ClassroomMaindashboard/ClassroomNoticeCenter";

// Server Action
import { fetchMyClassroomsAction } from "@/actions/classroomActions/_fetchMyClassroomsAction";
import { getCurrentNoticeAction } from "@/actions/noticeActions";

export default function ClassroomDashboard() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [classroomResult, noticeResult] = await Promise.all([
          fetchMyClassroomsAction(),
          getCurrentNoticeAction(),
        ]);

        if (classroomResult.success) {
          setMemberships(classroomResult.data || []);
        } else {
          setError(classroomResult.error as string || "Failed to load classrooms.");
        }

        if (noticeResult.success) {
          setNotice(noticeResult.data || null);
        }
      } catch {
        setError("A network error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter classrooms based on search input
  const filteredMemberships = memberships.filter((item) =>
    item.classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.classroom.institutionName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
      <ClassroomNoticeCenter notice={notice} />
      <div className="mx-auto max-w-7xl">
        <ClassroomHeader />

        {/* SEARCH BAR */}
        <div className="group relative mb-8 sm:mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
          <Input
            placeholder="Search by name, teacher or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 rounded-[1.25rem] border-border bg-card/50 pl-12 text-sm backdrop-blur-sm transition-all focus-visible:border-orange-500 focus-visible:ring-orange-500/20 sm:h-14 sm:rounded-[1.5rem] sm:text-base"
          />
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <ClassroomSkeleton />
        ) : error ? (
          /* ERROR STATE */
          <div className="text-center py-20 bg-destructive/5 rounded-[2.5rem] border border-destructive/20">
            <p className="text-destructive font-bold">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="mt-4 rounded-xl border-destructive/20 hover:bg-destructive/10"
            >
              Try Again
            </Button>
          </div>
        ) : filteredMemberships.length > 0 ? (
          /* DATA GRID */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
            {filteredMemberships.map((item) => (
              <ClassroomCard
                key={item.classroom.id}
                membership={item}
                onLeftClassroom={(classroomId) =>
                  setMemberships((current) =>
                    current.filter((membership) => membership.classroom.id !== classroomId)
                  )
                }
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-20 bg-muted/20 rounded-[2.5rem] border border-dashed border-muted-foreground/20">
            <p className="text-muted-foreground font-medium">
              {searchQuery ? "No classrooms match your search." : "No classrooms found. Join or create one to get started!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
