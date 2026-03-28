"use client";

import { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Download,
  FolderDown,
  Loader2,
  CheckCircle2,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { INoteFile } from "@/types/note.types";
import { formatFileSize } from "@/lib/Noteconstants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Triggers a browser download for a single file via fetch → blob → anchor click.
 * Falls back to window.open for cross-origin URLs that reject fetch.
 */
async function downloadFile(file: INoteFile): Promise<void> {
  try {
    const res = await fetch(file.url, { mode: "cors" });
    if (!res.ok) throw new Error("Fetch failed");
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = file.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    // Cross-origin fallback — opens in new tab, browser handles download
    window.open(file.url, "_blank", "noopener,noreferrer");
  }
}

/**
 * Downloads all files as a zip using the JSZip CDN (loaded lazily).
 * Falls back to sequential individual downloads if JSZip fails to load.
 */
async function downloadAllAsZip(
  files: INoteFile[],
  zipName: string
): Promise<void> {
  try {
    // Lazy-load JSZip from CDN
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    const fetches = files.map(async (file) => {
      try {
        const res = await fetch(file.url, { mode: "cors" });
        if (!res.ok) throw new Error();
        const blob = await res.blob();
        zip.file(file.fileName, blob);
      } catch {
        // Skip files that can't be fetched
      }
    });

    await Promise.all(fetches);

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${zipName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    // Fallback: download one by one
    for (const file of files) {
      await downloadFile(file);
    }
  }
}

// ─── FileRow ──────────────────────────────────────────────────────────────────

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

  return (
    <div
      className="
        group flex items-center gap-4 px-4 py-3.5
        rounded-2xl border border-border/40 bg-card/40
        hover:border-orange-500/30 hover:bg-card/70
        transition-all duration-200
      "
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Icon */}
      <div
        className={`
          h-10 w-10 rounded-xl flex items-center justify-center shrink-0
          ${isPdf ? "bg-orange-500/10 border border-orange-500/20" : "bg-sky-500/10 border border-sky-500/20"}
        `}
      >
        {isPdf ? (
          <FileText className="h-5 w-5 text-orange-500" />
        ) : (
          <ImageIcon className="h-5 w-5 text-sky-500" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{file.fileName}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-muted-foreground/50 uppercase font-bold tracking-wider">
            {isPdf ? "PDF" : "Image"}
          </span>
          <span className="text-muted-foreground/20 text-[10px]">·</span>
          <span className="text-[10px] text-muted-foreground/50 tabular-nums">
            {formatFileSize(file.fileSize)}
          </span>
        </div>
      </div>

      {/* Preview link */}
      <a
        href={file.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="
          hidden sm:flex text-[11px] font-bold text-muted-foreground/40
          hover:text-orange-500 transition-colors px-2
        "
      >
        Preview
      </a>

      {/* Download button */}
      <Button
        size="sm"
        variant="outline"
        onClick={handleDownload}
        disabled={state === "loading"}
        className={`
          h-8 px-3 rounded-xl text-xs font-bold gap-1.5 transition-all shrink-0
          ${state === "done"
            ? "border-emerald-500/40 bg-emerald-500/8 text-emerald-500"
            : "border-border/50 hover:border-orange-500/40 hover:text-orange-500 hover:bg-orange-500/5"
          }
        `}
      >
        {state === "loading" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : state === "done" ? (
          <><CheckCircle2 className="h-3.5 w-3.5" /> Saved</>
        ) : (
          <><Download className="h-3.5 w-3.5" /> Download</>
        )}
      </Button>
    </div>
  );
};

// ─── NoteFileDownloader ───────────────────────────────────────────────────────

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
    <Card className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4 text-orange-500" />
          <h2 className="text-sm font-black tracking-tight">
            Attachments
            <span className="ml-1.5 text-xs text-muted-foreground/50 font-bold">
              ({files.length})
            </span>
          </h2>
        </div>

        {/* Download all — only shown when there are multiple files */}
        {files.length > 1 && (
          <Button
            size="sm"
            onClick={handleDownloadAll}
            disabled={zipState === "loading"}
            className={`
              h-8 px-4 rounded-xl text-xs font-bold gap-1.5 transition-all
              ${zipState === "done"
                ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/20"
              }
            `}
          >
            {zipState === "loading" ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Zipping…</>
            ) : zipState === "done" ? (
              <><CheckCircle2 className="h-3.5 w-3.5" /> Downloaded!</>
            ) : (
              <><FolderDown className="h-3.5 w-3.5" /> Download All</>
            )}
          </Button>
        )}
      </div>

      {/* File rows */}
      <div className="flex flex-col gap-2 p-4">
        {files.map((file, i) => (
          <FileRow key={file.id} file={file} index={i} />
        ))}
      </div>

      {files.length > 1 && (
        <div className="px-5 py-3 border-t border-border/20 bg-muted/10">
          <p className="text-[11px] text-muted-foreground/40 font-medium">
            "Download All" packages every file into a single .zip folder.
          </p>
        </div>
      )}
    </Card>
  );
};