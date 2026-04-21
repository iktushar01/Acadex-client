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
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/BUET_LOGO.svg/200px-BUET_LOGO.svg.png",
  },
  {
    id: "du",
    name: "Dhaka University",
    short: "DU",
    tagline: "The First University of Bangladesh",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/University_of_Dhaka_logo.svg/200px-University_of_Dhaka_logo.svg.png",
  },
  {
    id: "diu",
    name: "Daffodil International",
    short: "DIU",
    tagline: "Daffodil International University",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Daffodil_International_University_Logo.png/200px-Daffodil_International_University_Logo.png",
  },
  {
    id: "nsu",
    name: "North South University",
    short: "NSU",
    tagline: "Private University of Bangladesh",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c8/North_South_University_logo.svg/200px-North_South_University_logo.svg.png",
  },
  {
    id: "brac",
    name: "BRAC University",
    short: "BRACU",
    tagline: "BRAC University - Enlightening Lives",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/BRAC_University_logo.png/200px-BRAC_University_logo.png",
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
