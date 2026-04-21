import { FormState, MissingField } from "./CoverPageBuilder.types";

export const formatDate = (value: string) => {
  if (!value) return "Date";
  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const sanitizeFilePart = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "cover-page";

export const getDocumentLabel = (documentType: FormState["documentType"]) =>
  documentType === "lab-report" ? "Lab Report" : "Assignment";

export const getItemNumberLabel = (documentType: FormState["documentType"]) =>
  documentType === "lab-report" ? "Experiment No." : "Assignment No.";

export const getItemTitleLabel = (documentType: FormState["documentType"]) =>
  documentType === "lab-report" ? "Experiment Name" : "Assignment Title";

export const getItemNumberValue = (form: FormState) =>
  form.documentType === "lab-report" ? form.experimentNo : form.assignmentNo;

export const getDownloadBaseName = (form: FormState) => {
  const typePart = sanitizeFilePart(getDocumentLabel(form.documentType));
  const titlePart = sanitizeFilePart(form.itemTitle || form.subjectName || form.institutionName);
  return `${typePart}-${titlePart}`;
};

export const getLogoProxyUrl = (url: string) =>
  `/api/cover-page/logo?url=${encodeURIComponent(url)}`;

export const getMissingFields = (form: FormState): MissingField[] => {
  const values: MissingField[] = [
    { key: "institutionName", label: "Institution name", step: 1 },
    { key: "subjectName", label: "Subject name", step: 2 },
    { key: "subjectCode", label: "Subject code", step: 2 },
    { key: "itemNumber", label: getItemNumberLabel(form.documentType), step: 2 },
    { key: "itemTitle", label: getItemTitleLabel(form.documentType), step: 2 },
    { key: "submissionDate", label: "Submission date", step: 2 },
    { key: "teacherName", label: "Teacher name", step: 3 },
    { key: "teacherDesignation", label: "Teacher designation", step: 3 },
    { key: "studentName", label: "Student name", step: 3 },
    { key: "studentId", label: "Student ID", step: 3 },
    { key: "batchGroup", label: "Batch & group", step: 3 },
    { key: "section", label: "Section", step: 3 },
  ];

  return values.filter(({ key }) => {
    if (key === "itemNumber") {
      return !getItemNumberValue(form).trim();
    }
    return !String(form[key] ?? "").trim();
  });
};

export const getFirstMissingStep = (missingFields: MissingField[]) =>
  missingFields.reduce((smallest, field) => Math.min(smallest, field.step), 4);

export const getLogoFileName = (institutionName: string, sourceUrl: string) => {
  const safeName = sanitizeFilePart(institutionName || "institution-logo");
  const extension = sourceUrl.split(".").pop()?.split("?")[0]?.toLowerCase();
  const safeExtension = extension && /^[a-z0-9]+$/.test(extension) ? extension : "png";
  return `${safeName}.${safeExtension}`;
};
