"use client";

import { useMemo, useRef, useState } from "react";
import { AlertTriangle, Download, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ServicePageHeader } from "../shared/ServicePageHeader";
import { useLocalStorageState } from "../shared/useLocalStorageState";
import type { ClassSlot, DayKey } from "./timetable.types";
import { DAYS_ORDER, DAY_LABELS } from "./timetable.types";
import {
  STORAGE_KEY,
  colorForSubject,
  defaultTimetableState,
  findConflicts,
  findFreeGaps,
  formatTime12,
  parseScheduleText,
  slotsByDay,
  uid,
} from "./timetable.utils";

const emptySlot = (): Omit<ClassSlot, "id" | "color"> => ({
  day: "mon",
  startTime: "09:00",
  endTime: "10:00",
  subject: "",
  teacher: "",
  room: "",
  isLab: false,
});

export default function TimetableBuilder() {
  const [state, setState, hydrated] = useLocalStorageState(STORAGE_KEY, defaultTimetableState());
  const [form, setForm] = useState(emptySlot);
  const [pasteText, setPasteText] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  const conflicts = useMemo(() => findConflicts(state.slots), [state.slots]);
  const weekly = useMemo(() => slotsByDay(state.slots), [state.slots]);
  const wedGaps = useMemo(() => findFreeGaps(state.slots, "wed", 60), [state.slots]);

  const addSlot = () => {
    if (!form.subject.trim()) {
      toast.error("Subject is required.");
      return;
    }
    const slot: ClassSlot = {
      id: uid(),
      ...form,
      subject: form.subject.trim(),
      color: colorForSubject(form.subject, state.slots.length),
    };
    setState((prev) => ({ slots: [...prev.slots, slot] }));
    setForm(emptySlot());
  };

  const importText = () => {
    const parsed = parseScheduleText(pasteText);
    if (parsed.length === 0) {
      toast.error("Could not parse schedule. Try: Sat: CSE101 9:00-10:30");
      return;
    }
    const slots = parsed.map((p, i) => ({
      id: uid(),
      ...p,
      color: colorForSubject(p.subject, state.slots.length + i),
    }));
    setState((prev) => ({ slots: [...prev.slots, ...slots] }));
    setPasteText("");
    toast.success(`Imported ${slots.length} classes.`);
  };

  const removeSlot = (id: string) => {
    setState((prev) => ({ slots: prev.slots.filter((s) => s.id !== id) }));
  };

  const exportPng = async () => {
    if (!gridRef.current) return;
    try {
      const canvas = await html2canvas(gridRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "acadex-timetable.png";
      a.click();
      toast.success("Timetable image downloaded.");
    } catch {
      toast.error("Export failed.");
    }
  };

  if (!hydrated) {
    return <div className="mx-auto max-w-5xl animate-pulse p-8 text-muted-foreground">Loading timetable…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 animate-in fade-in duration-500 pb-12">
      <ServicePageHeader
        badge="Campus life"
        title="Weekly Timetable"
        description="Build or paste your class routine, spot conflicts, and export a shareable weekly view."
      />

      {conflicts.length > 0 && (
        <Card className="rounded-2xl border-yellow-500/40 bg-yellow-500/5">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
            <div className="space-y-1 text-sm">
              <p className="font-bold text-yellow-800 dark:text-yellow-300">Schedule conflicts</p>
              {conflicts.map(({ a, b }) => (
                <p key={`${a.id}-${b.id}`} className="text-muted-foreground">
                  {DAY_LABELS[a.day]}: {a.subject} ({formatTime12(a.startTime)}–{formatTime12(a.endTime)}) overlaps
                  with {b.subject}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {wedGaps.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Free time on Wed: {wedGaps.map((g) => `${formatTime12(g.start)}–${formatTime12(g.end)} (${g.minutes} min)`).join(", ")}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-6">
          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Paste routine</CardTitle>
              <CardDescription>One line per class: Sat: CSE101 9:00-10:30</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                rows={5}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={`Sat: CSE101 9:00-10:30\nSun: DLD 11:00-12:30\nMon: Math 8:00-9:30`}
                className="rounded-xl font-mono text-sm"
              />
              <Button onClick={importText} className="w-full rounded-2xl font-bold">
                Import schedule
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Add class</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Day</Label>
                <select
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  value={form.day}
                  onChange={(e) => setForm((f) => ({ ...f, day: e.target.value as DayKey }))}
                >
                  {DAYS_ORDER.map((d) => (
                    <option key={d} value={d}>
                      {DAY_LABELS[d]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Input
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="rounded-xl"
                  placeholder="OOP"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Start</Label>
                <Input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>End</Label>
                <Input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Teacher</Label>
                <Input
                  value={form.teacher}
                  onChange={(e) => setForm((f) => ({ ...f, teacher: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Room</Label>
                <Input
                  value={form.room}
                  onChange={(e) => setForm((f) => ({ ...f, room: e.target.value }))}
                  className="rounded-xl"
                  placeholder="402"
                />
              </div>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isLab}
                  onChange={(e) => setForm((f) => ({ ...f, isLab: e.target.checked }))}
                />
                Lab session
              </label>
              <Button onClick={addSlot} className="sm:col-span-2 rounded-2xl font-bold">
                <Plus className="mr-2 h-4 w-4" />
                Add to timetable
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Weekly view</CardTitle>
            <Button size="sm" variant="outline" className="rounded-xl" onClick={() => void exportPng()}>
              <Download className="mr-1 h-4 w-4" />
              PNG
            </Button>
          </CardHeader>
          <CardContent>
            <div
              ref={gridRef}
              className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-4 text-gray-900 sm:grid-cols-4 lg:grid-cols-7 dark:bg-zinc-950 dark:text-zinc-100"
            >
              {weekly.map(({ day, label, slots }) => (
                <div key={day} className="min-h-[120px] rounded-xl border border-border/40 p-2">
                  <p className="mb-2 text-center text-xs font-black uppercase tracking-wider">{label}</p>
                  <div className="space-y-2">
                    {slots.length === 0 ? (
                      <p className="text-center text-[10px] text-muted-foreground">—</p>
                    ) : (
                      slots.map((s) => (
                        <div
                          key={s.id}
                          className="rounded-lg p-2 text-[10px] leading-tight text-white"
                          style={{ backgroundColor: s.color }}
                        >
                          <p className="font-bold">{s.subject}</p>
                          <p>{formatTime12(s.startTime)}</p>
                          {s.room && <p>Rm {s.room}</p>}
                          {s.isLab && (
                            <Badge className="mt-1 h-4 bg-black/20 text-[8px]">Lab</Badge>
                          )}
                          <button
                            type="button"
                            onClick={() => removeSlot(s.id)}
                            className="mt-1 flex items-center gap-0.5 opacity-80 hover:opacity-100"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
