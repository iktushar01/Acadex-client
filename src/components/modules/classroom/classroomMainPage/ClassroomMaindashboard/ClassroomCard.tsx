"use client";

import { GraduationCap, MoreVertical, BookOpen, Building2, ArrowRight, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface ClassroomCardProps {
  membership: any;
}

const getColor = (id: string) => {
  const colors = ["bg-orange-500", "bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-rose-500", "bg-indigo-500"];
  const index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export const ClassroomCard = ({ membership }: ClassroomCardProps) => {
  const cls = membership.classroom;
  const cardColor = getColor(cls.id);

  return (
    <Card className="group relative overflow-hidden rounded-[2.5rem] border-border bg-card/50 p-6 transition-all hover:shadow-2xl hover:shadow-orange-500/5 hover:-translate-y-1">
      <div className={`absolute top-0 left-0 h-1.5 w-full ${cardColor} opacity-80`} />

      <div className="flex justify-between items-start mb-6">
        <div className={`h-12 w-12 rounded-2xl ${cardColor} flex items-center justify-center text-white shadow-lg shadow-inherit/20`}>
          <GraduationCap className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-lg font-bold text-[10px] uppercase tracking-wider">
            {membership.memberRole}
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
};