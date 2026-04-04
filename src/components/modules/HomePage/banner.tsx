"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

const Banner = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <>
      <section
        className="relative flex md:min-h-[100vh] min-h-[40vh] w-full flex-col items-center justify-center overflow-hidden bg-background pt-6 pb-10"
        style={{
          // Modernized Notepad Grid: Thinner lines, more subtle
          backgroundImage: `
            linear-gradient(to right, var(--muted) 1px, transparent 1px),
            linear-gradient(to bottom, var(--muted) 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
          maskImage: "radial-gradient(ellipse at center, black 50%, transparent 95%)",
        }}
      >
        {/* Red "Notebook Margin" - Moved slightly for better symmetry */}
        <div className="absolute top-0 left-[8%] h-full w-[1px] bg-orange-500/20 md:left-[12%]" />
        <div className="absolute top-0 left-[8.5%] h-full w-[1px] bg-orange-500/10 md:left-[12.5%]" />

        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 right-[10%] animate-bounce duration-[3000ms] opacity-20 hidden lg:block">
          <GraduationCap className="size-16 text-orange-500 -rotate-12" />
        </div>

        <div className="container relative z-10 flex flex-col items-center px-4 text-center">
          {/* Modern Glass Badge */}
          <div className="group mb-8 flex items-center gap-2 rounded-2xl border border-orange-500/20 bg-orange-500/5 px-5 py-2 text-sm font-bold text-orange-600 backdrop-blur-md transition-all hover:bg-orange-500/10 md:text-base animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="size-4 fill-orange-500 animate-pulse" />
            <span className="tracking-tight">Classroom-Based Note Sharing Platform</span>
          </div>

          {/* Main Headline with Custom SVG Underline */}
          <h1 className="max-w-5xl text-5xl font-black leading-[0.9] tracking-tighter text-foreground md:text-5xl lg:text-7xl">
            Manage Classrooms, <br />
            <span className="relative inline-block text-orange-500 italic">
              Share Notes
              {/* Hand-drawn style SVG Underline */}
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8C45.5 2.5 132.5 -1.5 296 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="animate-draw" />
              </svg>
            </span>
          </h1>

          {/* Description with Stacked Typography */}
          <div className="mt-16 flex max-w-xl items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="hidden h-20 w-[2px] rounded-full bg-gradient-to-b from-orange-500 to-transparent sm:block" />
            <p className="text-center text-lg font-medium leading-relaxed text-muted-foreground sm:text-left md:text-xl">
              Skip the scattered files. Acadex gives students and class reps one <span className="font-bold text-foreground">organized workspace</span> to join classrooms, manage subjects and folders, and share verified study notes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 sm:flex-row">
            <Link href="/login">
              <Button size="lg" className="h-16 rounded-2xl bg-orange-500 px-10 text-lg font-black shadow-xl shadow-orange-500/20 transition-all hover:scale-105 hover:bg-orange-600 active:scale-95 cursor-pointer">
                Open Acadex
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="lg"
              className="h-16 rounded-2xl border border-transparent px-8 text-lg font-bold transition-all hover:border-orange-500/20 hover:bg-orange-500/5 cursor-pointer"
              onClick={() => setIsDemoOpen(true)}
            >
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Background Auras (The "Globs") */}
        <div className="absolute -bottom-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[10%] -right-[5%] h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-[100px] animate-pulse delay-700" />

        {/* Hand-drawn CSS Animation */}
        <style jsx>{`
          @keyframes draw {
            from {
              stroke-dasharray: 0 300;
            }
            to {
              stroke-dasharray: 300 300;
            }
          }
          .animate-draw {
            stroke-dasharray: 0 300;
            animation: draw 1.5s ease-out forwards;
            animation-delay: 1.2s;
          }
        `}</style>
      </section>

      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent
          className="w-[calc(100%-1rem)] max-w-[96vw] gap-3 overflow-hidden border-0 bg-background p-2 sm:w-[calc(100%-2rem)] md:max-w-5xl lg:max-w-6xl xl:max-w-7xl sm:p-4"
          showCloseButton
        >
          <DialogTitle className="px-10 pt-2 text-base font-semibold sm:px-0 sm:pt-0 sm:text-lg">
            Meet Acadex
          </DialogTitle>
          <DialogDescription className="px-10 text-xs sm:px-0 sm:text-sm">
            Watch how Acadex helps students join classrooms, organize study materials, and share notes.
          </DialogDescription>

          <div className="overflow-hidden rounded-xl border bg-black">
            <div className="aspect-video max-h-[70vh] w-full sm:max-h-[80vh] lg:max-h-[82vh]">
              {isDemoOpen ? (
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/3BApolGeKAs?autoplay=1&rel=0"
                  title="Acadex demo video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Banner;
