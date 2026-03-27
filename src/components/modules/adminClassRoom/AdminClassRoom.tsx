"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import {
  getAllClassroomsAction,
  approveClassroomAction,
  rejectClassroomAction,
} from "@/actions/_getAllClassroomsAction";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { ClassroomsTable } from "./Classroomstable";
import { DetailDialog, ApproveDialog, RejectDialog } from "./Dialogs";
import { Classroom } from "@/types/classroom.types";

// ─── Status filter options ────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
] as const;

// ─── Main Component ───────────────────────────────────────────────────────────

const AdminClassRoom = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Dialog states
  const [detailTarget, setDetailTarget] = useState<Classroom | null>(null);
  const [approveTarget, setApproveTarget] = useState<Classroom | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Classroom | null>(null);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["admin-classrooms", page, searchTerm, statusFilter],
    queryFn: () =>
      getAllClassroomsAction({
        page,
        limit: 10,
        searchTerm: searchTerm || undefined,
        status: (statusFilter as any) || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const classrooms: Classroom[] = (data?.data as Classroom[]) ?? [];
  const meta = data?.meta;

  // ── Approve mutation ───────────────────────────────────────────────────────
  const approveMutation = useMutation({
    mutationFn: (classroomId: string) => approveClassroomAction(classroomId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Classroom approved successfully!");
        queryClient.invalidateQueries({ queryKey: ["admin-classrooms"] });
        setApproveTarget(null);
      } else {
        toast.error(result.message || "Failed to approve classroom.");
      }
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  // ── Reject mutation ────────────────────────────────────────────────────────
  const rejectMutation = useMutation({
    mutationFn: ({
      classroomId,
      reason,
    }: {
      classroomId: string;
      reason: string;
    }) => rejectClassroomAction(classroomId, reason),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Classroom rejected.");
        queryClient.invalidateQueries({ queryKey: ["admin-classrooms"] });
        setRejectTarget(null);
      } else {
        toast.error(result.message || "Failed to reject classroom.");
      }
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  return (
    <>
      <div
        className="p-6 space-y-6 animate-in fade-in duration-500"
        style={{ opacity: isPlaceholderData ? 0.6 : 1 }}
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6 border-border/50">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              Classroom <span className="text-orange-500">Management</span>
            </h1>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1">
              Total:{" "}
              <span className="text-foreground">{meta?.total ?? 0}</span>{" "}
              classrooms
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            {/* Status filter pills */}
            <div className="flex gap-1 flex-wrap">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${statusFilter === opt.value
                      ? "bg-orange-500 text-white"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64 flex items-center">
              {/* Added flex and items-center to the container for better baseline support */}
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70"
              />
              <Input
                placeholder="Search classrooms..."
                className="pl-9 h-10 rounded-full bg-muted/20 border-white/10 text-sm focus-visible:ring-orange-500/50 placeholder:text-muted-foreground/50"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <ClassroomsTable
          classrooms={classrooms}
          isLoading={isLoading}
          emptyMessage={data?.message}
          hasError={data?.success === false}
          meta={meta}
          page={page}
          onPageChange={setPage}
          onView={setDetailTarget}
          onApprove={setApproveTarget}
          onReject={setRejectTarget}
        />
      </div>

      {/* DIALOGS */}
      <DetailDialog
        open={!!detailTarget}
        classroom={detailTarget}
        onClose={() => setDetailTarget(null)}
      />

      <ApproveDialog
        open={!!approveTarget}
        classroom={approveTarget}
        onClose={() => setApproveTarget(null)}
        onConfirm={() =>
          approveTarget && approveMutation.mutate(approveTarget.id)
        }
        isPending={approveMutation.isPending}
      />

      <RejectDialog
        open={!!rejectTarget}
        classroom={rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={(reason) =>
          rejectTarget &&
          rejectMutation.mutate({ classroomId: rejectTarget.id, reason })
        }
        isPending={rejectMutation.isPending}
      />
    </>
  );
};

export default AdminClassRoom;