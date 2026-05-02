"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { A4_H, A4_W, UNIVERSITIES, defaultForm } from "./CoverPageBuilder.constants";
import { CoverPageContent, StepBar } from "./CoverPagePreview";
import { MissingFieldsDialog, Step1Institution, Step2Document, Step3People, Step4Download } from "./CoverPageSteps";
import { DownloadFormat, FormState } from "./CoverPageBuilder.types";
import {
  getDownloadBaseName,
  getFirstMissingStep,
  getItemNumberLabel,
  getItemTitleLabel,
  getLogoProxyUrl,
  getMissingFields,
} from "./CoverPageBuilder.utils";

const logoDataUrlCache = new Map<string, string>();

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

const waitForImages = async (element: HTMLElement) => {
  const images = Array.from(element.querySelectorAll("img"));
  const IMAGE_TIMEOUT_MS = 5000; // 5 second timeout per image

  await Promise.all(
    images.map(
      (image) =>
        new Promise<boolean>((resolve) => {
          // Check if image is already loaded successfully
          if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
            resolve(true);
            return;
          }

          // If image is complete but has no dimensions, it failed to load
          if (image.complete && image.naturalWidth === 0) {
            console.warn("Image failed to load:", image.src);
            resolve(false);
            return;
          }

          // Set up load/error handlers with timeout
          let timeoutId: NodeJS.Timeout | null = null;
          const cleanup = () => {
            if (timeoutId) clearTimeout(timeoutId);
            image.removeEventListener("load", onLoad);
            image.removeEventListener("error", onError);
          };

          const onLoad = () => {
            cleanup();
            resolve(true);
          };

          const onError = () => {
            cleanup();
            console.warn("Image load error:", image.src);
            resolve(false);
          };

          const onTimeout = () => {
            cleanup();
            console.warn("Image load timeout:", image.src);
            resolve(false);
          };

          image.addEventListener("load", onLoad, { once: true });
          image.addEventListener("error", onError, { once: true });
          timeoutId = setTimeout(onTimeout, IMAGE_TIMEOUT_MS);
        }),
    ),
  );
};

const CoverPageBuilder = () => {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [step, setStep] = useState(1);
  const [captureLogoUrl, setCaptureLogoUrl] = useState<string | null>(null);
  const [isLogoResolving, setIsLogoResolving] = useState(false);
  const [missingDialogOpen, setMissingDialogOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<DownloadFormat | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
      const response = await fetch(previewLogoUrl, {
        cache: "force-cache",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logo");
      }

      const blob = await response.blob();
      const dataUrl = await blobToDataUrl(blob);
      logoDataUrlCache.set(cacheKey, dataUrl);
      setCaptureLogoUrl(dataUrl);
      return dataUrl;
    } catch {
      setCaptureLogoUrl(null);
      return null;
    } finally {
      setIsLogoResolving(false);
    }
  }, [previewLogoUrl, selectedUni.id, selectedUni.logo]);

  useEffect(() => {
    setCaptureLogoUrl(null);
    void prepareCaptureLogo();
  }, [prepareCaptureLogo]);

  const capturePreview = useCallback(async (logoDataUrl?: string) => {
    const element = previewRef.current;

    if (!element) {
      throw new Error("Preview element not found");
    }

    if (logoDataUrl) {
      const logoImage = element.querySelector<HTMLImageElement>('img[alt="Institution logo"]');
      if (logoImage) {
        // Ensure CORS is set for the data URL assignment
        logoImage.crossOrigin = "anonymous";
        logoImage.src = logoDataUrl;
        // Give the image a moment to start loading
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    await waitForImages(element);

    const html2canvas = (await import("html2canvas")).default;

    try {
      // First attempt: strict CORS requirements
      return await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
      });
    } catch (error) {
      console.warn("html2canvas failed with strict CORS, retrying with allowTaint...", error);
      // Fallback: allow tainted canvas if strict mode fails
      return html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
    }
  }, []);

  const runDownload = useCallback(
    async (format: DownloadFormat) => {
      try {
        let logoDataUrl: string | null = null;
        try {
          logoDataUrl = await prepareCaptureLogo();
        } catch (logoError) {
          console.warn("Failed to prepare logo, will use default:", logoError);
        }

        const canvas = await capturePreview(logoDataUrl ?? captureLogoUrl ?? undefined);

        if (!canvas) {
          toast.error("Could not capture preview. Please try again.");
          return;
        }

        if (format === "png") {
          try {
            const anchor = document.createElement("a");
            anchor.href = canvas.toDataURL("image/png");
            anchor.download = `${downloadBaseName}.png`;
            anchor.click();
            toast.success("PNG downloaded");
          } catch (downloadError) {
            console.error("PNG download failed:", downloadError);
            toast.error("Failed to download PNG. Please try again.");
          }
          return;
        }

        try {
          const { jsPDF } = await import("jspdf");
          const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
          const width = pdf.internal.pageSize.getWidth();
          const height = pdf.internal.pageSize.getHeight();
          const imageData = canvas.toDataURL("image/png");
          pdf.addImage(imageData, "PNG", 0, 0, width, height, undefined, "FAST");
          pdf.save(`${downloadBaseName}.pdf`);
          toast.success("PDF downloaded");
        } catch (pdfError) {
          console.error("PDF generation failed:", pdfError);
          toast.error("Failed to create PDF. The preview may be too large. Try simplifying the form.");
        }
      } catch (error) {
        console.error("Download failed:", error);
        toast.error(`Could not create ${format.toUpperCase()}. Please try again or refresh the page.`);
      }
    },
    [capturePreview, captureLogoUrl, downloadBaseName, prepareCaptureLogo],
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
              <div className="relative overflow-hidden rounded-lg shadow-md" style={{ width: A4_W * 0.42, height: A4_H * 0.42 }}>
                <div
                  className="absolute left-0 top-0 origin-top-left"
                  style={{ transform: "scale(0.42)", width: A4_W, height: A4_H }}
                >
                  <CoverPageContent form={form} logoUrl={activeLogoUrl} previewRef={previewRef} />
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
