"use client";

import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { 
  BookOpen, Building2, GraduationCap, Layers, 
  Users, FileText, Sparkles, Hash, Clock, CheckCircle2, Copy, ArrowLeft 
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
        toast.success("Request logged successfully.");
      } else {
        toast.error(result.message);
      }
    },
  });

  // ── RENDER: SUCCESS / PENDING STATE ──
  if (submittedData) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 animate-in zoom-in-95 duration-500">
        <div className="p-10 rounded-[3rem] border border-border bg-card shadow-2xl text-center space-y-8">
          <div className="relative mx-auto size-24">
            <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative size-full rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Clock className="size-10 text-orange-500" />
            </div>
            <CheckCircle2 className="absolute -bottom-1 -right-1 size-8 text-green-500 fill-background" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter uppercase italic">Request Pending</h1>
            <p className="text-muted-foreground font-medium text-sm px-6">
              Classroom <span className="text-foreground font-bold">{submittedData.name}</span> has been submitted for admin approval at {submittedData.institutionName}.
            </p>
          </div>

          <div className="bg-muted/50 border border-border rounded-2xl p-6 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Classroom Join Code</p>
            <div className="flex items-center justify-between bg-background p-4 rounded-xl border border-border">
              <code className="text-2xl font-mono font-black tracking-[0.3em] text-orange-600">
                {submittedData.joinCode}
              </code>
              <Button variant="ghost" size="icon" onClick={() => {
                navigator.clipboard.writeText(submittedData.joinCode);
                toast.success("Code copied!");
              }}>
                <Copy className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button asChild className="h-12 rounded-xl bg-orange-600 font-black uppercase tracking-widest">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
            <Button variant="link" onClick={() => setSubmittedData(null)} className="text-xs uppercase font-bold opacity-50">
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
          <div className="h-px w-8 bg-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">Phase 01: Registration</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Initialize <span className="text-orange-500">Node</span></h1>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); form.handleSubmit(); }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-6">
          <div className="p-8 rounded-[2.5rem] border border-border bg-card/40 backdrop-blur-md space-y-8">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <BookOpen className="size-4 text-orange-500" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">Academic Identity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form.Field name="name" children={(field) => <ReUsableField field={field} label="Class Name" prepend={<Hash />} />} />
              <form.Field name="institutionName" children={(field) => <ReUsableField field={field} label="Institution" prepend={<Building2 />} />} />
              <form.Field name="className" children={(field) => <ReUsableField field={field} label="Grade" prepend={<GraduationCap />} />} />
              <form.Field name="department" children={(field) => <ReUsableField field={field} label="Department" prepend={<Layers />} />} />
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-border bg-muted/20">
            <form.Field name="description" children={(field) => <ReUsableField field={field} label="Syllabus Overview" prepend={<FileText />} />} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] border border-border bg-card shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4">
              <Sparkles className="size-4 text-orange-500" />
              <h2 className="text-[10px] font-black uppercase tracking-widest">Configuration</h2>
            </div>
            <form.Field name="level" children={(field) => <ReUsableField field={field} label="Level" placeholder="COLLEGE" />} />
            <form.Field name="groupName" children={(field) => <ReUsableField field={field} label="Group" prepend={<Users />} />} />
            
            <div className="pt-6">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <AppSubmitButton isPending={isSubmitting} disabled={!canSubmit}>
                    Request Approval
                  </AppSubmitButton>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateClassroomPage;