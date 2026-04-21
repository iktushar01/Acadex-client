import { FormState, University } from "./CoverPageBuilder.types";

export const A4_W = 794;
export const A4_H = 1123;

export const UNIVERSITIES: University[] = [
  {
    id: "uu",
    name: "Uttara University",
    short: "UU",
    tagline: "Excellence in Higher Education and Research",
    logo: "https://i.ibb.co/xqwm5FDC/Screenshot-2026-04-21-150046.png",
  },
  {
    id: "buet",
    name: "BUET",
    short: "BUET",
    tagline: "Bangladesh University of Engineering & Technology",
    logo: "https://i.ibb.co/xqwm5FDC/Screenshot-2026-04-21-150046.png",
  },
  {
    id: "du",
    name: "Dhaka University",
    short: "DU",
    tagline: "The First University of Bangladesh",
    logo: "https://i.ibb.co/xqwm5FDC/Screenshot-2026-04-21-150046.png",
  },
  {
    id: "diu",
    name: "Daffodil International",
    short: "DIU",
    tagline: "Daffodil International University",
    logo: "https://i.ibb.co/xqwm5FDC/Screenshot-2026-04-21-150046.png",
  },
  {
    id: "nsu",
    name: "North South University",
    short: "NSU",
    tagline: "Private University of Bangladesh",
    logo: "https://i.ibb.co/xqwm5FDC/Screenshot-2026-04-21-150046.png",
  },
  {
    id: "brac",
    name: "BRAC University",
    short: "BRACU",
    tagline: "BRAC University - Enlightening Lives",
    logo: "https://i.ibb.co/xqwm5FDC/Screenshot-2026-04-21-150046.png",
  },
];

export const defaultForm = (): FormState => ({
  documentType: "lab-report",
  selectedUniId: "uu",
  institutionName: "Uttara University",
  tagline: "Excellence in Higher Education and Research",
  department: "",
  subjectName: "",
  subjectCode: "",
  experimentNo: "",
  assignmentNo: "",
  itemTitle: "",
  teacherName: "",
  teacherDesignation: "",
  studentName: "",
  studentId: "",
  batchGroup: "",
  section: "",
  submissionDate: new Date().toISOString().slice(0, 10),
});
