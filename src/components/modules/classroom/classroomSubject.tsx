"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  Loader2, 
  MoreVertical, 
  Edit, 
  Trash2, 
  LayoutGrid, 
  List,
  ChevronRight,
  BookOpen,
  Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { fetchSubjectsAction } from "@/app/(dashboardLayout)/dashboard/classroom/[id]/_action";
import { useClassroomRole } from "@/hooks/useClassroomRole"; 
import { Subject } from "@/types/classroomSubject.types";
import Link from "next/link";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ClassroomSubject = () => {
  const { id } = useParams();
  const router = useRouter();
  const classroomId = id as string;

  const { isCR, roleLoading } = useClassroomRole(classroomId);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid"); // Set default to grid for 'advanced' look

  const loadData = useCallback(async () => {
    if (!classroomId) return;
    setLoading(true);
    try {
      const result = await fetchSubjectsAction(classroomId);
      if (result.success) setSubjects(result.data || []);
    } catch (err) {
      toast.error("Failed to load curriculum");
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || roleLoading) return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
    Loading
  </p>
</div>
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-4 md:px-10 md:py-8 space-y-8">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground">
            Curriculum <span className="text-orange-500">.</span>
          </h1>
          <p className="text-muted-foreground font-medium">Access and manage your classroom subjects.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* VIEW TOGGLE */}
          <div className="flex items-center rounded-2xl bg-secondary/50 p-1.5 backdrop-blur-sm border border-border/50">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewMode("list")}
              className={`h-9 w-9 rounded-xl transition-all ${viewMode === "list" ? "bg-background shadow-md text-orange-500" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewMode("grid")}
              className={`h-9 w-9 rounded-xl transition-all ${viewMode === "grid" ? "bg-background shadow-md text-orange-500" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>

          {isCR && (
            <Link href={`/dashboard/classroom/subject/${classroomId}/add`}>
              <Button className="h-12 rounded-2xl bg-orange-500 font-bold hover:bg-orange-600 px-6 shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                <Plus className="mr-2 h-5 w-5 stroke-[3px]" /> New Subject
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* SEARCH TOOLBAR */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
        <Input 
          placeholder="Filter by subject name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-14 rounded-2xl bg-secondary/30 pl-12 border-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-orange-500/50 shadow-inner transition-all text-base"
        />
      </div>

      {/* SUBJECT DISPLAY */}
      {filteredSubjects.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSubjects.map((subject) => (
              <Card 
                key={subject.id}
                onClick={() => router.push(`/dashboard/classroom/subject/${subject.id}`)}
                className="group relative cursor-pointer overflow-hidden rounded-[2rem] border-none bg-card hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 active:scale-[0.98] ring-1 ring-border/50 hover:ring-orange-500/30"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
                  {subject.coverImage ? (
                    <img src={subject.coverImage} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-orange-500/5 text-orange-500/30">
                      <BookOpen className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="p-4 px-5 flex justify-between items-start">
                  <div className="space-y-1 flex-1">
                    <h3 className="text-lg font-black uppercase italic tracking-tight line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-secondary/50 w-fit px-2.5 py-1 rounded-md">
                      {subject._count?.notes || 0} Resources
                    </p>
                  </div>
                  {isCR && <DropdownAction subject={subject} classroomId={classroomId} router={router} />}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSubjects.map((subject) => (
              <div 
                key={subject.id}
                onClick={() => router.push(`/dashboard/classroom/subject/${subject.id}`)}
                className="group flex items-center justify-between rounded-2xl bg-card border border-border/50 p-3 pr-6 hover:border-orange-500/40 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted shadow-inner ring-1 ring-border/50">
                    {subject.coverImage ? (
                      <img src={subject.coverImage} className="h-full w-full object-cover transition-transform group-hover:scale-110" alt="" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-orange-50 text-orange-500">
                        <BookOpen className="h-7 w-7" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase italic tracking-tight leading-tight">{subject.name}</h3>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mt-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                      {subject._count?.notes || 0} Resource Files
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                  {isCR && <DropdownAction subject={subject} classroomId={classroomId} router={router} />}
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-secondary/50 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    <ChevronRight className="h-5 w-5 translate-x-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mb-2">
            <Inbox className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <div className="space-y-1">
            <p className="text-xl font-bold italic uppercase tracking-tight">No subjects found</p>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              {searchTerm ? `No results for "${searchTerm}". Try another search term.` : "There are no subjects in this classroom yet."}
            </p>
          </div>
          {searchTerm && (
            <Button variant="link" onClick={() => setSearchTerm("")} className="text-orange-500 font-bold uppercase text-xs">
              Clear search
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// Extracted Dropdown to keep the main list clean
const DropdownAction = ({ subject, router }: { subject: Subject, classroomId: string, router: any }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-orange-50 transition-colors">
        <MoreVertical className="h-5 w-5 text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="rounded-2xl w-48 p-2 shadow-xl border-border/50 backdrop-blur-md">
      <DropdownMenuItem 
        onClick={() => router.push(`/dashboard/classroom/subject/edit/${subject.id}`)}
        className="rounded-xl font-bold py-2.5 cursor-pointer"
      >
        <Edit className="mr-3 h-4 w-4 text-orange-500" /> Edit Details
      </DropdownMenuItem>
      <DropdownMenuItem 
        className="rounded-xl font-bold py-2.5 text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer"
      >
        <Trash2 className="mr-3 h-4 w-4" /> Delete Subject
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ClassroomSubject;