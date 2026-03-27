"use client";

import Link from "next/link";
import { FolderIcon, MoreVertical, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FolderCardProps {
  folder: {
    id: string;
    name: string;
    _count?: {
      notes: number;
    };
  };
  isCR: boolean | undefined;
}

export const FolderCard = ({ folder, isCR }: FolderCardProps) => {
  return (
    <Card className="group relative overflow-hidden rounded-[2rem] p-6 bg-card/50 hover:bg-card hover:shadow-2xl hover:shadow-orange-500/5 transition-all border-border hover:border-orange-500/30 cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">
          <FolderIcon className="h-6 w-6 fill-current" />
        </div>
        
        {isCR && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-orange-500/10 z-20"
            onClick={(e) => {
              // Prevents the Card's Link from triggering when clicking the menu
              e.preventDefault();
              e.stopPropagation();
              console.log("Options for folder:", folder.id);
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-lg truncate group-hover:text-orange-500 transition-colors">
          {folder.name}
        </h3>
        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/60 uppercase">
          <FileText className="h-3 w-3" />
          <span>{folder._count?.notes || 0} Notes</span>
        </div>
      </div>

      {/* Main navigation link */}
      <Link 
        href={`/dashboard/classroom/folder/${folder.id}`} 
        className="absolute inset-0 z-10" 
      />
    </Card>
  );
};