import { Clock, CheckCircle2, XCircle } from "lucide-react";
import type { NoteStatus } from "@/types/note.types";

export const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    Icon: Clock,
    cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    dot: "bg-amber-400",
  },
  APPROVED: {
    label: "Approved",
    Icon: CheckCircle2,
    cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    Icon: XCircle,
    cls: "bg-red-500/10 text-red-500 border-red-500/20",
    dot: "bg-red-400",
  },
} as const;

export const FILTER_OPTIONS: { label: string; value: NoteStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Approved", value: "APPROVED" },
  { label: "Pending", value: "PENDING" },
  { label: "Rejected", value: "REJECTED" },
];

export const ACCEPTED_FILE_TYPES =
  "image/jpeg,image/png,image/webp,application/pdf";

export const MAX_FILES = 10;
export const MAX_TITLE_LENGTH = 150;
export const MAX_DESCRIPTION_LENGTH = 1000;
 
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};