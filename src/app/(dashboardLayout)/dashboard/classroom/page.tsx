"use client";

import { 
  Plus, 
  Users, 
  ArrowRight, 
  MoreVertical, 
  GraduationCap, 
  BookOpen, 
  Search,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

// Mock Data for the list
const classrooms = [
  { id: 1, name: "Advanced Mathematics", teacher: "Dr. Sarah Chen", students: 42, color: "bg-orange-500" },
  { id: 2, name: "Modern Physics", teacher: "Prof. James Wilson", students: 28, color: "bg-blue-500" },
  { id: 3, name: "UI/UX Design Systems", teacher: "Alex Rivera", students: 15, color: "bg-purple-500" },
];

const ClassroomPage = () => {
  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        
        {/* HEADER & ACTIONS */}
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

        {/* SEARCH BAR BENTO BOX */}
        <div className="relative mb-10 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
          <Input 
            placeholder="Search your classes..." 
            className="h-14 pl-12 rounded-[1.5rem] border-border bg-card/50 backdrop-blur-sm focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all"
          />
        </div>

        {/* CLASSROOM LIST GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((cls) => (
            <Card key={cls.id} className="group relative overflow-hidden rounded-[2.5rem] border-border bg-card/50 p-6 transition-all hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1">
              
              {/* Top Accent Bar */}
              <div className={`absolute top-0 left-0 h-1.5 w-full ${cls.color} opacity-80`} />

              <div className="flex justify-between items-start mb-6">
                <div className={`h-12 w-12 rounded-2xl ${cls.color} flex items-center justify-center text-white shadow-lg shadow-inherit/20`}>
                  <GraduationCap className="h-6 w-6" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-orange-500/10">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl p-2">
                    <DropdownMenuItem className="rounded-lg font-medium cursor-pointer">Archive</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg font-medium cursor-pointer text-destructive focus:bg-destructive/10">Leave Class</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-xl font-black tracking-tight group-hover:text-orange-500 transition-colors">
                  {cls.name}
                </h3>
                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> {cls.teacher}
                </p>
              </div>

              {/* Stats & Footer */}
              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <div className="flex -space-x-2">
                   {[1, 2, 3].map((i) => (
                     <Avatar key={i} className="h-8 w-8 border-2 border-background">
                       <AvatarImage src={`https://i.pravatar.cc/150?u=${cls.id + i}`} />
                       <AvatarFallback>U</AvatarFallback>
                     </Avatar>
                   ))}
                   <div className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] font-bold">
                     +{cls.students - 3}
                   </div>
                </div>
                
                <Button variant="ghost" className="rounded-xl group/btn font-bold hover:bg-orange-500 hover:text-white transition-all">
                  Enter <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>

              {/* Background Decoration */}
              <Zap className="absolute -bottom-4 -right-4 h-24 w-24 text-orange-500/5 rotate-12" />
            </Card>
          ))}

          {/* EMPTY STATE / ADD PLACEHOLDER */}
          <button className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border p-10 transition-all hover:border-orange-500/40 hover:bg-orange-500/5 group">
            <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white">
              <Plus className="h-6 w-6" />
            </div>
            <p className="font-bold text-muted-foreground group-hover:text-orange-600">Add another space</p>
          </button>
        </div>

      </div>
    </div>
  );
};

export default ClassroomPage;