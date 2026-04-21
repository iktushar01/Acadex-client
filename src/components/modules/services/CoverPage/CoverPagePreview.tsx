"use client";

import type { RefObject } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { A4_H, A4_W, UNIVERSITIES } from "./CoverPageBuilder.constants";
import { FormState, University } from "./CoverPageBuilder.types";
import { formatDate, getDocumentLabel, getItemNumberLabel, getItemNumberValue, getItemTitleLabel } from "./CoverPageBuilder.utils";

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

        <h2 style={{ fontSize: 30, fontWeight: 700, color: "#1a3a6b", margin: 0 }}>{form.institutionName}</h2>
        {form.tagline && <p style={{ fontSize: 13, color: "#555", marginTop: 8 }}>{form.tagline}</p>}
        {form.department && (
          <p style={{ fontSize: 12, color: "#555", fontStyle: "italic", marginTop: 4 }}>{form.department}</p>
        )}
      </div>

      <div
        style={{
          width: "100%",
          height: 2,
          background: "linear-gradient(to right,#1a3a6b,#2a5aa0,#1a3a6b)",
          marginTop: 18,
        }}
      />
      <div style={{ width: "60%", height: 1, background: "#2a5aa0", margin: "4px auto 0" }} />

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
            ["Subject Name & Code", [form.subjectName, form.subjectCode].filter(Boolean).join(" - ")],
          ] as [string, string][]
        ).map(([label, value]) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 12 }}>
            <span style={{ fontWeight: 600 }}>{label}</span>
            <span
              style={{
                color: value ? "#1a1a1a" : "#bbb",
                borderBottom: "1px solid #e8e4dd",
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
          paddingTop: 32,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
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
            <div
              key={k}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr",
                gap: 8,
                fontSize: 15,
                marginBottom: 10,
                lineHeight: 1.5,
              }}
            >
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
            <div
              key={k}
              style={{
                display: "grid",
                gridTemplateColumns: "100px 1fr",
                gap: 8,
                fontSize: 15,
                marginBottom: 10,
                lineHeight: 1.5,
              }}
            >
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
