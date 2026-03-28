import { STATUS_CONFIG } from "@/lib/Noteconstants";
import type { NoteStatus } from "@/types/note.types";

interface StatusBadgeProps {
  status: NoteStatus;
  /** Compact mode shows only a dot + label, no icon */
  compact?: boolean;
}

export const StatusBadge = ({ status, compact = false }: StatusBadgeProps) => {
  const { label, Icon, cls, dot } = STATUS_CONFIG[status];

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cls}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dot} shrink-0`} />
        {label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cls}`}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};