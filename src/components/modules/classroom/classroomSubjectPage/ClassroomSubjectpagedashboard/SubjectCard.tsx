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
    <Card className="group relative overflow-hidden rounded-[2.5rem] bg-card border-none hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2">
      {/* SUBJECT COVER IMAGE */}
      <div className="relative h-40 w-full overflow-hidden">
        {subject.coverImage ? (
          <img
            src={subject.coverImage}
            alt={subject.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
            <Library className="h-12 w-12 text-orange-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

        <div className="absolute bottom-4 left-6 h-12 w-12 rounded-2xl bg-background/90 backdrop-blur-md flex items-center justify-center text-orange-600 shadow-lg border border-white/20">
          <FileText className="h-6 w-6" />
        </div>

        {isCR && (
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-9 w-9 rounded-xl bg-white/80 backdrop-blur-md hover:bg-orange-500 hover:text-white border-none shadow-sm transition-all">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl w-40 p-2 border-orange-500/10">
                <DropdownMenuItem
                  className="rounded-lg font-bold cursor-pointer"
                  onClick={() => router.push(`/dashboard/classroom/subject/edit/${subject.id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="rounded-lg font-bold text-destructive focus:text-destructive cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2rem]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-2xl font-black italic">
                        Are you <span className="text-orange-500">sure?</span>
                      </AlertDialogTitle>
                      <AlertDialogDescription className="font-medium">
                        This will permanently delete <span className="font-bold text-foreground">"{subject.name}"</span>.
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

      <div className="px-6 pb-6 pt-2">
        <div className="mb-6">
          <h3 className="text-2xl font-black tracking-tight mb-1 group-hover:text-orange-500 transition-colors truncate italic">
            {subject.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {subject._count?.notes || 0} Resources Available
            </span>
          </div>
        </div>

        <Link href={`/dashboard/classroom/subject/${subject.id}?classroomId=${subject.classroomId}`}>
          <Button variant="outline" className="w-full h-12 rounded-2xl font-bold group/btn border-orange-500/20 bg-orange-500/5 hover:bg-orange-500 hover:text-white transition-all duration-300">
            View Materials
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};