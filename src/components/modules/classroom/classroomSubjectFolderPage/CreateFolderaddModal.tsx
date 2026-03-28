"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFolderAction } from "@/actions/classroomSubjectFolder/_createFolderAction";

const formSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  subjectId: z.string(),
});

interface CreateFolderModalProps {
  subjectId: string;
  onSuccess?: () => void; // Added to trigger refresh on the parent
}

export function CreateFolderModal({ subjectId, onSuccess }: CreateFolderModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", subjectId }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      const result = await createFolderAction(values);
      if (result.success) {
        toast.success("Folder created!");
        reset();
        setOpen(false);
        if (onSuccess) onSuccess(); // Refresh the list
      } else {
        toast.error(result.error || "Failed to create folder");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl font-bold h-12 px-6 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all active:scale-95">
          <Plus className="mr-2 h-5 w-5" /> Create Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Folder Name</Label>
            <Input 
              id="name" 
              {...register("name")} 
              placeholder="e.g. Midterm Materials" 
              className="rounded-xl"
            />
            {errors.name && <p className="text-red-500 text-xs font-medium">{errors.name.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-orange-500 hover:bg-orange-600 min-w-[100px]"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Folder"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}