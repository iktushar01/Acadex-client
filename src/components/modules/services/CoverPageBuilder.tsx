"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, FileImage, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────────────────

const A4_W = 794;
const A4_H = 1123;

// ─── University data (replaces logo-upload system) ────────────────────────────

type University = {
  id: string;
  name: string;
  short: string;
  tagline: string;
  logo: string;
};

const UNIVERSITIES: University[] = [
  {
    id: "uu",
    name: "Uttara University",
    short: "UU",
    tagline: "Excellence in Higher Education and Research",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Uttara_University_logo.png/200px-Uttara_University_logo.png",
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
    tagline: "BRAC University — Enlightening Lives",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/BRAC_University_logo.png/200px-BRAC_University_logo.png",
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

type DocumentType = "lab-report" | "assignment";

type FormState = {
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

const defaultForm = (): FormState => ({
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

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Step indicator bar */
function StepBar({ current, total }: { current: number; total: number }) {
  const labels = ["Institution", "Document", "People", "Download"];
  return (
    <div className="flex items-center gap-1">
      {labels.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={idx} className="flex items-center gap-1">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all",
                  done && "bg-emerald-600 text-white",
                  active && "bg-primary text-primary-foreground ring-2 ring-primary/30 ring-offset-1",
                  !done && !active && "bg-muted text-muted-foreground",
                )}
              >
                {done ? "✓" : idx}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium",
                  active && "text-primary",
                  done && "text-emerald-600",
                  !done && !active && "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
            {idx < total && (
              <div className={cn("mb-4 h-px w-8 shrink-0", done ? "bg-emerald-600" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/** University selector card */
function UniSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (uni: University) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {UNIVERSITIES.map((uni) => (
        <button
          key={uni.id}
          type="button"
          onClick={() => onSelect(uni)}
          className={cn(
            "flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all hover:border-primary/60 hover:bg-accent",
            selectedId === uni.id
              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
              : "border-border bg-background",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={uni.logo}
            alt={uni.name}
            crossOrigin="anonymous"
            className="h-9 w-9 shrink-0 object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <div>
            <p className="text-xs font-semibold leading-tight">{uni.name}</p>
            <p className="text-[10px] text-muted-foreground">{uni.short}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

/** The actual A4 cover page (also used as the capture target) */
function CoverPageContent({
  form,
  logoUrl,
  previewRef,
}: {
  form: FormState;
  logoUrl: string | null;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const documentLabel = form.documentType === "lab-report" ? "Lab Report" : "Assignment";
  const itemNumberLabel = form.documentType === "lab-report" ? "Experiment No." : "Assignment No.";
  const itemTitleLabel = form.documentType === "lab-report" ? "Experiment Name" : "Assignment Title";
  const itemNumber = form.documentType === "lab-report" ? form.experimentNo : form.assignmentNo;

  const dash = "................................";

  return (
    <div
      ref={previewRef}
      className="box-border flex flex-col bg-white text-slate-900"
      style={{
        width: A4_W,
        height: A4_H,
        padding: "52px 60px 56px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt="Institution logo"
            crossOrigin="anonymous"
            className="mb-4 max-h-28 max-w-[220px] object-contain"
          />
        ) : (
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-dashed border-slate-300 text-[11px] text-slate-400">
            Logo
          </div>
        )}

        <h2
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#1a3a6b",
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: 0,
          }}
        >
          {form.institutionName || "Institution Name"}
        </h2>

        <p style={{ fontSize: 13, color: "#2a5aa0", fontWeight: 500, marginTop: 8 }}>
          {form.tagline || "Excellence in Higher Education and Research"}
        </p>

        {form.department && (
          <p style={{ fontSize: 12, color: "#555", fontStyle: "italic", marginTop: 4 }}>
            {form.department}
          </p>
        )}
      </div>

      {/* Dividers */}
      <div style={{ width: "100%", height: 2, background: "linear-gradient(to right,#1a3a6b,#2a5aa0,#1a3a6b)", marginTop: 18 }} />
      <div style={{ width: "60%", height: 1, background: "#2a5aa0", margin: "4px auto 0" }} />

      {/* Document type */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <h1
          style={{
            fontSize: 38,
            fontWeight: 300,
            letterSpacing: 1,
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          {documentLabel}
        </h1>
        <div style={{ width: 72, height: 2, background: "#c4933a", margin: "8px auto 0" }} />
      </div>

      {/* Meta rows */}
      <div
        style={{
          marginTop: 32,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          fontSize: 17,
          lineHeight: 1.55,
        }}
      >
        {(
          [
            [itemNumberLabel, itemNumber],
            [itemTitleLabel, form.itemTitle],
            ["Subject Name & Code", [form.subjectName, form.subjectCode].filter(Boolean).join(" — ")],
          ] as [string, string][]
        ).map(([label, value]) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12 }}>
            <span style={{ fontWeight: 600 }}>{label}</span>
            <span style={{ color: value ? "#1a1a1a" : "#bbb", borderBottom: "1px solid #e8e4dd", paddingBottom: 3 }}>
              {value || dash}
            </span>
          </div>
        ))}
      </div>

      {/* Submitted To / By boxes */}
      <div style={{ marginTop: "auto", paddingTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Submitted To */}
        <div style={{ border: "1.5px solid #1a3a6b", padding: "18px 20px" }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              textAlign: "center",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              color: "#1a3a6b",
              marginBottom: 16,
            }}
          >
            Submitted To:
          </h3>
          {(
            [
              ["Name:", form.teacherName],
              ["Designation:", form.teacherDesignation],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 8, fontSize: 15, marginBottom: 10, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600 }}>{k}</span>
              <span style={{ color: v ? "#1a1a1a" : "#bbb", borderBottom: "1px dotted #ccc", paddingBottom: 2 }}>
                {v || dash}
              </span>
            </div>
          ))}
          <p style={{ fontSize: 15, marginTop: 10, color: "#333" }}>{form.institutionName || "Institution Name"}</p>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 8, fontSize: 15, marginTop: 14 }}>
            <span style={{ fontWeight: 700 }}>Date:</span>
            <span>{formatDate(form.submissionDate)}</span>
          </div>
        </div>

        {/* Submitted By */}
        <div style={{ border: "1.5px solid #1a3a6b", padding: "18px 20px" }}>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              textAlign: "center",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              color: "#1a3a6b",
              marginBottom: 16,
            }}
          >
            Submitted By
          </h3>
          {(
            [
              ["Name:", form.studentName],
              ["Student ID:", form.studentId],
              ["Batch & Group:", form.batchGroup],
              ["Section:", form.section],
            ] as [string, string][]
          ).map(([k, v]) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 8, fontSize: 15, marginBottom: 10, lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600 }}>{k}</span>
              <span style={{ color: v ? "#1a1a1a" : "#bbb", borderBottom: "1px dotted #ccc", paddingBottom: 2 }}>
                {v || dash}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step panels ──────────────────────────────────────────────────────────────

function Step1Institution({
  form,
  setField,
  onNext,
}: {
  form: FormState;
  setField: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>University</Label>
        <UniSelector
          selectedId={form.selectedUniId}
          onSelect={(uni) => {
            setField("selectedUniId", uni.id);
            setField("institutionName", uni.name);
            setField("tagline", uni.tagline);
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="institutionName">Custom name (overrides selection)</Label>
        <Input
          id="institutionName"
          value={form.institutionName}
          onChange={(e) => setField("institutionName", e.target.value)}
          placeholder="e.g. Uttara University"
          className="rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
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
          placeholder="e.g. Dept. of Electrical and Electronic Engineering"
          className="rounded-xl"
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="button" onClick={onNext} className="rounded-xl">
          Next: Document →
        </Button>
      </div>
    </div>
  );
}

function Step2Document({
  form,
  setField,
  onBack,
  onNext,
}: {
  form: FormState;
  setField: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const itemNumberLabel = form.documentType === "lab-report" ? "Experiment No." : "Assignment No.";
  const itemTitleLabel = form.documentType === "lab-report" ? "Experiment Name" : "Assignment Title";

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Document type</Label>
        <div className="grid grid-cols-2 gap-3">
          {(["lab-report", "assignment"] as DocumentType[]).map((t) => (
            <Button
              key={t}
              type="button"
              variant={form.documentType === t ? "default" : "outline"}
              className="justify-start rounded-xl"
              onClick={() => setField("documentType", t)}
            >
              {t === "lab-report" ? "Lab Report" : "Assignment"}
            </Button>
          ))}
        </div>
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
          <Label htmlFor="itemNo">{itemNumberLabel}</Label>
          <Input
            id="itemNo"
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
      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="rounded-xl">
          ← Back
        </Button>
        <Button type="button" onClick={onNext} className="rounded-xl">
          Next: People →
        </Button>
      </div>
    </div>
  );
}

function Step3People({
  form,
  setField,
  onBack,
  onNext,
}: {
  form: FormState;
  setField: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Submitted to</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="teacherName">Teacher name</Label>
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
      <Separator />
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Submitted by</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentName">Your name</Label>
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
            placeholder="e.g. 2262081187"
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
      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="rounded-xl">
          ← Back
        </Button>
        <Button type="button" onClick={onNext} className="rounded-xl">
          Finish &amp; Download →
        </Button>
      </div>
    </div>
  );
}

function Step4Download({
  downloadBaseName,
  onDownloadPng,
  onDownloadPdf,
  onBack,
}: {
  downloadBaseName: string;
  onDownloadPng: () => void;
  onDownloadPdf: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        <p className="text-sm font-medium text-emerald-700">
          Cover page is ready — choose a format below.
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        File will be saved as <span className="font-mono font-medium">{downloadBaseName}</span>
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" className="rounded-xl font-bold" onClick={onDownloadPng}>
          <FileImage className="mr-2 h-4 w-4" />
          Download PNG
        </Button>
        <Button type="button" variant="secondary" className="rounded-xl font-bold" onClick={onDownloadPdf}>
          <FileText className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      <div className="pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="rounded-xl">
          ← Edit details
        </Button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const CoverPageBuilder = () => {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [step, setStep] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const selectedUni = UNIVERSITIES.find((u) => u.id === form.selectedUniId) ?? UNIVERSITIES[0];

  const documentLabel = form.documentType === "lab-report" ? "Lab Report" : "Assignment";

  const downloadBaseName = useMemo(() => {
    const typePart = sanitizeFilePart(documentLabel);
    const titlePart = sanitizeFilePart(form.itemTitle || form.subjectName || form.institutionName);
    return `${typePart}-${titlePart}`;
  }, [documentLabel, form.institutionName, form.itemTitle, form.subjectName]);

  const capturePreview = useCallback(async () => {
    const el = previewRef.current;
    if (!el) return null;
    const html2canvas = (await import("html2canvas")).default;
    return html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
    });
  }, []);

  const downloadPng = async () => {
    try {
      const canvas = await capturePreview();
      if (!canvas) return;
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${downloadBaseName}.png`;
      a.click();
      toast.success("PNG downloaded");
    } catch {
      toast.error("Could not create PNG");
    }
  };

  const downloadPdf = async () => {
    try {
      const canvas = await capturePreview();
      if (!canvas) return;
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, w, h, undefined, "FAST");
      pdf.save(`${downloadBaseName}.pdf`);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Could not create PDF");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500">
      <div>
        <Link
          href="/dashboard/services"
          className="mb-3 inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          ← Back to services
        </Link>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">Lab report cover page</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Build a printable cover page for lab reports or assignments, then download as PNG or PDF.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        {/* ── Left: wizard form ── */}
        <Card className="rounded-[2rem] border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Details</CardTitle>
            <CardDescription>Complete all steps to unlock the download.</CardDescription>
            <div className="pt-2">
              <StepBar current={step} total={4} />
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <Step1Institution form={form} setField={setField} onNext={() => setStep(2)} />
            )}
            {step === 2 && (
              <Step2Document
                form={form}
                setField={setField}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            )}
            {step === 3 && (
              <Step3People
                form={form}
                setField={setField}
                onBack={() => setStep(2)}
                onNext={() => setStep(4)}
              />
            )}
            {step === 4 && (
              <Step4Download
                downloadBaseName={downloadBaseName}
                onDownloadPng={downloadPng}
                onDownloadPdf={downloadPdf}
                onBack={() => setStep(3)}
              />
            )}
          </CardContent>
        </Card>

        {/* ── Right: live preview ── */}
        <Card className="rounded-[2rem] border border-border/60 shadow-sm lg:sticky lg:top-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Preview</CardTitle>
            <CardDescription>A4 portrait — live as you type.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-6">
            <div className="flex min-h-[280px] justify-center py-2">
              {/* Visible scaled preview */}
              <div
                className="relative overflow-hidden rounded-lg shadow-md"
                style={{ width: A4_W * 0.42, height: A4_H * 0.42 }}
              >
                <div
                  className="absolute left-0 top-0 origin-top-left"
                  style={{ transform: "scale(0.42)", width: A4_W, height: A4_H }}
                >
                  <CoverPageContent form={form} logoUrl={selectedUni.logo} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Hidden full-size capture target ── */}
      <div className="sr-only" aria-hidden>
        <CoverPageContent form={form} logoUrl={selectedUni.logo} previewRef={previewRef} />
      </div>
    </div>
  );
};

export default CoverPageBuilder;