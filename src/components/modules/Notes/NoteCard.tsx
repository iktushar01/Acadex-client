"use client";

import React, { memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, XCircle, Trash2, MoreVertical, 
  Loader2, Calendar, ShieldCheck, AlertCircle, Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/modules/Notes/StatusBadge";
import { UploaderAvatar } from "@/components/modules/Notes/UploaderAvatar";
import { cn } from "@/lib/utils";
import type { INote } from "@/types/note.types";

// --- Configuration & Constants ---

const STATUS_CONFIG = {
  APPROVED: { 
    color: "text-emerald-500", 
    bg: "bg-emerald-500/10", 
    blob: "bg-emerald-400/20",
    icon: ShieldCheck, 
  },
  REJECTED: { 
    color: "text-red-500", 
    bg: "bg-red-500/10", 
    blob: "bg-red-400/20",
    icon: AlertCircle, 
  },
  PENDING: { 
    color: "text-amber-500", 
    bg: "bg-amber-500/10", 
    blob: "bg-amber-400/20",
    icon: Clock, 
  },
} as const;

// --- Sub-Components ---

const ActionMenu = memo(({ 
  note, isCR, onApprove, onReject, onDelete 
}: Omit<NoteCardProps, "isActioning">) => {
  const actions = useMemo(() => [
    {
      show: isCR && note.status === "PENDING",
      label: "Approve",
      icon: CheckCircle2,
      onClick: () => onApprove(note.id),
      className: "text-emerald-600 dark:text-emerald-400"
    },
    {
      show: isCR && note.status === "PENDING",
      label: "Reject",
      icon: XCircle,
      onClick: () => onReject(note.id),
      className: "text-amber-600 dark:text-amber-400"
    },
    {
      show: true,
      label: "Delete",
      icon: Trash2,
      onClick: () => onDelete(note.id),
      className: "text-destructive",
      separator: isCR && note.status === "PENDING"
    }
  ], [note.id, note.status, isCR, onApprove, onReject, onDelete]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background/80">
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 p-1.5 backdrop-blur-xl border-border/50 shadow-2xl">
        {actions.filter(a => a.show).map((action) => (
          <React.Fragment key={action.label}>
            {action.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); action.onClick(); }}
              className={cn("gap-2.5 py-2 px-3 cursor-pointer rounded-lg", action.className)}
            >
              <action.icon className="h-4 w-4" />
              <span className="font-medium text-sm">{action.label}</span>
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// --- Main Component ---

export interface NoteCardProps {
  note: INote;
  isCR: boolean;
  isActioning?: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NoteCard = memo(({ note, isActioning, ...props }: NoteCardProps) => {
  const router = useRouter();
  const config = STATUS_CONFIG[note.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover="hover"
      className="relative h-full"
    >
      <div 
        onClick={() => router.push(`/dashboard/classroom/notes/${note.id}`)}
        className={cn(
          "relative flex flex-col h-full min-h-[220px] p-6 rounded-3xl border overflow-hidden transition-colors duration-500",
          "bg-card/40 backdrop-blur-xl border-border/50 cursor-pointer",
          "hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5",
          isActioning && "opacity-60 pointer-events-none"
        )}
      >
        {/* --- Advanced Background Element (Animated Blob) --- */}
        <motion.div
          variants={{
            hover: { scale: 1.2, rotate: 15, x: 20, y: -20 }
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] -z-10 transition-colors duration-700",
            config.blob
          )}
        />
        
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent pointer-events-none" />

        {/* Header Section */}
        <div className="flex items-start justify-between gap-4 z-10">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <div className={cn("p-2 rounded-xl bg-background shadow-inner border border-border/20", config.color)}>
                <config.icon className="h-4 w-4" />
              </div>
              <StatusBadge status={note.status} compact className="font-bold text-[10px] tracking-widest px-2.5 border-none bg-muted/50" />
            </div>
            
            <h3 className="text-lg font-bold tracking-tight text-foreground leading-[1.2] line-clamp-2 group-hover:text-primary transition-colors">
              {note.title}
            </h3>
          </div>

          <ActionMenu note={note} {...props} />
        </div>

        {/* Description */}
        <p className="mt-4 text-sm text-muted-foreground/80 line-clamp-2 font-medium leading-relaxed z-10">
          {note.description || "No summary available for this module."}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3 bg-background/40 p-1 pr-3 rounded-full border border-border/50">
            <UploaderAvatar uploader={note.uploader} className="h-7 w-7 ring-2 ring-background" />
            <span className="text-[11px] font-bold text-foreground/70 truncate max-w-[70px]">
              {note.uploader.name.split(' ')[0]}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/20 shadow-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
              {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isActioning && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md"
            >
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Updating</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

NoteCard.displayName = "NoteCard";