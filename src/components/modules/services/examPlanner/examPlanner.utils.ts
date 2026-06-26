import type { ExamPlan, StudyPhase } from "./examPlanner.types";

export const STORAGE_KEY = "acadex-exam-planner";

export const defaultPlannerState = () => ({
  exams: [] as ExamPlan[],
  streak: { dates: [] as string[], lastActiveDate: "" },
});

export const uid = () => crypto.randomUUID();

export const todayKey = () => new Date().toISOString().slice(0, 10);

export const daysUntil = (dateStr: string) => {
  const target = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const urgencyClass = (days: number) => {
  if (days < 7) return "border-red-500/40 bg-red-500/5 text-red-600 dark:text-red-400";
  if (days <= 30) return "border-yellow-500/40 bg-yellow-500/5 text-yellow-700 dark:text-yellow-400";
  return "border-green-500/40 bg-green-500/5 text-green-700 dark:text-green-400";
};

export const urgencyLabel = (days: number) => {
  if (days < 0) return "Past due";
  if (days < 7) return "Urgent";
  if (days <= 30) return "Soon";
  return "On track";
};

export const getStudyPhase = (days: number): StudyPhase => {
  if (days <= 3) return "final";
  if (days <= 10) return "mock";
  if (days <= 21) return "revision";
  return "learning";
};

export const phaseLabel: Record<StudyPhase, string> = {
  learning: "Learning phase",
  revision: "Revision phase",
  mock: "Mock test phase",
  final: "Final review phase",
};

export const chaptersRemaining = (exam: ExamPlan) =>
  Math.max(0, exam.totalChapters - exam.completedChapters);

export const readinessPercent = (exam: ExamPlan) => {
  if (exam.totalChapters <= 0) return 0;
  return Math.min(100, Math.round((exam.completedChapters / exam.totalChapters) * 100));
};

export const recommendedChaptersPerDay = (exam: ExamPlan) => {
  const days = Math.max(1, daysUntil(exam.date));
  const remaining = chaptersRemaining(exam);
  return remaining > 0 ? Math.ceil(remaining / days) : 0;
};

export const formatExamDate = (dateStr: string) => {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const updateStreak = (dates: string[], taskCompletedToday: boolean) => {
  const today = todayKey();
  if (!taskCompletedToday) return { dates, lastActiveDate: today };

  const set = new Set(dates);
  set.add(today);
  const sorted = [...set].sort();
  return { dates: sorted, lastActiveDate: today };
};

export const computeStreak = (dates: string[]) => {
  const set = new Set(dates);
  let streak = 0;
  const cursor = new Date();

  for (let i = 0; i < 365; i++) {
    const key = cursor.toISOString().slice(0, 10);
    if (set.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
};

export const todaysTasks = (exam: ExamPlan) =>
  exam.tasks.filter((t) => t.date === todayKey());
