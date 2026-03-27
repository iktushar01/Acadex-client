"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Plus,
  Search,
  Loader2,
  ArrowRight,
  LayoutGrid,
  FileText,
  MoreVertical,
  Edit,
  Trash2,
  Library
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchSubjectsAction } from "@/app/(dashboardLayout)/dashboard/classroom/[id]/_fetchSubjectsAction";
import { useClassroomRole } from "@/hooks/useClassroomRole";
import { Subject } from "@/types/classroomSubject.types";
import Link from "next/link";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteSubjectAction } from "@/app/(dashboardLayout)/dashboard/classroom/subject/[id]/add/_createUpdateDeleteSubjectAction";

const ClassroomSubject = () => {
  const { id } = useParams();
  const router = useRouter();
  const classroomId = id as string;

  const { isCR, roleLoading } = useClassroomRole(classroomId);

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = useCallback(async () => {
    if (!classroomId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchSubjectsAction(classroomId);

      if (result.success) {
        setSubjects(result.data || []);
      } else {
        setError(result.error as string);
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching subjects.");
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (subjectId: string) => {
    try {
      const result = await deleteSubjectAction(subjectId, classroomId);
      if (result.success) {
        toast.success("Subject deleted successfully");
        loadData();
      } else {
        toast.error(result.error || "Failed to delete subject");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const isInitialLoading = loading || roleLoading;

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <LayoutGrid className="h-5 w-5" />
              <span className="font-bold uppercase tracking-widest text-xs">Curriculum</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight italic">
              Class <span className="text-orange-500">Subjects</span>
            </h1>
          </div>

          {isCR && (
            <Link href={`/dashboard/classroom/subject/${classroomId}/add`}>
              <Button className="rounded-2xl font-bold h-12 px-6 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all active:scale-95">
                <Plus className="mr-2 h-5 w-5" /> Add Subject
              </Button>
            </Link>
          )}
        </header>

        {/* SEARCH */}
        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 pl-12 rounded-2xl border-border bg-card/50 backdrop-blur-sm focus-visible:ring-orange-500/20"
          />
        </div>

        {isInitialLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loading Curriculum</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-destructive/5 rounded-3xl border border-destructive/20 text-destructive font-bold">
            {error}
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-[2.5rem] border-border bg-card/10">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">
              {isCR ? "Get started by adding your first subject." : "No subjects have been added to this class yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSubjects.map((subject) => (
              <Card key={subject.id} className="group relative overflow-hidden rounded-[2.5rem] bg-card border-none hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2">

                {/* SUBJECT COVER IMAGE */}
                <div className="relative h-40 w-full overflow-hidden">
                  {subject.coverImage ? (
                    <img
                      src={subject.coverImage}
                      alt={subject.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                      <Library className="h-12 w-12 text-orange-200" />
                    </div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                  {/* Floating Icon */}
                  <div className="absolute bottom-4 left-6 h-12 w-12 rounded-2xl bg-background/90 backdrop-blur-md flex items-center justify-center text-orange-600 shadow-lg border border-white/20">
                    <FileText className="h-6 w-6" />
                  </div>

                  {/* ACTION MENU OVERLAY */}
                  {isCR && (
                    <div className="absolute top-4 right-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="icon" className="h-9 w-9 rounded-xl bg-white/80 backdrop-blur-md hover:bg-orange-500 hover:text-white border-none shadow-sm transition-all">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl w-40 p-2 border-orange-500/10">
                          <DropdownMenuItem
                            className="rounded-lg font-bold cursor-pointer"
                            onClick={() => router.push(`/dashboard/classroom/subject/edit/${subject.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="rounded-lg font-bold text-destructive focus:text-destructive cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2rem]">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-2xl font-black italic">
                                  Are you <span className="text-orange-500">sure?</span>
                                </AlertDialogTitle>
                                <AlertDialogDescription className="font-medium">
                                  This will permanently delete <span className="font-bold text-foreground">"{subject.name}"</span>.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(subject.id)}
                                  className="rounded-xl bg-destructive hover:bg-destructive/90 font-bold"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>

                <div className="px-6 pb-6 pt-2">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black tracking-tight mb-1 group-hover:text-orange-500 transition-colors truncate italic">
                      {subject.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        {subject._count?.notes || 0} Resources Available
                      </span>
                    </div>
                  </div>

                  <Link href={`/dashboard/classroom/subject/${subject.id}`}>
                    <Button variant="outline" className="w-full h-12 rounded-2xl font-bold group/btn border-orange-500/20 bg-orange-500/5 hover:bg-orange-500 hover:text-white transition-all duration-300">
                      View Materials
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomSubject;