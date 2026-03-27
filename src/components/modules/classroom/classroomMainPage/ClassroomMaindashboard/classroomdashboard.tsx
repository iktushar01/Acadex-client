"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Components
import { ClassroomCard } from "@/components/modules/classroom/classroomMainPage/ClassroomMaindashboard/ClassroomCard";
import { ClassroomHeader } from "@/components/modules/classroom/classroomMainPage/ClassroomMaindashboard/ClassroomHeader";
import { ClassroomSkeleton } from "@/components/modules/classroom/classroomMainPage/ClassroomMaindashboard/ClassroomSkeleton";

// Server Action
import { fetchMyClassroomsAction } from "@/actions/classroomActions/_fetchMyClassroomsAction";

export default function ClassroomDashboard() {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchMyClassroomsAction();
        if (result.success) {
          setMemberships(result.data || []);
        } else {
          setError(result.error as string || "Failed to load classrooms.");
        }
      } catch (err) {
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
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <ClassroomHeader />

        {/* SEARCH BAR */}
        <div className="relative mb-10 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
          <Input
            placeholder="Search by name, teacher or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-12 rounded-[1.5rem] border-border bg-card/50 backdrop-blur-sm focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemberships.map((item) => (
              <ClassroomCard key={item.classroom.id} membership={item} />
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