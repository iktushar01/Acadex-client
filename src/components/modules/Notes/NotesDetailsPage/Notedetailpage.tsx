"use client";

import { AlertCircle, BookOpen, Calendar, FileText, FolderOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { NoteDetailHeader } from "@/components/modules/Notes/NotesDetailsPage/Notedetailheader";
import { NoteFileDownloader } from "@/components/modules/Notes/NotesDetailsPage/Notefiledownloader";
import { NoteCommentSection } from "@/components/modules/Notes/NotesDetailsPage/Notecommentsection";
import { StatusBadge } from "@/components/modules/Notes/StatusBadge";
import { UploaderAvatar } from "@/components/modules/Notes/UploaderAvatar";
import type { INote } from "@/types/note.types";
import type { INoteDetailUser } from "@/types/note-detail.types";
import { formatDate } from "../NotesMainPage";

const MetaRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/30">
      <Icon className="h-3.5 w-3.5 text-muted-foreground/50" />
    </div>
    <div className="min-w-0">
      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
        {label}
      </p>
      <div className="text-xs font-semibold">{value}</div>
    </div>
  </div>
);

const NoteMetaCard = ({ note }: { note: INote }) => (
  <Card className="overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm">
    <div className="border-b border-border/30 px-5 py-4">
      <h3 className="text-sm font-black">Note Info</h3>
    </div>
    <div className="flex flex-col gap-4 p-5">
      <MetaRow
        icon={BookOpen}
        label="Subject"
        value={note.subject?.name ?? "-"}
      />
      {note.folder?.name && (
        <MetaRow
          icon={FolderOpen}
          label="Folder"
          value={note.folder.name}
        />
      )}
      <MetaRow
        icon={Calendar}
        label="Uploaded"
        value={formatDate(note.createdAt)}
      />
      <MetaRow
        icon={FileText}
        label="Files"
        value={`${note.files.length} attachment${note.files.length !== 1 ? "s" : ""}`}
      />

      <div className="flex flex-col gap-3 border-t border-border/25 pt-3">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
            Uploaded by
          </p>
          <UploaderAvatar uploader={note.uploader} />
        </div>
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40">
            Status
          </p>
          <StatusBadge status={note.status} />
        </div>
      </div>
    </div>
  </Card>
);

const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-screen overflow-hidden bg-background">
    <div className="pointer-events-none fixed top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-orange-500/4 blur-[140px]" />
    <div className="pointer-events-none fixed bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-rose-500/3 blur-[120px]" />
    <div className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">{children}</div>
  </div>
);

const NoteDetailPage = ({
  initialNote,
  initialError,
  currentUser,
}: {
  initialNote?: INote;
  initialError?: string | null;
  currentUser?: INoteDetailUser;
}) => {
  const searchParams = useSearchParams();
  const backHref = searchParams?.get("back") ?? "/dashboard";
  const note = initialNote ?? null;
  const error = initialError ?? null;

  if (error || !note) {
    return (
      <PageShell>
        <Link
          href={backHref}
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 transition-colors hover:text-orange-500"
        >
          ← Back to notes
        </Link>
        <Card className="rounded-2xl border-destructive/20 bg-destructive/5 p-10 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-destructive/60" />
          <p className="mb-1 font-bold text-destructive">Note not found</p>
          <p className="text-sm text-muted-foreground">{error ?? "Could not load note"}</p>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <NoteDetailHeader note={note} backHref={backHref} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <NoteFileDownloader files={note.files} noteTitle={note.title} />
          <NoteCommentSection noteId={note.id} currentUser={currentUser} />
        </div>

        <aside className="flex flex-col gap-4">
          <NoteMetaCard note={note} />
        </aside>
      </div>
    </PageShell>
  );
};

export default NoteDetailPage;
