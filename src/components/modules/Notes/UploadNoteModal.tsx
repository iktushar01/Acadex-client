"use client";

import { useRef, useState, useCallback } from "react";
import {
  Plus,
  X,
  FileText,
  Image as ImageIcon,
  Upload,
  Loader2,
  FilePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createNoteAction } from "@/actions/notesAction/_notesActions";
import { formatFileSize } from "@/lib/Noteconstants";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILES,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "@/lib/Noteconstants";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface UploadNoteModalProps {
  subjectId: string;
  classroomId: string;
  folderId?: string;
  onSuccess: () => void;
}

// ─── DropZone ─────────────────────────────────────────────────────────────────

interface DropZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  fileCount: number;
}

const DropZone = ({
  isDragging,
  onDragOver,
  onDrop,
  onClick,
  fileCount,
}: DropZoneProps) => (
  <div
    onClick={onClick}
    onDrop={onDrop}
    onDragOver={onDragOver}
    className={`
      relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer
      transition-all duration-200 select-none
      ${
        isDragging
          ? "border-orange-500/70 bg-orange-500/8 scale-[1.01]"
          : "border-border/50 hover:border-orange-500/40 hover:bg-orange-500/5"
      }
    `}
  >
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
        h-10 w-10 rounded-2xl flex items-center justify-center transition-colors
        ${isDragging ? "bg-orange-500/15" : "bg-muted/30"}
      `}
      >
        <FilePlus
          className={`h-5 w-5 transition-colors ${
            isDragging ? "text-orange-500" : "text-muted-foreground/50"
          }`}
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-muted-foreground">
          {isDragging ? "Drop to add files" : (
            <>
              Drop files or{" "}
              <span className="text-orange-500 font-bold">browse</span>
            </>
          )}
        </p>
        <p className="text-[11px] text-muted-foreground/40 mt-0.5">
          PDF, JPG, PNG, WebP — up to {MAX_FILES} files
          {fileCount > 0 && ` (${fileCount} added)`}
        </p>
      </div>
    </div>
  </div>
);

// ─── FileListItem ─────────────────────────────────────────────────────────────

interface FileListItemProps {
  file: File;
  onRemove: () => void;
}

const FileListItem = ({ file, onRemove }: FileListItemProps) => (
  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-muted/20 border border-border/30 group">
    {file.type.includes("pdf") ? (
      <FileText className="h-4 w-4 text-orange-500 shrink-0" />
    ) : (
      <ImageIcon className="h-4 w-4 text-orange-400 shrink-0" />
    )}
    <span className="flex-1 text-xs font-medium truncate">{file.name}</span>
    <span className="text-[10px] text-muted-foreground/40 shrink-0 tabular-nums">
      {formatFileSize(file.size)}
    </span>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onRemove();
      }}
      className="
        h-5 w-5 rounded-full flex items-center justify-center shrink-0
        bg-muted/30 hover:bg-red-500/20 hover:text-red-500
        transition-colors opacity-0 group-hover:opacity-100
      "
    >
      <X className="h-3 w-3" />
    </button>
  </div>
);

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

const FormField = ({ label, required, children, hint }: FormFieldProps) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/70">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
      </label>
      {hint && (
        <span className="text-[10px] text-muted-foreground/40">{hint}</span>
      )}
    </div>
    {children}
  </div>
);

// ─── UploadNoteModal ──────────────────────────────────────────────────────────

export const UploadNoteModal = ({
  subjectId,
  classroomId,
  folderId,
  onSuccess,
}: UploadNoteModalProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File helpers ───────────────────────────────────────────────────────────

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const deduplicated = Array.from(incoming).filter(
        (f) => !files.some((ex) => ex.name === f.name && ex.size === f.size)
      );
      setFiles((prev) => [...prev, ...deduplicated].slice(0, MAX_FILES));
    },
    [files]
  );

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setError(null);
    if (!title.trim()) return setError("Title is required.");
    if (files.length === 0) return setError("Please attach at least one file.");

    const form = new FormData();
    form.append("title", title.trim());
    form.append("classroomId", classroomId);
    form.append("subjectId", subjectId);
    if (description.trim()) form.append("description", description.trim());
    if (folderId) form.append("folderId", folderId);
    files.forEach((f) => form.append("files", f));

    setLoading(true);
    const result = await createNoteAction(form);
    setLoading(false);

    if (result.success) {
      handleClose();
      onSuccess();
    } else {
      setError(result.error || "Upload failed. Please try again.");
    }
  };

  // ── Reset / close ──────────────────────────────────────────────────────────

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFiles([]);
    setError(null);
    setIsDragging(false);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(val) => (val ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>
        <Button className="
          rounded-2xl bg-orange-500 hover:bg-orange-600 text-white
          font-bold px-5 gap-2
          shadow-lg shadow-orange-500/20
          hover:shadow-orange-500/30 hover:scale-[1.02]
          active:scale-[0.98] transition-all
        ">
          <Plus className="h-4 w-4" />
          Upload Note
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-xl font-black tracking-tight">
            Upload <span className="text-orange-500">Note</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Share your notes with the class. Pending approval by the class representative.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-1">
          {/* Title */}
          <FormField label="Title" required hint={`${title.length}/${MAX_TITLE_LENGTH}`}>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 3 — Thermodynamics"
              className="h-10 rounded-xl border-border/50 bg-background/50 text-sm focus-visible:ring-1 focus-visible:ring-orange-500/30"
              maxLength={MAX_TITLE_LENGTH}
            />
          </FormField>

          {/* Description */}
          <FormField
            label="Description"
            hint={`${description.length}/${MAX_DESCRIPTION_LENGTH}`}
          >
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this note cover? (optional)"
              rows={2}
              maxLength={MAX_DESCRIPTION_LENGTH}
              className="
                w-full rounded-xl border border-border/50
                bg-background/50 px-3 py-2 text-sm resize-none
                focus:outline-none focus:ring-1 focus:ring-orange-500/30 focus:border-orange-500/30
                placeholder:text-muted-foreground/40 transition-all
              "
            />
          </FormField>

          {/* Drop zone */}
          <DropZone
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            fileCount={files.length}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            multiple
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />

          {/* File list */}
          {files.length > 0 && (
            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-0.5">
              {files.map((file, i) => (
                <FileListItem
                  key={`${file.name}-${i}`}
                  file={file}
                  onRemove={() => removeFile(i)}
                />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 font-medium bg-red-500/8 border border-red-500/15 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2.5 mt-1">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-xl text-sm"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || files.length === 0 || !title.trim()}
              className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md shadow-orange-500/20 text-sm disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5 mr-2" />
                  Upload {files.length > 0 && `(${files.length})`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};