"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { uploadCoverLogoAction } from "@/actions/coverPageActions/_uploadCoverLogoAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileImage, FileText, ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

const A4_W = 794;
const A4_H = 1123;

type DocumentType = "lab-report" | "assignment";

type FormState = {
  documentType: DocumentType;
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

const defaultForm = (): FormState => ({
  documentType: "lab-report",
  institutionName: "",
  tagline: "",
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

const formatDate = (value: string) => {
  if (!value) return "Date";

  return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const sanitizeFilePart = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "cover-page";

const CoverPageBuilder = () => {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("logo", file);
      return uploadCoverLogoAction(fd);
    },
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error || "Upload failed");
        return;
      }

      if (result.data?.url) {
        setLogoUrl(result.data.url);
        setPendingFile(null);
        toast.success(result.message || "Logo uploaded");
      }
    },
    onError: () => toast.error("Could not upload logo"),
  });

  const handleFilePick = (file: File | null) => {
    if (!file) {
      setPendingFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    setPendingFile(file);
  };

  const clearLogo = () => {
    setLogoUrl(null);
    setPendingFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const capturePreview = useCallback(async () => {
    const el = previewRef.current;
    if (!el) return null;

    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
    });

    return canvas;
  }, []);

  const documentLabel = form.documentType === "lab-report" ? "Lab Report" : "Assignment";
  const itemNumberLabel = form.documentType === "lab-report" ? "Experiment No." : "Assignment No.";
  const itemTitleLabel = form.documentType === "lab-report" ? "Experiment Name" : "Assignment Title";

  const downloadBaseName = useMemo(() => {
    const typePart = sanitizeFilePart(documentLabel);
    const titlePart = sanitizeFilePart(form.itemTitle || form.subjectName || form.institutionName);
    return `${typePart}-${titlePart}`;
  }, [documentLabel, form.institutionName, form.itemTitle, form.subjectName]);

  const downloadPng = async () => {
    try {
      const canvas = await capturePreview();
      if (!canvas) return;

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${downloadBaseName}.png`;
      a.click();
      toast.success("PNG downloaded");
    } catch {
      toast.error("Could not create PNG. If you use a logo URL, make sure it loads correctly.");
    }
  };

  const downloadPdf = async () => {
    try {
      const canvas = await capturePreview();
      if (!canvas) return;

      const { jsPDF } = await import("jspdf");
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pageW, pageH, undefined, "FAST");
      pdf.save(`${downloadBaseName}.pdf`);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Could not create PDF");
    }
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const displayLogo = logoUrl;

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500">
      <div>
        <Link
          href="/dashboard/services"
          className="mb-3 inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Back to services
        </Link>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">Lab report cover page</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Build a printable cover page for lab reports or assignments, then download it as PNG or PDF.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <Card className="rounded-[2rem] border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Details</CardTitle>
            <CardDescription>Fill in the fields that should appear on the cover page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <Label>Document type</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant={form.documentType === "lab-report" ? "default" : "outline"}
                  className="justify-start rounded-xl"
                  onClick={() => setField("documentType", "lab-report")}
                >
                  Lab Report
                </Button>
                <Button
                  type="button"
                  variant={form.documentType === "assignment" ? "default" : "outline"}
                  className="justify-start rounded-xl"
                  onClick={() => setField("documentType", "assignment")}
                >
                  Assignment
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution / university</Label>
              <Input
                id="institutionName"
                value={form.institutionName}
                onChange={(e) => setField("institutionName", e.target.value)}
                placeholder="e.g. Uttara University"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline (optional)</Label>
              <Input
                id="tagline"
                value={form.tagline}
                onChange={(e) => setField("tagline", e.target.value)}
                placeholder="e.g. Excellence in Higher Education and Research"
                className="rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department (optional)</Label>
              <Input
                id="department"
                value={form.department}
                onChange={(e) => setField("department", e.target.value)}
                placeholder="e.g. Department of Electrical and Electronic Engineering"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subjectName">Subject name</Label>
                <Input
                  id="subjectName"
                  value={form.subjectName}
                  onChange={(e) => setField("subjectName", e.target.value)}
                  placeholder="e.g. Electrical Circuit Lab"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectCode">Subject code</Label>
                <Input
                  id="subjectCode"
                  value={form.subjectCode}
                  onChange={(e) => setField("subjectCode", e.target.value)}
                  placeholder="e.g. EEE 073102"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="itemNumber">{itemNumberLabel}</Label>
                <Input
                  id="itemNumber"
                  value={form.documentType === "lab-report" ? form.experimentNo : form.assignmentNo}
                  onChange={(e) =>
                    form.documentType === "lab-report"
                      ? setField("experimentNo", e.target.value)
                      : setField("assignmentNo", e.target.value)
                  }
                  placeholder={form.documentType === "lab-report" ? "e.g. 03" : "e.g. 01"}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="submissionDate">Submission date</Label>
                <Input
                  id="submissionDate"
                  type="date"
                  value={form.submissionDate}
                  onChange={(e) => setField("submissionDate", e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemTitle">{itemTitleLabel}</Label>
              <Input
                id="itemTitle"
                value={form.itemTitle}
                onChange={(e) => setField("itemTitle", e.target.value)}
                placeholder={
                  form.documentType === "lab-report"
                    ? "e.g. Verification of KCL and KVL"
                    : "e.g. Assignment on Digital Logic"
                }
                className="rounded-xl"
              />
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="teacherName">Submitted to: teacher name</Label>
                <Input
                  id="teacherName"
                  value={form.teacherName}
                  onChange={(e) => setField("teacherName", e.target.value)}
                  placeholder="e.g. Ummama Parvin"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacherDesignation">Designation</Label>
                <Input
                  id="teacherDesignation"
                  value={form.teacherDesignation}
                  onChange={(e) => setField("teacherDesignation", e.target.value)}
                  placeholder="e.g. Lecturer"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="studentName">Submitted by: your name</Label>
                <Input
                  id="studentName"
                  value={form.studentName}
                  onChange={(e) => setField("studentName", e.target.value)}
                  placeholder="e.g. Ibrahim Khalil"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={form.studentId}
                  onChange={(e) => setField("studentId", e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="batchGroup">Batch &amp; group</Label>
                <Input
                  id="batchGroup"
                  value={form.batchGroup}
                  onChange={(e) => setField("batchGroup", e.target.value)}
                  placeholder="e.g. 64 E"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  value={form.section}
                  onChange={(e) => setField("section", e.target.value)}
                  placeholder="e.g. E"
                  className="rounded-xl"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Logo (optional)</Label>
              <p className="text-xs text-muted-foreground">
                Images are uploaded through the Acadex server so the exported cover keeps the logo.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFilePick(e.target.files?.[0] ?? null)}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  Choose image
                </Button>
                <Button
                  type="button"
                  className="rounded-xl"
                  disabled={!pendingFile || uploadMutation.isPending}
                  onClick={() => pendingFile && uploadMutation.mutate(pendingFile)}
                >
                  {uploadMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  Upload logo
                </Button>
                {(displayLogo || pendingFile) && (
                  <Button type="button" variant="ghost" className="rounded-xl text-destructive" onClick={clearLogo}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
              {pendingFile && !logoUrl ? (
                <p className="text-xs text-muted-foreground">Selected: {pendingFile.name}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="button" className="rounded-xl font-bold" onClick={downloadPng}>
                <FileImage className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
              <Button type="button" variant="secondary" className="rounded-xl font-bold" onClick={downloadPdf}>
                <FileText className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-border/60 shadow-sm lg:sticky lg:top-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Preview</CardTitle>
            <CardDescription>A4 portrait layout used for both PNG and PDF downloads.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-6">
            <div className="flex min-h-[280px] justify-center py-2">
              <div
                className="relative overflow-hidden rounded-lg shadow-md"
                style={{
                  width: A4_W * 0.42,
                  height: A4_H * 0.42,
                }}
              >
                <div
                  className="absolute left-0 top-0 origin-top-left"
                  style={{ transform: "scale(0.42)", width: A4_W, height: A4_H }}
                >
                  <div
                    ref={previewRef}
                    className="box-border flex h-full flex-col bg-white text-slate-900"
                    style={{
                      width: A4_W,
                      height: A4_H,
                      padding: "52px 58px 62px",
                      fontFamily: "Arial, Helvetica, sans-serif",
                    }}
                  >
                    <div className="text-center">
                      {displayLogo ? (
                        <div className="mb-5 flex justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={displayLogo}
                            alt="Institution logo"
                            crossOrigin="anonymous"
                            className="max-h-28 max-w-[220px] object-contain"
                          />
                        </div>
                      ) : (
                        <div className="mb-5 flex justify-center">
                          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-slate-300 text-[11px] text-slate-400">
                            Logo
                          </div>
                        </div>
                      )}

                      <h2 className="text-[38px] font-bold leading-none tracking-tight text-blue-800">
                        {form.institutionName || "Institution Name"}
                      </h2>
                      <p className="mt-3 text-[16px] font-medium text-blue-700">
                        {form.tagline || "Excellence in Higher Education and Research"}
                      </p>
                      {form.department ? <p className="mt-2 text-[14px] text-slate-600">{form.department}</p> : null}
                    </div>

                    <div className="pt-10 text-center">
                      <h1 className="text-[40px] font-light tracking-tight">{documentLabel}</h1>
                    </div>

                    <div className="mx-auto mt-14 w-full max-w-[620px] space-y-5 text-[18px] leading-[1.55]">
                      <div className="grid grid-cols-[210px_1fr] gap-3">
                        <span className="font-medium">{itemNumberLabel}</span>
                        <span>{form.documentType === "lab-report" ? form.experimentNo || "................................" : form.assignmentNo || "................................"}</span>
                      </div>
                      <div className="grid grid-cols-[210px_1fr] gap-3">
                        <span className="font-medium">{itemTitleLabel}</span>
                        <span>{form.itemTitle || "................................"}</span>
                      </div>
                      <div className="grid grid-cols-[210px_1fr] gap-3">
                        <span className="font-medium">Subject Name &amp; Code</span>
                        <span>
                          {[form.subjectName, form.subjectCode].filter(Boolean).join(" - ") || "................................"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto grid gap-8 pt-16 md:grid-cols-2">
                      <div className="min-h-[255px] border border-slate-500 px-8 py-7">
                        <h3 className="text-center text-[22px] font-bold underline underline-offset-4">
                          Submitted To:
                        </h3>
                        <div className="mt-8 space-y-5 text-[17px] leading-[1.55]">
                          <div className="grid grid-cols-[110px_1fr] gap-3">
                            <span className="font-medium">Name:</span>
                            <span>{form.teacherName || "................................"}</span>
                          </div>
                          <div className="grid grid-cols-[110px_1fr] gap-3">
                            <span className="font-medium">Designation:</span>
                            <span>{form.teacherDesignation || "................................"}</span>
                          </div>
                          <div className="pt-2 text-[17px]">{form.institutionName || "Institution Name"}</div>
                          <div className="grid grid-cols-[110px_1fr] gap-3 pt-4">
                            <span className="font-bold">Date:</span>
                            <span>{formatDate(form.submissionDate)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="min-h-[255px] border border-slate-500 px-8 py-7">
                        <h3 className="text-center text-[22px] font-bold underline underline-offset-4">
                          Submitted By
                        </h3>
                        <div className="mt-8 space-y-5 text-[17px] leading-[1.55]">
                          <div className="grid grid-cols-[110px_1fr] gap-3">
                            <span className="font-medium">Name:</span>
                            <span>{form.studentName || "................................"}</span>
                          </div>
                          <div className="grid grid-cols-[110px_1fr] gap-3">
                            <span className="font-medium">Student ID:</span>
                            <span>{form.studentId || "................................"}</span>
                          </div>
                          <div className="grid grid-cols-[110px_1fr] gap-3">
                            <span className="font-medium">Batch &amp; Group:</span>
                            <span>{form.batchGroup || "................................"}</span>
                          </div>
                          <div className="grid grid-cols-[110px_1fr] gap-3">
                            <span className="font-medium">Section:</span>
                            <span>{form.section || "................................"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoverPageBuilder;
