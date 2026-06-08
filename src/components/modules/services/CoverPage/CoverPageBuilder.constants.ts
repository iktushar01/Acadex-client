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
    logo: "",
  },
  {
    id: "du",
    name: "Dhaka University",
    short: "DU",
    logo: "",
  },
  {
    id: "diu",
    name: "Daffodil International",
    short: "DIU",
    logo: "",
  },
  {
    id: "nsu",
    name: "North South University",
    short: "NSU",
    logo: "",
  },
  {
    id: "brac",
    name: "BRAC University",
    short: "BRACU",
    logo: "",
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
