export type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

export type ClassSlot = {
  id: string;
  day: DayKey;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
  room: string;
  isLab: boolean;
  color: string;
};

export type TimetableState = {
  slots: ClassSlot[];
};

export const DAY_LABELS: Record<DayKey, string> = {
  sun: "Sun",
  mon: "Mon",
  tue: "Tue",
  wed: "Wed",
  thu: "Thu",
  fri: "Fri",
  sat: "Sat",
};

export const DAYS_ORDER: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export const SUBJECT_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];
