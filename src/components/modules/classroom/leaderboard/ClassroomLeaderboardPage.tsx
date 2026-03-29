"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Building2, Loader2, Trophy, 
  Search, Users, Star, Crown, LayoutGrid 
} from "lucide-react";

import { getClassroomLeaderboardAction } from "@/actions/classroomActions/_getClassroomLeaderboardAction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ClassroomLeaderboard } from "@/types/classroom.types";

// --- Animation Variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { y: -5, transition: { duration: 0.2 } }
} as const;

const ClassroomLeaderboardPage = () => {
  const [leaderboards, setLeaderboards] = useState<ClassroomLeaderboard[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      const result = await getClassroomLeaderboardAction();
      if (result.success) setLeaderboards(result.data ?? []);
      else setError(result.message);
      setLoading(false);
    };
    loadLeaderboard();
  }, []);

  const filtered = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return leaderboards;
    return leaderboards.filter((item) =>
      item.classroom.name.toLowerCase().includes(term) ||
      item.classroom.institutionName.toLowerCase().includes(term)
    );
  }, [leaderboards, query]);

  return (
    <div className="min-h-screen bg-background/50 p-4 sm:p-8 lg:p-12">
      <div className="mx-auto max-w-7xl space-y-12">
        
        {/* --- Header Section --- */}
        <header className="relative space-y-6">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="h-1 w-12 bg-primary rounded-full" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Hall of Fame</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black tracking-tighter leading-none max-w-4xl"
            >
              Track your <span className="text-muted-foreground">Classroom</span> Standing.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl text-muted-foreground font-medium leading-relaxed"
            >
              Access detailed podium rankings and contribution stats for every classroom you're part of.
            </motion.p>
          </div>

          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by classroom or school..."
              className="h-14 pl-12 rounded-2xl bg-card/50 backdrop-blur-md border-border/50 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
        </header>

        {/* --- Grid Section --- */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex min-h-[40vh] items-center justify-center"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="size-10 animate-spin text-primary/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Fetching Standings</span>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div key="error" className="p-12 text-center rounded-[2rem] border-2 border-dashed border-destructive/20 bg-destructive/5">
              <p className="text-lg font-bold text-destructive">{error}</p>
              <Button className="mt-4 rounded-xl" variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((leaderboard) => (
                <LeaderboardClassroomCard key={leaderboard.classroom.id} leaderboard={leaderboard} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const LeaderboardClassroomCard = ({ leaderboard }: { leaderboard: ClassroomLeaderboard }) => {
  const firstPlace = leaderboard.topMembers[0];

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group relative flex flex-col min-h-[300px]"
    >
      <div className={cn(
        "relative flex flex-col h-full p-7 rounded-[2.5rem] border overflow-hidden transition-all duration-500",
        "bg-card/40 backdrop-blur-xl border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20"
      )}>
        
        {/* --- Dynamic Background Blob --- */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-colors duration-700 -z-10" />

        {/* --- Header: Metadata --- */}
        <div className="flex items-center justify-between mb-8">
          <Badge variant="secondary" className="rounded-lg bg-background/50 border-border/50 text-[10px] font-black uppercase tracking-widest px-3 py-1">
            {leaderboard.myMembershipRole}
          </Badge>
          <div className="flex items-center gap-1.5 text-primary">
            <Users className="size-3.5" />
            <span className="text-xs font-bold tabular-nums">{leaderboard.totalMembers}</span>
          </div>
        </div>

        {/* --- Main Info --- */}
        <div className="space-y-2 flex-1">
          <h2 className="text-2xl font-black tracking-tighter leading-[1.1] group-hover:text-primary transition-colors">
            {leaderboard.classroom.name}
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground/60">
            <Building2 className="size-3.5" />
            <span className="text-[13px] font-medium truncate">{leaderboard.classroom.institutionName}</span>
          </div>
        </div>

        {/* --- Ranking Stats --- */}
        <div className="grid grid-cols-2 gap-3 my-8">
          <div className="p-4 rounded-3xl bg-background/60 border border-border/40 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <Star className="size-3" /> Rank
            </div>
            <p className="text-2xl font-black tracking-tight italic">
              {leaderboard.myRank ? `#${leaderboard.myRank.rank}` : "—"}
            </p>
          </div>
          <div className="p-4 rounded-3xl bg-background/60 border border-border/40 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <Crown className="size-3 text-amber-500" /> Leader
            </div>
            <p className="text-[13px] font-black truncate">
              {firstPlace ? firstPlace.name : "N/A"}
            </p>
          </div>
        </div>

        {/* --- Interactive Action Zone (Clickable) --- */}
        <Link href={`/dashboard/classroom/leaderboard/${leaderboard.classroom.id}`} className="mt-auto">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex items-center justify-between p-4 rounded-2xl transition-all group/btn",
              "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40"
            )}
          >
            <span className="font-bold text-sm tracking-tight">Enter Leaderboard</span>
            <div className="p-1 rounded-lg bg-white/20">
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ClassroomLeaderboardPage;