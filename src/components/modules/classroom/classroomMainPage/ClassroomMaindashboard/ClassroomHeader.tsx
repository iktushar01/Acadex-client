"use client";

import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const ClassroomHeader = () => {
  return (
    <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-12">
      <div>
        <h1 className="text-4xl font-black tracking-tight italic">
          My <span className="text-orange-500">Classrooms</span>
        </h1>
        <p className="text-muted-foreground font-medium mt-1">Manage your learning spaces and collaborators.</p>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/dashboard/classroom/join">
          <Button variant="outline" className="rounded-2xl font-bold h-12 px-6 border-orange-500/20 hover:bg-orange-500/5 text-orange-600 transition-all active:scale-95">
            <Users className="mr-2 h-4 w-4" /> Join Class
          </Button>
        </Link>
        <Link href="/dashboard/classroom/create">
          <Button className="rounded-2xl font-bold h-12 px-6 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all active:scale-95">
            <Plus className="mr-2 h-5 w-5" /> Create New
          </Button>
        </Link>
      </div>
    </header>
  );
};