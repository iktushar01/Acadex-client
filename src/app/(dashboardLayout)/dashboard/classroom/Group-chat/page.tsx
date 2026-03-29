"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Users, 
  ShieldCheck,
  Lock,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const GroupChatPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background/40 flex flex-col items-center justify-center p-6 md:p-12">
      
      {/* --- Aesthetic Background --- */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-10%] size-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] size-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full space-y-12 text-center"
      >
        {/* --- Back Navigation --- */}
        <div className="flex justify-center">
          <Link href="/dashboard/classroom">
            <Button variant="ghost" className="rounded-2xl gap-2 font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:bg-card border border-transparent hover:border-border/50">
              <ArrowLeft className="size-4" /> Return to Classroom
            </Button>
          </Link>
        </div>

        {/* --- Hero Content --- */}
        <section className="space-y-6">
          <div className="flex justify-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 font-black text-[10px] tracking-[0.3em] uppercase rounded-full shadow-xl shadow-primary/5">
              Protocol: Alpha v1.0
            </Badge>
          </div>
          
          <div className="relative inline-block">
             <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
             <h1 className="relative text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
                Group<span className="text-primary">Chat.</span>
             </h1>
          </div>

          <p className="max-w-xl mx-auto text-muted-foreground font-medium text-lg leading-relaxed">
            We are engineering a high-performance communication layer for Acadex. Real-time collaboration, encrypted by default.
          </p>
        </section>

        {/* --- Coming Soon Grid --- */}
        <div className="grid md:grid-cols-3 gap-4">
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
              className="p-6 rounded-[2rem] bg-card/40 border border-border/50 backdrop-blur-3xl group hover:border-primary/30 transition-all"
            >
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 mx-auto group-hover:scale-110 transition-transform">
                <feature.icon className="size-5" />
              </div>
              <h4 className="font-black text-xs uppercase tracking-widest mb-1">{feature.label}</h4>
              <p className="text-[11px] text-muted-foreground font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* --- Call to Action / Status --- */}
        <div className="pt-8">
           <div className="inline-flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl">
                <Sparkles className="size-4 animate-spin-slow" /> Deploying Soon
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50">
                Est. Deployment: Q2 2026
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GroupChatPage;