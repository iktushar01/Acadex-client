"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { BookOpen, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

// Actions & Hooks
import { fetchSubjectsAction } from "@/actions/classroomSubject/_fetchSubjectsAction";
import { deleteSubjectAction } from "@/actions/classroomSubject/_DeleteSubjectAction";
import { useClassroomRole } from "@/hooks/useClassroomRole";

// Types
import { Subject } from "@/types/classroomSubject.types";

// Components
import { SubjectHeader } from "./SubjectHeader";
import { SubjectCard } from "./SubjectCard";

export default function ClassroomSubjectPage() {
  const { id } = useParams();
  const classroomId = id as string;

  const { isCR, roleLoading } = useClassroomRole(classroomId);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    if (!classroomId) return;
    setLoading(true);
    try {
      const result = await fetchSubjectsAction(classroomId);
      if (result.success) setSubjects(result.data || []);
      else setError(result.error as string);
    } catch (err) {
      setError("An unexpected error occurred while fetching subjects.");
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async (subjectId: string) => {
    const result = await deleteSubjectAction(subjectId, classroomId);
    if (result.success) {
      toast.success("Subject deleted successfully");
      loadData();
    } else {
      toast.error(result.error || "Failed to delete subject");
    }
  };

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || roleLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loading Curriculum</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <SubjectHeader isCR={isCR} classroomId={classroomId} />

        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 pl-12 rounded-2xl border-border bg-card/50 backdrop-blur-sm focus-visible:ring-orange-500/20"
          />
        </div>

        {error ? (
          <div className="p-8 text-center bg-destructive/5 rounded-3xl border border-destructive/20 text-destructive font-bold">{error}</div>
        ) : filteredSubjects.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-[2.5rem] border-border bg-card/10">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium mb-5">
              {isCR ? "Get started by adding your first subject." : "No subjects added yet."}
            </p>
            {isCR && (
              <Link href={`/dashboard/classroom/subject/${classroomId}/add`}>
                <Button className="rounded-xl font-bold bg-orange-500 hover:bg-orange-600">
                  Add Subject
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSubjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} isCR={isCR} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}