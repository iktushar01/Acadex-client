"use client"; // <--- Add this line at the very top

import { GraduationCap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

const GlobalLoading = () => {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    const timer2 = setTimeout(() => setProgress(85), 2000);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      {/* Notepad Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20 dark:opacity-5 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--muted) 1px, transparent 1px)`,
          backgroundSize: '100% 3rem',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Pulsing Logo */}
        <div className="relative">
          <div className="flex h-24 w-24 animate-bounce items-center justify-center rounded-3xl bg-primary shadow-[0_0_40px_rgba(var(--primary),0.3)]">
            <GraduationCap className="h-12 w-12 text-primary-foreground" />
          </div>
          <div className="absolute inset-0 animate-ping rounded-3xl bg-primary/20" />
        </div>

        {/* Text & Progress */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Opening Acadex
            </h2>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              Syncing your classroom notes...
            </p>
          </div>

          <div className="w-64 overflow-hidden rounded-full border border-border bg-muted">
            <Progress 
              value={progress} 
              className="h-2 w-full bg-primary transition-all duration-1000 ease-out" 
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 px-6 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/50 font-semibold">
          "Education is the most powerful weapon"
        </p>
      </div>
    </div>
  );
};

export default GlobalLoading;