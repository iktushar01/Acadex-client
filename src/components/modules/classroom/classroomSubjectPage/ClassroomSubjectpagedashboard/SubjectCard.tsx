"use client";

import { Edit, FileText, Library, MoreVertical, Trash2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Subject } from "@/types/classroomSubject.types";

interface SubjectCardProps {
  subject: Subject;
  isCR: boolean;
  onDelete: (id: string) => void;
}

export const SubjectCard = ({ subject, isCR, onDelete }: SubjectCardProps) => {
  const router = useRouter();

  return (
    <Card className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-card border-none p-0 shadow-lg transition-all duration-500 hover:shadow-primary/5 hover:-translate-y-1">
      
      {/* IMAGE SECTION - Pinned to 0,0 with no container padding */}
      <div className="relative h-48 w-full shrink-0 overflow-hidden">
        {subject.coverImage ? (
          <img
            src={subject.coverImage}
            alt={subject.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Library className="h-12 w-12 text-muted-foreground/20" />
          </div>
        )}

        {/* Floating Icons */}
        <div className="absolute top-4 left-4 z-10">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        {isCR && (
          <div className="absolute top-4 right-4 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-md hover:bg-primary text-white border-none transition-all"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-border p-1.5 shadow-xl">
                <DropdownMenuItem
                  className="rounded-xl font-bold cursor-pointer py-3"
                  onClick={() => router.push(`/dashboard/classroom/subject/edit/${subject.id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="rounded-xl font-bold text-destructive focus:text-destructive cursor-pointer py-3"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2.5rem]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-black italic uppercase">Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription className="font-medium text-muted-foreground">
                        This will delete <span className="text-foreground font-bold">{subject.name}</span>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl font-bold">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(subject.id)}
                        className="rounded-xl bg-destructive hover:bg-destructive/90 font-bold"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* CONTENT SECTION - p-6 at the bottom, pt-5 for the text */}
      <div className="flex flex-col flex-grow px-6 pb-6 pt-5 bg-card">
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">
              Subject
            </span>
          </div>
          <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors truncate italic uppercase">
            {subject.name}
          </h3>
          <div className="flex items-center gap-2 pt-1 opacity-60">
             <div className="flex -space-x-1">
                <div className="h-4 w-4 rounded-full bg-muted border border-card" />
                <div className="h-4 w-4 rounded-full bg-muted border border-card" />
             </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {subject._count?.notes || 0} Resources
            </span>
          </div>
        </div>

        <div className="mt-auto">
          <Link href={`/dashboard/classroom/subject/${subject.id}?classroomId=${subject.classroomId}`}>
            <Button 
              className="w-full h-12 rounded-full font-black uppercase italic bg-primary text-primary-foreground hover:scale-[1.02] transition-all shadow-md hover:shadow-primary/20"
            >
              Folder
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};