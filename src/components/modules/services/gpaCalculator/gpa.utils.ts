import type { CourseRow, GradeLetter, ScaleType } from "./gpa.types";

export const STORAGE_KEY = "acadex-gpa-calculator";

export const GRADE_POINTS_4: Record<GradeLetter, number> = {
  "A+": 4.0,
  A: 3.75,
  "A-": 3.5,
  "B+": 3.25,
  B: 3.0,
  "B-": 2.75,
  "C+": 2.5,
  C: 2.25,
  D: 2.0,
  F: 0.0,
};

export const GRADE_LETTERS = Object.keys(GRADE_POINTS_4) as GradeLetter[];

export const uid = () => crypto.randomUUID();

export const defaultGpaState = () => ({
  scale: "4.00" as ScaleType,
  semesters: [
    {
      id: uid(),
      label: "Semester 1",
      courses: [
        { id: uid(), name: "CSE101", credit: 3, grade: "A" as GradeLetter, isRetake: false },
        { id: uid(), name: "MAT101", credit: 3, grade: "A+" as GradeLetter, isRetake: false },
        { id: uid(), name: "PHY101", credit: 1.5, grade: "B+" as GradeLetter, isRetake: false },
      ],
    },
  ],
  targetCgpa: 3.8,
  degreeTotalCredits: 160,
});

const pointFor = (grade: GradeLetter, scale: ScaleType) => {
  const base = GRADE_POINTS_4[grade];
  if (scale === "5.00") return (base / 4) * 5;
  return base;
};

export const semesterGpa = (courses: CourseRow[], scale: ScaleType) => {
  let points = 0;
  let credits = 0;

  for (const c of courses) {
    if (c.credit <= 0) continue;
    const grade = c.isRetake && c.replacedGrade ? c.grade : c.grade;
    points += pointFor(grade, scale) * c.credit;
    credits += c.credit;
  }

  if (credits === 0) return 0;
  return Math.round((points / credits) * 100) / 100;
};

export const cgpa = (
  semesters: { courses: CourseRow[] }[],
  scale: ScaleType,
) => {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const sem of semesters) {
    for (const c of sem.courses) {
      if (c.credit <= 0) continue;
      totalPoints += pointFor(c.grade, scale) * c.credit;
      totalCredits += c.credit;
    }
  }

  if (totalCredits === 0) return 0;
  return Math.round((totalPoints / totalCredits) * 100) / 100;
};

export const completedCredits = (semesters: { courses: CourseRow[] }[]) =>
  semesters.reduce((sum, s) => sum + s.courses.reduce((a, c) => a + (c.credit || 0), 0), 0);

export const requiredFutureGpa = (
  currentCgpa: number,
  targetCgpa: number,
  completedCredits: number,
  remainingCredits: number,
) => {
  if (remainingCredits <= 0) return null;
  const needed = (targetCgpa * (completedCredits + remainingCredits) - currentCgpa * completedCredits) / remainingCredits;
  return Math.round(needed * 100) / 100;
};
