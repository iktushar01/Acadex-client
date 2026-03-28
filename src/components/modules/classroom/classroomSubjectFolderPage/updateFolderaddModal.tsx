"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateFolderAction } from "@/actions/classroomSubjectFolder/_crudFolderAction";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Folder name must be at least 2 characters")
    .max(100, "Folder name must be at most 100 characters"),
  folderId: z.string().min(1, "Folder ID is required"),
});

interface UpdateFolderModalProps {
  folder?: { id: string; name: string } | null;
  folderId?: string;
  subjectId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function UpdateFolderModal({ 
    folder, 
    folderId,
    subjectId,
    isOpen, 
    onClose, 
    onSuccess 
}: UpdateFolderModalProps) {
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { 
        name: folder?.name || "", 
        folderId: folder?.id || folderId || "" 
    }
  });

  // Reset form values when the folder prop changes
  useEffect(() => {
    if (folder) {
      reset({ name: folder.name, folderId: folder.id });
    } else if (folderId) {
        reset({ name: "", folderId: folderId });
    }
  }, [folder, folderId, reset]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      // Logic: call your update action here
      const result = await updateFolderAction({ name: values.name, folderId: values.folderId }); 
      
      if (result.success) {
        toast.success("Folder updated!");
        onClose?.();
        if (onSuccess) onSuccess();
      } else {
        toast.error(result.error || "Failed to update");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Folder Name</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Folder Name</Label>
            <Input 
              id="edit-name" 
              {...register("name")} 
              className="rounded-xl"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="bg-orange-500 hover:bg-orange-600 min-w-[100px]">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Folder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}