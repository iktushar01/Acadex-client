"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Crown,
  Loader2,
  Search,
  Star,
  Users,
} from "lucide-react";

import { getClassroomLeaderboardAction } from "@/actions/classroomActions/_getClassroomLeaderboardAction";
import { ClassroomLeaderboardSkeleton } from "@/components/modules/classroom/leaderboard/ClassroomLeaderboardSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ClassroomLeaderboard } from "@/types/classroom.types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { y: -5, transition: { duration: 0.2 } },
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

    return leaderboards.filter(
      (item) =>
        item.classroom.name.toLowerCase().includes(term) ||
        item.classroom.institutionName.toLowerCase().includes(term)
    );
  }, [leaderboards, query]);

  return (
    <div className="min-h-screen bg-background/50 p-4 sm:p-8 lg:p-12">
      <div className="mx-auto max-w-7xl space-y-12">
        <header className="relative space-y-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="h-1 w-12 rounded-full bg-primary" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">
                Hall of Fame
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl text-4xl font-black leading-none tracking-tighter md:text-6xl"
            >
              Track your <span className="text-muted-foreground">Classroom</span> Standing.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl font-medium leading-relaxed text-muted-foreground"
            >
              Access detailed podium rankings and contribution stats for every classroom you're
              part of.
            </motion.p>
          </div>

          <div className="group relative max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by classroom or school..."
              className="h-14 rounded-2xl border-border/50 bg-card/50 pl-12 shadow-sm transition-all backdrop-blur-md focus:ring-primary/20"
            />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 px-1">
                <Loader2 className="size-4 animate-spin text-primary/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Fetching Standings
                </span>
              </div>
              <ClassroomLeaderboardSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              className="rounded-[2rem] border-2 border-dashed border-destructive/20 bg-destructive/5 p-12 text-center"
            >
              <p className="text-lg font-bold text-destructive">{error}</p>
              <Button
                className="mt-4 rounded-xl"
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
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
                <LeaderboardClassroomCard
                  key={leaderboard.classroom.id}
                  leaderboard={leaderboard}
                />
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
      className="group relative flex min-h-[300px] flex-col"
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border p-7 transition-all duration-500",
          "border-border/50 bg-card/40 shadow-sm backdrop-blur-xl hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
        )}
      >
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-[60px] transition-colors duration-700 group-hover:bg-primary/20 -z-10" />

        <div className="mb-8 flex items-center justify-between">
          <Badge
            variant="secondary"
            className="rounded-lg border-border/50 bg-background/50 px-3 py-1 text-[10px] font-black uppercase tracking-widest"
          >
            {leaderboard.myMembershipRole}
          </Badge>
          <div className="flex items-center gap-1.5 text-primary">
            <Users className="size-3.5" />
            <span className="text-xs font-bold tabular-nums">{leaderboard.totalMembers}</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <h2 className="text-2xl font-black leading-[1.1] tracking-tighter transition-colors group-hover:text-primary">
            {leaderboard.classroom.name}
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground/60">
            <Building2 className="size-3.5" />
            <span className="truncate text-[13px] font-medium">
              {leaderboard.classroom.institutionName}
            </span>
          </div>
        </div>

        <div className="my-8 grid grid-cols-2 gap-3">
          <div className="space-y-1 rounded-3xl border border-border/40 bg-background/60 p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Star className="size-3" /> Rank
            </div>
            <p className="text-2xl font-black italic tracking-tight">
              {leaderboard.myRank ? `#${leaderboard.myRank.rank}` : "--"}
            </p>
          </div>
          <div className="space-y-1 rounded-3xl border border-border/40 bg-background/60 p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <Crown className="size-3 text-amber-500" /> Leader
            </div>
            <p className="truncate text-[13px] font-black">{firstPlace ? firstPlace.name : "N/A"}</p>
          </div>
        </div>

        <Link href={`/dashboard/classroom/leaderboard/${leaderboard.classroom.id}`} className="mt-auto">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className={cn(
              "group/btn flex items-center justify-between rounded-2xl p-4 transition-all",
              "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40"
            )}
          >
            <span className="text-sm font-bold tracking-tight">Enter Leaderboard</span>
            <div className="rounded-lg bg-white/20 p-1">
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ClassroomLeaderboardPage;
