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
    <div className="min-h-screen bg-background/40 px-4 py-6 sm:px-8 sm:py-10 md:px-12 lg:px-16">
      <motion.div
        variants={anim.container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-7xl space-y-10 sm:space-y-12 lg:space-y-16"
      >
        
        {/* --- Header & Navigation --- */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <Link href="/dashboard/classroom/leaderboard">
              <Button
                variant="ghost"
                className="h-auto gap-2 rounded-2xl px-0 py-2 text-left font-bold text-muted-foreground transition-all hover:bg-card hover:px-4"
              >
                <ArrowLeft className="size-4" /> Hall of Fame
              </Button>
            </Link>
            <h1 className="max-w-full break-words text-4xl font-black leading-[0.9] tracking-tighter italic uppercase sm:text-6xl md:text-7xl lg:text-8xl">
              {leaderboard.classroom.name.split(" ")[0]}
              <span className="text-primary">.</span>
            </h1>
          </div>
          
          <div className="flex w-full items-center gap-4 rounded-[1.75rem] border border-border/50 bg-card/50 p-4 backdrop-blur-xl sm:w-fit sm:rounded-[2rem] sm:px-6">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Trophy className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classroom</p>
                <p className="truncate text-sm font-black sm:max-w-[200px]">
                  {leaderboard.classroom.institutionName}
                </p>
              </div>
          </div>
        </div>

        {/* --- The Podium --- */}
        <section className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-3 md:items-end md:gap-4 md:pt-16 lg:gap-8">
          {/* 2nd Place: Order 2 on mobile, 1 on desktop */}
          <div className="order-2 md:order-1">
            <PodiumCard member={podium[1]} rank={2} color="text-slate-400" border="border-slate-400/20" />
          </div>

          {/* 1st Place: Order 1 on mobile, 2 on desktop */}
          <div className="order-1 md:order-2">
            <PodiumCard member={podium[0]} rank={1} color="text-amber-400" border="border-amber-400/30" active />
          </div>

          {/* 3rd Place: Order 3 on both */}
          <div className="order-3 md:order-3">
            <PodiumCard member={podium[2]} rank={3} color="text-orange-600" border="border-orange-600/20" />
          </div>
        </section>

        {/* --- Main Dashboard Content --- */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[350px_1fr] lg:gap-12">
          
          {/* Sidebar: Personal Focus */}
          <aside className="space-y-6">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-card/60 p-6 shadow-2xl backdrop-blur-3xl sm:p-8">
              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              
              <h3 className="mb-8 flex items-center gap-3 text-xl font-black tracking-tight">
                <ShieldCheck className="size-5 text-primary" /> Your Rank
              </h3>

              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-[2rem] bg-primary/60 p-6 text-background sm:p-8">
                   <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Total XP</p>
                      <div className="mt-1 text-5xl font-black tracking-tighter sm:text-6xl">
                        {leaderboard.myRank?.score ?? 0}
                      </div>
                      <Badge className="mt-6 border-none bg-foreground px-4 py-1 font-black text-background">
                        RANK #{leaderboard.myRank?.rank ?? "N/A"}
                      </Badge>
                   </div>
                   <Zap className="absolute -bottom-6 -right-6 size-28 rotate-12 opacity-10 sm:size-32" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <StatPill icon={NotebookPen} label="Notes" val={leaderboard.myRank?.notesUploaded ?? 0} />
                  <StatPill icon={MessageSquareText} label="Cmnts" val={leaderboard.myRank?.commentsCount ?? 0} />
                </div>
              </div>
            </div>
          </aside>

          {/* Main List: Full Standings */}
          <main className="flex min-w-0 flex-col rounded-[2.5rem] border border-border/50 bg-card/40 p-6 backdrop-blur-3xl sm:p-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-primary p-2.5 text-white shadow-lg shadow-primary/20">
                  <TrendingUp className="size-5" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter sm:text-2xl">
                  Full Standings
                </h3>
              </div>
              <span className="w-fit rounded-full bg-muted/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {allMembers.length} Members
              </span>
            </div>

            <div className="space-y-4">
              {allMembers.map((member, i) => (
                <motion.div
                  key={member.userId}
                  variants={anim.item}
                  className="group flex items-center gap-4 rounded-[1.5rem] border border-transparent bg-background/20 p-3 transition-all hover:border-primary/20 hover:bg-background/60 sm:rounded-[2rem] sm:p-4"
                >
                  <div className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl border font-black text-sm transition-all sm:size-12 sm:rounded-2xl sm:text-base",
                    i < 3 ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border/50"
                  )}>
                    {i + 1}
                  </div>
                  
                  <Avatar className="size-10 border-2 border-background shadow-lg sm:size-12">
                    <AvatarImage src={member.image ?? undefined} />
                    <AvatarFallback className="text-xs font-black">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black uppercase tracking-tight sm:text-base">{member.name}</p>
                    <p className="text-[10px] font-bold italic uppercase tracking-widest text-muted-foreground opacity-60">
                      {member.memberRole}
                    </p>
                  </div>

                  <div className="flex flex-col items-end text-right">
                    <span className="text-lg font-black tabular-nums tracking-tighter text-primary sm:text-xl">{member.score}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Pts</span>
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

const PodiumCard = ({ member, rank, color, border, active }: PodiumCardProps) => {
  if (!member) return null;
  return (
    <motion.div 
      variants={anim.item}
      className={cn(
        "relative flex flex-col items-center overflow-hidden rounded-[2.5rem] border bg-card/60 p-8 text-center shadow-xl backdrop-blur-2xl transition-all sm:rounded-[3rem]",
        border,
        active ? "z-10 ring-4 ring-primary/10 md:-mt-12 md:scale-105 md:py-12 lg:scale-110 lg:py-16" : "opacity-90"
      )}
    >
      {active && <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.08] to-transparent pointer-events-none" />}
      
      <div className={cn("absolute right-6 top-6 select-none text-4xl font-black italic opacity-10", color)}>
        #{rank}
      </div>

      <div className="relative mb-6">
        <div className={cn("absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background p-2 shadow-xl", color)}>
          {rank === 1 ? <Crown className="size-6" /> : <Medal className="size-5" />}
        </div>
        <Avatar className="size-24 ring-4 ring-background shadow-2xl transition-transform group-hover:rotate-3 md:size-28 lg:size-32">
          <AvatarImage src={member.image ?? undefined} />
          <AvatarFallback className="text-2xl font-black">
            {member.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="relative z-10 w-full">
        <h3 className="truncate text-xl font-black uppercase tracking-tighter">
          {member.name}
        </h3>
        <p className="mt-1 text-[10px] font-black italic uppercase tracking-[0.2em] text-primary/60">
          {member.memberRole}
        </p>

        <div className="mt-8 w-full rounded-2xl border border-border/40 bg-background/50 px-4 py-5 backdrop-blur-md">
          <p className={cn("text-3xl font-black italic leading-none sm:text-4xl", active ? "text-primary" : "text-foreground")}>
            {member.score}
          </p>
          <p className="mt-2 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground">
            Exp Points
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const StatPill = ({ icon: Icon, label, val }: { icon: any, label: string, val: number }) => (
  <div className="group rounded-[1.8rem] border border-border/50 bg-background/50 p-5 transition-colors hover:border-primary/30">
    <div className="mb-2 flex items-center gap-2 text-muted-foreground transition-colors group-hover:text-primary">
      <Icon className="size-3.5" />
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-2xl font-black tabular-nums tracking-tighter">{val}</div>
  </div>
);

type PodiumCardProps = {
  member?: ClassroomLeaderboardEntry;
  rank: number;
  color: string;
  border: string;
  active?: boolean;
};

export default ClassroomLeaderboardDetailsPage;