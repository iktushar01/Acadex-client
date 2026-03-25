"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAction } from "@/app/(commonLayout)/profile/_action";
import {
  Phone, MapPin, Calendar, User, Lock,
  MailCheck, Info, Pencil, Camera, Loader2,
  CheckCircle2, ShieldCheck, Zap, Copy
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await getCurrentUserAction(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="text-xs font-black tracking-[0.2em] text-muted-foreground animate-pulse uppercase">
          Syncing Profile...
        </p>
      </div>
    );
  }

  const user = data?.data;

  if (isError || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl border border-destructive/20 bg-destructive/5">
          <Info className="h-10 w-10 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold italic tracking-tight">Access Error</h2>
          <p className="text-sm text-muted-foreground">{error?.message || "User data is currently unreachable."}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="rounded-xl border-red-200 hover:bg-red-50">
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  const infoRows = [
    { icon: <Phone className="h-3.5 w-3.5 text-orange-500" />, value: user.student?.contactNumber || "Not provided", label: "Registry Contact" },
    { icon: <MapPin className="h-3.5 w-3.5 text-orange-500" />, value: user.student?.address || "Remote Location", label: "Base Location" },
    { icon: <Calendar className="h-3.5 w-3.5 text-orange-500" />, value: new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }), label: "Enrollment Date" },
    { icon: <User className="h-3.5 w-3.5 text-orange-500" />, value: user.student?.gender || "Not specified", label: "Gender Identity" },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="rounded-[2rem] border border-border bg-card overflow-hidden shadow-2xl shadow-orange-500/5">

        {/* ── HERO BANNER ── */}
        <div className="relative h-52 w-full bg-orange-500 overflow-hidden">
          {/* technical grid overlay */}
          <div className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          <div className="absolute bottom-6 left-8 flex flex-col gap-1">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/70">
              ACADEX — CORE SYSTEMS
            </p>
            <div className="h-1 w-16 bg-white/40 rounded-full" />
          </div>

          <button className="absolute top-6 right-8 flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/20 transition-all">
            <Pencil className="h-3.5 w-3.5" /> Edit Registry
          </button>
        </div>

        {/* ── IDENTITY ROW ── */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 px-8 pb-8 border-b border-border bg-card/50">
          <div className="relative -mt-16 flex-shrink-0">
            <Avatar className="h-32 w-32 border-[6px] border-background shadow-2xl transition-transform hover:scale-105 duration-500">
              <AvatarImage src={user.image} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-4xl font-black text-white">
                {user.name?.charAt(0)?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-2xl border-2 border-background bg-orange-500 text-white shadow-lg hover:scale-110 transition-all">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left pt-4">
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap mb-2">
              <h1 className="text-3xl font-black tracking-tight">{user.name}</h1>
              <div className="flex gap-2">
                <span className="rounded-xl bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-orange-600">
                  {user.role}
                </span>
                <span className="flex items-center gap-1.5 rounded-xl bg-green-500/10 border border-green-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-tighter text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active Status
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
              {user.email} <Copy className="size-3 cursor-pointer hover:text-orange-500 transition-colors" />
            </p>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-muted/20">
          {[
            { value: "12", label: "Active Courses", icon: <Zap className="size-3 text-orange-500" /> },
            { value: "87", label: "Saved Assets", icon: <Zap className="size-3 text-orange-500" /> },
            { value: "4.9", label: "Quality Score", icon: <Zap className="size-3 text-orange-500" /> },
          ].map(({ value, label, icon }) => (
            <div key={label} className="py-6 flex flex-col items-center justify-center hover:bg-card transition-colors group">
              <p className="text-3xl font-black tracking-tighter group-hover:scale-110 transition-transform">{value}</p>
              <div className="flex items-center gap-1.5 mt-1">
                {icon}
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── BODY ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] divide-y md:divide-y-0 md:divide-x divide-border">

          {/* LEFT — Profile Breakdown */}
          <div className="p-8 space-y-8">
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600 mb-6 flex items-center gap-2">
                <User className="size-3" /> Core Dossier
              </h3>
              <div className="space-y-5">
                {infoRows.map(({ icon, value, label }) => (
                  <div key={label} className="flex items-center gap-4 group cursor-default">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted group-hover:bg-orange-500/10 transition-colors flex-shrink-0 border border-transparent group-hover:border-orange-500/20">
                      {icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 leading-none mb-1.5">{label}</p>
                      <p className="text-sm font-bold tracking-tight">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="pt-8 border-t border-border">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600 mb-6 flex items-center gap-2">
                <ShieldCheck className="size-3" /> Integrity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border">
                  <div className="flex items-center gap-3">
                    <MailCheck className="size-4 text-green-500" />
                    <span className="text-xs font-black uppercase tracking-tighter">Email Verification</span>
                  </div>
                  <CheckCircle2 className="size-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 border border-border group opacity-60">
                  <div className="flex items-center gap-3">
                    <Lock className="size-4 text-orange-500" />
                    <span className="text-xs font-black uppercase tracking-tighter">2FA Security</span>
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground">INACTIVE</span>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT — Activity Logs */}
          <div className="p-8 space-y-8 bg-muted/5">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600">Learning Momentum</h3>
                <span className="text-[10px] font-bold text-muted-foreground">LIVE LOGS</span>
              </div>
              <div className="grid gap-4">
                {[
                  { name: "Advanced Data Structures", time: "02h 15m ago", pct: 72, color: "bg-orange-500" },
                  { name: "System Design Fundamentals", time: "24h ago", pct: 45, color: "bg-orange-500/60" },
                  { name: "Modern React Patterns", time: "3 days ago", pct: 91, color: "bg-orange-500" },
                ].map(({ name, time, pct, color }) => (
                  <div key={name} className="p-5 rounded-3xl bg-card border border-border shadow-sm hover:border-orange-500/30 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-black tracking-tight group-hover:text-orange-600 transition-colors">{name}</p>
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">{time}</p>
                      </div>
                      <span className="text-xs font-black tracking-tighter bg-muted px-2 py-1 rounded-lg">{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Notice card */}
            <div className="relative group overflow-hidden rounded-[2rem] bg-orange-600 p-6 text-white shadow-xl shadow-orange-600/20">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform duration-500">
                <Zap className="size-16" />
              </div>
              <div className="relative z-10 flex items-center gap-5">
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                  <Info className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Community Clearance</p>
                  <p className="text-sm font-bold leading-tight mt-1">
                    Verified Member of <br/>
                    <span className="italic">Acadex Engineering Society</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;