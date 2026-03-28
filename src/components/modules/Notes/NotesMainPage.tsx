"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Trash2,
  MoreVertical,
  Filter,
  FolderOpen,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotes } from "@/hooks/useNotes";
import { useClassroomRole } from "@/hooks/useClassroomRole";
import { UploadNoteModal } from "@/components/modules/Notes/UploadNoteModal";
import { fetchFolderByIdAction } from "@/actions/_fetchFoldersAction";
import { INote, INoteFile, NoteStatus } from "@/types/note.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    Icon: Clock,
    cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  APPROVED: {
    label: "Approved",
    Icon: CheckCircle2,
    cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  REJECTED: {
    label: "Rejected",
    Icon: XCircle,
    cls: "bg-red-500/10 text-red-500 border-red-500/20",
  },
} as const;

const FILTER_OPTIONS: { label: string; value: NoteStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Approved", value: "APPROVED" },
  { label: "Pending", value: "PENDING" },
  { label: "Rejected", value: "REJECTED" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: NoteStatus }) => {
  const { label, Icon, cls } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cls}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};

const FileChip = ({ file }: { file: INoteFile }) => (
  <a
    href={file.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/60 border border-border/60 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all group text-xs"
  >
    {file.type === "pdf" ? (
      <FileText className="h-3.5 w-3.5 text-orange-500 shrink-0" />
    ) : (
      <ImageIcon className="h-3.5 w-3.5 text-orange-400 shrink-0" />
    )}
    <span className="truncate max-w-[130px] text-muted-foreground group-hover:text-foreground transition-colors font-medium">
      {file.fileName}
    </span>
    <span className="text-muted-foreground/40 shrink-0">
      {formatFileSize(file.fileSize)}
    </span>
    <Download className="h-3 w-3 text-muted-foreground/30 group-hover:text-orange-500 transition-colors ml-auto shrink-0" />
  </a>
);

const UploaderAvatar = ({ uploader }: { uploader: INote["uploader"] }) => (
  <div className="flex items-center gap-2">
    {uploader.image ? (
      <img
        src={uploader.image}
        alt={uploader.name}
        className="h-6 w-6 rounded-full object-cover ring-1 ring-border"
      />
    ) : (
      <div className="h-6 w-6 rounded-full bg-orange-500/20 ring-1 ring-orange-500/30 flex items-center justify-center">
        <span className="text-[10px] font-black text-orange-500">
          {uploader.name?.[0]?.toUpperCase() ?? "?"}
        </span>
      </div>
    )}
    <span className="text-xs text-muted-foreground font-medium">
      {uploader.name}
    </span>
  </div>
);

// ── Note Card ──────────────────────────────────────────────────────────────────

interface NoteCardProps {
  note: INote;
  isCR: boolean;
  isActioning: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

const NoteCard = ({
  note,
  isCR,
  isActioning,
  onApprove,
  onReject,
  onDelete,
}: NoteCardProps) => (
  <Card className="group relative flex flex-col gap-4 p-5 rounded-[1.75rem] border-border/60 bg-card/40 backdrop-blur-sm hover:border-orange-500/30 hover:bg-card/70 transition-all duration-300 overflow-hidden">
    {/* Hover glow */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
      <div className="absolute top-0 right-0 h-24 w-24 bg-orange-500/8 blur-2xl rounded-full" />
    </div>

    {/* Action loading overlay */}
    {isActioning && (
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-[1.75rem] flex items-center justify-center z-10">
        <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
      </div>
    )}

    {/* Header */}
    <div className="flex items-start justify-between gap-3 relative">
      <div className="flex-1 min-w-0">
        <h3 className="font-black text-base leading-tight tracking-tight truncate pr-2">
          {note.title}
        </h3>
        {note.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {note.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={note.status} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl min-w-[140px]">
            {isCR && note.status === "PENDING" && (
              <>
                <DropdownMenuItem
                  onClick={() => onApprove(note.id)}
                  className="text-emerald-500 focus:text-emerald-500 focus:bg-emerald-500/10 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onReject(note.id)}
                  className="text-amber-500 focus:text-amber-500 focus:bg-amber-500/10 cursor-pointer"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(note.id)}
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    {/* Files */}
    {note.files.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {note.files.map((file) => (
          <FileChip key={file.id} file={file} />
        ))}
      </div>
    )}

    {/* Footer */}
    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/40">
      <UploaderAvatar uploader={note.uploader} />
      <span className="text-[11px] text-muted-foreground/50 font-medium">
        {formatDate(note.createdAt)}
      </span>
    </div>
  </Card>
);

// ── Skeleton ───────────────────────────────────────────────────────────────────

const NotesSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="rounded-[1.75rem] border border-border/40 bg-card/30 p-5 animate-pulse"
        style={{ animationDelay: `${i * 80}ms` }}
      >
        <div className="h-4 bg-muted/40 rounded-lg w-3/4 mb-2" />
        <div className="h-3 bg-muted/30 rounded-lg w-full mb-1" />
        <div className="h-3 bg-muted/30 rounded-lg w-2/3 mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="h-7 bg-muted/30 rounded-xl w-28" />
          <div className="h-7 bg-muted/30 rounded-xl w-24" />
        </div>
        <div className="h-px bg-border/30 mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-muted/30" />
            <div className="h-3 bg-muted/30 rounded w-20" />
          </div>
          <div className="h-3 bg-muted/20 rounded w-16" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const NotesPage = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? "";

  const isFolderNotesRoute = pathname.includes("/dashboard/classroom/folder/");
  const isSubjectNotesRoute =
    pathname.includes("/dashboard/classroom/subject/") &&
    pathname.includes("/notes");

  const folderIdParam = isFolderNotesRoute
    ? ((params?.id as string) || undefined)
    : undefined;
  const subjectIdFromQuery = searchParams?.get("subjectId") ?? "";
  const classroomIdFromQuery = searchParams?.get("classroomId") ?? undefined;

  const [folderBootstrap, setFolderBootstrap] = useState<{
    subjectId: string;
    classroomId?: string;
    loading: boolean;
    error?: string;
  }>({
    subjectId: "",
    classroomId: undefined,
    loading: false,
  });

  useEffect(() => {
    if (!isFolderNotesRoute || !folderIdParam) {
      setFolderBootstrap({
        subjectId: "",
        classroomId: undefined,
        loading: false,
        error: undefined,
      });
      return;
    }

    if (subjectIdFromQuery) {
      setFolderBootstrap({
        subjectId: subjectIdFromQuery,
        classroomId: classroomIdFromQuery,
        loading: false,
        error: undefined,
      });
      return;
    }

    setFolderBootstrap({
      subjectId: "",
      classroomId: undefined,
      loading: true,
      error: undefined,
    });

    let cancelled = false;
    fetchFolderByIdAction(folderIdParam).then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        const d = res.data as {
          subjectId: string;
          subject?: { classroomId?: string };
        };
        setFolderBootstrap({
          subjectId: d.subjectId,
          classroomId: d.subject?.classroomId,
          loading: false,
          error: undefined,
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

    return () => {
      cancelled = true;
    };
  }, [
    isFolderNotesRoute,
    folderIdParam,
    subjectIdFromQuery,
    classroomIdFromQuery,
  ]);

  let subjectId = "";
  let folderId: string | undefined;

  if (isFolderNotesRoute) {
    folderId = folderIdParam;
    subjectId = subjectIdFromQuery || folderBootstrap.subjectId;
  } else if (isSubjectNotesRoute) {
    subjectId = (params?.id as string) ?? searchParams?.get("subjectId") ?? "";
    folderId = searchParams?.get("folderId") ?? undefined;
  } else {
    subjectId =
      (params?.subjectId as string) ??
      searchParams?.get("subjectId") ??
      "";
    folderId = searchParams?.get("folderId") ?? undefined;
  }

  const classroomId =
    classroomIdFromQuery ||
    (isFolderNotesRoute ? folderBootstrap.classroomId : undefined);

  const {
    notes,
    meta,
    loading,
    actionLoading,
    error,
    filters,
    setSearchTerm,
    setStatus,
    setPage,
    clearFilters,
    fetchNotes,
    approveNote,
    rejectNote,
    deleteNote,
    stats,
  } = useNotes(subjectId, folderId);

  // classroomId needed for role check — resolve from first note if not in URL
  const resolvedClassroomId =
    classroomId ?? notes[0]?.classroomId ?? undefined;

  const { isCR, roleLoading } = useClassroomRole(resolvedClassroomId);

  // Names for breadcrumb — pulled from first note's joined data
  const subjectName = notes[0]?.subject?.name ?? "";
  const folderName = notes[0]?.folder?.name ?? "";
  const backHref = folderId
    ? `/dashboard/classroom/subject/${subjectId}${
        classroomId ? `?classroomId=${encodeURIComponent(classroomId)}` : ""
      }`
    : isSubjectNotesRoute
      ? `/dashboard/classroom/subject/${subjectId}${
          classroomId ? `?classroomId=${encodeURIComponent(classroomId)}` : ""
        }`
      : classroomId
        ? `/dashboard/classroom/${classroomId}`
        : "/dashboard";

  const backLabel = folderId
    ? "Back to folders"
    : isSubjectNotesRoute
      ? "Back to folders"
      : "Back to classroom";

  const handleApprove = async (noteId: string) => {
    await approveNote(noteId);
  };

  const handleReject = async (noteId: string) => {
    await rejectNote(noteId);
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm("Delete this note and all its files? This cannot be undone."))
      return;
    await deleteNote(noteId);
  };

  const hasActiveFilters = !!filters.searchTerm || !!filters.status;

  // ── Folder URL without ?subjectId= — resolve via GET /folders/:id first ─────

  const folderContextPending =
    isFolderNotesRoute &&
    !subjectIdFromQuery &&
    !folderBootstrap.error &&
    (folderBootstrap.loading || !folderBootstrap.subjectId);

  if (folderContextPending) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-orange-500/5 blur-[120px] rounded-full" />
        <div className="mx-auto max-w-6xl">
          <NotesSkeleton />
        </div>
      </div>
    );
  }

  if (isFolderNotesRoute && folderBootstrap.error) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10 relative overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-orange-500 transition-colors mb-6 group w-fit"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold text-sm">Back to dashboard</span>
          </Link>
          <Card className="p-10 text-center border-destructive/20 bg-destructive/5 rounded-[2.5rem]">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
            <p className="text-destructive font-bold mb-2">{folderBootstrap.error}</p>
            <p className="text-sm text-muted-foreground mb-4">
              Open this folder from the subject materials page, or check that you are logged in
              and are a member of the classroom.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-orange-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] bg-orange-500/3 blur-[100px] rounded-full" />

      <div className="mx-auto max-w-6xl">
        {/* ── Back ── */}
        <Link
          href={backHref}
          className="flex items-center gap-2 text-muted-foreground hover:text-orange-500 transition-colors mb-6 group w-fit"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-bold text-sm">{backLabel}</span>
        </Link>

        {/* ── Header ── */}
        <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-orange-500 mb-2 flex-wrap">
              <FolderOpen className="h-4 w-4 shrink-0" />
              <span className="text-xs font-black uppercase tracking-widest">
                {subjectName || "Subject"}
              </span>
              {folderName && (
                <>
                  <span className="text-orange-500/40 text-xs">›</span>
                  <span className="text-xs font-black uppercase tracking-widest">
                    {folderName}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight italic">
              Study <span className="text-orange-500">Notes</span>
            </h1>
            {meta && (
              <p className="text-sm text-muted-foreground mt-1.5">
                {meta.total} note{meta.total !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          {!roleLoading && (
            <UploadNoteModal
              subjectId={subjectId}
              classroomId={resolvedClassroomId ?? classroomId ?? ""}
              folderId={folderId}
              onSuccess={fetchNotes}
            />
          )}
        </header>

        {/* ── CR Stats ── */}
        {isCR && notes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Approved", value: stats.approved, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
              { label: "Pending", value: stats.pending, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
              { label: "Rejected", value: stats.rejected, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20" },
              { label: "Total Files", value: stats.totalFiles, color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20" },
            ].map((s) => (
              <div
                key={s.label}
                className={`${s.bg} rounded-2xl px-4 py-3 border`}
              >
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground font-bold mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Search + Filter ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={filters.searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 pl-12 rounded-[1.5rem] border-border bg-card/30 backdrop-blur-xl focus-visible:ring-orange-500/20 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 bg-card/30 border border-border/60 rounded-[1.5rem] p-1.5 backdrop-blur-sm">
            <Filter className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  filters.status === opt.value
                    ? "bg-orange-500 text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <NotesSkeleton />
        ) : error ? (
          <Card className="p-10 text-center border-destructive/20 bg-destructive/5 rounded-[2.5rem]">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
            <p className="text-destructive font-bold mb-4">{error}</p>
            <Button onClick={fetchNotes} variant="outline" className="rounded-xl">
              Try Again
            </Button>
          </Card>
        ) : notes.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border rounded-[2.5rem] bg-card/20 backdrop-blur-sm">
            <FileText className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground">
              No Notes Found
            </h3>
            <p className="text-muted-foreground/60 mb-6">
              {hasActiveFilters
                ? "Try adjusting your search or filter."
                : "Be the first to upload a note!"}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

            {meta && meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  disabled={meta.page <= 1}
                  onClick={() => setPage(meta.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage(meta.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotesPage;