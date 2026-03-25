"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { 
  BookOpen, Building2, GraduationCap, Layers, 
  Users, FileText, Sparkles, Hash, Clock, CheckCircle2, Copy, School 
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import ReUsableField from "@/components/shared/form/ReUsableField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Button } from "@/components/ui/button";
import { createClassroomAction } from "@/app/(dashboardLayout)/dashboard/classroom/create/_action";
import { createClassValidation } from "@/zod/classroom.validation";

const CreateClassroomPage = () => {
  const [submittedData, setSubmittedData] = useState<any>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      institutionName: "",
      level: "",
      className: "",
      department: "",
      groupName: "",
      description: "",
    },
    validators: { onChange: createClassValidation },
    onSubmit: async ({ value }) => {
      const result = await createClassroomAction(value);
      if (result.success) {
        setSubmittedData(result.data);
        toast.success("Classroom request sent!");
      } else {
        toast.error(result.message);
      }
    },
  });

  // ── RENDER: SUCCESS / PENDING STATE ──
  if (submittedData) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 animate-in zoom-in-95 duration-500">
        <div className="p-10 rounded-[2rem] border border-border bg-card shadow-2xl text-center space-y-8">
          <div className="relative mx-auto size-24">
            <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative size-full rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Clock className="size-10 text-green-600" />
            </div>
            <CheckCircle2 className="absolute -bottom-1 -right-1 size-8 text-green-600 fill-background" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Request Received!</h1>
            <p className="text-muted-foreground font-medium text-sm px-6">
              Your classroom <span className="text-foreground font-bold">{submittedData.name}</span> is being reviewed by the administration at {submittedData.institutionName}.
            </p>
          </div>

          <div className="bg-muted/30 border border-dashed border-border rounded-2xl p-6 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Classroom Join Code</p>
            <div className="flex items-center justify-between bg-background p-4 rounded-xl border border-border">
              <code className="text-2xl font-mono font-bold tracking-widest text-primary">
                {submittedData.joinCode}
              </code>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => {
                navigator.clipboard.writeText(submittedData.joinCode);
                toast.success("Code copied to clipboard");
              }}>
                <Copy className="size-4" />
                Copy
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button asChild className="h-12 rounded-xl font-bold">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="ghost" onClick={() => setSubmittedData(null)} className="text-xs font-semibold">
              Create another classroom
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: FORM STATE ──
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 animate-in fade-in duration-700">
      <div className="mb-10 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-1 w-6 rounded-full bg-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">New Classroom</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Setup Your <span className="text-primary">Learning Space</span></h1>
        <p className="text-muted-foreground">Fill in the details below to create your digital classroom environment.</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[1.5rem] border border-border bg-card shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <BookOpen className="size-5 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field name="name" children={(field) => <ReUsableField field={field} label="Classroom Name" placeholder="e.g. Advanced Physics" prepend={<Hash className="size-4" />} />} />
              <form.Field name="institutionName" children={(field) => <ReUsableField field={field} label="School / Institution" placeholder="e.g. City University" prepend={<Building2 className="size-4" />} />} />
              <form.Field name="className" children={(field) => <ReUsableField field={field} label="Grade / Semester" placeholder="e.g. Grade 10 or Fall 2024" prepend={<GraduationCap className="size-4" />} />} />
              <form.Field name="department" children={(field) => <ReUsableField field={field} label="Department" placeholder="e.g. Science" prepend={<Layers className="size-4" />} />} />
            </div>
          </div>

          <div className="p-8 rounded-[1.5rem] border border-border bg-muted/20">
            <form.Field name="description" children={(field) => (
               <ReUsableField field={field} label="About this Class" placeholder="Briefly describe what students will learn..." prepend={<FileText className="size-4" />} />
            )} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-[1.5rem] border border-border bg-card shadow-md space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <Sparkles className="size-5 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Classification</h2>
            </div>
            
            {/* Level Dropdown */}
            <form.Field name="level" children={(field) => (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <School className="size-4 text-primary" />
                  Academic Level
                </label>
                <select 
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="" disabled>Select Level</option>
                  <option value="SCHOOL">SCHOOL</option>
                  <option value="COLLEGE">COLLEGE</option>
                  <option value="UNIVERSITY">UNIVERSITY</option>
                </select>
                {field.state.meta.errors && <p className="text-[10px] text-destructive">{field.state.meta.errors.join(", ")}</p>}
              </div>
            )} />

            <form.Field name="groupName" children={(field) => <ReUsableField field={field} label="Section / Group" placeholder="e.g. Group A" prepend={<Users className="size-4" />} />} />
            
            <div className="pt-6">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <AppSubmitButton isPending={isSubmitting} disabled={!canSubmit}>
                    Create Classroom
                  </AppSubmitButton>
                )}
              />
              <p className="text-[10px] text-center text-muted-foreground mt-4">
                By creating this, you agree to follow the institutional guidelines.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateClassroomPage;