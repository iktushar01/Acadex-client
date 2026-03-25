"use client";

import { ArrowRight, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Banner = () => {
  return (
    <section 
      className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-background pt-20"
      style={{
        // Modernized Notepad Grid: Thinner lines, more subtle
        backgroundImage: `
          linear-gradient(to right, var(--muted) 1px, transparent 1px),
          linear-gradient(to bottom, var(--muted) 1px, transparent 1px)
        `,
        backgroundSize: '4rem 4rem',
        maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 95%)'
      }}
    >
      {/* Red "Notebook Margin" - Moved slightly for better symmetry */}
      <div className="absolute top-0 left-[8%] h-full w-[1px] bg-orange-500/20 md:left-[12%]" />
      <div className="absolute top-0 left-[8.5%] h-full w-[1px] bg-orange-500/10 md:left-[12.5%]" />

      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 right-[10%] animate-bounce duration-[3000ms] opacity-20 hidden lg:block">
        <GraduationCap className="size-16 text-orange-500 -rotate-12" />
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center px-4">
        
        {/* Modern Glass Badge */}
        <div className="group mb-8 flex items-center gap-2 rounded-2xl border border-orange-500/20 bg-orange-500/5 px-5 py-2 text-sm font-bold text-orange-600 backdrop-blur-md transition-all hover:bg-orange-500/10 md:text-base animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="size-4 fill-orange-500 animate-pulse" />
          <span className="tracking-tight">Next-Gen Learning Platform</span>
        </div>

        {/* Main Headline with Custom SVG Underline */}
        <h1 className="max-w-5xl text-5xl font-black tracking-tighter text-foreground md:text-8xl lg:text-9xl leading-[0.9]">
          Study Smarter, <br />
          <span className="relative inline-block text-orange-500 italic">
            Together
            {/* Hand-drawn style SVG Underline */}
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8C45.5 2.5 132.5 -1.5 296 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="animate-draw" />
            </svg>
          </span>
        </h1>

        {/* Description with Stacked Typography */}
        <div className="mt-16 flex max-w-xl items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="hidden sm:block h-20 w-[2px] rounded-full bg-gradient-to-b from-orange-500 to-transparent" />
          <p className="text-lg font-medium leading-relaxed text-muted-foreground md:text-xl text-center sm:text-left">
            Ditch the messy folders. AcaDex is the <span className="text-foreground font-bold">unified workspace</span> for note-sharing, real-time collaboration, and organized academic growth.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <Button size="lg" className="h-16 rounded-2xl bg-orange-500 px-10 text-lg font-black shadow-xl shadow-orange-500/20 hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all">
            Enter Dashboard
            <ArrowRight className="ml-2 size-5" />
          </Button>
          
          <Button variant="ghost" size="lg" className="h-16 rounded-2xl px-8 text-lg font-bold border border-transparent hover:border-orange-500/20 hover:bg-orange-500/5 transition-all">
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
          from { stroke-dasharray: 0 300; }
          to { stroke-dasharray: 300 300; }
        }
        .animate-draw {
          stroke-dasharray: 0 300;
          animation: draw 1.5s ease-out forwards;
          animation-delay: 1.2s;
        }
      `}</style>
    </section>
  );
};

export default Banner;