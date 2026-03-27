"use client";

import { LayoutGrid, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SubjectHeaderProps {
  isCR: boolean;
  classroomId: string;
}

export const SubjectHeader = ({ isCR, classroomId }: SubjectHeaderProps) => {
  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
      <div>
        <div className="flex items-center gap-2 text-orange-500 mb-2">
          <LayoutGrid className="h-5 w-5" />
          <span className="font-bold uppercase tracking-widest text-xs">Curriculum</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight italic">
          Class <span className="text-orange-500">Subjects</span>
        </h1>
      </div>

      {isCR && (
        <Link href={`/dashboard/classroom/subject/${classroomId}/add`}>
          <Button className="rounded-2xl font-bold h-12 px-6 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all active:scale-95">
            <Plus className="mr-2 h-5 w-5" /> Add Subject
          </Button>
        </Link>
      )}
    </header>
  );
};