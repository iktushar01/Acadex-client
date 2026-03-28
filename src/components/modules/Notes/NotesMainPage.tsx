"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, usePathname } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

// ── Feature components ────────────────────────────────────────────────────────
import { NotesPageHeader } from "@/components/modules/Notes/Notespageheader";
import { NotesStatsBar } from "@/components/modules/Notes/NotesStatsBar";
import { NotesFilterBar } from "@/components/modules/Notes/NotesFilterBar";
import { NoteCard } from "@/components/modules/Notes/NoteCard";
import { NotesSkeleton } from "@/components/modules/Notes/NotesSkeleton";
import { NotesPagination } from "@/components/modules/Notes/NotesPagination";
import { NotesEmptyState, NotesErrorState } from "@/components/modules/Notes/NotesEmptyState";

// ── Hooks & actions ───────────────────────────────────────────────────────────
import { useNotes } from "@/hooks/useNotes";
import { useClassroomRole } from "@/hooks/useClassroomRole";
import { fetchFolderByIdAction } from "@/actions/_fetchFoldersAction";
import { formatFileSize } from "@/lib/Noteconstants";


// ── Folder bootstrap state type ────────────────────────────────────────────────
interface FolderBootstrap {
  subjectId: string;
  classroomId?: string;
  loading: boolean;
  error?: string;
}






 
export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
 

// ─── Page ─────────────────────────────────────────────────────────────────────

const NotesPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? "";

  // ── Route detection ────────────────────────────────────────────────────────
  const isFolderRoute = pathname.includes("/dashboard/classroom/folder/");
  const isSubjectRoute =
    pathname.includes("/dashboard/classroom/subject/") &&
    pathname.includes("/notes");

  const folderIdParam = isFolderRoute
    ? ((params?.id as string) || undefined)
    : undefined;
  const subjectIdFromQuery = searchParams?.get("subjectId") ?? "";
  const classroomIdFromQuery = searchParams?.get("classroomId") ?? undefined;

  // ── Folder bootstrap (resolve subjectId when opening folder directly) ──────
  const [folderBootstrap, setFolderBootstrap] = useState<FolderBootstrap>({
    subjectId: "",
    classroomId: undefined,
    loading: false,
  });

  useEffect(() => {
    if (!isFolderRoute || !folderIdParam) {
      setFolderBootstrap({ subjectId: "", classroomId: undefined, loading: false });
      return;
    }
    if (subjectIdFromQuery) {
      setFolderBootstrap({
        subjectId: subjectIdFromQuery,
        classroomId: classroomIdFromQuery,
        loading: false,
      });
      return;
    }

    setFolderBootstrap({ subjectId: "", classroomId: undefined, loading: true });
    let cancelled = false;

    fetchFolderByIdAction(folderIdParam).then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        const d = res.data as { subjectId: string; subject?: { classroomId?: string } };
        setFolderBootstrap({
          subjectId: d.subjectId,
          classroomId: d.subject?.classroomId,
          loading: false,
        });
      } else {
        setFolderBootstrap({
          subjectId: "",
          classroomId: undefined,
          loading: false,
          error: res.error || "Could not load folder",
        });
      }
    });

    return () => { cancelled = true; };
  }, [isFolderRoute, folderIdParam, subjectIdFromQuery, classroomIdFromQuery]);

  // ── Resolved IDs ───────────────────────────────────────────────────────────
  let subjectId = "";
  let folderId: string | undefined;

  if (isFolderRoute) {
    folderId = folderIdParam;
    subjectId = subjectIdFromQuery || folderBootstrap.subjectId;
  } else if (isSubjectRoute) {
    subjectId = (params?.id as string) ?? searchParams?.get("subjectId") ?? "";
    folderId = searchParams?.get("folderId") ?? undefined;
  } else {
    subjectId = (params?.subjectId as string) ?? searchParams?.get("subjectId") ?? "";
    folderId = searchParams?.get("folderId") ?? undefined;
  }

  const classroomId =
    classroomIdFromQuery ||
    (isFolderRoute ? folderBootstrap.classroomId : undefined);

  // ── Data hooks ─────────────────────────────────────────────────────────────
  const {
    notes, meta, loading, actionLoading, error,
    filters, setSearchTerm, setStatus, setPage, clearFilters,
    fetchNotes, approveNote, rejectNote, deleteNote, stats,
  } = useNotes(subjectId, folderId);

  const resolvedClassroomId = classroomId ?? notes[0]?.classroomId;
  const { isCR, roleLoading } = useClassroomRole(resolvedClassroomId);

  // ── Derived values ─────────────────────────────────────────────────────────
  const subjectName = notes[0]?.subject?.name ?? "";
  const folderName = notes[0]?.folder?.name ?? "";
  const hasActiveFilters = !!filters.searchTerm || !!filters.status;

  const backHref = folderId || isSubjectRoute
    ? `/dashboard/classroom/subject/${subjectId}${classroomId ? `?classroomId=${encodeURIComponent(classroomId)}` : ""}`
    : classroomId
      ? `/dashboard/classroom/${classroomId}`
      : "/dashboard";

  const backLabel = folderId || isSubjectRoute
    ? "Back to folders"
    : "Back to classroom";

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleApprove = (id: string) => approveNote(id);
  const handleReject = (id: string) => rejectNote(id);
  const handleDelete = (id: string) => {
    if (!confirm("Delete this note and all its files? This cannot be undone.")) return;
    deleteNote(id);
  };

  // ── Folder context loading ─────────────────────────────────────────────────
  if (isFolderRoute && !subjectIdFromQuery && (folderBootstrap.loading || (!folderBootstrap.subjectId && !folderBootstrap.error))) {
    return (
      <PageShell>
        <NotesSkeleton />
      </PageShell>
    );
  }

  if (isFolderRoute && folderBootstrap.error) {
    return (
      <PageShell>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 hover:text-orange-500 mb-6 font-semibold transition-colors">
          ← Back to dashboard
        </Link>
        <Card className="p-10 text-center border-destructive/20 bg-destructive/5 rounded-2xl">
          <AlertCircle className="h-8 w-8 text-destructive/60 mx-auto mb-3" />
          <p className="font-bold text-destructive mb-1">Folder not found</p>
          <p className="text-sm text-muted-foreground">{folderBootstrap.error}</p>
        </Card>
      </PageShell>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <PageShell>
      {/* Header */}
      <NotesPageHeader
        backHref={backHref}
        backLabel={backLabel}
        subjectName={subjectName}
        folderName={folderName}
        totalNotes={meta?.total}
        subjectId={subjectId}
        classroomId={resolvedClassroomId ?? classroomId ?? ""}
        folderId={folderId}
        showUpload={!roleLoading}
        onUploadSuccess={fetchNotes}
      />

      {/* CR stats */}
      {isCR && notes.length > 0 && <NotesStatsBar stats={stats} />}

      {/* Search + filter */}
      <NotesFilterBar
        searchTerm={filters.searchTerm}
        status={filters.status}
        onSearch={setSearchTerm}
        onStatus={setStatus}
      />

      {/* Content states */}
      {loading ? (
        <NotesSkeleton />
      ) : error ? (
        <NotesErrorState message={error} onRetry={fetchNotes} />
      ) : notes.length === 0 ? (
        <NotesEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isCR={isCR}
                isActioning={actionLoading === note.id}
                onApprove={handleApprove}
                onReject={handleReject}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {meta && (
            <NotesPagination meta={meta} onPage={setPage} />
          )}
        </>
      )}
    </PageShell>
  );
};

// ─── Layout shell ──────────────────────────────────────────────────────────────

const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background relative overflow-hidden">
    {/* Ambient glows */}
    <div className="pointer-events-none fixed top-0 right-0 -z-10 h-[600px] w-[600px] bg-orange-500/4 blur-[140px] rounded-full" />
    <div className="pointer-events-none fixed bottom-0 left-0 -z-10 h-[400px] w-[400px] bg-orange-500/3 blur-[120px] rounded-full" />

    <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
      {children}
    </div>
  </div>
);

export default NotesPage;