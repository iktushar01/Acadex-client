"use client";

import { useRef, useState } from "react";
import { Plus, X, FileText, Image as ImageIcon, Upload, Loader2 } from "lucide-react";
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

// ─── Props ────────────────────────────────────────────────────────────────────

interface UploadNoteModalProps {
  subjectId: string;
  classroomId: string;
  folderId?: string;
  onSuccess: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ACCEPTED = "image/jpeg,image/png,image/webp,application/pdf";

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handling ──────────────────────────────────────────────────────────

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles = Array.from(incoming).filter(
      (f) => !files.some((existing) => existing.name === f.name)
    );
    setFiles((prev) => [...prev, ...newFiles].slice(0, 10));
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setError(null);

    if (!title.trim()) return setError("Title is required");
    if (files.length === 0) return setError("At least one file is required");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("classroomId", classroomId);
    formData.append("subjectId", subjectId);
    if (description.trim()) formData.append("description", description.trim());
    if (folderId) formData.append("folderId", folderId);
    files.forEach((f) => formData.append("files", f));

    setLoading(true);
    const result = await createNoteAction(formData);
    setLoading(false);

    if (result.success) {
      setOpen(false);
      resetForm();
      onSuccess();
    } else {
      setError(result.error || "Upload failed");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFiles([]);
    setError(null);
  };

  const handleOpenChange = (val: boolean) => {
    setOpen(val);
    if (!val) resetForm();
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold px-5 gap-2 shadow-lg shadow-orange-500/20 transition-all hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="h-4 w-4" />
          Upload Note
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-[2rem] border-border/60 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight italic">
            Upload <span className="text-orange-500">Note</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Title <span className="text-orange-500">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 3 — Thermodynamics"
              className="h-11 rounded-xl border-border/60 bg-background/50 focus-visible:ring-orange-500/20"
              maxLength={150}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Description{" "}
              <span className="text-muted-foreground/40 font-medium normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this note cover?"
              rows={2}
              maxLength={1000}
              className="w-full rounded-xl border border-border/60 bg-background/50 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/40 transition-all placeholder:text-muted-foreground/50"
            />
          </div>

          {/* Drop zone */}
          <div
            className="border-2 border-dashed border-border/60 rounded-2xl p-6 text-center cursor-pointer hover:border-orange-500/40 hover:bg-orange-500/5 transition-all"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <Upload className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm font-bold text-muted-foreground">
              Drop files here or{" "}
              <span className="text-orange-500">browse</span>
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              PDF, JPG, PNG, WebP — up to 10 files
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED}
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl bg-card/60 border border-border/40"
                >
                  {file.type.includes("pdf") ? (
                    <FileText className="h-4 w-4 text-orange-500 shrink-0" />
                  ) : (
                    <ImageIcon className="h-4 w-4 text-orange-400 shrink-0" />
                  )}
                  <span className="flex-1 text-xs font-medium truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground/50 shrink-0">
                    {formatFileSize(file.size)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="h-5 w-5 rounded-full bg-muted/40 hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 font-medium bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-1">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-xl"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};