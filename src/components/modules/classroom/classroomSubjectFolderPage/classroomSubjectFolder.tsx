"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { fetchFoldersAction } from "@/actions/_fetchFoldersAction";
import { fetchSubjectByIdAction } from "@/actions/classroomSubject/_fetchSubjectByIdAction";
import { fetchMyClassroomsAction } from "@/actions/classroomActions/_fetchMyClassroomsAction";
import { FolderIcon, ArrowLeft, Search, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FolderCard } from "./FolderCard";
import { FolderSkeleton } from "./folderSkeleton";
import { CreateFolderModal } from "./CreateFolderaddModal";

const SubjectFolderPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const subjectId = (params?.id ?? params?.subjectId) as string;
  const classroomIdFromQuery = searchParams?.get("classroomId") || undefined;

  const [folders, setFolders] = useState<any[]>([]);
  const [foldersLoading, setFoldersLoading] = useState(true);
  const [subjectLoading, setSubjectLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectMeta, setSubjectMeta] = useState<{ name?: string; classroomId?: string } | null>(() =>
    classroomIdFromQuery ? { classroomId: classroomIdFromQuery } : null
  );
  const [isCR, setIsCR] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!subjectId) return;
    setFoldersLoading(true);
    setError(null);

    try {
      const [subjectResult, foldersResult] = await Promise.all([
        fetchSubjectByIdAction(subjectId),
        fetchFoldersAction(subjectId)
      ]);

      if (subjectResult?.success) {
        setSubjectMeta({
          name: subjectResult.data?.name,
          classroomId: subjectResult.data?.classroomId,
        });
      }

      if (foldersResult.success) {
        setFolders(foldersResult.data || []);
      } else {
        setError(foldersResult.error || "Failed to load materials");
      }
    } catch (err) {
      setError("Connection to server failed");
    } finally {
      setFoldersLoading(false);
      setSubjectLoading(false);
    }
  }, [subjectId]);

  const resolveRoleBySubject = useCallback(async () => {
    if (!subjectId) {
      setRoleLoading(false);
      setIsCR(false);
      return;
    }

    setRoleLoading(true);
    try {
      const membershipsResult = await fetchMyClassroomsAction();
      if (!membershipsResult.success || !membershipsResult.data) {
        setIsCR(false);
        return;
      }

      const memberships = membershipsResult.data as any[];
      const match = memberships.find((m: any) => m.classroom?.id === subjectMeta?.classroomId);
      
      if (match) {
        setIsCR(match.memberRole === "CR");
      } else {
        // Fallback search removed for brevity, assume classroomId is resolved in loadData
        setIsCR(false);
      }
    } catch {
      setIsCR(false);
    } finally {
      setRoleLoading(false);
    }
  }, [subjectId, subjectMeta?.classroomId]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { resolveRoleBySubject(); }, [resolveRoleBySubject]);

  const filteredFolders = useMemo(() => {
    return folders.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [folders, searchTerm]);

  const isInitialLoading = foldersLoading || subjectLoading || roleLoading;

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-orange-500/5 blur-[120px] rounded-full" />
      
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/dashboard/classroom/${subjectMeta?.classroomId || ""}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-orange-500 transition-colors mb-6 group w-fit"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-bold text-sm">Back to Subject</span>
        </Link>

        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <LayoutGrid className="h-4 w-4" />
              <span className="text-xs font-black uppercase tracking-widest">{subjectMeta?.name || "Subject"}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight italic">
              Resource <span className="text-orange-500">Folders</span>
            </h1>
          </div>

          {!roleLoading && isCR && (
            <CreateFolderModal subjectId={subjectId} onSuccess={loadData} />
          )}
        </header>

        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 pl-12 rounded-[1.5rem] border-border bg-card/30 backdrop-blur-xl focus-visible:ring-orange-500/20 transition-all shadow-sm"
          />
        </div>

        {isInitialLoading ? (
          <FolderSkeleton />
        ) : error ? (
          <Card className="p-10 text-center border-destructive/20 bg-destructive/5 rounded-[2.5rem]">
            <p className="text-destructive font-bold mb-4">{error}</p>
            <Button onClick={loadData} variant="outline" className="rounded-xl">Try Again</Button>
          </Card>
        ) : filteredFolders.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border rounded-[2.5rem] bg-card/20 backdrop-blur-sm">
            <FolderIcon className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">No Folders Found</h3>
            <p className="text-muted-foreground/60 mb-6">{isCR ? "Start by creating a folder." : "No materials available yet."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFolders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} subjectId={subjectId} isCR={isCR} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectFolderPage;