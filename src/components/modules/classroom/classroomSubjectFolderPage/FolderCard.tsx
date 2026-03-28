"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderIcon, MoreVertical, FileText, Pencil, Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UpdateFolderModal } from "./updateFolderaddModal";
import { DeleteFolderModal } from "./deleteFolderModal";

interface FolderCardProps {
  folder: { id: string; name: string; _count?: { notes: number } };
  subjectId: string;
  isCR: boolean | undefined;
}

export const FolderCard = ({ folder, subjectId, isCR }: FolderCardProps) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Card className="group relative overflow-hidden rounded-[2rem] p-6 bg-card/40 hover:bg-card/60 transition-all duration-500 border-border hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1">
        {/* Advanced Decorative Glow */}
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-orange-500/5 blur-2xl group-hover:bg-orange-500/10 transition-colors" />
        
        <div className="relative z-20">
          <div className="flex justify-between items-start mb-6">
            <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-inner">
              <FolderIcon className="h-7 w-7 fill-current" />
            </div>

            {isCR && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-orange-500/10 z-30"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                  >
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl z-50 backdrop-blur-md">
                  <DropdownMenuItem className="cursor-pointer gap-2" onSelect={() => setShowUpdateModal(true)}>
                    <Pencil className="h-4 w-4" /> Edit Folder
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10" onSelect={() => setShowDeleteModal(true)}>
                    <Trash2 className="h-4 w-4" /> Delete Folder
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xl leading-tight group-hover:text-orange-500 transition-colors line-clamp-1">
                {folder.name}
              </h3>
              <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-orange-500" />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              <div className="flex -space-x-1.5 overflow-hidden mr-1">
                 {/* Decorative element: small dots to look "pro" */}
                 <div className="h-2 w-2 rounded-full bg-orange-500/40" />
                 <div className="h-2 w-2 rounded-full bg-orange-500/20" />
              </div>
              <span>{folder._count?.notes || 0} Resources</span>
            </div>
          </div>
        </div>

        <Link href={`/dashboard/classroom/folder/${folder.id}`} className="absolute inset-0 z-10" />
      </Card>

      <UpdateFolderModal
        folder={folder}
        subjectId={subjectId}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSuccess={() => window.location.reload()}
      />

      <DeleteFolderModal
        folderId={folder.id}
        folderName={folder.name}
        subjectId={subjectId}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={() => window.location.reload()}
      />
    </>
  );
};