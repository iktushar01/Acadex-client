import { STATUS_CONFIG } from "@/lib/Noteconstants";
import { cn } from "@/lib/utils";
import type { NoteStatus } from "@/types/note.types";

interface StatusBadgeProps {
  status: NoteStatus;
  /** Compact mode shows only a dot + label, no icon */
  compact?: boolean;
  className?: string;
}

export const StatusBadge = ({ status, compact = false, className }: StatusBadgeProps) => {
  const { label, Icon, cls, dot } = STATUS_CONFIG[status];

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold",
          cls,
          className,
        )}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${dot} shrink-0`} />
        {label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold",
        cls,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
};
