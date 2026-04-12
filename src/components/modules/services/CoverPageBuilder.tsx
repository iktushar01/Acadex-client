"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
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

type FormState = {
  institutionName: string;
  department: string;
  courseCode: string;
  courseName: string;
  reportTitle: string;
  studentName: string;
  studentId: string;
  instructorName: string;
  submissionDate: string;
};

const defaultForm = (): FormState => ({
  institutionName: "",
  department: "",
  courseCode: "",
  courseName: "",
  reportTitle: "Lab Report / Assignment",
  studentName: "",
  studentId: "",
  instructorName: "",
  submissionDate: new Date().toISOString().slice(0, 10),
});

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
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  const downloadPng = async () => {
    try {
      const canvas = await capturePreview();
      if (!canvas) return;
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "lab-report-cover.png";
      a.click();
      toast.success("Image downloaded");
    } catch {
      toast.error("Could not create image. If you use a logo URL, ensure it loads (CORS).");
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
      pdf.save("lab-report-cover.pdf");
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
          ← All services
        </Link>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">Lab report cover page</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details, add an optional logo (stored on Cloudinary), then download as PNG or PDF.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <Card className="rounded-[2rem] border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Details</CardTitle>
            <CardDescription>These fields appear on your cover page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution / university</Label>
              <Input
                id="institutionName"
                value={form.institutionName}
                onChange={(e) => setField("institutionName", e.target.value)}
                placeholder="e.g. National University"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={form.department}
                onChange={(e) => setField("department", e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="courseCode">Course code</Label>
                <Input
                  id="courseCode"
                  value={form.courseCode}
                  onChange={(e) => setField("courseCode", e.target.value)}
                  placeholder="e.g. CSE 301"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseName">Course name</Label>
                <Input
                  id="courseName"
                  value={form.courseName}
                  onChange={(e) => setField("courseName", e.target.value)}
                  placeholder="e.g. Data Structures"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportTitle">Report / assignment title</Label>
              <Input
                id="reportTitle"
                value={form.reportTitle}
                onChange={(e) => setField("reportTitle", e.target.value)}
                className="rounded-xl"
              />
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="studentName">Your name</Label>
                <Input
                  id="studentName"
                  value={form.studentName}
                  onChange={(e) => setField("studentName", e.target.value)}
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
                <Label htmlFor="instructorName">Instructor</Label>
                <Input
                  id="instructorName"
                  value={form.instructorName}
                  onChange={(e) => setField("instructorName", e.target.value)}
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

            <Separator />

            <div className="space-y-2">
              <Label>Logo (optional)</Label>
              <p className="text-xs text-muted-foreground">
                Images are uploaded to Cloudinary through your Acadex backend.
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
                  Upload to Cloudinary
                </Button>
                {(displayLogo || pendingFile) && (
                  <Button type="button" variant="ghost" className="rounded-xl text-destructive" onClick={clearLogo}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>
              {pendingFile && !logoUrl && (
                <p className="text-xs text-muted-foreground">Selected: {pendingFile.name}</p>
              )}
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
            <CardDescription>A4 portrait — matches exported PNG/PDF.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-6">
            <div className="flex min-h-[280px] justify-center py-2">
              {/** Outer box reserves only the scaled footprint; inner stays 794×1123 for PNG/PDF capture */}
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
                    className="box-border flex flex-col bg-white text-slate-900"
                    style={{
                      width: A4_W,
                      height: A4_H,
                      padding: "56px 64px",
                      fontFamily: "system-ui, Segoe UI, sans-serif",
                    }}
                  >
                  {displayLogo ? (
                    <div className="mb-8 flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={displayLogo}
                        alt="Institution logo"
                        crossOrigin="anonymous"
                        className="max-h-24 max-w-[200px] object-contain"
                      />
                    </div>
                  ) : (
                    <div className="mb-8 flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                      Logo (optional)
                    </div>
                  )}

                  <div className="text-center">
                    <h2 className="text-[22px] font-bold leading-tight tracking-tight">
                      {form.institutionName || "Institution name"}
                    </h2>
                    {form.department ? (
                      <p className="mt-2 text-[13px] font-medium text-slate-600">{form.department}</p>
                    ) : (
                      <p className="mt-2 text-[13px] text-slate-400">Department</p>
                    )}
                  </div>

                  <div className="my-8 h-px bg-slate-800" />

                  <div className="text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {form.courseCode || form.courseName
                        ? [form.courseCode, form.courseName].filter(Boolean).join(" · ")
                        : "Course code · Course name"}
                    </p>
                    <h1 className="mt-6 text-[26px] font-black leading-snug text-slate-900">
                      {form.reportTitle || "Report title"}
                    </h1>
                  </div>

                  <div className="mt-auto space-y-5 pt-16 text-[14px]">
                    <div className="flex border-b border-slate-300 py-1">
                      <span className="w-40 shrink-0 font-semibold text-slate-600">Submitted by</span>
                      <span className="text-slate-900">{form.studentName || "—"}</span>
                    </div>
                    <div className="flex border-b border-slate-300 py-1">
                      <span className="w-40 shrink-0 font-semibold text-slate-600">Student ID</span>
                      <span className="text-slate-900">{form.studentId || "—"}</span>
                    </div>
                    <div className="flex border-b border-slate-300 py-1">
                      <span className="w-40 shrink-0 font-semibold text-slate-600">Instructor</span>
                      <span className="text-slate-900">{form.instructorName || "—"}</span>
                    </div>
                    <div className="flex border-b border-slate-300 py-1">
                      <span className="w-40 shrink-0 font-semibold text-slate-600">Date</span>
                      <span className="text-slate-900">
                        {form.submissionDate
                          ? new Date(form.submissionDate + "T12:00:00").toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "—"}
                      </span>
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
