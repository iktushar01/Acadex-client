"use client";

import { useMemo } from "react";
import { Download, GraduationCap, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServicePageHeader } from "../shared/ServicePageHeader";
import { useLocalStorageState } from "../shared/useLocalStorageState";
import type { CourseRow, GradeLetter, SemesterRow } from "./gpa.types";
import {
  GRADE_LETTERS,
  STORAGE_KEY,
  cgpa,
  completedCredits,
  defaultGpaState,
  requiredFutureGpa,
  semesterGpa,
  uid,
} from "./gpa.utils";

export default function GpaCalculator() {
  const [state, setState, hydrated] = useLocalStorageState(STORAGE_KEY, defaultGpaState());

  const overallCgpa = useMemo(() => cgpa(state.semesters, state.scale), [state.semesters, state.scale]);
  const doneCredits = useMemo(() => completedCredits(state.semesters), [state.semesters]);
  const remainingCredits = Math.max(0, state.degreeTotalCredits - doneCredits);
  const futureGpa = requiredFutureGpa(
    overallCgpa,
    state.targetCgpa,
    doneCredits,
    remainingCredits,
  );

  const addSemester = () => {
    setState((prev) => ({
      ...prev,
      semesters: [
        ...prev.semesters,
        { id: uid(), label: `Semester ${prev.semesters.length + 1}`, courses: [] },
      ],
    }));
  };

  const removeSemester = (id: string) => {
    setState((prev) => ({ ...prev, semesters: prev.semesters.filter((s) => s.id !== id) }));
  };

  const patchSemester = (id: string, patch: Partial<SemesterRow>) => {
    setState((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const addCourse = (semesterId: string) => {
    const course: CourseRow = {
      id: uid(),
      name: "",
      credit: 3,
      grade: "A",
      isRetake: false,
    };
    setState((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) =>
        s.id === semesterId ? { ...s, courses: [...s.courses, course] } : s,
      ),
    }));
  };

  const patchCourse = (semesterId: string, courseId: string, patch: Partial<CourseRow>) => {
    setState((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) =>
        s.id === semesterId
          ? { ...s, courses: s.courses.map((c) => (c.id === courseId ? { ...c, ...patch } : c)) }
          : s,
      ),
    }));
  };

  const removeCourse = (semesterId: string, courseId: string) => {
    setState((prev) => ({
      ...prev,
      semesters: prev.semesters.map((s) =>
        s.id === semesterId ? { ...s, courses: s.courses.filter((c) => c.id !== courseId) } : s,
      ),
    }));
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(18);
    doc.text("Acadex GPA Report", 14, y);
    y += 10;
    doc.setFontSize(11);
    doc.text(`CGPA (${state.scale} scale): ${overallCgpa.toFixed(2)}`, 14, y);
    y += 8;
    doc.text(`Credits completed: ${doneCredits} / ${state.degreeTotalCredits}`, 14, y);
    y += 12;

    for (const sem of state.semesters) {
      const gpa = semesterGpa(sem.courses, state.scale);
      doc.setFontSize(13);
      doc.text(`${sem.label} — GPA: ${gpa.toFixed(2)}`, 14, y);
      y += 7;
      doc.setFontSize(10);
      for (const c of sem.courses) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`${c.name || "Course"} | ${c.credit} cr | ${c.grade}${c.isRetake ? " (retake)" : ""}`, 18, y);
        y += 6;
      }
      y += 6;
    }

    doc.save("acadex-gpa-report.pdf");
    toast.success("GPA report downloaded.");
  };

  if (!hydrated) {
    return <div className="mx-auto max-w-5xl animate-pulse p-8 text-muted-foreground">Loading calculator…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500 pb-12">
      <ServicePageHeader
        badge="Academic utilities"
        title="GPA / CGPA Calculator"
        description="Calculate semester GPA and overall CGPA using the Bangladesh 4.00 grade scale. Data stays on this device."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-[2rem] border-primary/20 bg-primary/5 sm:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription>Overall CGPA</CardDescription>
            <CardTitle className="text-4xl font-black tabular-nums">{overallCgpa.toFixed(2)}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="rounded-[2rem] sm:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription>Degree progress</CardDescription>
            <CardTitle className="text-2xl font-bold">
              {doneCredits} / {state.degreeTotalCredits} credits
            </CardTitle>
            <Progress value={(doneCredits / state.degreeTotalCredits) * 100} className="mt-2 h-2" />
          </CardHeader>
        </Card>
        <Card className="rounded-[2rem] sm:col-span-1">
          <CardHeader className="pb-2">
            <CardDescription>Goal predictor</CardDescription>
            <CardTitle className="text-lg font-bold">
              {futureGpa !== null ? (
                <>Need ~{futureGpa.toFixed(2)} GPA on remaining credits</>
              ) : (
                "Set remaining credits"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.01"
                min={0}
                max={state.scale === "5.00" ? 5 : 4}
                value={state.targetCgpa}
                onChange={(e) =>
                  setState((p) => ({ ...p, targetCgpa: Number(e.target.value) || 0 }))
                }
                className="h-9 rounded-xl"
                placeholder="Target CGPA"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[2rem]">
        <CardContent className="flex flex-wrap items-center gap-4 pt-6">
          <div className="flex items-center gap-2">
            <Label>Scale</Label>
            <Select
              value={state.scale}
              onValueChange={(v) => setState((p) => ({ ...p, scale: v as "4.00" | "5.00" }))}
            >
              <SelectTrigger className="w-28 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4.00">4.00</SelectItem>
                <SelectItem value="5.00">5.00</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label>Degree credits</Label>
            <Input
              type="number"
              className="w-24 rounded-xl"
              value={state.degreeTotalCredits}
              onChange={(e) =>
                setState((p) => ({ ...p, degreeTotalCredits: Number(e.target.value) || 0 }))
              }
            />
          </div>
          <Button onClick={exportPdf} variant="outline" className="ml-auto rounded-2xl">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </CardContent>
      </Card>

      {state.semesters.map((sem) => {
        const gpa = semesterGpa(sem.courses, state.scale);
        return (
          <Card key={sem.id} className="rounded-[2rem] border border-border/60">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <Input
                  value={sem.label}
                  onChange={(e) => patchSemester(sem.id, { label: e.target.value })}
                  className="max-w-[200px] rounded-xl font-bold"
                />
                <Badge variant="secondary" className="rounded-full font-bold">
                  GPA: {gpa.toFixed(2)}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => addCourse(sem.id)}>
                  <Plus className="mr-1 h-4 w-4" />
                  Course
                </Button>
                {state.semesters.length > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => removeSemester(sem.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-2 font-medium">Course</th>
                    <th className="pb-2 pr-2 font-medium">Credit</th>
                    <th className="pb-2 pr-2 font-medium">Grade</th>
                    <th className="pb-2 pr-2 font-medium">Retake</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody>
                  {sem.courses.map((c) => (
                    <tr key={c.id} className="border-b border-border/40">
                      <td className="py-2 pr-2">
                        <Input
                          value={c.name}
                          placeholder="CSE101"
                          onChange={(e) => patchCourse(sem.id, c.id, { name: e.target.value })}
                          className="h-9 rounded-lg"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <Input
                          type="number"
                          step="0.5"
                          min={0}
                          value={c.credit}
                          onChange={(e) =>
                            patchCourse(sem.id, c.id, { credit: Number(e.target.value) || 0 })
                          }
                          className="h-9 w-20 rounded-lg"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <Select
                          value={c.grade}
                          onValueChange={(v) =>
                            patchCourse(sem.id, c.id, { grade: v as GradeLetter })
                          }
                        >
                          <SelectTrigger className="h-9 w-20 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADE_LETTERS.map((g) => (
                              <SelectItem key={g} value={g}>
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 pr-2">
                        <input
                          type="checkbox"
                          checked={c.isRetake}
                          onChange={(e) =>
                            patchCourse(sem.id, c.id, { isRetake: e.target.checked })
                          }
                          className="h-4 w-4 rounded"
                          title="Retake — new grade replaces old"
                        />
                      </td>
                      <td className="py-2 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeCourse(sem.id, c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        );
      })}

      <Button onClick={addSemester} variant="outline" className="w-full rounded-2xl font-bold">
        <Plus className="mr-2 h-4 w-4" />
        Add semester
      </Button>
    </div>
  );
}
