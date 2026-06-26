"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  getClassroomIndexStatsAction,
  reindexNoteAction,
} from "@/actions/chatbotActions/_chatbotActions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ClassroomIndexStats } from "@/types/chatbot.types";

type StudyAssistantIndexPanelProps = {
  classroomId: string;
};

const statusVariant = (status: string) => {
  if (status === "completed") return "secondary";
  if (status === "failed") return "destructive";
  if (status === "processing") return "default";
  return "outline";
};

export function StudyAssistantIndexPanel({
  classroomId,
}: StudyAssistantIndexPanelProps) {
  const [stats, setStats] = useState<ClassroomIndexStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getClassroomIndexStatsAction(classroomId);
      if (response.success && response.data) {
        setStats(response.data);
      } else if (!response.success) {
        toast.error(response.error || "Failed to load index stats");
      }
    } finally {
      setLoading(false);
    }
  }, [classroomId]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const handleRetryNote = async (noteId: string) => {
    const response = await reindexNoteAction(noteId);
    if (response.success) {
      toast.success(response.data?.message || "Note reindex queued");
      void loadStats();
    } else {
      toast.error(response.error || "Failed to retry note indexing");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-xs text-muted-foreground">
        <Loader2 className="size-3 animate-spin" />
        Loading indexing stats...
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="max-h-48 overflow-y-auto border-b border-border bg-muted/20 px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          Index Dashboard
        </p>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-[10px]"
          onClick={() => void loadStats()}
        >
          <RefreshCw className="mr-1 size-3" />
          Refresh
        </Button>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-lg border border-border/60 bg-background/70 p-2">
          <p className="text-muted-foreground">Indexed</p>
          <p className="font-semibold">
            {stats.indexedNotes}/{stats.totalNotes}
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/70 p-2">
          <p className="text-muted-foreground">Chunks</p>
          <p className="font-semibold">{stats.totalChunks}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/70 p-2">
          <p className="text-muted-foreground">Failed</p>
          <p className="font-semibold text-destructive">{stats.failedNotes}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/70 p-2">
          <p className="text-muted-foreground">Pending</p>
          <p className="font-semibold">{stats.pendingNotes}</p>
        </div>
      </div>

      {stats.lastReindexAt && (
        <p className="mb-2 text-[10px] text-muted-foreground">
          Last reindex: {new Date(stats.lastReindexAt).toLocaleString()}
        </p>
      )}

      <div className="space-y-2">
        {stats.recentJobs.slice(0, 5).map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/60 px-2 py-1.5"
          >
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium">
                {job.noteTitle ?? job.noteId}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {job.chunksIndexed} chunks
                {job.ocrStatus ? ` · OCR: ${job.ocrStatus}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Badge variant={statusVariant(job.status)} className="text-[9px]">
                {job.status}
              </Badge>
              {job.status === "failed" && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-6 px-2 text-[9px]"
                  onClick={() => void handleRetryNote(job.noteId)}
                >
                  Retry
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
