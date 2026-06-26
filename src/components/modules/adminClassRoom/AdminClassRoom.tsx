"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import {
  getAllClassroomsAction,
  approveClassroomAction,
  rejectClassroomAction,
  updateClassroomStatusAction,
  deleteClassroomAction,
} from "@/actions/_getAllClassroomsAction";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { ClassroomsTable } from "./Classroomstable";
import {
  DetailDialog,
  ApproveDialog,
  RejectDialog,
  DeleteDialog,
  StatusDialog,
} from "./Dialogs";
import { Classroom } from "@/types/classroom.types";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "APPROVED", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "BANNED", label: "Banned" },
  { value: "PENDING", label: "Pending" },
  { value: "REJECTED", label: "Rejected" },
] as const;

type StatusAction = "INACTIVE" | "BANNED" | "APPROVED";

const AdminClassRoom = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const [detailTarget, setDetailTarget] = useState<Classroom | null>(null);
  const [approveTarget, setApproveTarget] = useState<Classroom | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Classroom | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Classroom | null>(null);
  const [statusTarget, setStatusTarget] = useState<{
    classroom: Classroom;
    status: StatusAction;
  } | null>(null);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ["admin-classrooms", page, searchTerm, statusFilter],
    queryFn: () =>
      getAllClassroomsAction({
        page,
        limit: 10,
        searchTerm: searchTerm || undefined,
        status:
          (statusFilter as
            | "PENDING"
            | "APPROVED"
            | "REJECTED"
            | "INACTIVE"
            | "BANNED"
            | "") || undefined,
      }),
    placeholderData: (prev) => prev,
  });

  const classrooms: Classroom[] = (data?.data as Classroom[]) ?? [];
  const meta = data?.meta;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-classrooms"] });
    queryClient.invalidateQueries({ queryKey: ["admin-dashboard-stats"] });
  };

  const approveMutation = useMutation({
    mutationFn: (classroomId: string) => approveClassroomAction(classroomId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Classroom approved successfully!");
        invalidate();
        setApproveTarget(null);
      } else {
        toast.error(result.message || "Failed to approve classroom.");
      }
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

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
        invalidate();
        setRejectTarget(null);
      } else {
        toast.error(result.message || "Failed to reject classroom.");
      }
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const statusMutation = useMutation({
    mutationFn: ({
      classroomId,
      status,
      reason,
    }: {
      classroomId: string;
      status: StatusAction;
      reason?: string;
    }) => updateClassroomStatusAction(classroomId, status, reason),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Classroom status updated.");
        invalidate();
        setStatusTarget(null);
      } else {
        toast.error(result.message || "Failed to update classroom.");
      }
    },
    onError: () => toast.error("Something went wrong. Please try again."),
  });

  const deleteMutation = useMutation({
    mutationFn: (classroomId: string) => deleteClassroomAction(classroomId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Classroom deleted.");
        invalidate();
        setDeleteTarget(null);
      } else {
        toast.error(result.message || "Failed to delete classroom.");
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

          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="flex gap-1 flex-wrap">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    statusFilter === opt.value
                      ? "bg-orange-500 text-white"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64 flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
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
          onDeactivate={(classroom) =>
            setStatusTarget({ classroom, status: "INACTIVE" })
          }
          onBan={(classroom) =>
            setStatusTarget({ classroom, status: "BANNED" })
          }
          onRestore={(classroom) =>
            setStatusTarget({ classroom, status: "APPROVED" })
          }
          onDelete={setDeleteTarget}
        />
      </div>

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

      <StatusDialog
        open={!!statusTarget}
        classroom={statusTarget?.classroom ?? null}
        status={statusTarget?.status ?? "INACTIVE"}
        onClose={() => setStatusTarget(null)}
        onConfirm={(reason) =>
          statusTarget &&
          statusMutation.mutate({
            classroomId: statusTarget.classroom.id,
            status: statusTarget.status,
            reason,
          })
        }
        isPending={statusMutation.isPending}
      />

      <DeleteDialog
        open={!!deleteTarget}
        classroom={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate(deleteTarget.id)
        }
        isPending={deleteMutation.isPending}
      />
    </>
  );
};

export default AdminClassRoom;
