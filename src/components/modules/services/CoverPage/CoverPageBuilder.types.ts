export type University = {
  id: string;
  name: string;
  short: string;
  tagline: string;
  logo: string;
};

export type DocumentType = "lab-report" | "assignment";

export type FormState = {
  documentType: DocumentType;
  selectedUniId: string;
  institutionName: string;
  tagline: string;
  department: string;
  subjectName: string;
  subjectCode: string;
  experimentNo: string;
  assignmentNo: string;
  itemTitle: string;
  teacherName: string;
  teacherDesignation: string;
  studentName: string;
  studentId: string;
  batchGroup: string;
  section: string;
  submissionDate: string;
};

export type MissingField = {
  key: keyof FormState | "itemNumber";
  label: string;
  step: number;
};

export type DownloadFormat = "png" | "pdf";
