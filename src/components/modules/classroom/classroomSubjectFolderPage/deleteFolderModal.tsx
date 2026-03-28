"use client";

import { useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteFolderAction } from "@/actions/classroomSubjectFolder/_crudFolderAction";
// import { deleteFolderAction } from "@/actions/classroomSubjectFolder/_deleteFolderAction";

interface DeleteFolderModalProps {
  folderId: string;
  folderName: string;
  /** Used to revalidate the subject folders page after delete */
  subjectId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteFolderModal({
  folderId,
  folderName,
  subjectId,
  isOpen,
  onClose,
  onSuccess,
}: DeleteFolderModalProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteFolderAction(folderId, subjectId);
        if (result.success) {
          toast.success("Folder deleted successfully");
          onClose();
          if (onSuccess) onSuccess();
        } else {
          toast.error(result.error || "Failed to delete folder");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent className="rounded-[2rem]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-black">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="font-medium text-muted-foreground">
            This will permanently delete the folder 
            <span className="text-orange-500 font-bold mx-1">"{folderName}"</span> 
            and all resources inside it. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel 
            disabled={isPending} 
            className="rounded-xl font-bold"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Prevent automatic close to handle loading
              handleDelete();
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl font-bold"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete Folder
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}