"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { fetchFoldersAction } from "@/app/(dashboardLayout)/dashboard/classroom/subject/[id]/_action";
import { 
  Loader2, 
  FolderIcon, 
  Plus, 
  ArrowLeft, 
  Search,
  MoreVertical,
  FileText,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { fetchMyClassroomsAction } from "@/app/(dashboardLayout)/dashboard/classroom/_action";

const SubjectMaterialsPage = () => {
  const params = useParams();
  const subjectId = (params?.id ?? params?.subjectId) as string;

  const [folders, setFolders] = useState<any[]>([]);
  const [isCR, setIsCR] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjectMeta, setSubjectMeta] = useState<{ name?: string; classroomId?: string } | null>(null);

  // Safely get subject name from state or folders
  const subjectName = subjectMeta?.name || (folders.length > 0 ? folders[0].subject?.name : "Subject");

  const loadData = useCallback(async () => {
    if (!subjectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch Folders and My Classrooms in parallel
      const [foldersResult, classroomsResult] = await Promise.all([
        fetchFoldersAction(subjectId),
        fetchMyClassroomsAction()
      ]);
      
      if (foldersResult.success) {
        setFolders(foldersResult.data || []);
        
        // 2. Extract metadata (Ensure your action returns 'subject' even if 'data' is empty)
        const meta = foldersResult.data?.[0]?.subject;

        const parentClassroomId = meta?.classroomId;
        
        // 3. Match classroomId with your memberships API data
        if (classroomsResult.success && classroomsResult.data && parentClassroomId) {
          const membership = classroomsResult.data.find(
            (m: any) => m.classroom.id === parentClassroomId
          );
          
          if (membership?.memberRole === "CR") {
            setIsCR(true);
          }
        }
      } else {
        setError(foldersResult.error || "Failed to load materials");
      }
    } catch (err) {
      setError("Connection to server failed");
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        
        {/* TOP NAV */}
        <Link 
          href={`/dashboard/classroom/${subjectMeta?.classroomId || ""}`} 
          className="flex items-center gap-2 text-muted-foreground hover:text-orange-500 transition-colors mb-6 group w-fit"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-bold text-sm">Back to Subject List</span>
        </Link>

        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">{subjectName}</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight italic">
              Resource <span className="text-orange-500">Folders</span>
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Manage notes and materials for this subject.</p>
          </div>

          {/* ADD FOLDER BTN: Only shows if user is CR */}
          {isCR && (
            <Button className="rounded-2xl font-bold h-12 px-6 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all active:scale-95">
              <Plus className="mr-2 h-5 w-5" /> Create Folder
            </Button>
          )}
        </header>

        {/* SEARCH */}
        <div className="relative mb-10 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
          <Input 
            placeholder={`Search in ${subjectName}...`}
            className="h-14 pl-12 rounded-[1.5rem] border-border bg-card/50 backdrop-blur-sm focus-visible:ring-orange-500/20 transition-all"
          />
        </div>

        {/* STATES */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-4 animate-pulse">Syncing Library</p>
          </div>
        ) : error ? (
          <Card className="p-10 text-center border-destructive/20 bg-destructive/5 rounded-[2.5rem]">
            <p className="text-destructive font-bold mb-4">{error}</p>
            <Button onClick={loadData} variant="outline" className="rounded-xl border-destructive/20 hover:bg-destructive/10">
              Try Again
            </Button>
          </Card>
        ) : folders.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border rounded-[2.5rem] bg-card/20">
            <FolderIcon className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">No Folders Found</h3>
            <p className="text-muted-foreground/60">
              {isCR ? "Start by creating a folder." : "Ask your CR to create folders for this subject."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {folders.map((folder) => (
              <Card 
                key={folder.id} 
                className="group relative overflow-hidden rounded-[2rem] p-6 bg-card/50 hover:bg-card hover:shadow-2xl hover:shadow-orange-500/5 transition-all border-border hover:border-orange-500/30 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">
                    <FolderIcon className="h-6 w-6 fill-current" />
                  </div>
                  {isCR && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-orange-500/10 z-20">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-lg truncate group-hover:text-orange-500 transition-colors">
                    {folder.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60 uppercase">
                    <FileText className="h-3 w-3" />
                    <span>{folder._count?.notes || 0} Notes</span>
                  </div>
                </div>

                <Link href={`/dashboard/classroom/folder/${folder.id}`} className="absolute inset-0 z-10" />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectMaterialsPage;