import { FileText, Image as ImageIcon, Download } from "lucide-react";
import { formatFileSize } from "@/lib/Noteconstants";
import type { INoteFile } from "@/types/note.types";

interface FileChipProps {
  file: INoteFile;
}

export const FileChip = ({ file }: FileChipProps) => (
  <a
    href={file.url}
    target="_blank"
    rel="noopener noreferrer"
    title={`Download ${file.fileName}`}
    className="
      group flex items-center gap-2
      px-3 py-1.5 rounded-xl
      bg-background/60 border border-border/50
      hover:border-orange-500/50 hover:bg-orange-500/5
      transition-all duration-200 text-xs
    "
  >
    {file.type === "pdf" ? (
      <FileText className="h-3.5 w-3.5 text-orange-500 shrink-0" />
    ) : (
      <ImageIcon className="h-3.5 w-3.5 text-orange-400 shrink-0" />
    )}

    <span className="truncate max-w-[130px] text-muted-foreground group-hover:text-foreground transition-colors font-medium">
      {file.fileName}
    </span>

    <span className="text-muted-foreground/40 shrink-0 tabular-nums">
      {formatFileSize(file.fileSize)}
    </span>

    <Download className="h-3 w-3 ml-auto shrink-0 text-muted-foreground/30 group-hover:text-orange-500 transition-colors" />
  </a>
);