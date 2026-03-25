"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAction } from "@/app/(commonLayout)/profile/_action";
import {
  Phone, MapPin, Calendar, User, Lock,
  MailCheck, Info, Pencil, Camera, Loader2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await getCurrentUserAction(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const user = data?.data;

  if (isError) {
    return (
      <div className="text-center py-20 font-medium text-red-500">
        Query Error: {error?.message}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 space-y-2">
        <p className="font-medium">User not found or failed to load.</p>
        <p className="text-sm text-muted-foreground">
          {data?.message || "No error message provided"}
        </p>
      </div>
    );
  }

  const infoRows = [
    {
      icon: <Phone className="h-3.5 w-3.5 text-orange-500" />,
      value: user.student?.contactNumber || "Not provided",
      label: "Contact number",
    },
    {
      icon: <MapPin className="h-3.5 w-3.5 text-orange-500" />,
      value: user.student?.address || "Global Citizen",
      label: "Location",
    },
    {
      icon: <Calendar className="h-3.5 w-3.5 text-orange-500" />,
      value: new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      label: "Member since",
    },
    {
      icon: <User className="h-3.5 w-3.5 text-orange-500" />,
      value: user.student?.gender || "Not specified",
      label: "Gender",
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">

        {/* ── HERO BANNER ── */}
        <div className="relative h-44 w-full bg-orange-500 overflow-hidden">
          {/* subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          <p className="absolute bottom-4 left-6 text-[11px] font-medium tracking-[0.12em] uppercase text-white/50">
            Acadex — Student Profile
          </p>
          <button className="absolute top-4 right-4 flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition-colors">
            <Pencil className="h-3 w-3" /> Edit profile
          </button>
        </div>

        {/* ── IDENTITY ROW ── */}
        <div className="flex items-end gap-5 px-6 pb-5 border-b border-border">
          <div className="relative -mt-11 flex-shrink-0">
            <Avatar className="h-[88px] w-[88px] border-[3px] border-background shadow-md">
              <AvatarImage src={user.image} className="object-cover" />
              <AvatarFallback className="bg-orange-500 text-3xl font-medium text-white">
                {user.name?.charAt(0)?.toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0.5 right-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted transition-colors">
              <Camera className="h-3 w-3 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 pt-4">
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <h1 className="text-xl font-medium">{user.name}</h1>
              <span className="inline-flex items-center rounded-full bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 px-2.5 py-0.5 text-[11px] font-medium text-orange-700 dark:text-orange-300">
                {user.role}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 px-2.5 py-0.5 text-[11px] font-medium text-green-700 dark:text-green-300">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Active
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          {[
            { value: "12", label: "Courses enrolled" },
            { value: "87", label: "Notes saved" },
            { value: "4.9", label: "Avg. score" },
          ].map(({ value, label }) => (
            <div key={label} className="py-4 text-center">
              <p className="text-2xl font-medium">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── BODY ── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.7fr] divide-y md:divide-y-0 md:divide-x divide-border">

          {/* LEFT — Account info & verification */}
          <div className="p-5 space-y-6">
            <div>
              <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">
                Account info
              </p>
              <div className="space-y-1">
                {infoRows.map(({ icon, value, label }) => (
                  <div key={label} className="flex items-center gap-3 py-2 border-b border-border last:border-none">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950 flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight">{value}</p>
                      <p className="text-[11px] text-muted-foreground">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">
                Verification
              </p>
              <div className="space-y-1">
                <div className="flex items-center gap-3 py-2 border-b border-border">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950 flex-shrink-0">
                    <MailCheck className="h-3.5 w-3.5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">
                      {user.emailVerified ? "Email verified" : "Email unverified"}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950 flex-shrink-0">
                    <Lock className="h-3.5 w-3.5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">Account secured</p>
                    <p className="text-[11px] text-muted-foreground">2FA not enabled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Details, activity, notice */}
          <div className="p-5 space-y-6">
            <div>
              <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">
                Personal details
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Full name", value: user.name },
                  { label: "Role", value: `Full-time ${user.role.toLowerCase()}` },
                  { label: "Institute", value: "Acadex Academy" },
                  { label: "Account status", value: user.status, green: user.status === "ACTIVE" },
                ].map(({ label, value, green }) => (
                  <div key={label} className="rounded-xl bg-muted/40 px-3.5 py-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.08em] mb-1">{label}</p>
                    <p className={`text-sm font-medium ${green ? "text-green-600 dark:text-green-400" : ""}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3">
                Recent activity
              </p>
              <div className="space-y-0">
                {[
                  { name: "Data Structures", time: "2 hours ago", pct: 72, active: true },
                  { name: "Algorithms 101", time: "Yesterday", pct: 45, active: false },
                  { name: "Web Dev Bootcamp", time: "3 days ago", pct: 91, active: false },
                ].map(({ name, time, pct, active }) => (
                  <div key={name} className="flex items-center justify-between py-2.5 border-b border-border last:border-none">
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2 w-2 rounded-full flex-shrink-0 ${active ? "bg-orange-500" : "bg-border"}`} />
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-[11px] text-muted-foreground">{time}</p>
                      </div>
                    </div>
                    <div className="w-20 h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice bar */}
            <div className="flex items-center gap-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900 px-3.5 py-2.5">
              <Info className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
              <p className="text-xs text-orange-700 dark:text-orange-300">
                You&apos;re an active member of the{" "}
                <strong className="font-semibold">Acadex Student Community</strong>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;