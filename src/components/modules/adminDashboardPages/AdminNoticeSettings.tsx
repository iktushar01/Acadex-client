"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BellRing, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { getCurrentNoticeAction, toggleNoticeAction, updateNoticeAction } from "@/actions/noticeActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const AdminNoticeSettings = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-notice"],
    queryFn: getCurrentNoticeAction,
  });

  const notice = data?.data;
  const [draftContent, setDraftContent] = useState<string | null>(null);
  const [draftActive, setDraftActive] = useState<boolean | null>(null);
  const content = draftContent ?? notice?.content ?? "";
  const isActive = draftActive ?? notice?.isActive ?? false;

  const saveMutation = useMutation({
    mutationFn: updateNoticeAction,
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      setDraftContent(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-notice"] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: toggleNoticeAction,
    onSuccess: async (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setDraftActive(null);
      toast.success(result.message);
      await queryClient.invalidateQueries({ queryKey: ["admin-notice"] });
    },
  });

  return (
    <section className="admin-panel rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="admin-section-label text-xs font-black uppercase tracking-[0.25em] text-primary">
            Notice Center
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight">
            Classroom notice
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Publish one Acadex notice for students. When active, students will see it as a modal on the classroom dashboard and can reopen it from the sticky notice button.
          </p>
        </div>

        <div className="rounded-2xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          Current status:{" "}
          <span className="font-bold text-foreground">
            {isLoading ? "loading" : isActive ? "active" : "inactive"}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-border/70 bg-background/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <BellRing className="size-5" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight">Notice visibility</p>
              <p className="text-xs text-muted-foreground">Toggle this on to show the latest notice to students.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={isActive ? "default" : "outline"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
            <Switch
              checked={isActive}
              disabled={toggleMutation.isPending || !notice}
              onCheckedChange={(checked) => {
                setDraftActive(checked);
                toggleMutation.mutate(checked);
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/70">
            Notice Content
          </label>
          <Textarea
            value={content}
            onChange={(e) => setDraftContent(e.target.value)}
            placeholder="Write the classroom notice here..."
            className="min-h-40 rounded-[1.75rem] bg-background/70 px-4 py-4"
            maxLength={1000}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>One shared notice for the classroom dashboard</span>
            <span>{content.length}/1000</span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => saveMutation.mutate(content)}
            disabled={saveMutation.isPending || !content.trim()}
            className="rounded-2xl px-5 font-black"
          >
            {saveMutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
            Save Notice
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AdminNoticeSettings;
