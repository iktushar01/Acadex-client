import React from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  GraduationCap,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./Statusbadge";
import type { Classroom } from "@/types/classroom.types";

interface Meta {
  total: number;
  totalPages: number;
}

interface ClassroomsTableProps {
  classrooms: Classroom[];
  isLoading: boolean;
  emptyMessage?: string;
  hasError?: boolean;
  meta: Meta | undefined;
  page: number;
  onPageChange: (page: number) => void;
  onView: (classroom: Classroom) => void;
  onApprove: (classroom: Classroom) => void;
  onReject: (classroom: Classroom) => void;
}

export const ClassroomsTable = ({
  classrooms,
  isLoading,
  emptyMessage,
  hasError,
  meta,
  page,
  onPageChange,
  onView,
  onApprove,
  onReject,
}: ClassroomsTableProps) => (
  <div className="rounded-2xl border border-border bg-card/30 backdrop-blur-sm overflow-hidden shadow-sm transition-opacity duration-300">
    <Table>
      <TableHeader className="bg-muted/40 text-[10px] font-black uppercase tracking-widest">
        <TableRow className="hover:bg-transparent border-b border-border/50">
          <TableHead className="py-4 pl-6 text-orange-500">Classroom</TableHead>
          <TableHead>Institution</TableHead>
          <TableHead className="hidden md:table-cell">Requested By</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="border-border/40">
              {[...Array(5)].map((__, j) => (
                <TableCell key={j} className="py-5">
                  <div className="h-4 bg-muted/60 rounded animate-pulse w-3/4" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : classrooms.length > 0 ? (
          classrooms.map((cls) => (
            <TableRow
              key={cls.id}
              className="group hover:bg-orange-500/[0.03] border-border/40 transition-colors"
            >
              {/* Classroom name */}
              <TableCell className="py-4 pl-6">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-muted border border-border flex items-center justify-center text-orange-500 shrink-0">
                    <GraduationCap className="size-4" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{cls.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {cls.level} • {cls.joinCode}
                    </p>
                  </div>
                </div>
              </TableCell>

              {/* Institution */}
              <TableCell className="text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="size-3 shrink-0" />
                  <span className="font-medium">{cls.institutionName}</span>
                </div>
                {cls.department && (
                  <p className="text-[10px] mt-0.5 ml-4.5">
                    {cls.department}
                    {cls.className ? ` • ${cls.className}` : ""}
                  </p>
                )}
              </TableCell>

              {/* Requester */}
              <TableCell className="hidden md:table-cell text-xs">
                {cls.creator ? (
                  <div>
                    <p className="font-medium">{cls.creator.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {cls.creator.email}
                    </p>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>

              {/* Status */}
              <TableCell className="text-center">
                <StatusBadge status={cls.status} />
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-lg hover:bg-muted"
                    title="View Details"
                    onClick={() => onView(cls)}
                  >
                    <Eye className="size-3.5" />
                  </Button>

                  {cls.status === "PENDING" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-600"
                      title="Approve"
                      onClick={() => onApprove(cls)}
                    >
                      <ThumbsUp className="size-3.5" />
                    </Button>
                  )}

                  {cls.status === "PENDING" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg hover:bg-red-500/10 hover:text-red-500"
                      title="Reject"
                      onClick={() => onReject(cls)}
                    >
                      <ThumbsDown className="size-3.5" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="py-24 text-center">
              <div className="flex flex-col items-center gap-3 opacity-30">
                <XCircle className="size-10" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                  {emptyMessage || "No classrooms found"}
                </p>
                {hasError && (
                  <p className="text-[9px] text-destructive font-bold uppercase tracking-widest mt-1">
                    Backend Sync Error
                  </p>
                )}
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>

    {/* PAGINATION */}
    {meta && meta.totalPages > 1 && (
      <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground font-medium">
          Showing {Math.min((page - 1) * 10 + 1, meta.total)}–
          {Math.min(page * 10, meta.total)} of {meta.total}
        </p>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex items-center px-3 text-[11px] font-black text-orange-500">
            {page} / {meta.totalPages}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg"
            disabled={page === meta.totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    )}
  </div>
);