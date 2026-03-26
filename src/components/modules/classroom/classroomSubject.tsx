"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Loader2, 
  ArrowRight, 
  LayoutGrid,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchSubjectsAction } from "@/app/(dashboardLayout)/dashboard/classroom/[id]/_action";
import { Subject } from "@/types/classroomSubject.types";
import Link from "next/link";

const ClassroomSubject = () => {
  const { id } = useParams();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubjects = async () => {
      if (!id) return;
      setLoading(true);
      const result = await fetchSubjectsAction(id as string);
      
      if (result.success) {
        setSubjects(result.data || []);
      } else {
        setError(result.error as string);
      }
      setLoading(false);
    };

    loadSubjects();
  }, [id]);

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

          <Button className="rounded-2xl font-bold h-12 px-6 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all active:scale-95">
            <Plus className="mr-2 h-5 w-5" /> Add Subject
          </Button>
        </header>

        {/* SEARCH */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search subjects..." 
            className="h-14 pl-12 rounded-2xl border-border bg-card/50 backdrop-blur-sm focus-visible:ring-orange-500/20"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-destructive/5 rounded-3xl border border-destructive/20 text-destructive font-bold">
            {error}
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-[2.5rem] border-border">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">No subjects found for this classroom.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.id} className="group relative overflow-hidden rounded-[2.5rem] p-6 bg-card/50 hover:shadow-xl transition-all hover:-translate-y-1 border-border">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 bg-secondary rounded-full uppercase tracking-tighter">
                    {subject.code || "SUB-101"}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-orange-500 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {subject.description || "Explore resources, assignments, and lectures for this subject."}
                  </p>
                </div>

                <Link href={`/dashboard/classroom/subject/${subject.id}`}>
                  <Button variant="outline" className="w-full rounded-xl font-bold group/btn border-orange-500/10 hover:bg-orange-500 hover:text-white transition-all">
                    View Materials 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomSubject;