"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Lock,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const GroupChatPage = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background/40 px-4 py-8 sm:px-6 md:p-12">
      
      {/* --- Aesthetic Background --- */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute right-[-25%] top-[-10%] size-[280px] rounded-full bg-primary/10 blur-[100px] animate-pulse sm:right-[-10%] sm:size-[500px] sm:blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-25%] size-[280px] rounded-full bg-blue-500/10 blur-[100px] sm:left-[-10%] sm:size-[500px] sm:blur-[120px]" />
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-8 text-center sm:space-y-10 md:space-y-12"
      >
        {/* --- Back Navigation --- */}
        <div className="flex justify-center sm:justify-start">
          <Link href="/dashboard/classroom">
            <Button variant="ghost" className="h-auto whitespace-normal rounded-2xl border border-transparent px-4 py-3 text-center font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:bg-card hover:border-border/50 sm:text-left">
              <ArrowLeft className="size-4" /> Return to Classroom
            </Button>
          </Link>
        </div>

        {/* --- Hero Content --- */}
        <section className="space-y-5 sm:space-y-6">
          <div className="flex justify-center">
            <Badge className="max-w-full whitespace-normal rounded-full border-primary/20 bg-primary/10 px-4 py-1.5 text-center font-black text-[10px] uppercase tracking-[0.25em] text-primary shadow-xl shadow-primary/5 sm:tracking-[0.3em]">
              Protocol: Alpha v1.0
            </Badge>
          </div>
          
          <div className="relative inline-block max-w-full">
             <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
             <h1 className="relative break-words text-4xl font-black leading-none tracking-tighter italic uppercase sm:text-6xl md:text-7xl lg:text-8xl">
                Group<span className="text-primary">Chat.</span>
             </h1>
          </div>

          <p className="mx-auto max-w-xl px-1 text-sm font-medium leading-relaxed text-muted-foreground sm:text-base md:text-lg">
            We are engineering a high-performance communication layer for Acadex. Real-time collaboration, encrypted by default.
          </p>
        </section>

        {/* --- Coming Soon Grid --- */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Zap, label: "Low Latency", desc: "Sub-50ms message delivery" },
            { icon: Lock, label: "Secure", desc: "End-to-end encrypted rooms" },
            { icon: Globe, label: "Shared Hub", desc: "Note-integrated discussions" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-[1.75rem] border border-border/50 bg-card/40 p-5 backdrop-blur-3xl transition-all hover:border-primary/30 sm:p-6"
            >
              <div className="mx-auto mb-4 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                <feature.icon className="size-5" />
              </div>
              <h4 className="mb-1 text-xs font-black uppercase tracking-widest">{feature.label}</h4>
              <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* --- Call to Action / Status --- */}
        <div className="pt-4 sm:pt-8">
           <div className="inline-flex max-w-full flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-center text-[11px] font-black uppercase tracking-[0.15em] text-background shadow-2xl sm:px-6 sm:tracking-[0.2em]">
                <Sparkles className="size-4 animate-spin-slow" /> Deploying Soon
              </div>
              <p className="text-center text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-50 sm:tracking-[0.4em]">
                Est. Deployment: Q2 2026
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GroupChatPage;
