"use client";

import { CheckCircle2, FileImage, FileText, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UniSelector } from "./CoverPagePreview";
import { DownloadFormat, FormState, MissingField } from "./CoverPageBuilder.types";

type SetField = <K extends keyof FormState>(k: K, v: FormState[K]) => void;

export function Step1Institution({
  form,
  setField,
  onNext,
}: {
  form: FormState;
  setField: SetField;
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
          {"Next: Document ->"}
        </Button>
      </div>
    </div>
  );
}

export function Step2Document({
  form,
  setField,
  onBack,
  onNext,
  itemNumberLabel,
  itemTitleLabel,
}: {
  form: FormState;
  setField: SetField;
  onBack: () => void;
  onNext: () => void;
  itemNumberLabel: string;
  itemTitleLabel: string;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Document type</Label>
        <div className="grid grid-cols-2 gap-3">
          {(["lab-report", "assignment"] as const).map((t) => (
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
          {"<- Back"}
        </Button>
        <Button type="button" onClick={onNext} className="rounded-xl">
          {"Next: People ->"}
        </Button>
      </div>
    </div>
  );
}

export function Step3People({
  form,
  setField,
  onBack,
  onNext,
}: {
  form: FormState;
  setField: SetField;
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
          {"<- Back"}
        </Button>
        <Button type="button" onClick={onNext} className="rounded-xl">
          {"Finish & Download ->"}
        </Button>
      </div>
    </div>
  );
}

export function Step4Download({
  downloadBaseName,
  onDownloadPng,
  onDownloadPdf,
  onBack,
  isLogoResolving,
}: {
  downloadBaseName: string;
  onDownloadPng: () => void;
  onDownloadPdf: () => void;
  onBack: () => void;
  isLogoResolving: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
        <p className="text-sm font-medium text-emerald-700">
          Cover page is ready. Choose a format below.
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        File will be saved as <span className="font-mono font-medium">{downloadBaseName}</span>
      </p>
      {isLogoResolving && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Preparing the institution logo for download...
        </div>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" className="rounded-xl font-bold" onClick={onDownloadPng} disabled={isLogoResolving}>
          <FileImage className="mr-2 h-4 w-4" />
          Download PNG
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="rounded-xl font-bold"
          onClick={onDownloadPdf}
          disabled={isLogoResolving}
        >
          <FileText className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
      <div className="pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="rounded-xl">
          {"<- Edit details"}
        </Button>
      </div>
    </div>
  );
}

export function MissingFieldsDialog({
  open,
  missingFields,
  pendingFormat,
  onContinueEditing,
  onDownloadAnyway,
  onOpenChange,
}: {
  open: boolean;
  missingFields: MissingField[];
  pendingFormat: DownloadFormat | null;
  onContinueEditing: () => void;
  onDownloadAnyway: () => void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[2rem] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-black">
            <TriangleAlert className="h-5 w-5 text-amber-500" />
            Some details are still missing
          </DialogTitle>
          <DialogDescription>
            Your cover page can still be downloaded, but these fields will appear blank in the {pendingFormat?.toUpperCase() ?? "file"}.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
          <ul className="space-y-2 text-sm">
            {missingFields.map((field) => (
              <li key={field.key} className="flex items-center justify-between gap-3">
                <span>{field.label}</span>
                <span className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  Step {field.step}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" className="rounded-xl" onClick={onContinueEditing}>
            Continue editing
          </Button>
          <Button type="button" className="rounded-xl" onClick={onDownloadAnyway}>
            Download anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
