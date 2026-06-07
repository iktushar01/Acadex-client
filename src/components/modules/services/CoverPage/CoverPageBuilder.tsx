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
const PAGE_MARGIN = 94;
const PRIMARY_NAVY = "#1A3A6B";
const ACCENT_GOLD = "#C8952A";
const BOX_FILL = "#EEF4FF";
const CHARCOAL = "#2C2C2C";

const dataUrlToBytes = (dataUrl: string) => {
  const base64 = dataUrl.split(",")[1];
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
};

const downloadBytes = (bytes: Uint8Array, fileName: string, type: string) => {
  const arrayBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const url = URL.createObjectURL(new Blob([arrayBuffer], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

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

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
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

  const marginX = PAGE_MARGIN;
  const contentWidth = A4_W - marginX * 2;
  const documentLabel = getDocumentLabel(form.documentType);
  const itemNumberLabel = getItemNumberLabel(form.documentType);
  const itemTitleLabel = getItemTitleLabel(form.documentType);
  const itemNumber = getItemNumberValue(form);
  const dash = "................................";
  const footerHeight = 30;

  const headerBandY = 46;
  const headerBandHeight = 188;

  ctx.fillStyle = "#f4f8fc";
  drawRoundedRect(ctx, marginX - 12, headerBandY, contentWidth + 24, headerBandHeight, 12);
  ctx.fill();

  let cursorY = headerBandY + 22;

  if (logoUrl) {
    try {
      const logo = await loadImage(logoUrl);
      const maxWidth = 190;
      const maxHeight = 78;
      const ratio = Math.min(maxWidth / logo.width, maxHeight / logo.height, 1);
      const drawWidth = Math.max(1, logo.width * ratio);
      const drawHeight = Math.max(1, logo.height * ratio);
      const drawX = (A4_W - drawWidth) / 2;

      ctx.drawImage(logo, drawX, cursorY, drawWidth, drawHeight);
      cursorY += drawHeight + 30;
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
      cursorY += 110;
    }
  } else {
    cursorY += 110;
  }

  ctx.textAlign = "center";
  ctx.fillStyle = PRIMARY_NAVY;
  ctx.font = "700 31px Georgia";
  ctx.fillText(form.institutionName, A4_W / 2, cursorY);
  cursorY += 24;

  if (form.tagline) {
    ctx.fillStyle = "#5f6b7a";
    ctx.font = "italic 13px Arial";
    ctx.fillText(form.tagline, A4_W / 2, cursorY);
    cursorY += 18;
  }

  if (form.department) {
    ctx.fillStyle = "#5f6b7a";
    ctx.font = "12px Arial";
    ctx.fillText(form.department, A4_W / 2, cursorY);
  }

  cursorY = headerBandY + headerBandHeight + 24;
  ctx.fillStyle = PRIMARY_NAVY;
  ctx.fillRect(marginX, cursorY, contentWidth, 2);
  ctx.fillStyle = ACCENT_GOLD;
  ctx.fillRect(marginX, cursorY + 7, contentWidth, 2);
  cursorY += 72;

  ctx.fillStyle = CHARCOAL;
  ctx.font = "700 40px Georgia";
  ctx.fillText(documentLabel, A4_W / 2, cursorY);
  ctx.fillStyle = ACCENT_GOLD;
  ctx.fillRect(A4_W / 2 - 58, cursorY + 13, 116, 4);
  cursorY += 82;

  const rows: [string, string][] = [
    [itemNumberLabel, itemNumber],
    [itemTitleLabel, form.itemTitle],
    ["Course Title & Code", [form.subjectName, form.subjectCode].filter(Boolean).join(" - ")],
  ];

  const labelX = marginX;
  const valueX = marginX + 190;

  for (const [label, value] of rows) {
    ctx.textAlign = "left";
    ctx.fillStyle = PRIMARY_NAVY;
    ctx.font = "700 16px Arial";
    ctx.fillText(label, labelX, cursorY);

    ctx.fillStyle = value ? CHARCOAL : "#9ca3af";
    ctx.font = "16px Arial";
    drawWrappedText(ctx, value || dash, valueX, cursorY, A4_W - marginX - valueX, 22);

    ctx.strokeStyle = "#9ca3af";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([2, 5]);
    ctx.beginPath();
    ctx.moveTo(valueX, cursorY + 8);
    ctx.lineTo(A4_W - marginX, cursorY + 8);
    ctx.stroke();
    ctx.setLineDash([]);

    cursorY += 58;
  }

  const boxTop = A4_H - footerHeight - PAGE_MARGIN - 252;
  const boxGap = 28;
  const boxWidth = (contentWidth - boxGap) / 2;
  const boxHeight = 252;
  const boxHeaderHeight = 38;

  const drawInfoBox = (
    x: number,
    title: string,
    rowsToRender: [string, string][],
    footer?: () => void,
  ) => {
    ctx.save();
    ctx.shadowColor = "rgba(26, 58, 107, 0.16)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = BOX_FILL;
    drawRoundedRect(ctx, x, boxTop, boxWidth, boxHeight, 8);
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = "rgba(26, 58, 107, 0.22)";
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, x, boxTop, boxWidth, boxHeight, 8);
    ctx.stroke();

    ctx.save();
    drawRoundedRect(ctx, x, boxTop, boxWidth, boxHeaderHeight, 8);
    ctx.clip();
    ctx.fillStyle = PRIMARY_NAVY;
    ctx.fillRect(x, boxTop, boxWidth, boxHeaderHeight + 8);
    ctx.restore();

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 16px Arial";
    ctx.fillText(title, x + boxWidth / 2, boxTop + 24);

    let rowY = boxTop + 70;
    for (const [label, value] of rowsToRender) {
      ctx.textAlign = "left";
      ctx.fillStyle = PRIMARY_NAVY;
      ctx.font = "700 14px Arial";
      ctx.fillText(label, x + 18, rowY);

      ctx.fillStyle = value ? CHARCOAL : "#9ca3af";
      ctx.font = "14px Arial";
      ctx.fillText(value || dash, x + 116, rowY, boxWidth - 136);

      ctx.strokeStyle = "#9ca3af";
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(x + 116, rowY + 5);
      ctx.lineTo(x + boxWidth - 18, rowY + 5);
      ctx.stroke();
      ctx.setLineDash([]);

      rowY += 34;
    }

    footer?.();
  };

  drawInfoBox(marginX, "Submitted To:", [
    ["Name:", form.teacherName],
    ["Designation:", form.teacherDesignation],
  ], () => {
    ctx.textAlign = "left";
    ctx.fillStyle = CHARCOAL;
    ctx.font = "14px Arial";
    ctx.fillText(form.institutionName || "Institution Name", marginX + 18, boxTop + 160, boxWidth - 36);

    ctx.fillStyle = PRIMARY_NAVY;
    ctx.font = "700 14px Arial";
    ctx.fillText("Date:", marginX + 18, boxTop + 198);
    ctx.fillStyle = CHARCOAL;
    ctx.font = "14px Arial";
    ctx.fillText(formatDate(form.submissionDate), marginX + 70, boxTop + 198);
  });

  drawInfoBox(marginX + boxWidth + boxGap, "Submitted By", [
    ["Name:", form.studentName],
    ["Student ID:", form.studentId],
    ["Semester", form.batchGroup],
    ["Batch:", form.section],
  ]);

  ctx.fillStyle = PRIMARY_NAVY;
  ctx.fillRect(0, A4_H - footerHeight, A4_W, footerHeight);
  ctx.fillStyle = "#ffffff";
  ctx.font = "italic 11px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Uttara University - Excellence in Higher Education and Research", A4_W / 2, A4_H - 11);

  return canvas;
};

const CoverPageBuilder = () => {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [step, setStep] = useState(1);
  const [captureLogoUrl, setCaptureLogoUrl] = useState<string | null>(null);
  const [isLogoResolving, setIsLogoResolving] = useState(false);
  const [isMergingPdf, setIsMergingPdf] = useState(false);
  const [missingDialogOpen, setMissingDialogOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<DownloadFormat | null>(null);
  const [pendingMergeFile, setPendingMergeFile] = useState<File | null>(null);

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
    async (format: DownloadFormat, mergeFile?: File) => {
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

        if (format === "merged-pdf") {
          if (!mergeFile) {
            toast.error("Please choose a PDF to merge with your cover page.");
            return;
          }

          if (mergeFile.type && mergeFile.type !== "application/pdf") {
            toast.error("Only PDF files can be merged.");
            return;
          }

          setIsMergingPdf(true);

          const { PDFDocument } = await import("pdf-lib");
          const mergedPdf = await PDFDocument.create();
          const coverImage = await mergedPdf.embedPng(dataUrlToBytes(canvas.toDataURL("image/png")));
          const coverPage = mergedPdf.addPage([595.28, 841.89]);

          coverPage.drawImage(coverImage, {
            x: 0,
            y: 0,
            width: coverPage.getWidth(),
            height: coverPage.getHeight(),
          });

          const sourcePdf = await PDFDocument.load(await mergeFile.arrayBuffer());
          const sourcePages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());

          sourcePages.forEach((page) => mergedPdf.addPage(page));

          const mergedBytes = await mergedPdf.save();
          downloadBytes(mergedBytes, `${downloadBaseName}-merged.pdf`, "application/pdf");
          toast.success("Merged PDF downloaded");
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
        const formatLabel = format === "merged-pdf" ? "merged PDF" : format.toUpperCase();
        toast.error(`Could not create ${formatLabel}. Please try again or refresh the page.`);
      } finally {
        if (format === "merged-pdf") {
          setIsMergingPdf(false);
        }
      }
    },
    [captureLogoUrl, downloadBaseName, form, prepareCaptureLogo, previewLogoUrl],
  );

  const requestDownload = useCallback(
    async (format: DownloadFormat, mergeFile?: File) => {
      if (isLogoResolving) {
        toast("Please wait while the logo finishes loading");
        return;
      }

      if (format === "merged-pdf") {
        if (!mergeFile) {
          toast.error("Please choose a PDF to merge with your cover page.");
          return;
        }

        if (mergeFile.type && mergeFile.type !== "application/pdf") {
          toast.error("Only PDF files can be merged.");
          return;
        }

        setPendingMergeFile(mergeFile);
      } else {
        setPendingMergeFile(null);
      }

      setPendingFormat(format);

      if (missingFields.length > 0) {
        setMissingDialogOpen(true);
        return;
      }

      await runDownload(format, mergeFile);
      setPendingFormat(null);
      setPendingMergeFile(null);
    },
    [isLogoResolving, missingFields.length, runDownload],
  );

  const handleDownloadAnyway = useCallback(async () => {
    if (!pendingFormat) return;
    setMissingDialogOpen(false);
    await runDownload(pendingFormat, pendingMergeFile ?? undefined);
    setPendingFormat(null);
    setPendingMergeFile(null);
  }, [pendingFormat, pendingMergeFile, runDownload]);

  const handleContinueEditing = useCallback(() => {
    setMissingDialogOpen(false);
    setPendingFormat(null);
    setPendingMergeFile(null);
    setStep(getFirstMissingStep(missingFields));
  }, [missingFields]);

  const handleMissingDialogOpenChange = useCallback((open: boolean) => {
    setMissingDialogOpen(open);
    if (!open) {
      setPendingFormat(null);
      setPendingMergeFile(null);
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
                onMergePdf={(file) => void requestDownload("merged-pdf", file)}
                onBack={() => setStep(3)}
                isLogoResolving={isLogoResolving}
                isMergingPdf={isMergingPdf}
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
