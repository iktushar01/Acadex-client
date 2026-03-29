"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Building2,
  ChevronRight,
  FolderKanban,
  Loader2,
  MessageSquareText,
  UserCog,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL;

const fetchDashboardStats = async (): Promise<DashboardStatsResponse> => {
  if (!API_BASE_URL) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/admins/stats`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload?.message || `Request failed with status ${response.status}`,
    );
  }

  return payload as DashboardStatsResponse;
};

const AdminDashboardHome = () => {
  const statsQuery = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: fetchDashboardStats,
    retry: false,
  });

  const stats = statsQuery.data?.data;

  return (
    <div className="admin-shell min-h-screen space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="admin-panel relative overflow-hidden px-5 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <Badge className="px-3 py-1 text-white" style={{ backgroundColor: "var(--admin-accent-strong)" }}>
              Admin Overview
            </Badge>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Clean command view for approvals, content signals, and platform health.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Classroom management and admin management stay on their own dedicated
              routes. This dashboard now acts as a responsive overview page with live
              stats and fast entry points into those separate workspaces.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <QuickPill label="Role Scope" value={stats?.roleScope ?? "Loading"} />
            <QuickPill
              label="System Feed"
              value={
                statsQuery.isError
                  ? "Stats offline"
                  : statsQuery.isLoading
                    ? "Syncing"
                    : "Live"
              }
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="admin-section-label">Live Platform Stats</p>
            <h2 className="text-2xl font-black tracking-tight">Real backend activity snapshot</h2>
          </div>
          {statsQuery.isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading stats
            </div>
          )}
        </div>

        {statsQuery.isError ? (
          <Card className="admin-panel border-destructive/20 bg-destructive/5">
            <CardContent className="flex flex-col gap-3 pt-6">
              <p className="text-lg font-bold text-destructive">Stats unavailable</p>
              <p className="text-sm text-muted-foreground">
                {statsQuery.error instanceof Error
                  ? statsQuery.error.message
                  : "The dashboard could not reach the backend stats endpoint."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Building2 className="size-5" />}
              label="Classrooms"
              value={stats?.classroomSummary.total ?? 0}
              meta={`${stats?.classroomSummary.pending ?? 0} pending approvals`}
              tone="warm"
            />
            <StatCard
              icon={<BookOpen className="size-5" />}
              label="Notes"
              value={stats?.contentSummary.notes ?? 0}
              meta={`${stats?.contentSummary.approvedNotes ?? 0} approved`}
              tone="emerald"
            />
            <StatCard
              icon={<MessageSquareText className="size-5" />}
              label="Comments"
              value={stats?.contentSummary.comments ?? 0}
              meta={`${stats?.contentSummary.subjects ?? 0} subjects tracked`}
              tone="sky"
            />
            <StatCard
              icon={<UserCog className="size-5" />}
              label="Admin Accounts"
              value={stats?.adminSummary.totalAdminAccounts ?? 0}
              meta={`${stats?.adminSummary.totalSuperAdmins ?? 0} super admins`}
              tone="slate"
            />
          </div>
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="admin-panel">
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="admin-section-label">Approval Queue</p>
                <h3 className="text-xl font-black tracking-tight">Classroom moderation pressure</h3>
              </div>
              <Badge variant="outline">
                {stats?.classroomSummary.pending ?? 0} pending
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MiniMetric
                label="Approved"
                value={stats?.classroomSummary.approved ?? 0}
                className="admin-stat-emerald border-emerald-500/20"
              />
              <MiniMetric
                label="Rejected"
                value={stats?.classroomSummary.rejected ?? 0}
                className="border-rose-500/20 bg-rose-500/5"
              />
              <MiniMetric
                label="Pending Notes"
                value={stats?.contentSummary.pendingNotes ?? 0}
                className="admin-stat-warm border-amber-500/20"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="admin-panel">
          <CardContent className="space-y-5 pt-6">
            <div>
              <p className="admin-section-label">Recent Classrooms</p>
              <h3 className="text-xl font-black tracking-tight">New requests and arrivals</h3>
            </div>

            <div className="space-y-3">
              {(stats?.recentClassrooms ?? []).slice(0, 4).map((classroom) => (
                <div
                  key={classroom.id}
                  className="rounded-2xl border border-border bg-background/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{classroom.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {classroom.institutionName}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        classroom.status === "APPROVED" && "bg-emerald-600 text-white",
                        classroom.status === "PENDING" && "text-white",
                        classroom.status === "REJECTED" && "bg-rose-600 text-white",
                      )}
                      style={
                        classroom.status === "PENDING"
                          ? { backgroundColor: "var(--admin-accent-strong)" }
                          : undefined
                      }
                    >
                      {classroom.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Requested by {classroom.creator.name} on{" "}
                    {new Date(classroom.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}

              {!statsQuery.isLoading && (stats?.recentClassrooms?.length ?? 0) === 0 && (
                <p className="text-sm text-muted-foreground">
                  No recent classroom activity available yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <p className="admin-section-label">Workspaces</p>
          <h2 className="text-2xl font-black tracking-tight">Jump into the right admin route</h2>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <RouteCard
            href="/admin/classrooms-management"
            icon={<FolderKanban className="size-5" />}
            title="Classrooms Management"
            description="Review pending classrooms, approve requests, reject invalid submissions, and monitor classroom intake."
            badgeText={`${stats?.classroomSummary.pending ?? 0} pending`}
          />
          <RouteCard
            href="/admin/admin-management"
            icon={<UserCog className="size-5" />}
            title="Admin Management"
            description="Manage admin accounts on the dedicated route. Super-admin-only actions remain protected by backend RBAC."
            badgeText={`${stats?.adminSummary.totalAdminAccounts ?? 0} accounts`}
          />
        </div>
      </section>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  meta,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  meta: string;
  tone: "warm" | "emerald" | "sky" | "slate";
}) => {
  const toneClassName = {
    warm: "admin-stat-warm border-orange-500/20 text-[color:var(--admin-accent-strong)]",
    emerald: "admin-stat-emerald border-emerald-500/20 text-emerald-600",
    sky: "admin-stat-sky border-sky-500/20 text-sky-600",
    slate: "admin-stat-slate border-slate-500/20 text-slate-600",
  }[tone];

  return (
    <Card className="admin-panel">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-3 text-4xl font-black tracking-tight">{value}</p>
            <p className="mt-2 text-sm text-muted-foreground">{meta}</p>
          </div>
          <div className={cn("rounded-2xl border p-3", toneClassName)}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

const QuickPill = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
    <div className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
      {label}
    </div>
    <p className="mt-2 text-lg font-black tracking-tight">{value}</p>
  </div>
);

const MiniMetric = ({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className?: string;
}) => (
  <div className={cn("rounded-2xl border p-4", className)}>
    <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
      {label}
    </p>
    <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>
  </div>
);

const RouteCard = ({
  href,
  icon,
  title,
  description,
  badgeText,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badgeText: string;
}) => (
  <Link href={href} className="block">
    <Card className="admin-panel h-full transition-transform duration-200 hover:-translate-y-1">
      <CardContent className="flex h-full flex-col gap-5 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div
            className="flex size-12 items-center justify-center rounded-2xl border"
            style={{
              backgroundColor: "var(--admin-accent-soft)",
              color: "var(--admin-accent-strong)",
              borderColor: "color-mix(in oklab, var(--admin-accent-strong) 18%, var(--border))",
            }}
          >
            {icon}
          </div>
          <Badge variant="outline">{badgeText}</Badge>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-tight">{title}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="mt-auto flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--admin-accent-strong)" }}>
          Open route
          <ChevronRight className="size-4" />
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default AdminDashboardHome;
