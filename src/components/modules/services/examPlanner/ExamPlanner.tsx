"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Flame,
  MapPin,
  Plus,
  Target,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ServicePageHeader } from "../shared/ServicePageHeader";
import { useLocalStorageState } from "../shared/useLocalStorageState";
import type { DailyTask, ExamPlan } from "./examPlanner.types";
import {
  STORAGE_KEY,
  chaptersRemaining,
  computeStreak,
  daysUntil,
  defaultPlannerState,
  formatExamDate,
  getStudyPhase,
  phaseLabel,
  readinessPercent,
  recommendedChaptersPerDay,
  todaysTasks,
  todayKey,
  uid,
  updateStreak,
  urgencyClass,
  urgencyLabel,
} from "./examPlanner.utils";

const emptyForm = () => ({
  name: "",
  subject: "",
  date: "",
  time: "",
  location: "",
  totalChapters: "12",
  dailyProblemsTarget: "10",
});

export default function ExamPlanner() {
  const [state, setState, hydrated] = useLocalStorageState(STORAGE_KEY, defaultPlannerState());
  const [form, setForm] = useState(emptyForm);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState("");

  const sortedExams = useMemo(
    () => [...state.exams].sort((a, b) => a.date.localeCompare(b.date)),
    [state.exams],
  );

  const activeExam = sortedExams.find((e) => e.id === selectedId) ?? sortedExams[0] ?? null;
  const streak = computeStreak(state.streak.dates);

  const addExam = () => {
    if (!form.name || !form.subject || !form.date) {
      toast.error("Name, subject, and date are required.");
      return;
    }

    const exam: ExamPlan = {
      id: uid(),
      name: form.name,
      subject: form.subject,
      date: form.date,
      time: form.time,
      location: form.location,
      totalChapters: Number(form.totalChapters) || 0,
      completedChapters: 0,
      dailyProblemsTarget: Number(form.dailyProblemsTarget) || 0,
      tasks: [],
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({ ...prev, exams: [...prev.exams, exam] }));
    setSelectedId(exam.id);
    setForm(emptyForm());
    toast.success("Exam added to your planner.");
  };

  const deleteExam = (id: string) => {
    setState((prev) => ({ ...prev, exams: prev.exams.filter((e) => e.id !== id) }));
    if (selectedId === id) setSelectedId(null);
  };

  const patchExam = (id: string, patch: Partial<ExamPlan>) => {
    setState((prev) => ({
      ...prev,
      exams: prev.exams.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));
  };

  const toggleTask = (examId: string, taskId: string) => {
    let completedToday = false;
    setState((prev) => {
      const exams = prev.exams.map((exam) => {
        if (exam.id !== examId) return exam;
        const tasks = exam.tasks.map((t) => {
          if (t.id !== taskId) return t;
          const done = !t.done;
          if (done && t.date === todayKey()) completedToday = true;
          return { ...t, done };
        });
        return { ...exam, tasks };
      });
      const streak = updateStreak(prev.streak.dates, completedToday);
      return { exams, streak: { dates: streak.dates, lastActiveDate: streak.lastActiveDate } };
    });
  };

  const addTask = (examId: string) => {
    if (!newTask.trim()) return;
    const task: DailyTask = { id: uid(), label: newTask.trim(), done: false, date: todayKey() };
    setState((prev) => ({
      ...prev,
      exams: prev.exams.map((e) => (e.id === examId ? { ...e, tasks: [...e.tasks, task] } : e)),
    }));
    setNewTask("");
  };

  if (!hydrated) {
    return <div className="mx-auto max-w-5xl animate-pulse space-y-4 p-8 text-muted-foreground">Loading planner…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500 pb-12">
      <ServicePageHeader
        badge="Study tools"
        title="Exam Countdown & Study Planner"
        description="Track exams, daily targets, revision phases, and study streaks — all saved on this device."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="rounded-full px-3 py-1 text-sm font-bold">
          <Flame className="mr-1 h-4 w-4 text-orange-500" />
          {streak}-day study streak
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card className="rounded-[2rem] border border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Add exam</CardTitle>
            <CardDescription>Set subject, date, and workload targets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Exam name</Label>
                <Input
                  placeholder="Final Exam"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Input
                  placeholder="DLD"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Time</Label>
                <Input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input
                  placeholder="Room 402"
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Total chapters</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.totalChapters}
                  onChange={(e) => setForm((f) => ({ ...f, totalChapters: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Daily problems target</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.dailyProblemsTarget}
                  onChange={(e) => setForm((f) => ({ ...f, dailyProblemsTarget: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
            </div>
            <Button onClick={addExam} className="w-full rounded-2xl font-bold">
              <Plus className="mr-2 h-4 w-4" />
              Add to planner
            </Button>
          </CardContent>
        </Card>

        {activeExam ? (
          <ExamCountdownCard
            exam={activeExam}
            onSelect={(id) => setSelectedId(id)}
            onDelete={deleteExam}
            onProgress={(completed) => patchExam(activeExam.id, { completedChapters: completed })}
            onToggleTask={(taskId) => toggleTask(activeExam.id, taskId)}
            onAddTask={() => addTask(activeExam.id)}
            newTask={newTask}
            setNewTask={setNewTask}
            allExams={sortedExams}
            selectedId={activeExam.id}
          />
        ) : (
          <Card className="flex min-h-[280px] items-center justify-center rounded-[2rem] border border-dashed border-border/60">
            <p className="text-sm text-muted-foreground">Add your first exam to see the countdown.</p>
          </Card>
        )}
      </div>

      {sortedExams.length > 1 && (
        <Card className="rounded-[2rem] border border-border/60">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Upcoming exams</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {sortedExams.map((exam) => {
                const days = daysUntil(exam.date);
                return (
                  <li key={exam.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(exam.id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                        exam.id === activeExam?.id ? "border-primary/40 bg-primary/5" : "border-border/50"
                      }`}
                    >
                      <span className="font-semibold">
                        {exam.subject} — {exam.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatExamDate(exam.date)} · {days < 0 ? "Past" : `${days} days`}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ExamCountdownCard({
  exam,
  allExams,
  selectedId,
  onSelect,
  onDelete,
  onProgress,
  onToggleTask,
  onAddTask,
  newTask,
  setNewTask,
}: {
  exam: ExamPlan;
  allExams: ExamPlan[];
  selectedId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onProgress: (completed: number) => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: () => void;
  newTask: string;
  setNewTask: (v: string) => void;
}) {
  const days = daysUntil(exam.date);
  const remaining = chaptersRemaining(exam);
  const ready = readinessPercent(exam);
  const perDay = recommendedChaptersPerDay(exam);
  const phase = getStudyPhase(days);
  const tasks = todaysTasks(exam);

  return (
    <div className="space-y-4">
      <Card className={`rounded-[2rem] border-2 ${urgencyClass(days)}`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-xl font-black">
                {exam.name}: {exam.subject}
              </CardTitle>
              <CardDescription className="mt-1 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatExamDate(exam.date)}
                  {exam.time ? ` at ${exam.time}` : ""}
                </span>
                {exam.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {exam.location}
                  </span>
                )}
              </CardDescription>
            </div>
            <Badge variant="outline" className="shrink-0 rounded-full font-bold">
              {urgencyLabel(days)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="text-center">
            <p className="text-4xl font-black tabular-nums">
              {days < 0 ? "0" : days}
            </p>
            <p className="text-sm font-medium text-muted-foreground">days left</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>{ready}% ready</span>
              <span>{remaining} chapters remaining</span>
            </div>
            <Progress value={ready} className="h-2.5" />
          </div>

          <div className="grid gap-2 rounded-2xl bg-muted/40 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <Target className="h-4 w-4 text-primary" />
              Study {perDay} chapter{perDay !== 1 ? "s" : ""}/day
            </p>
            {exam.dailyProblemsTarget > 0 && (
              <p>Complete {exam.dailyProblemsTarget} problems/day</p>
            )}
            <p className="text-muted-foreground">{phaseLabel[phase]}</p>
          </div>

          <div className="flex items-center gap-2">
            <Label className="shrink-0 text-xs">Chapters done</Label>
            <Input
              type="number"
              min={0}
              max={exam.totalChapters}
              value={exam.completedChapters}
              onChange={(e) => onProgress(Math.min(exam.totalChapters, Math.max(0, Number(e.target.value) || 0)))}
              className="h-9 rounded-xl"
            />
            <span className="text-sm text-muted-foreground">/ {exam.totalChapters}</span>
          </div>

          {allExams.length > 1 && (
            <select
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              value={selectedId}
              onChange={(e) => onSelect(e.target.value)}
            >
              {allExams.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.subject} — {formatExamDate(e.date)}
                </option>
              ))}
            </select>
          )}

          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(exam.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Remove exam
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border border-border/60">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Today&apos;s tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tasks for today. Add one below.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => onToggleTask(t.id)}
                    className="flex w-full items-center gap-3 rounded-xl border border-border/50 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40"
                  >
                    {t.done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <span className={t.done ? "line-through text-muted-foreground" : ""}>{t.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Chapter 4, Mock quiz"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAddTask()}
              className="rounded-xl"
            />
            <Button onClick={onAddTask} className="shrink-0 rounded-xl">
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
