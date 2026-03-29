"use client";

import React, { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Building2,
  ChevronRight,
  FolderKanban,
  Loader2,
  MessageSquareText,
  UserCog,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  TrendingUp,
  Database,
  Fingerprint,
  Terminal,
  Server
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// --- Types & API Logic ---

type DashboardStatsResponse = {
  success: boolean;
  message: string;
  data: {
    roleScope: "ADMIN" | "SUPER_ADMIN";
    adminSummary: {
      totalAdmins: number;
      totalSuperAdmins: number;
      totalAdminAccounts: number;
    };
    classroomSummary: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
    };
    contentSummary: {
      subjects: number;
      notes: number;
      approvedNotes: number;
      pendingNotes: number;
      rejectedNotes: number;
      comments: number;
    };
    recentClassrooms: Array<{
      id: string;
      name: string;
      institutionName: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
      createdAt: string;
      creator: {
        id: string;
        name: string;
        email: string;
      };
    }>;
  };
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

const fetchDashboardStats = async (): Promise<DashboardStatsResponse> => {
  if (!API_BASE_URL) throw new Error("API base URL is not configured.");
  const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/admins/stats`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.message || `Request failed with status ${response.status}`);
  return payload as DashboardStatsResponse;
};

// --- Advanced UI Sub-Components ---

/**
 * A real-time clock to enhance the "Command Center" feel.
 */
const SystemClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 font-mono text-xs font-bold tracking-widest opacity-60">
      <Clock className="size-3" />
      {time.toLocaleTimeString([], { hour12: false })}
    </div>
  );
};

const SectionHeader = ({ label, title, description, icon: Icon }: any) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="size-4" style={{ color: "var(--admin-accent-strong)" }} />}
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/70">
        {label}
      </span>
    </div>
    <h2 className="text-2xl font-black tracking-tighter sm:text-3xl">{title}</h2>
    {description && <p className="text-xs font-medium text-muted-foreground/60">{description}</p>}
  </div>
);

const QuickPill = ({ label, value, icon: Icon, isLive }: any) => (
  <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/50 p-4 backdrop-blur-md">
    <div 
      className="flex size-10 items-center justify-center rounded-xl border"
      style={{ 
        backgroundColor: "var(--admin-accent-soft)", 
        color: "var(--admin-accent-strong)",
        borderColor: "color-mix(in oklab, var(--admin-accent-strong) 20%, transparent)"
      }}
    >
      <Icon className={cn("size-5", isLive && "animate-pulse")} />
    </div>
    <div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">{label}</p>
      <p className="text-sm font-black tracking-tight">{value}</p>
    </div>
  </div>
);

const AdminDashboardHome = () => {
  const statsQuery = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: fetchDashboardStats,
    retry: false,
  });

  const stats = statsQuery.data?.data;

  const moderationPressure = useMemo(() => {
    if (!stats) return 0;
    const total = stats.classroomSummary.total || 1;
    const pending = stats.classroomSummary.pending;
    return Math.round((pending / total) * 100);
  }, [stats]);

  return (
    <div className="admin-shell relative min-h-screen space-y-8 p-4 sm:p-8 lg:p-10">
      
      {/* --- LAYER 1: COMMAND HERO --- */}
      <section className="admin-panel relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/30 p-8 md:p-12 backdrop-blur-2xl">
        {/* Decorative elements using global accent */}
        <div 
          className="absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[120px] opacity-10" 
          style={{ backgroundColor: "var(--admin-accent-strong)" }}
        />
        
        <div className="relative z-10 flex flex-col gap-10 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="flex items-center gap-4">
              <Badge 
                className="rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white"
                style={{ backgroundColor: "var(--admin-accent-strong)" }}
              >
                <Terminal className="mr-2 size-3" /> Core Terminal
              </Badge>
              <SystemClock />
            </div>

            <h1 className="text-4xl font-black tracking-tighter sm:text-5xl lg:text-6xl">
              System <span style={{ color: "var(--admin-accent-strong)" }}>Intelligence.</span>
            </h1>
            
            <p className="max-w-xl text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
              Unified command interface for educational asset management. Reviewing 
              incoming signals from <span className="text-foreground font-bold">{stats?.classroomSummary.total ?? 0}</span> nodes.
            </p>

            <div className="flex flex-wrap gap-2">
                {["Classroom Ingress", "Auth Scaling", "Asset Moderation"].map((tag) => (
                  <span key={tag} className="rounded-md border border-border/40 bg-background/40 px-2 py-1 text-[10px] font-bold text-muted-foreground/80">
                    {tag}
                  </span>
                ))}
            </div>
          </div>

          <div className="grid shrink-0 gap-4 sm:grid-cols-2">
            <QuickPill label="Auth Scope" value={stats?.roleScope ?? "VERIFYING"} icon={Fingerprint} />
            <QuickPill label="API Feed" value={statsQuery.isLoading ? "SYNCING" : "ACTIVE"} icon={Activity} isLive={!statsQuery.isLoading} />
          </div>
        </div>
      </section>

      {/* --- LAYER 2: BENTO METRICS --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Classrooms"
          value={stats?.classroomSummary.total ?? 0}
          meta={`${stats?.classroomSummary.pending ?? 0} awaiting review`}
          icon={Building2}
          loading={statsQuery.isLoading}
        />
        <MetricCard
          label="Note Assets"
          value={stats?.contentSummary.notes ?? 0}
          meta={`${stats?.contentSummary.approvedNotes ?? 0} currently public`}
          icon={BookOpen}
          loading={statsQuery.isLoading}
        />
        <MetricCard
          label="System Signals"
          value={stats?.contentSummary.comments ?? 0}
          meta="User feedback interactions"
          icon={MessageSquareText}
          loading={statsQuery.isLoading}
        />
        <MetricCard
          label="Administrator"
          value={stats?.adminSummary.totalAdminAccounts ?? 0}
          meta={`${stats?.adminSummary.totalSuperAdmins ?? 0} root users`}
          icon={UserCog}
          loading={statsQuery.isLoading}
        />
      </div>

      {/* --- LAYER 3: DEEP ANALYSIS --- */}
      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        
        {/* Moderation Engine */}
        <Card className="admin-panel rounded-[2rem] border-border/40 bg-card/20 p-8 shadow-2xl">
          <div className="mb-10 flex items-start justify-between">
            <SectionHeader 
              label="Pipeline Pulse" 
              title="Moderation Pressure" 
              description="Real-time analysis of pending requests vs platform capacity."
            />
            <div 
              className="flex size-14 items-center justify-center rounded-2xl"
              style={{ backgroundColor: "var(--admin-accent-soft)", color: "var(--admin-accent-strong)" }}
            >
              <Zap className="size-7" />
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-4">
               <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span>In-Process Load</span>
                  <span style={{ color: "var(--admin-accent-strong)" }}>{moderationPressure}%</span>
               </div>
               <div className="h-3 w-full overflow-hidden rounded-full bg-border/20">
                  <div 
                    className="h-full transition-all duration-1000" 
                    style={{ 
                      width: `${moderationPressure}%`, 
                      backgroundColor: "var(--admin-accent-strong)",
                      boxShadow: `0 0 20px var(--admin-accent-strong)`
                    }} 
                  />
               </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <AdvancedStatusBox label="Approved" value={stats?.classroomSummary.approved ?? 0} type="success" />
              <AdvancedStatusBox label="Rejected" value={stats?.classroomSummary.rejected ?? 0} type="danger" />
              <AdvancedStatusBox label="Pending Notes" value={stats?.contentSummary.pendingNotes ?? 0} type="warning" />
            </div>
          </div>
        </Card>

        {/* Workspace Hub */}
        <div className="flex flex-col gap-6">
          <SectionHeader label="Endpoints" title="Workspaces" icon={Server} />
          
          <RouteTerminal 
            title="Moderation Hub" 
            desc="Control classroom ingress"
            href="/admin/classrooms-management"
            icon={FolderKanban}
            count={stats?.classroomSummary.pending ?? 0}
          />
          
          <RouteTerminal 
            title="IAM Service" 
            desc="Identity & Access Management"
            href="/admin/admin-management"
            icon={UserCog}
            count={stats?.adminSummary.totalAdminAccounts ?? 0}
          />

          <div className="mt-auto rounded-2xl border border-dashed border-border/60 p-6">
             <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground/60">
                <ShieldCheck className="size-4" />
                <span>RBAC Policy active. Your session is encrypted.</span>
             </div>
          </div>
        </div>
      </div>

      {/* --- LAYER 4: INGRESS LOG --- */}
      <section className="space-y-6">
        <SectionHeader label="Chronicle" title="Latest Activity Ingress" />
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(stats?.recentClassrooms ?? []).slice(0, 4).map((item) => (
            <div 
              key={item.id} 
              className="group relative rounded-3xl border border-border/40 bg-card/40 p-6 transition-all hover:border-border active:scale-[0.98]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div 
                  className="flex size-10 items-center justify-center rounded-xl font-black text-white"
                  style={{ backgroundColor: "var(--admin-accent-strong)" }}
                >
                  {item.name.charAt(0)}
                </div>
                <Badge variant="outline" className={cn(
                  "rounded-md text-[9px] font-black uppercase tracking-tighter",
                  item.status === "APPROVED" && "border-emerald-500/50 text-emerald-500 bg-emerald-500/5",
                  item.status === "PENDING" && "border-primary/50 text-primary bg-primary/5",
                  item.status === "REJECTED" && "border-rose-500/50 text-rose-500 bg-rose-500/5",
                )}>
                  {item.status}
                </Badge>
              </div>
              <h4 className="font-black tracking-tight line-clamp-1">{item.name}</h4>
              <p className="text-[10px] font-medium text-muted-foreground truncate mb-4">{item.institutionName}</p>
              
              <div className="flex items-center justify-between border-t border-border/30 pt-4">
                 <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest">
                   {new Date(item.createdAt).toLocaleDateString()}
                 </span>
                 <Link href={`/admin/classrooms-management?id=${item.id}`}>
                    <ArrowUpRight className="size-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: "var(--admin-accent-strong)" }} />
                 </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- Atomic Terminal Components ---

const MetricCard = ({ label, value, meta, icon: Icon, loading }: any) => (
  <Card className="admin-panel group relative overflow-hidden rounded-[2rem] border-border/40 bg-card/20 p-7 transition-all hover:-translate-y-1 hover:border-border">
    <div className="relative z-10 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div 
          className="flex size-12 items-center justify-center rounded-2xl border"
          style={{ 
            backgroundColor: "var(--admin-accent-soft)", 
            color: "var(--admin-accent-strong)",
            borderColor: "color-mix(in oklab, var(--admin-accent-strong) 20%, transparent)"
          }}
        >
          <Icon className="size-6 transition-transform group-hover:scale-110" />
        </div>
        <TrendingUp className="size-4 opacity-20" />
      </div>
      
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{label}</p>
        <h3 className="text-4xl font-black tracking-tighter">
          {loading ? <Loader2 className="size-6 animate-spin" /> : value}
        </h3>
        <p className="text-[11px] font-medium text-muted-foreground/50">{meta}</p>
      </div>
    </div>
  </Card>
);

const AdvancedStatusBox = ({ label, value, type }: any) => {
  const styles = {
    success: "text-emerald-500 bg-emerald-500/5 border-emerald-500/20",
    danger: "text-rose-500 bg-rose-500/5 border-rose-500/20",
    warning: "text-orange-500 bg-orange-500/5 border-orange-500/20",
  };

  return (
    <div className={cn("rounded-2xl border p-5 shadow-inner", styles[type as keyof typeof styles])}>
      <div className="mb-2 flex items-center gap-2">
         <div className="size-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
         <span className="text-[9px] font-black uppercase tracking-widest opacity-70">{label}</span>
      </div>
      <p className="text-3xl font-black tracking-tighter">{value}</p>
    </div>
  );
};

const RouteTerminal = ({ title, desc, icon: Icon, href, count }: any) => (
  <Link href={href} className="group block">
    <div className="flex items-center justify-between rounded-3xl border border-border/40 bg-background/50 p-6 transition-all hover:bg-card">
      <div className="flex items-center gap-5">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border/60 bg-background transition-all group-hover:scale-110 group-hover:border-primary/50">
          <Icon className="size-6 text-muted-foreground group-hover:text-primary" />
        </div>
        <div>
          <h4 className="font-black tracking-tight leading-none text-foreground">{title}</h4>
          <p className="mt-1 text-xs font-medium text-muted-foreground/60">{desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
           <p className="text-[9px] font-black uppercase tracking-widest opacity-30">Registry</p>
           <p className="text-xl font-black leading-none">{count}</p>
        </div>
        <ChevronRight className="size-5 transition-transform group-hover:translate-x-1" style={{ color: "var(--admin-accent-strong)" }} />
      </div>
    </div>
  </Link>
);

export default AdminDashboardHome;