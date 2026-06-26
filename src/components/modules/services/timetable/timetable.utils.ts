import type { ClassSlot, DayKey } from "./timetable.types";
import { DAYS_ORDER, DAY_LABELS, SUBJECT_COLORS } from "./timetable.types";

export const STORAGE_KEY = "acadex-timetable";

export const uid = () => crypto.randomUUID();

export const defaultTimetableState = () => ({ slots: [] as ClassSlot[] });

const DAY_ALIASES: Record<string, DayKey> = {
  sun: "sun",
  sunday: "sun",
  mon: "mon",
  monday: "mon",
  tue: "tue",
  tues: "tue",
  tuesday: "tue",
  wed: "wed",
  wednesday: "wed",
  thu: "thu",
  thur: "thu",
  thursday: "thu",
  fri: "fri",
  friday: "fri",
  sat: "sat",
  saturday: "sat",
};

export const parseScheduleText = (text: string): Omit<ClassSlot, "id" | "color">[] => {
  const results: Omit<ClassSlot, "id" | "color">[] = [];
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const match = line.match(
      /^(\w+)\s*:?\s*([A-Za-z0-9]+)?\s*(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})\s*(.*)$/i,
    );
    if (!match) continue;

    const dayRaw = match[1].toLowerCase();
    const day = DAY_ALIASES[dayRaw];
    if (!day) continue;

    const subject = (match[2] || match[5] || "Class").trim();
    const startTime = normalizeTime(match[3]);
    const endTime = normalizeTime(match[4]);

    results.push({
      day,
      startTime,
      endTime,
      subject,
      teacher: "",
      room: "",
      isLab: /lab/i.test(line),
    });
  }

  return results;
};

const normalizeTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const timeToMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const formatTime12 = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

export type Conflict = { a: ClassSlot; b: ClassSlot };

export const findConflicts = (slots: ClassSlot[]): Conflict[] => {
  const conflicts: Conflict[] = [];
  const byDay = DAYS_ORDER.map((day) => slots.filter((s) => s.day === day));

  for (const daySlots of byDay) {
    for (let i = 0; i < daySlots.length; i++) {
      for (let j = i + 1; j < daySlots.length; j++) {
        const a = daySlots[i];
        const b = daySlots[j];
        const aStart = timeToMinutes(a.startTime);
        const aEnd = timeToMinutes(a.endTime);
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        if (aStart < bEnd && bStart < aEnd) conflicts.push({ a, b });
      }
    }
  }
  return conflicts;
};

export const findFreeGaps = (slots: ClassSlot[], day: DayKey, minMinutes = 60) => {
  const daySlots = slots
    .filter((s) => s.day === day)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  const gaps: { start: string; end: string; minutes: number }[] = [];
  for (let i = 0; i < daySlots.length - 1; i++) {
    const end = timeToMinutes(daySlots[i].endTime);
    const nextStart = timeToMinutes(daySlots[i + 1].startTime);
    const diff = nextStart - end;
    if (diff >= minMinutes) {
      gaps.push({
        start: daySlots[i].endTime,
        end: daySlots[i + 1].startTime,
        minutes: diff,
      });
    }
  }
  return gaps;
};

export const colorForSubject = (subject: string, index: number) =>
  SUBJECT_COLORS[index % SUBJECT_COLORS.length];

export const slotsByDay = (slots: ClassSlot[]) =>
  DAYS_ORDER.map((day) => ({
    day,
    label: DAY_LABELS[day],
    slots: slots
      .filter((s) => s.day === day)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)),
  }));
