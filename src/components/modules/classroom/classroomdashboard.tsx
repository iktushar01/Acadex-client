"use client";

import { useEffect, useState } from "react";
import { 
  Plus, Users, ArrowRight, MoreVertical, GraduationCap, 
  BookOpen, Search, Zap, Loader2, Building2, BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Import the Server Action
import { fetchMyClassroomsAction } from "@/app/(dashboardLayout)/dashboard/classroom/_action";

const ClassroomDashboard = () => {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to get a consistent color based on string ID
  const getColor = (id: string) => {
    const colors = ["bg-orange-500", "bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-rose-500", "bg-indigo-500"];
    const index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await fetchMyClassroomsAction();
      
      if (result.success) {
        setMemberships(result.data || []);
      } else {
        setError(result.error as string);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        
        {/* HEADER */}
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

        {/* SEARCH BAR */}
        <div className="relative mb-10 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-orange-500" />
          <Input 
            placeholder="Search by name, teacher or institution..." 
            className="h-14 pl-12 rounded-[1.5rem] border-border bg-card/50 backdrop-blur-sm focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
            <p className="mt-4 text-muted-foreground font-medium">Loading your spaces...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/5 rounded-[2.5rem] border border-destructive/20">
            <p className="text-destructive font-bold">{error}</p>
            <Button variant="ghost" onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberships.map((item) => {
              const cls = item.classroom;
              const cardColor = getColor(cls.id);
              
              return (
                <Card key={cls.id} className="group relative overflow-hidden rounded-[2.5rem] border-border bg-card/50 p-6 transition-all hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1">
                  <div className={`absolute top-0 left-0 h-1.5 w-full ${cardColor} opacity-80`} />

                  <div className="flex justify-between items-start mb-6">
                    <div className={`h-12 w-12 rounded-2xl ${cardColor} flex items-center justify-center text-white shadow-lg shadow-inherit/20`}>
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-lg font-bold text-[10px] uppercase tracking-wider">
                        {item.memberRole}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hover:bg-orange-500/10">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl p-2">
                          <DropdownMenuItem className="rounded-lg font-medium cursor-pointer">Class Info</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-lg font-medium cursor-pointer text-destructive focus:bg-destructive/10">Leave Class</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <h3 className="text-xl font-black tracking-tight group-hover:text-orange-500 transition-colors line-clamp-1">
                      {cls.name}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-orange-500" /> {cls.creator.name}
                      </p>
                      <p className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" /> {cls.institutionName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <Avatar className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={cls.creator.image} />
                          <AvatarFallback>{cls.creator.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="text-[11px] font-bold text-muted-foreground">
                        {cls._count.memberships} Member{cls._count.memberships !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <Link href={`/dashboard/classroom/${cls.id}`}>
                      <Button variant="ghost" className="rounded-xl group/btn font-bold hover:bg-orange-500 hover:text-white transition-all h-9">
                        Enter <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                  <Zap className="absolute -bottom-4 -right-4 h-24 w-24 text-orange-500/5 rotate-12" />
                </Card>
              );
            })}

            <Link href="/dashboard/classroom/create" className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-border p-10 transition-all hover:border-orange-500/40 hover:bg-orange-500/5 group">
              <div className="h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white">
                <Plus className="h-6 w-6" />
              </div>
              <p className="font-bold text-muted-foreground group-hover:text-orange-600">Add another space</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomDashboard;