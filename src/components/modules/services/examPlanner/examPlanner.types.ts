export type StudyPhase = "learning" | "revision" | "mock" | "final";

export type DailyTask = {
  id: string;
  label: string;
  done: boolean;
  date: string;
};

export type ExamPlan = {
  id: string;
  name: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  totalChapters: number;
  completedChapters: number;
  dailyProblemsTarget: number;
  tasks: DailyTask[];
  createdAt: string;
};

export type StudyStreak = {
  dates: string[];
  lastActiveDate: string;
};

export type ExamPlannerState = {
  exams: ExamPlan[];
  streak: StudyStreak;
};
