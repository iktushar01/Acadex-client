"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { fetchFoldersAction } from "@/actions/_fetchFoldersAction";
import { fetchSubjectByIdAction } from "@/actions/classroomSubject/_fetchSubjectByIdAction";
import { fetchMyClassroomsAction } from "@/actions/classroomActions/_fetchMyClassroomsAction";
import { fetchSubjectsAction } from "@/actions/classroomSubject/_fetchSubjectsAction";
import {
  Loader2,
  FolderIcon,
  Plus,
  ArrowLeft,
  Search,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FolderCard } from "./FolderCard";

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
    setSubjectLoading(true);
    setError(null);

    const subjectPromise = fetchSubjectByIdAction(subjectId);
    const foldersPromise = fetchFoldersAction(subjectId);

    // Subject meta fetch should never block folders rendering
    (async () => {
      try {
        const subjectResult = await subjectPromise;
        if (subjectResult?.success) {
          setSubjectMeta({
            name: subjectResult.data?.name,
            classroomId: subjectResult.data?.classroomId,
          });
        }
      } finally {
        setSubjectLoading(false);
      }
    })();

    try {
      const foldersResult = await foldersPromise;
      if (foldersResult.success) {
        setFolders(foldersResult.data || []);
      } else {
        setError(foldersResult.error || "Failed to load materials");
      }
    } catch (err) {
      setError("Connection to server failed");
    } finally {
      setFoldersLoading(false);
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

      // Fast path: if classroomId is already known, role can be resolved directly.
      if (subjectMeta?.classroomId) {
        const membership = memberships.find((m: any) => m.classroom?.id === subjectMeta.classroomId);
        setIsCR(membership?.memberRole === "CR");
        return;
      }

      // Fallback: discover which classroom contains this subject.
      const subjectSearches = await Promise.all(
        memberships.map(async (m: any) => {
          const classId = m?.classroom?.id;
          if (!classId) return null;
          const subjectsRes = await fetchSubjectsAction(classId);
          if (!subjectsRes.success || !subjectsRes.data) return null;
          const matched = (subjectsRes.data as any[]).find((s: any) => s.id === subjectId);
          if (!matched) return null;
          return {
            classroomId: classId,
            memberRole: m.memberRole,
            subjectName: matched.name as string | undefined,
          };
        })
      );

      const match = subjectSearches.find(Boolean) as
        | { classroomId: string; memberRole: string; subjectName?: string }
        | undefined;

      if (match) {
        setSubjectMeta((prev) => ({
          name: prev?.name || match.subjectName,
          classroomId: prev?.classroomId || match.classroomId,
        }));
        setIsCR(match.memberRole === "CR");
      } else {
        setIsCR(false);
      }
    } catch {
      setIsCR(false);
    } finally {
      setRoleLoading(false);
    }
  }, [subjectId, subjectMeta?.classroomId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    resolveRoleBySubject();
  }, [resolveRoleBySubject]);

  const filteredFolders = useMemo(() => {
    return folders.filter(f =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [folders, searchTerm]);

  const isInitialLoading = foldersLoading || subjectLoading || roleLoading;
  const subjectName = subjectMeta?.name || "Subject";

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

          {/* Header Create Button */}
          {!roleLoading && isCR && subjectMeta?.classroomId && (
            <Link href={`/dashboard/classroom/subject/${subjectId}/folder/add?classroomId=${subjectMeta.classroomId}`}>
              <Button className="rounded-2xl font-bold h-12 px-6 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all active:scale-95">
                <Plus className="mr-2 h-5 w-5" /> Create Folder
              </Button>
            </Link>
          )}
        </header>

        {/* SEARCH */}
        <div className="relative mb-10 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
          <Input
            placeholder={`Search in ${subjectName}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 pl-12 rounded-[1.5rem] border-border bg-card/50 backdrop-blur-sm focus-visible:ring-orange-500/20 transition-all"
          />
        </div>

        {isInitialLoading ? (
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
        ) : filteredFolders.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border rounded-[2.5rem] bg-card/20">
            <FolderIcon className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">No Folders Found</h3>
            <p className="text-muted-foreground/60 mb-6">
              {isCR ? "Start by creating a folder." : "Ask your CR to create folders for this subject."}
            </p>
            
            {/* Added Create Button inside the Empty State for CRs */}
            {isCR && subjectMeta?.classroomId && (
              <Link href={`/dashboard/classroom/subject/${subjectId}/folder/add?classroomId=${subjectMeta.classroomId}`}>
                <Button variant="outline" className="rounded-xl font-bold border-orange-500/50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all">
                  <Plus className="mr-2 h-4 w-4" /> Create First Folder
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFolders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} isCR={isCR} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectFolderPage;