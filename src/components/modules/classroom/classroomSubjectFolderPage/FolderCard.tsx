"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderIcon, MoreVertical, Pencil, Trash2, ArrowUpRight, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
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
      <Card className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-card/80 to-card/30 backdrop-blur-md transition-all duration-500 border-border/50 hover:border-orange-500/40 hover:shadow-[0_20px_50px_rgba(249,115,22,_0.15)] hover:-translate-y-2 h-full min-h-[220px]">
        
        {/* Decorative Background Element */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-500/10 blur-[50px] group-hover:bg-orange-500/20 transition-all duration-700" />

        <div className="relative p-7 flex flex-col h-full z-10">
          {/* Top Row: Icon & Menu */}
          <div className="flex justify-between items-start mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-500 group-hover:rotate-3">
                <FolderIcon className="h-7 w-7 fill-white/20" />
              </div>
            </div>

            {isCR && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-secondary/50 hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent align="end" className="rounded-2xl min-w-[180px] p-2 shadow-2xl border-border/50 backdrop-blur-xl bg-background/95">
                    <DropdownMenuItem
                      className="rounded-lg cursor-pointer gap-3 py-3 font-medium focus:bg-orange-500/10 focus:text-orange-600 transition-colors"
                      onSelect={() => setShowUpdateModal(true)}
                    >
                      <Pencil className="h-4 w-4" /> Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-lg cursor-pointer gap-3 py-3 font-medium text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors"
                      onSelect={() => setShowDeleteModal(true)}
                    >
                      <Trash2 className="h-4 w-4" /> Remove Folder
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            )}
          </div>

          {/* Content Area */}
          <Link
            href={`/dashboard/classroom/folder/${folder.id}`}
            className="flex-grow flex flex-col group/link"
          >
            <div className="space-y-4 mt-auto">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500/80 mb-1">Folder</p>
                  <h3 className="font-bold text-2xl tracking-tight leading-none group-hover/link:text-orange-500 transition-colors duration-300">
                    {folder.name}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 bg-background/50">
                  <ArrowUpRight className="h-5 w-5 text-orange-500" />
                </div>
              </div>

              {/* Progress/Stats bar */}
              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground/70">
                  <div className="flex items-center gap-2">
                    <Files className="h-3.5 w-3.5 text-orange-500/60" />
                    <span>{folder._count?.notes || 0} Resources</span>
                  </div>
                  <div className="flex gap-1">
                     {[...Array(3)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1 w-4 rounded-full transition-all duration-500 ${
                            i === 0 ? "bg-orange-500 w-8" : "bg-orange-500/20 group-hover:bg-orange-500/40"
                          }`} 
                        />
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
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