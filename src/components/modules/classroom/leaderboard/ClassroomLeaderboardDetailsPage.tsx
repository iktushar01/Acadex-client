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

  if (!leaderboard) return <div className="p-20 text-center font-black uppercase tracking-widest">No Data Found</div>;

  return (
    <div className="min-h-screen bg-background/40 p-4 md:p-10 lg:p-16">
      <motion.div variants={anim.container} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-12">
        
        {/* --- Header & Navigation --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <Link href="/dashboard/classroom/leaderboard">
              <Button variant="ghost" className="rounded-2xl gap-2 font-bold text-muted-foreground hover:bg-card px-0 hover:px-4 transition-all">
                <ArrowLeft className="size-4" /> Hall of Fame
              </Button>
            </Link>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">
              {leaderboard.classroom.name.split(' ')[0]}
              <span className="text-primary">.</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4 bg-card/50 border border-border/50 p-4 rounded-[2rem] backdrop-blur-xl">
             <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Trophy className="size-5" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classroom</p>
                <p className="text-sm font-black truncate max-w-[150px]">{leaderboard.classroom.institutionName}</p>
             </div>
          </div>
        </div>

        {/* --- The Podium: Mobile Optimized --- */}
        <section className="grid gap-6 md:grid-cols-3 items-end pt-10">
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
        <div className="grid lg:grid-cols-[380px_1fr] gap-10">
          
          {/* Sidebar: Personal Focus */}
          <aside className="space-y-6">
            <div className="p-8 rounded-[2.5rem] bg-card/60 border border-border/50 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              
              <h3 className="font-black text-xl tracking-tight mb-8 flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" /> Your Rank
              </h3>

              <div className="space-y-6">
                <div className="relative p-8 rounded-[2rem] bg-primary/60 text-background overflow-hidden">
                   <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Classroom XP</p>
                      <div className="text-6xl font-black tracking-tighter mt-1">
                        {leaderboard.myRank?.score ?? 0}
                      </div>
                      <Badge className="mt-4 bg-foreground text-background border-none font-black px-3">
                        RANK #{leaderboard.myRank?.rank ?? "N/A"}
                      </Badge>
                   </div>
                   <Zap className="absolute -right-6 -bottom-6 size-32 opacity-10 rotate-12" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <StatPill icon={NotebookPen} label="Notes" val={leaderboard.myRank?.notesUploaded ?? 0} />
                  <StatPill icon={MessageSquareText} label="Cmnts" val={leaderboard.myRank?.commentsCount ?? 0} />
                </div>
              </div>
            </div>
          </aside>

          {/* Main List: Full Standings */}
          <main className="p-8 rounded-[2.5rem] bg-card/40 border border-border/50 backdrop-blur-3xl flex flex-col">
            <div className="flex items-center justify-between mb-10 px-2">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                  <TrendingUp className="size-4" />
                </div>
                <h3 className="font-black text-xl tracking-tighter uppercase italic">Full Standings</h3>
              </div>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-4 py-1.5 rounded-full">
                {allMembers.length} Active
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {allMembers.map((member, i) => (
                <motion.div
                  key={member.userId}
                  variants={anim.item}
                  className="group flex items-center gap-5 p-4 rounded-[1.8rem] bg-background/20 border border-transparent hover:border-primary/20 hover:bg-background/60 transition-all cursor-pointer"
                >
                  <div className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-2xl font-black text-lg shadow-inner border transition-all",
                    i < 3 ? "bg-primary text-white border-primary" : "bg-card text-muted-foreground border-border/50"
                  )}>
                    {i + 1}
                  </div>
                  
                  <Avatar className="size-12 border-2 border-background shadow-xl">
                    <AvatarImage src={member.image ?? undefined} />
                    <AvatarFallback className="font-black text-xs">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm truncate uppercase tracking-tight">{member.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 italic">
                      {member.memberRole}
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="text-xl font-black text-primary tabular-nums tracking-tighter">{member.score}</span>
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
        "relative p-8 rounded-[3rem] border bg-card/60 backdrop-blur-2xl transition-all shadow-xl text-center overflow-hidden",
        border,
        active ? "md:-mt-12 md:py-16 ring-4 ring-primary/10 scale-105 md:scale-110 z-10" : "z-0 opacity-90"
      )}
    >
      {/* Decorative inner glow for Rank 1 */}
      {active && <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] to-transparent pointer-events-none" />}
      
      <div className={cn("absolute top-4 right-6 text-4xl font-black opacity-10 italic select-none", color)}>
        #{rank}
      </div>

      <div className="relative inline-block mb-6">
        <div className={cn("absolute -top-4 left-1/2 -translate-x-1/2 p-2 rounded-xl bg-background border shadow-2xl z-20", color)}>
          {rank === 1 ? <Crown className="size-6" /> : <Medal className="size-5" />}
        </div>
        <Avatar className={cn("size-24 md:size-28 ring-4 ring-background shadow-2xl transition-transform hover:rotate-3")}>
          <AvatarImage src={member.image ?? undefined} />
          <AvatarFallback className="text-2xl font-black">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>

      <div className="relative z-10">
        <h3 className="font-black text-xl tracking-tighter truncate uppercase">{member.name}</h3>
        <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mt-1 italic">{member.memberRole}</p>

        <div className="mt-8 py-4 px-6 rounded-2xl bg-background/50 border border-border/40 backdrop-blur-md">
          <p className={cn("text-3xl font-black italic leading-none", active ? "text-primary" : "text-foreground")}>
            {member.score}
          </p>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground mt-2">Exp Points</p>
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
  <div className="p-5 rounded-[1.8rem] bg-background/50 border border-border/50 group hover:border-primary/30 transition-colors">
    <div className="flex items-center gap-2 mb-2 text-muted-foreground group-hover:text-primary transition-colors">
      <Icon className="size-3" />
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-2xl font-black tabular-nums tracking-tighter">{val}</div>
  </div>
);

export default ClassroomLeaderboardDetailsPage;
