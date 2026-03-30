"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Download,
  FileText,
  Files,
  FolderDown,
  Image as ImageIcon,
  Laptop,
  Loader2,
  Paperclip,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { INoteFile } from "@/types/note.types";
import { formatFileSize } from "@/lib/Noteconstants";

const getFileRoute = (file: INoteFile, download = false) => {
  const params = new URLSearchParams({
    url: file.url,
    fileName: file.fileName,
  });

  if (download) {
    params.set("download", "1");
  }

  return `/api/notes/files?${params.toString()}`;
};

const triggerBrowserDownload = (href: string, fileName: string) => {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

async function downloadFile(file: INoteFile): Promise<void> {
  triggerBrowserDownload(getFileRoute(file, true), file.fileName);
}

async function downloadAllAsZip(
  files: INoteFile[],
  zipName: string
): Promise<void> {
  try {
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    const fetches = files.map(async (file) => {
      try {
        const res = await fetch(getFileRoute(file), { cache: "no-store" });
        if (!res.ok) throw new Error();
        const blob = await res.blob();
        zip.file(file.fileName, blob);
      } catch {
        // Skip files that can't be fetched.
      }
    });

    await Promise.all(fetches);

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${zipName}.zip`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  } catch {
    for (const file of files) {
      await downloadFile(file);
    }
  }
}

interface FileRowProps {
  file: INoteFile;
  index: number;
}

const FileRow = ({ file, index }: FileRowProps) => {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const handleDownload = async () => {
    if (state !== "idle") return;
    setState("loading");
    await downloadFile(file);
    setState("done");
    setTimeout(() => setState("idle"), 2500);
  };

  const isPdf = file.type === "pdf";
  const previewHref = getFileRoute(file);

  return (
    <div
      className="
        group flex items-center gap-4 rounded-2xl border border-border/40 bg-card/40 px-4 py-3.5
        transition-all duration-200 hover:border-orange-500/30 hover:bg-card/70
      "
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className={`
          flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
          ${isPdf ? "border border-orange-500/20 bg-orange-500/10" : "border border-sky-500/20 bg-sky-500/10"}
        `}
      >
        {isPdf ? (
          <FileText className="h-5 w-5 text-orange-500" />
        ) : (
          <ImageIcon className="h-5 w-5 text-sky-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{file.fileName}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
            {isPdf ? "PDF" : "Image"}
          </span>
          <span className="text-[10px] text-muted-foreground/20">·</span>
          <span className="text-[10px] tabular-nums text-muted-foreground/50">
            {formatFileSize(file.fileSize)}
          </span>
        </div>
      </div>

      <a
        href={previewHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="
          hidden px-2 text-[11px] font-bold text-muted-foreground/40 transition-colors
          hover:text-orange-500 sm:flex
        "
      >
        Preview
      </a>

      <Button
        size="sm"
        variant="outline"
        onClick={handleDownload}
        disabled={state === "loading"}
        className={`
          h-8 shrink-0 gap-1.5 rounded-xl px-3 text-xs font-bold transition-all
          ${state === "done"
            ? "border-emerald-500/40 bg-emerald-500/8 text-emerald-500"
            : "border-border/50 hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-500"
          }
        `}
      >
        {state === "loading" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : state === "done" ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" /> Saved
          </>
        ) : (
          <>
            <Download className="h-3.5 w-3.5" /> Download
          </>
        )}
      </Button>
    </div>
  );
};

interface NoteFileDownloaderProps {
  files: INoteFile[];
  noteTitle: string;
}

export const NoteFileDownloader = ({
  files,
  noteTitle,
}: NoteFileDownloaderProps) => {
  const [zipState, setZipState] = useState<"idle" | "loading" | "done">("idle");

  const handleDownloadAll = async () => {
    if (zipState !== "idle") return;
    setZipState("loading");
    await downloadAllAsZip(files, noteTitle);
    setZipState("done");
    setTimeout(() => setZipState("idle"), 3000);
  };

  if (files.length === 0) return null;

  return (
    <Card className="overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/30 px-5 py-4">
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-orange-500" />
          <h2 className="text-sm font-black tracking-tight">
            Attachments
            <span className="ml-1.5 text-xs font-bold text-muted-foreground/50">
              ({files.length})
            </span>
          </h2>
        </div>

        {files.length > 1 && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-xl border-border/50 px-4 text-xs font-bold transition-all hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-500"
                >
                  Unzip?
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl rounded-3xl border-border/50 bg-background/95 p-0 backdrop-blur-xl">
                <DialogHeader className="border-b border-border/30 px-6 py-5">
                  <DialogTitle className="text-xl font-black tracking-tight">
                    Guide for Unzip
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Quick steps for opening the downloaded ZIP file on Android, Windows, and iPhone.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 px-6 py-5 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border/40 bg-card/40 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-black">
                      <Smartphone className="h-4 w-4 text-orange-500" />
                      Method 1 (Android)
                    </div>
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <p>Open File Manager / My Files</p>
                      <p>Find your .zip file</p>
                      <p>Tap on it</p>
                      <p>Tap Extract / Unzip</p>
                      <p className="font-semibold text-foreground">
                        Done. Files will appear in a folder.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/40 bg-card/40 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-black">
                      <Laptop className="h-4 w-4 text-orange-500" />
                      Method 2 (PC)
                    </div>
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <p>Right-click the .zip file</p>
                      <p>Click Extract All</p>
                      <p>Choose location or just press Extract</p>
                      <p className="font-semibold text-foreground">Done.</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border/40 bg-card/40 p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-black">
                      <Files className="h-4 w-4 text-orange-500" />
                      iPhone
                    </div>
                    <div className="space-y-1.5 text-sm text-muted-foreground">
                      <p>iPhone already supports it natively.</p>
                      <p>Open Files app</p>
                      <p>Find .zip file</p>
                      <p>Tap it once</p>
                      <p className="font-semibold text-foreground">
                        It auto-unzips into a folder.
                      </p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              size="sm"
              onClick={handleDownloadAll}
              disabled={zipState === "loading"}
              className={`
                h-8 gap-1.5 rounded-xl px-4 text-xs font-bold transition-all
                ${zipState === "done"
                  ? "bg-emerald-500 text-white hover:bg-emerald-500"
                  : "bg-orange-500 text-white shadow-sm shadow-orange-500/20 hover:bg-orange-600"
                }
              `}
            >
              {zipState === "loading" ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Zipping...
                </>
              ) : zipState === "done" ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Downloaded!
                </>
              ) : (
                <>
                  <FolderDown className="h-3.5 w-3.5" /> <span className="sm:block hidden">Download</span> All
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4">
        {files.map((file, index) => (
          <FileRow key={file.id} file={file} index={index} />
        ))}
      </div>

      {files.length > 1 && (
        <div className="border-t border-border/20 bg-muted/10 px-5 py-3">
          <p className="text-[11px] font-medium text-muted-foreground/40">
            &quot;Download All&quot; packages every file into a single .zip folder.
          </p>
        </div>
      )}
    </Card>
  );
};
