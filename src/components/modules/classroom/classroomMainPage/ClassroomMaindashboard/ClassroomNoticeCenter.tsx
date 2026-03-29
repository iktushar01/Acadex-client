"use client";

import { useEffect, useMemo, useState } from "react";
import { BellRing, Megaphone, Pin, X } from "lucide-react";
import type { Notice } from "@/types/notice.types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const seenKeyForNotice = (notice: Notice) => `classroom-notice-seen:${notice.id}:${notice.updatedAt}`;

const ClassroomNoticeCenter = ({ notice }: { notice: Notice | null }) => {
  const [open, setOpen] = useState(false);

  const activeNotice = useMemo(() => {
    if (!notice || !notice.isActive) return null;
    return notice;
  }, [notice]);

  useEffect(() => {
    if (!activeNotice) return;

    const seenKey = seenKeyForNotice(activeNotice);
    const alreadySeen = window.localStorage.getItem(seenKey);

    if (!alreadySeen) {
      const timer = window.setTimeout(() => {
        setOpen(true);
        window.localStorage.setItem(seenKey, "1");
      }, 0);

      return () => window.clearTimeout(timer);
    }
  }, [activeNotice]);

  if (!activeNotice) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full border border-orange-500/20 bg-orange-500 px-4 py-3 text-white shadow-2xl shadow-orange-500/30 transition-all hover:scale-[1.03] hover:bg-orange-600"
      >
        <BellRing className="size-5" />
        <span className="hidden text-sm font-black tracking-tight sm:inline">Notice</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden rounded-[2rem] border-border/50 bg-card/95 p-0 backdrop-blur-xl sm:max-w-xl">
          <div className="relative overflow-hidden p-8">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />

            <DialogHeader className="relative space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                  <Megaphone className="size-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Notice from Acadex</p>
                  <DialogTitle className="mt-1 text-2xl font-black tracking-tight">
                    Classroom announcement
                  </DialogTitle>
                </div>
              </div>
            </DialogHeader>

            <div className="relative mt-6 rounded-[1.75rem] border border-border/60 bg-background/70 p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-muted-foreground">
                <Pin className="size-3.5 text-orange-500" />
                Posted by admin
              </div>
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                {activeNotice.content}
              </p>
            </div>

            <div className="relative mt-6 flex justify-end">
              <Button onClick={() => setOpen(false)} className="rounded-2xl font-black">
                <X className="mr-2 size-4" />
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClassroomNoticeCenter;
