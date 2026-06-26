export type GradeLetter =
  | "A+"
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C"
  | "D"
  | "F";

export type ScaleType = "4.00" | "5.00";

export type CourseRow = {
  id: string;
  name: string;
  credit: number;
  grade: GradeLetter;
  isRetake: boolean;
  replacedGrade?: GradeLetter;
};

export type SemesterRow = {
  id: string;
  label: string;
  courses: CourseRow[];
  totalDegreeCredits?: number;
};

export type GpaCalculatorState = {
  scale: ScaleType;
  semesters: SemesterRow[];
  targetCgpa: number;
  degreeTotalCredits: number;
};
