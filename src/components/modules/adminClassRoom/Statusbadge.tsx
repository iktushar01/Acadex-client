import React from "react";
import {
  Ban,
  CheckCircle,
  Clock,
  PauseCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<
    string,
    { className: string; icon: React.ReactNode; label: string }
  > = {
    PENDING: {
      className: "bg-amber-500/10 text-amber-600 border-amber-500/30",
      icon: <Clock className="size-3" />,
      label: "Pending",
    },
    APPROVED: {
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
      icon: <CheckCircle className="size-3" />,
      label: "Active",
    },
    REJECTED: {
      className: "bg-red-500/10 text-red-500 border-red-500/30",
      icon: <XCircle className="size-3" />,
      label: "Rejected",
    },
    INACTIVE: {
      className: "bg-slate-500/10 text-slate-600 border-slate-500/30",
      icon: <PauseCircle className="size-3" />,
      label: "Inactive",
    },
    BANNED: {
      className: "bg-rose-500/10 text-rose-600 border-rose-500/30",
      icon: <Ban className="size-3" />,
      label: "Banned",
    },
  };

  const c = config[status] ?? config.PENDING;

  return (
    <Badge
      className={`inline-flex items-center gap-1 rounded-lg text-[10px] font-bold px-2 py-1 border ${c.className}`}
    >
      {c.icon}
      {c.label}
    </Badge>
  );
};
