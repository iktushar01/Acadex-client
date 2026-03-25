"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight, ShieldCheck, Info, Loader2, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { joinClassroomAction } from "@/app/(dashboardLayout)/dashboard/classroom/_action";

const JoinClassroom = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: handleJoin, isPending } = useMutation({
    mutationFn: joinClassroomAction,
    onSuccess: (res) => {
      if (res.success) {
        router.push(`/classrooms/${res.data?.id || ""}`);
        router.refresh();
      } else {
        setError(res.message);
      }
    },
    onError: () => setError("Something went wrong. Try again."),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) return setError("Code is too short");
    setError(null);
    handleJoin(code);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      {/* BACKGROUND DECO */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[120px]" />

      <div className="w-full max-w-[450px]">
        <div className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card/60 p-8 shadow-2xl backdrop-blur-2xl transition-all hover:border-orange-500/30">
          
          {/* TOP ICON AREA */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/20" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-500 text-white shadow-xl shadow-orange-500/30">
                <Zap className="h-10 w-10 fill-current" />
              </div>
            </div>
          </div>

          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black tracking-tight italic">
              Join <span className="text-orange-500 font-black">Classroom</span>
            </h1>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              Enter the unique code provided by your teacher.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="relative group/input">
              <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-2">
                Access Code
              </label>
              <div className="relative">
                <Keyboard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within/input:text-orange-500 transition-colors" />
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. VL4Izb"
                  maxLength={10}
                  className="h-16 rounded-2xl border-2 border-border bg-background/50 pl-12 text-center text-xl font-black tracking-[0.3em] uppercase transition-all focus-visible:border-orange-500 focus-visible:ring-orange-500/10"
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/5 py-3">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs font-bold">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              disabled={isPending || code.length < 4}
              className="group/btn h-16 w-full rounded-[1.5rem] bg-orange-500 text-lg font-black shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 active:scale-[0.98] disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <>
                  Unlock Access
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          {/* FOOTER HINT */}
          <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-muted/50 p-4">
            <ShieldCheck className="h-4 w-4 text-orange-500" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Secure Cloud-Powered Learning
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JoinClassroom;