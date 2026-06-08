import { FormState, University } from "./CoverPageBuilder.types";

export const A4_W = 794;
export const A4_H = 1123;

export const UNIVERSITIES: University[] = [
  {
    id: "uu",
    name: "Uttara University",
    short: "UU",
    logo: "https://res.cloudinary.com/dfoqasqnw/image/upload/header_logo_ldhtg9.png",
  },
  {
    id: "buet",
    name: "BUET",
    short: "BUET",
    logo: "https://i.ibb.co/xqwm5FDC/Screenshot-2026-04-21-150046.png",
  },
  {
    id: "du",
    name: "Dhaka University",
    short: "DU",
    logo: "https://i.ibb.co/xqwm5FDC/Screenshot-2026-04-21-150046.png",
  },
  {
    id: "diu",
    name: "Daffodil International",
    short: "DIU",
    logo: "https://i.ibb.co/xqwm5FDC/Screenshot-2026-04-21-150046.png",
  },
  {
    id: "nsu",
    name: "North South University",
    short: "NSU",
    logo: "https://i.ibb.co/xqwm5FDC/Screenshot-2026-04-21-150046.png",
  },
  {
    id: "brac",
    name: "BRAC University",
    short: "BRACU",
    logo: "https://i.ibb.co/xqwm5FDC/Screenshot-2026-04-21-150046.png",
  },
];

export const defaultForm = (): FormState => ({
  documentType: "lab-report",
  selectedUniId: "uu",
  institutionName: "Uttara University",
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
