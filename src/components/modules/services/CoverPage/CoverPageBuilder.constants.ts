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
    logo: "https://res.cloudinary.com/dfoqasqnw/image/upload/v1780887820/247-2474590_transparent-buet-logo-hd-png-download_akbu3r.jpg",
  },
  {
    id: "du",
    name: "Dhaka University",
    short: "DU",
    logo: "https://res.cloudinary.com/dfoqasqnw/image/upload/v1780887872/05b7eef536de56b362f82095a1da74ef_ps2ai5.png",
  },
  {
    id: "diu",
    name: "Daffodil International",
    short: "DIU",
    logo: "https://res.cloudinary.com/dfoqasqnw/image/upload/v1780887922/585d5f202586b8cd0537e73f44b37780_cxy0u1.png",
  },
  {
    id: "nsu",
    name: "North South University",
    short: "NSU",
    logo: "https://res.cloudinary.com/dfoqasqnw/image/upload/v1780888033/OIP_a6905x.jpg",
  },
  {
    id: "brac",
    name: "BRAC University",
    short: "BRACU",
    logo: "https://res.cloudinary.com/dfoqasqnw/image/upload/v1780888079/OIP_1_fqiui4.jpg",
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
