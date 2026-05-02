"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { A4_H, A4_W, UNIVERSITIES, defaultForm } from "./CoverPageBuilder.constants";
import { CoverPageContent, StepBar } from "./CoverPagePreview";
import { MissingFieldsDialog, Step1Institution, Step2Document, Step3People, Step4Download } from "./CoverPageSteps";
import { DownloadFormat, FormState } from "./CoverPageBuilder.types";
import {
  formatDate,
  getDocumentLabel,
  getDownloadBaseName,
  getFirstMissingStep,
  getItemNumberLabel,
  getItemNumberValue,
  getItemTitleLabel,
  getLogoProxyUrl,
  getMissingFields,
} from "./CoverPageBuilder.utils";

const logoDataUrlCache = new Map<string, string>();
const EXPORT_SCALE = 2;
const EXPORT_WIDTH = A4_W * EXPORT_SCALE;
const EXPORT_HEIGHT = A4_H * EXPORT_SCALE;

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("Failed to read logo"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read logo"));
    reader.readAsDataURL(blob);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });

const drawWrappedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) => {
  const words = text.split(/\s+/).filter(Boolean);
  let line = "";
  let cursorY = y;

  for (const word of words) {
    const nextLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(nextLine).width <= maxWidth) {
      line = nextLine;
      continue;
    }

    if (line) {
      ctx.fillText(line, x, cursorY);
      cursorY += lineHeight;
    }

    line = word;
  }

  if (line) {
    ctx.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }

  return cursorY;
};

const renderCoverPageCanvas = async (form: FormState, logoUrl: string | null) => {
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_WIDTH;
  canvas.height = EXPORT_HEIGHT;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context is not available");
  }

  ctx.scale(EXPORT_SCALE, EXPORT_SCALE);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, A4_W, A4_H);

  const marginX = 60;
  const contentWidth = A4_W - marginX * 2;
  const documentLabel = getDocumentLabel(form.documentType);
  const itemNumberLabel = getItemNumberLabel(form.documentType);
  const itemTitleLabel = getItemTitleLabel(form.documentType);
  const itemNumber = getItemNumberValue(form);
  const dash = "................................";

  let cursorY = 52;

  if (logoUrl) {
    try {
      const logo = await loadImage(logoUrl);
      const maxWidth = 220;
      const maxHeight = 112;
      const ratio = Math.min(maxWidth / logo.width, maxHeight / logo.height, 1);
      const drawWidth = Math.max(1, logo.width * ratio);
      const drawHeight = Math.max(1, logo.height * ratio);
      const drawX = (A4_W - drawWidth) / 2;

      ctx.drawImage(logo, drawX, cursorY, drawWidth, drawHeight);
      cursorY += drawHeight + 24;
    } catch (error) {
      console.warn("Logo drawing failed:", error);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.arc(A4_W / 2, cursorY + 48, 48, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Logo", A4_W / 2, cursorY + 52);
      cursorY += 120;
    }
  } else {
    cursorY += 120;
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#1a3a6b";
  ctx.font = "700 30px Arial";
  ctx.fillText(form.institutionName, A4_W / 2, cursorY);
  cursorY += 22;

  if (form.tagline) {
    ctx.fillStyle = "#555555";
    ctx.font = "13px Arial";
    ctx.fillText(form.tagline, A4_W / 2, cursorY + 12);
    cursorY += 20;
  }

  if (form.department) {
    ctx.font = "italic 12px Arial";
    ctx.fillText(form.department, A4_W / 2, cursorY + 10);
    cursorY += 18;
  }

  cursorY += 18;

  const gradient = ctx.createLinearGradient(marginX, 0, A4_W - marginX, 0);
  gradient.addColorStop(0, "#1a3a6b");
  gradient.addColorStop(0.5, "#2a5aa0");
  gradient.addColorStop(1, "#1a3a6b");
  ctx.fillStyle = gradient;
  ctx.fillRect(marginX, cursorY, contentWidth, 2);
  ctx.fillStyle = "#2a5aa0";
  ctx.fillRect((A4_W - contentWidth * 0.6) / 2, cursorY + 4, contentWidth * 0.6, 1);
  cursorY += 42;

  ctx.fillStyle = "#1a1a1a";
  ctx.font = "300 38px Arial";
  ctx.fillText(documentLabel, A4_W / 2, cursorY);
  ctx.fillStyle = "#c4933a";
  ctx.fillRect(A4_W / 2 - 36, cursorY + 8, 72, 2);
  cursorY += 54;

  const rows: [string, string][] = [
    [itemNumberLabel, itemNumber],
    [itemTitleLabel, form.itemTitle],
    ["Subject Name & Code", [form.subjectName, form.subjectCode].filter(Boolean).join(" - ")],
  ];

  const labelX = marginX;
  const valueX = marginX + 212;

  for (const [label, value] of rows) {
    ctx.textAlign = "left";
    ctx.fillStyle = "#111827";
    ctx.font = "600 17px Arial";
    ctx.fillText(label, labelX, cursorY);

    ctx.fillStyle = value ? "#1a1a1a" : "#b8b8b8";
    ctx.font = "17px Arial";
    drawWrappedText(ctx, value || dash, valueX, cursorY, A4_W - marginX - valueX, 22);

    ctx.strokeStyle = "#e8e4dd";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(valueX, cursorY + 10);
    ctx.lineTo(A4_W - marginX, cursorY + 10);
    ctx.stroke();

    cursorY += 40;
  }

  const boxTop = A4_H - 300;
  const boxGap = 20;
  const boxWidth = (contentWidth - boxGap) / 2;
  const boxHeight = 220;

  const drawInfoBox = (
    x: number,
    title: string,
    rowsToRender: [string, string][],
    footer?: () => void,
  ) => {
    ctx.strokeStyle = "#1a3a6b";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, boxTop, boxWidth, boxHeight);

    ctx.textAlign = "center";
    ctx.fillStyle = "#1a3a6b";
    ctx.font = "700 18px Arial";
    ctx.fillText(title, x + boxWidth / 2, boxTop + 28);

    let rowY = boxTop + 64;
    for (const [label, value] of rowsToRender) {
      ctx.textAlign = "left";
      ctx.fillStyle = "#111827";
      ctx.font = "600 15px Arial";
      ctx.fillText(label, x + 16, rowY);

      ctx.fillStyle = value ? "#1a1a1a" : "#b8b8b8";
      ctx.font = "15px Arial";
      ctx.fillText(value || dash, x + 118, rowY, boxWidth - 136);

      ctx.strokeStyle = "#cfcfcf";
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(x + 118, rowY + 5);
      ctx.lineTo(x + boxWidth - 16, rowY + 5);
      ctx.stroke();
      ctx.setLineDash([]);

      rowY += 30;
    }

    footer?.();
  };

  drawInfoBox(marginX, "Submitted To:", [
    ["Name:", form.teacherName],
    ["Designation:", form.teacherDesignation],
  ], () => {
    ctx.textAlign = "left";
    ctx.fillStyle = "#333333";
    ctx.font = "15px Arial";
    ctx.fillText(form.institutionName || "Institution Name", marginX + 16, boxTop + 154, boxWidth - 32);

    ctx.fillStyle = "#111827";
    ctx.font = "700 15px Arial";
    ctx.fillText("Date:", marginX + 16, boxTop + 184);
    ctx.font = "15px Arial";
    ctx.fillText(formatDate(form.submissionDate), marginX + 68, boxTop + 184);
  });

  drawInfoBox(marginX + boxWidth + boxGap, "Submitted By", [
    ["Name:", form.studentName],
    ["Student ID:", form.studentId],
    ["Batch & Group:", form.batchGroup],
    ["Section:", form.section],
  ]);

  return canvas;
};

const CoverPageBuilder = () => {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [step, setStep] = useState(1);
  const [captureLogoUrl, setCaptureLogoUrl] = useState<string | null>(null);
  const [isLogoResolving, setIsLogoResolving] = useState(false);
  const [missingDialogOpen, setMissingDialogOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<DownloadFormat | null>(null);

  const selectedUni = UNIVERSITIES.find((u) => u.id === form.selectedUniId) ?? UNIVERSITIES[0];
  const previewLogoUrl = getLogoProxyUrl(selectedUni.logo);
  const activeLogoUrl = captureLogoUrl || previewLogoUrl;
  const missingFields = useMemo(() => getMissingFields(form), [form]);
  const itemNumberLabel = getItemNumberLabel(form.documentType);
  const itemTitleLabel = getItemTitleLabel(form.documentType);
  const downloadBaseName = useMemo(() => getDownloadBaseName(form), [form]);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const prepareCaptureLogo = useCallback(async () => {
    const cacheKey = `${selectedUni.id}:${selectedUni.logo}`;

    if (logoDataUrlCache.has(cacheKey)) {
      const cachedUrl = logoDataUrlCache.get(cacheKey) ?? null;
      setCaptureLogoUrl(cachedUrl);
      return cachedUrl;
    }

    setIsLogoResolving(true);

    try {
      const response = await fetch(previewLogoUrl, { cache: "force-cache" });
      if (!response.ok) {
        throw new Error("Failed to fetch logo");
      }

      const blob = await response.blob();
      const dataUrl = await blobToDataUrl(blob);
      logoDataUrlCache.set(cacheKey, dataUrl);
      setCaptureLogoUrl(dataUrl);
      return dataUrl;
    } catch (error) {
      console.warn("Logo preparation failed:", error);
      setCaptureLogoUrl(null);
      return null;
    } finally {
      setIsLogoResolving(false);
    }
  }, [previewLogoUrl, selectedUni.id, selectedUni.logo]);

  useEffect(() => {
    void prepareCaptureLogo();
  }, [prepareCaptureLogo]);

  const runDownload = useCallback(
    async (format: DownloadFormat) => {
      try {
        const logoDataUrl = (await prepareCaptureLogo()) ?? captureLogoUrl ?? previewLogoUrl;
        const canvas = await renderCoverPageCanvas(form, logoDataUrl);

        if (format === "png") {
          const anchor = document.createElement("a");
          anchor.href = canvas.toDataURL("image/png");
          anchor.download = `${downloadBaseName}.png`;
          anchor.click();
          toast.success("PNG downloaded");
          return;
        }

        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, width, height, undefined, "FAST");
        pdf.save(`${downloadBaseName}.pdf`);
        toast.success("PDF downloaded");
      } catch (error) {
        console.error("Cover page export failed:", error);
        toast.error(`Could not create ${format.toUpperCase()}. Please try again or refresh the page.`);
      }
    },
    [captureLogoUrl, downloadBaseName, form, prepareCaptureLogo, previewLogoUrl],
  );

  const requestDownload = useCallback(
    async (format: DownloadFormat) => {
      if (isLogoResolving) {
        toast("Please wait while the logo finishes loading");
        return;
      }

      setPendingFormat(format);

      if (missingFields.length > 0) {
        setMissingDialogOpen(true);
        return;
      }

      await runDownload(format);
      setPendingFormat(null);
    },
    [isLogoResolving, missingFields.length, runDownload],
  );

  const handleDownloadAnyway = useCallback(async () => {
    if (!pendingFormat) return;
    setMissingDialogOpen(false);
    await runDownload(pendingFormat);
    setPendingFormat(null);
  }, [pendingFormat, runDownload]);

  const handleContinueEditing = useCallback(() => {
    setMissingDialogOpen(false);
    setPendingFormat(null);
    setStep(getFirstMissingStep(missingFields));
  }, [missingFields]);

  const handleMissingDialogOpenChange = useCallback((open: boolean) => {
    setMissingDialogOpen(open);
    if (!open) {
      setPendingFormat(null);
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl animate-in space-y-8 fade-in duration-500">
      <div>
        <Link
          href="/dashboard/services"
          className="mb-3 inline-block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {"<- Back to services"}
        </Link>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">Lab report cover page</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Build a printable cover page for lab reports or assignments, then download as PNG or PDF.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        <Card className="rounded-[2rem] border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Details</CardTitle>
            <CardDescription>Fill the form, preview the page, then download.</CardDescription>
            <div className="pt-2">
              <StepBar current={step} total={4} />
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 && <Step1Institution form={form} setField={setField} onNext={() => setStep(2)} />}
            {step === 2 && (
              <Step2Document
                form={form}
                setField={setField}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                itemNumberLabel={itemNumberLabel}
                itemTitleLabel={itemTitleLabel}
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
                onDownloadPng={() => void requestDownload("png")}
                onDownloadPdf={() => void requestDownload("pdf")}
                onBack={() => setStep(3)}
                isLogoResolving={isLogoResolving}
              />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-border/60 shadow-sm lg:sticky lg:top-4">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Preview</CardTitle>
            <CardDescription>
              A4 portrait - live as you type. {isLogoResolving ? "Preparing logo..." : "Ready to export."}
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto pb-6">
            <div className="flex min-h-[280px] justify-center py-2">
              <div
                className="relative overflow-hidden rounded-lg shadow-md"
                style={{ width: A4_W * 0.42, height: A4_H * 0.42 }}
              >
                <div
                  className="absolute left-0 top-0 origin-top-left"
                  style={{ transform: "scale(0.42)", width: A4_W, height: A4_H }}
                >
                  <CoverPageContent form={form} logoUrl={activeLogoUrl} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <MissingFieldsDialog
        open={missingDialogOpen}
        missingFields={missingFields}
        pendingFormat={pendingFormat}
        onContinueEditing={handleContinueEditing}
        onDownloadAnyway={handleDownloadAnyway}
        onOpenChange={handleMissingDialogOpenChange}
      />
    </div>
  );
};

export default CoverPageBuilder;
