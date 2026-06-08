"use client";

import type { RefObject } from "react";
import { useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { A4_H, A4_W, UNIVERSITIES } from "./CoverPageBuilder.constants";
import { FormState, University } from "./CoverPageBuilder.types";
import { formatDate, getDocumentLabel, getItemNumberLabel, getItemNumberValue, getItemTitleLabel } from "./CoverPageBuilder.utils";
import { Input } from "@/components/ui/input";

export function StepBar({ current, total }: { current: number; total: number }) {
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
                {done ? <CheckCircle2 className="h-4 w-4" /> : idx}
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

export function UniSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (uni: University) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUniversities = UNIVERSITIES.filter((uni) =>
    uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uni.short.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search universities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-xl pl-9"
        />
      </div>

      {/* Universities Container with Fixed Height and Scrollbar */}
      <div className="overflow-y-auto rounded-xl border border-border bg-background p-2" style={{ maxHeight: "320px" }}>
        {filteredUniversities.length > 0 ? (
          <div className="flex flex-col gap-2">
            {filteredUniversities.map((uni) => (
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
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div>
                  <p className="text-xs font-semibold leading-tight">{uni.name}</p>
                  <p className="text-[10px] text-muted-foreground">{uni.short}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-muted-foreground/30 bg-muted/50">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">No universities found</p>
              <p className="text-xs text-muted-foreground/70">Try adjusting your search</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CoverPageContent({
  form,
  logoUrl,
  previewRef,
}: {
  form: FormState;
  logoUrl: string | null;
  previewRef?: RefObject<HTMLDivElement | null>;
}) {
  const documentLabel = getDocumentLabel(form.documentType);
  const itemNumberLabel = getItemNumberLabel(form.documentType);
  const itemTitleLabel = getItemTitleLabel(form.documentType);
  const itemNumber = getItemNumberValue(form);
  const dash = "................................";
  const margin = 94;
  const navy = "#1A3A6B";
  const gold = "#C8952A";
  const charcoal = "#2C2C2C";
  const boxFill = "#EEF4FF";
  const fieldRows: [string, string][] = [
    [itemNumberLabel, itemNumber],
    [itemTitleLabel, form.itemTitle],
    ["Course Title & Code", [form.subjectName, form.subjectCode].filter(Boolean).join(" - ")],
  ];
  const submittedToRows: [string, string][] = [
    ["Name:", form.teacherName],
    ["Designation:", form.teacherDesignation],
  ];
  const submittedByRows: [string, string][] = [
    ["Name:", form.studentName],
    ["Student ID:", form.studentId],
    ["Semester:", form.batchGroup],
    ["Batch:", form.section],
  ];

  return (
    <div
      ref={previewRef}
      className="box-border flex flex-col bg-white"
      style={{
        width: A4_W,
        height: A4_H,
        padding: `${margin}px ${margin}px 58px`,
        fontFamily: "Arial, Helvetica, sans-serif",
        color: charcoal,
        position: "relative",
      }}
    >
      <div
        className="flex flex-col items-center text-center"
        style={{
          margin: "-48px -12px 0",
          padding: "22px 24px 26px",
          borderRadius: 12,
          background: "#f4f8fc",
        }}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt="Institution logo"
            crossOrigin="anonymous"
            className="mb-7 max-h-[78px] max-w-[190px] object-contain"
          />
        ) : (
          <div className="mb-7 flex h-[78px] w-[78px] items-center justify-center rounded-full border border-dashed border-slate-300 text-[11px] text-slate-400">
            Logo
          </div>
        )}

        <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: 31, fontWeight: 700, color: navy, margin: 0 }}>
          {form.institutionName}
        </h2>
        {form.department && (
          <p style={{ fontSize: 12, color: "#5f6b7a", marginTop: 4 }}>{form.department}</p>
        )}
      </div>

      <div style={{ width: "100%", height: 2, background: navy, marginTop: 24 }} />
      <div style={{ width: "100%", height: 2, background: gold, marginTop: 7 }} />

      <div style={{ textAlign: "center", marginTop: 58 }}>
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 0,
            color: charcoal,
            margin: 0,
          }}
        >
          {documentLabel}
        </h1>
        <div style={{ width: 116, height: 4, background: gold, margin: "13px auto 0" }} />
      </div>

      <div
        style={{
          marginTop: 68,
          display: "flex",
          flexDirection: "column",
          gap: 34,
          fontSize: 16,
          lineHeight: 1.55,
        }}
      >
        {fieldRows.map(([label, value]) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "172px 1fr", gap: 18, alignItems: "baseline" }}>
            <span style={{ fontWeight: 700, color: navy }}>{label}</span>
            <span
              style={{
                color: value ? charcoal : "#9ca3af",
                borderBottom: "1.2px dotted #9ca3af",
                paddingBottom: 3,
              }}
            >
              {value || dash}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
        }}
      >
        <div
          style={{
            overflow: "hidden",
            minHeight: 252,
            border: "1px solid rgba(26, 58, 107, 0.22)",
            borderRadius: 8,
            background: boxFill,
            boxShadow: "0 8px 18px rgba(26, 58, 107, 0.16)",
          }}
        >
          <div
            style={{
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: navy,
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Submitted To:
          </div>
          <div style={{ padding: "26px 18px 18px" }}>
          {submittedToRows.map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "grid",
                gridTemplateColumns: "108px 1fr",
                gap: 8,
                fontSize: 14,
                marginBottom: 18,
                lineHeight: 1.5,
              }}
            >
              <span style={{ fontWeight: 700, color: navy }}>{k}</span>
              <span style={{ color: v ? charcoal : "#9ca3af", borderBottom: "1px dotted #9ca3af", paddingBottom: 2 }}>
                {v || dash}
              </span>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "108px 1fr", gap: 8, fontSize: 14, marginBottom: 18, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, color: navy }}>Institution:</span>
            <span style={{ color: form.institutionName ? charcoal : "#9ca3af", borderBottom: "1px dotted #9ca3af", paddingBottom: 2 }}>
              {form.institutionName || dash}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "108px 1fr", gap: 8, fontSize: 14, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, color: navy }}>Date:</span>
            <span style={{ color: charcoal, borderBottom: "1px dotted #9ca3af", paddingBottom: 2 }}>
              {formatDate(form.submissionDate)}
            </span>
          </div>
          </div>
        </div>

        <div
          style={{
            overflow: "hidden",
            minHeight: 252,
            border: "1px solid rgba(26, 58, 107, 0.22)",
            borderRadius: 8,
            background: boxFill,
            boxShadow: "0 8px 18px rgba(26, 58, 107, 0.16)",
          }}
        >
          <div
            style={{
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: navy,
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Submitted By
          </div>
          <div style={{ padding: "26px 18px 18px" }}>
          {submittedByRows.map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "grid",
                gridTemplateColumns: "108px 1fr",
                gap: 8,
                fontSize: 14,
                marginBottom: 18,
                lineHeight: 1.5,
              }}
            >
              <span style={{ fontWeight: 700, color: navy }}>{k}</span>
              <span style={{ color: v ? charcoal : "#9ca3af", borderBottom: "1px dotted #9ca3af", paddingBottom: 2 }}>
                {v || dash}
              </span>
            </div>
          ))}
          </div>
        </div>
      </div>

    </div>
  );
}
