import { ArrowLeft, FolderOpen, BookOpen } from "lucide-react";
import Link from "next/link";
import { UploadNoteModal } from "@/components/modules/Notes/UploadNoteModal";

interface NotesPageHeaderProps {
  backHref: string;
  backLabel: string;
  subjectName: string;
  folderName?: string;
  totalNotes?: number;
  // Upload modal props
  subjectId: string;
  classroomId: string;
  folderId?: string;
  showUpload: boolean;
  onUploadSuccess: () => void;
}

export const NotesPageHeader = ({
  backHref,
  backLabel,
  subjectName,
  folderName,
  totalNotes,
  subjectId,
  classroomId,
  folderId,
  showUpload,
  onUploadSuccess,
}: NotesPageHeaderProps) => (
  <header className="mb-10">
    {/* Back link */}
    <Link
      href={backHref}
      className="
        inline-flex items-center gap-1.5 mb-6
        text-xs text-muted-foreground/60 font-semibold
        hover:text-orange-500 transition-colors group
      "
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
      {backLabel}
    </Link>

    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-orange-500/70 font-bold uppercase tracking-widest mb-3 flex-wrap">
          <BookOpen className="h-3 w-3 shrink-0" />
          <span>{subjectName || "Subject"}</span>
          {folderName && (
            <>
              <span className="opacity-30">›</span>
              <FolderOpen className="h-3 w-3 shrink-0" />
              <span>{folderName}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Study{" "}
          <span className="text-orange-500 italic">Notes</span>
        </h1>

        {/* Subtitle */}
        {typeof totalNotes === "number" && (
          <p className="text-xs text-muted-foreground/50 mt-1.5 font-medium">
            {totalNotes} note{totalNotes !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {showUpload && (
        <UploadNoteModal
          subjectId={subjectId}
          classroomId={classroomId}
          folderId={folderId}
          onSuccess={onUploadSuccess}
        />
      )}
    </div>
  </header>
);