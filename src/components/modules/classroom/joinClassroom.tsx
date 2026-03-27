"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { DoorOpen, ArrowRight, ShieldCheck, Info, Loader2, Keyboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { joinClassroomAction } from "@/actions/_joinClassroomAction";

const JoinClassroom = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { mutate: handleJoin, isPending } = useMutation({
    mutationFn: joinClassroomAction,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Welcome to the class!");
        router.push(`/dashboard/classroom/${res.data?.id}`);
        router.refresh();
      } else {
        setError(res.message);
        toast.error(res.message);
      }
    },
    onError: () => {
      const msg = "Something went wrong. Please check your connection.";
      setError(msg);
      toast.error(msg);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) return setError("Please enter a valid 4-10 character code.");
    setError(null);
    handleJoin(code);
  };

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center p-4">
      {/* SOFT GLOW BACKGROUND */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]" />

      <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl p-8 transition-all">
          
          {/* WELCOME ICON */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <DoorOpen className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="text-center mb-8 space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Join a <span className="text-primary">Classroom</span>
            </h1>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Enter your invitation details
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground/80 ml-1 flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-primary" />
                Classroom Code
              </label>
              <div className="relative group">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ABCD12"
                  maxLength={10}
                  className="h-16 rounded-xl border-2 border-muted bg-muted/30 text-center text-2xl font-mono font-bold tracking-[0.4em] uppercase focus-visible:border-primary/50 focus-visible:ring-primary/10 transition-all"
                />
              </div>
              <p className="text-[10px] text-center text-muted-foreground">
                Ask your teacher for the join code.
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="rounded-xl border-destructive/20 bg-destructive/5 py-3">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              disabled={isPending || code.length < 4}
              type="submit"
              className="h-14 w-full rounded-xl text-sm font-bold shadow-lg active:scale-[0.98] transition-all"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Enter Classroom <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* SECURE FOOTER */}
          <div className="mt-8 flex items-center justify-center gap-2 border-t border-border/50 pt-6">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/50 border border-border">
                <ShieldCheck className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-bold text-muted-foreground">
                  Verified Academic Space
                </span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
                Don't have a code? <span className="text-primary font-semibold cursor-pointer hover:underline">Contact Support</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default JoinClassroom;