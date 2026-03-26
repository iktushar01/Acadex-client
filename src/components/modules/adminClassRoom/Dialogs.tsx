import React, { useState } from "react";
import { AlertTriangle, CheckCircle, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Classroom } from "@/types/classroom.types";

// ─── Reject Dialog ────────────────────────────────────────────────────────────

interface RejectDialogProps {
  open: boolean;
  classroom: Classroom | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending: boolean;
}

export const RejectDialog = ({
  open,
  classroom,
  onClose,
  onConfirm,
  isPending,
}: RejectDialogProps) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (reason.trim().length < 10) return;
    onConfirm(reason.trim());
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            Reject Classroom Request
          </DialogTitle>
          <DialogDescription>
            You are rejecting{" "}
            <span className="font-semibold text-foreground">
              {classroom?.name}
            </span>{" "}
            from{" "}
            <span className="font-semibold text-foreground">
              {classroom?.institutionName}
            </span>
            . Please provide a reason (min 10 characters).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Textarea
            placeholder="e.g. Duplicate classroom already exists for this department. Please verify and resubmit."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-[11px] text-muted-foreground text-right">
            {reason.length}/500 chars (min 10)
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending || reason.trim().length < 10}
          >
            {isPending ? "Rejecting..." : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Approve Dialog ───────────────────────────────────────────────────────────

interface ApproveDialogProps {
  open: boolean;
  classroom: Classroom | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export const ApproveDialog = ({
  open,
  classroom,
  onClose,
  onConfirm,
  isPending,
}: ApproveDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-emerald-600">
          <CheckCircle className="size-5" />
          Approve Classroom Request
        </DialogTitle>
        <DialogDescription>
          You are approving{" "}
          <span className="font-semibold text-foreground">
            {classroom?.name}
          </span>{" "}
          from{" "}
          <span className="font-semibold text-foreground">
            {classroom?.institutionName}
          </span>
          . The requesting student will automatically become CR of this
          classroom.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="gap-2">
        <Button variant="ghost" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ? "Approving..." : "Confirm Approval"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// ─── Detail Dialog ────────────────────────────────────────────────────────────

interface DetailDialogProps {
  open: boolean;
  classroom: Classroom | null;
  onClose: () => void;
}

export const DetailDialog = ({ open, classroom, onClose }: DetailDialogProps) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <GraduationCap className="size-5 text-orange-500" />
          {classroom?.name}
        </DialogTitle>
        <DialogDescription>{classroom?.institutionName}</DialogDescription>
      </DialogHeader>

      {classroom && (
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Level", value: classroom.level },
              { label: "Status", value: classroom.status },
              { label: "Class", value: classroom.className || "—" },
              { label: "Department", value: classroom.department || "—" },
              { label: "Group", value: classroom.groupName || "—" },
              { label: "Join Code", value: classroom.joinCode },
            ].map(({ label, value }) => (
              <div key={label} className="bg-muted/50 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                  {label}
                </p>
                <p className="font-semibold">{value}</p>
              </div>
            ))}
          </div>

          {classroom.description && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                Description
              </p>
              <p>{classroom.description}</p>
            </div>
          )}

          {classroom.creator && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                Requested By
              </p>
              <p className="font-semibold">{classroom.creator.name}</p>
              <p className="text-muted-foreground text-xs">
                {classroom.creator.email}
              </p>
            </div>
          )}

          {classroom.rejectionReason && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-[10px] text-destructive font-semibold uppercase tracking-wider mb-1">
                Rejection Reason
              </p>
              <p className="text-destructive">{classroom.rejectionReason}</p>
            </div>
          )}
        </div>
      )}

      <DialogFooter>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);