"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Crown, Medal, MessageSquareText,
  NotebookPen, ShieldCheck, TrendingUp, Trophy, Zap
} from "lucide-react";

import { getClassroomLeaderboardByIdAction } from "@/actions/classroomActions/_getClassroomLeaderboardByIdAction";
import { ClassroomLeaderboardDetailsSkeleton } from "@/components/modules/classroom/leaderboard/ClassroomLeaderboardDetailsSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ClassroomLeaderboard, ClassroomLeaderboardEntry } from "@/types/classroom.types";

const anim = {
  container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } },
};

const ClassroomLeaderboardDetailsPage = ({ classroomId }: { classroomId: string }) => {
  const [leaderboard, setLeaderboard] = useState<ClassroomLeaderboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getClassroomLeaderboardByIdAction(classroomId);
      if (result.success) setLeaderboard(result.data);
      setLoading(false);
    })();
  }, [classroomId]);

  const allMembers = useMemo(() => leaderboard?.allMembers ?? [], [leaderboard]);
  const podium = allMembers.slice(0, 3);

  if (loading) return <ClassroomLeaderboardDetailsSkeleton />;

  if (!leaderboard) {
    return (
      <div className="px-4 py-16 text-center font-black uppercase tracking-widest sm:p-20">
        No Data Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/40 px-4 py-5 sm:px-6 sm:py-8 md:p-10 lg:p-16">
      <motion.div
        variants={anim.container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl space-y-8 sm:space-y-10 lg:space-y-12"
      >
        
        {/* --- Header & Navigation --- */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center md:gap-6">
          <div className="space-y-4">
            <Link href="/dashboard/classroom/leaderboard">
              <Button
                variant="ghost"
                className="h-auto gap-2 rounded-2xl px-0 py-2 text-left font-bold text-muted-foreground transition-all hover:bg-card hover:px-4"
              >
                <ArrowLeft className="size-4" /> Hall of Fame
              </Button>
            </Link>
            <h1 className="break-words text-3xl font-black leading-none tracking-tighter italic uppercase sm:text-5xl md:text-6xl lg:text-7xl">
              {leaderboard.classroom.name.split(" ")[0]}
              <span className="text-primary">.</span>
            </h1>
          </div>
          
          <div className="flex w-full items-center gap-4 rounded-[1.75rem] border border-border/50 bg-card/50 p-4 backdrop-blur-xl sm:w-auto sm:rounded-[2rem]">
             <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Trophy className="size-5" />
             </div>
             <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classroom</p>
                <p className="break-words text-sm font-black sm:max-w-[220px] sm:truncate">
                  {leaderboard.classroom.institutionName}
                </p>
             </div>
          </div>
        </div>

        {/* --- The Podium: Mobile Optimized --- */}
        <section className="grid items-stretch gap-4 pt-2 sm:gap-6 sm:pt-6 md:grid-cols-3 md:items-end md:pt-10">
          {/* CSS Trick: Use 'order' property to move the 1st place to the top on mobile, 
              but keep it in the center on desktop.
          */}
          
          {/* 2nd Place */}
          <div className="order-2 md:order-1">
            <PodiumCard member={podium[1]} rank={2} color="text-slate-400" border="border-slate-400/20" />
          </div>

          {/* 1st Place (Primary) */}
          <div className="order-1 md:order-2">
            <PodiumCard member={podium[0]} rank={1} color="text-amber-400" border="border-amber-400/30" active />
          </div>

          {/* 3rd Place */}
          <div className="order-3 md:order-3">
            <PodiumCard member={podium[2]} rank={3} color="text-orange-600" border="border-orange-600/20" />
          </div>
        </section>

        {/* --- Dashboard Layout --- */}
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] lg:gap-10">
          
          {/* Sidebar: Personal Focus */}
          <aside className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/60 p-5 shadow-2xl backdrop-blur-3xl sm:rounded-[2.5rem] sm:p-8">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              
              <h3 className="mb-6 flex items-center gap-2 text-lg font-black tracking-tight sm:mb-8 sm:text-xl">
                <ShieldCheck className="size-5 text-primary" /> Your Rank
              </h3>

              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-[1.75rem] bg-primary/60 p-5 text-background sm:rounded-[2rem] sm:p-8">
                   <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Classroom XP</p>
                      <div className="mt-1 text-4xl font-black tracking-tighter sm:text-5xl lg:text-6xl">
                        {leaderboard.myRank?.score ?? 0}
                      </div>
                      <Badge className="mt-4 border-none bg-foreground px-3 font-black text-background">
                        RANK #{leaderboard.myRank?.rank ?? "N/A"}
                      </Badge>
                   </div>
                   <Zap className="absolute -bottom-6 -right-6 size-24 rotate-12 opacity-10 sm:size-32" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <StatPill icon={NotebookPen} label="Notes" val={leaderboard.myRank?.notesUploaded ?? 0} />
                  <StatPill icon={MessageSquareText} label="Cmnts" val={leaderboard.myRank?.commentsCount ?? 0} />
                </div>
              </div>
            </div>
          </aside>

          {/* Main List: Full Standings */}
          <main className="flex min-w-0 flex-col rounded-[2rem] border border-border/50 bg-card/40 p-5 backdrop-blur-3xl sm:rounded-[2.5rem] sm:p-8">
            <div className="mb-6 flex flex-col gap-4 px-1 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:px-2">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary p-2 text-white shadow-lg shadow-primary/20">
                  <TrendingUp className="size-4" />
                </div>
                <h3 className="text-lg font-black tracking-tighter uppercase italic sm:text-xl">
                  Full Standings
                </h3>
              </div>
              <span className="w-fit rounded-full bg-muted/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {allMembers.length} Active
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto sm:max-h-[600px] sm:pr-2 custom-scrollbar">
              {allMembers.map((member, i) => (
                <motion.div
                  key={member.userId}
                  variants={anim.item}
                  className="group flex flex-wrap items-center gap-3 rounded-[1.4rem] border border-transparent bg-background/20 p-3 transition-all hover:border-primary/20 hover:bg-background/60 sm:flex-nowrap sm:gap-5 sm:rounded-[1.8rem] sm:p-4"
                >
                  <div className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl border font-black text-base shadow-inner transition-all sm:size-12 sm:rounded-2xl sm:text-lg",
                    i < 3 ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border/50"
                  )}>
                    {i + 1}
                  </div>
                  
                  <Avatar className="size-10 border-2 border-background shadow-xl sm:size-12">
                    <AvatarImage src={member.image ?? undefined} />
                    <AvatarFallback className="font-black text-xs">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-black uppercase tracking-tight">{member.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 italic">
                      {member.memberRole}
                    </p>
                  </div>

                  <div className="ml-auto flex min-w-[68px] flex-col items-end text-right">
                    <span className="text-lg font-black tracking-tighter text-primary tabular-nums sm:text-xl">{member.score}</span>
                    <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Points</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </motion.div>
    </div>
  );
};

// --- Sub-Components ---

type PodiumCardProps = {
  member?: ClassroomLeaderboardEntry;
  rank: number;
  color: string;
  border: string;
  active?: boolean;
};

const PodiumCard = ({ member, rank, color, border, active }: PodiumCardProps) => {
  if (!member) return null;
  return (
    <motion.div 
      variants={anim.item}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border bg-card/60 p-5 text-center shadow-xl backdrop-blur-2xl transition-all sm:rounded-[3rem] sm:p-8",
        border,
        active ? "z-10 ring-4 ring-primary/10 sm:scale-[1.02] md:-mt-12 md:scale-110 md:py-16" : "z-0 opacity-90"
      )}
    >
      {/* Decorative inner glow for Rank 1 */}
      {active && <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />}
      
      <div className={cn("absolute right-4 top-4 select-none text-3xl font-black italic opacity-10 sm:right-6 sm:text-4xl", color)}>
        #{rank}
      </div>

      <div className="relative mb-6 inline-block">
        <div className={cn("absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-2 shadow-2xl", color)}>
          {rank === 1 ? <Crown className="size-5 sm:size-6" /> : <Medal className="size-4 sm:size-5" />}
        </div>
        <Avatar className="size-20 ring-4 ring-background shadow-2xl transition-transform hover:rotate-3 sm:size-24 md:size-28">
          <AvatarImage src={member.image ?? undefined} />
          <AvatarFallback className="text-xl font-black sm:text-2xl">
            {member.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="relative z-10">
        <h3 className="truncate text-lg font-black uppercase tracking-tighter sm:text-xl">
          {member.name}
        </h3>
        <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-primary/60 italic sm:tracking-[0.2em]">
          {member.memberRole}
        </p>

        <div className="mt-6 rounded-2xl border border-border/40 bg-background/50 px-5 py-4 backdrop-blur-md sm:mt-8 sm:px-6">
          <p className={cn("text-3xl font-black italic leading-none", active ? "text-primary" : "text-foreground")}>
            {member.score}
          </p>
          <p className="mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground sm:tracking-[0.25em]">
            Exp Points
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const StatPill = ({
  icon: Icon,
  label,
  val,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  val: number;
}) => (
  <div className="group rounded-[1.4rem] border border-border/50 bg-background/50 p-4 transition-colors hover:border-primary/30 sm:rounded-[1.8rem] sm:p-5">
    <div className="mb-2 flex items-center gap-2 text-muted-foreground transition-colors group-hover:text-primary">
      <Icon className="size-3" />
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-xl font-black tracking-tighter tabular-nums sm:text-2xl">{val}</div>
  </div>
);

export default ClassroomLeaderboardDetailsPage;
