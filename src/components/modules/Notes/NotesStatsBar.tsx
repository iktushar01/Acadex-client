import type { INotesStats } from "@/types/note.types";

interface StatItem {
  label: string;
  value: number;
  color: string;
  bg: string;
  bar: string;
}

const STAT_ITEMS = (stats: INotesStats): StatItem[] => [
  {
    label: "Approved",
    value: stats.approved,
    color: "text-emerald-400",
    bg: "bg-emerald-500/8 border-emerald-500/15",
    bar: "bg-emerald-500",
  },
  {
    label: "Pending",
    value: stats.pending,
    color: "text-amber-400",
    bg: "bg-amber-500/8 border-amber-500/15",
    bar: "bg-amber-500",
  },
  {
    label: "Rejected",
    value: stats.rejected,
    color: "text-red-400",
    bg: "bg-red-500/8 border-red-500/15",
    bar: "bg-red-500",
  },
  {
    label: "Files",
    value: stats.totalFiles,
    color: "text-orange-400",
    bg: "bg-orange-500/8 border-orange-500/15",
    bar: "bg-orange-500",
  },
];

interface NotesStatsBarProps {
  stats: INotesStats;
}

export const NotesStatsBar = ({ stats }: NotesStatsBarProps) => {
  const total = stats.approved + stats.pending + stats.rejected || 1;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {STAT_ITEMS(stats).map((s) => (
        <div
          key={s.label}
          className={`relative rounded-2xl px-4 py-3.5 border overflow-hidden ${s.bg}`}
        >
          {/* mini progress bar at bottom */}
          {s.label !== "Files" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border/20">
              <div
                className={`h-full ${s.bar} transition-all duration-700`}
                style={{ width: `${Math.round((s.value / total) * 100)}%` }}
              />
            </div>
          )}

          <div className={`text-2xl font-black tabular-nums ${s.color}`}>
            {s.value}
          </div>
          <div className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest mt-0.5">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
};