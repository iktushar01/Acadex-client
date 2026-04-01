"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpenText,
  Building2,
  Copy,
  FlaskConical,
  GraduationCap,
  Layers,
  Loader2,
  LogOut,
  MoreVertical,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { leaveClassroomAction } from "@/actions/classroomActions/_leaveClassroomAction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Membership } from "@/types/classroom.types";

type ClassroomTheme = {
  bg: string;
  text: string;
  light: string;
  border: string;
  shadow: string;
  glow: string;
};

const THEMES: Record<string, ClassroomTheme> = {
  orange: { bg: "bg-orange-500", text: "text-orange-500", light: "bg-orange-500/10", border: "border-orange-500/20", shadow: "shadow-orange-500/20", glow: "group-hover:shadow-orange-500/10" },
  blue: { bg: "bg-blue-600", text: "text-blue-600", light: "bg-blue-600/10", border: "border-blue-600/20", shadow: "shadow-blue-600/20", glow: "group-hover:shadow-blue-600/10" },
  purple: { bg: "bg-purple-600", text: "text-purple-600", light: "bg-purple-600/10", border: "border-purple-600/20", shadow: "shadow-purple-600/20", glow: "group-hover:shadow-purple-600/10" },
  emerald: { bg: "bg-emerald-600", text: "text-emerald-600", light: "bg-emerald-600/10", border: "border-emerald-600/20", shadow: "shadow-emerald-600/20", glow: "group-hover:shadow-emerald-600/10" },
};

const getTheme = (id: string) => {
  const keys = Object.keys(THEMES);
  const index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return THEMES[keys[index % keys.length]];
};

type ClassroomCardProps = {
  membership: Membership;
  onLeftClassroom?: (classroomId: string) => void;
};

export const ClassroomCard = ({ membership, onLeftClassroom }: ClassroomCardProps) => {
  const cls = membership.classroom;
  const theme = getTheme(cls.id);
  const activeStudentsCount = cls._count?.memberships ?? 0;
  const creatorImage = cls.creator.image ?? undefined;
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);

  const copyJoinCode = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(cls.joinCode);
    toast.success("Code copied to clipboard", {
      description: `Class code ${cls.joinCode} is ready to share.`,
      icon: <Copy className="h-4 w-4" />,
    });
  };

  const { mutate: handleLeaveClassroom, isPending: isLeaving } = useMutation({
    mutationFn: leaveClassroomAction,
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Classroom left", {
        description: `You have left ${cls.name}.`,
      });
      setLeaveModalOpen(false);
      onLeftClassroom?.(cls.id);
    },
    onError: () => {
      toast.error("Failed to leave classroom. Please try again.");
    },
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Card
          className={cn(
            "group relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-xl transition-all duration-500",
            "hover:border-border/80 hover:ring-1 hover:ring-border/50",
            theme.glow
          )}
        >
          <div
            className={cn(
              "absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[80px] opacity-0 transition-opacity duration-700 group-hover:opacity-20",
              theme.bg
            )}
          />

          <div className="relative z-10 flex h-full flex-col p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <motion.div
                whileHover={{ rotate: -5, scale: 1.05 }}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-xl transition-all duration-500 sm:h-14 sm:w-14",
                  theme.bg,
                  theme.shadow
                )}
              >
                <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" />
              </motion.div>

              <div className="flex w-full flex-row items-start justify-between gap-3 sm:w-auto sm:flex-col sm:items-end">
                <div className="flex min-w-0 flex-wrap gap-1.5 sm:justify-end">
                  <Badge
                    variant="outline"
                    className="bg-background/50 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md"
                  >
                    {cls.level}
                  </Badge>
                  <Badge
                    className={cn(
                      "border-none text-[10px] font-bold uppercase tracking-wider text-white",
                      theme.bg
                    )}
                  >
                    {membership.memberRole}
                  </Badge>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary/80">
                      <MoreVertical className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 rounded-xl border-border/40 bg-background/95 p-2 backdrop-blur-xl">
                    <DropdownMenuItem onClick={copyJoinCode} className="cursor-pointer gap-2 rounded-lg py-2.5 focus:bg-primary/5">
                      <Copy className="h-4 w-4" /> Copy Join Code
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={membership.memberRole === "CR"}
                      onClick={(event) => {
                        event.preventDefault();
                        setLeaveModalOpen(true);
                      }}
                      className="cursor-pointer gap-2 rounded-lg py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Leave Class
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mt-4 flex-1 space-y-4 sm:mt-6">
              <div className="min-w-0">
                <h3 className="break-words text-lg font-black leading-tight tracking-tight decoration-border/50 underline-offset-4 group-hover:underline sm:text-2xl">
                  {cls.name}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <div className="flex h-5 shrink-0 items-center rounded-md bg-muted/50 px-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                    CODE
                  </div>
                  <code className={cn("max-w-full break-all text-xs font-bold transition-colors", theme.text)}>
                    {cls.joinCode}
                  </code>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { icon: Layers, eyebrow: "Class", label: cls.className || "Class not set" },
                  { icon: FlaskConical, eyebrow: "Department", label: cls.department || "Department not set" },
                  { icon: Users, eyebrow: "Students", label: `${activeStudentsCount} active` },
                  { icon: Building2, eyebrow: "Institution", label: cls.institutionName },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="min-w-0 rounded-2xl border border-border/30 bg-secondary/20 p-3 transition-colors group-hover:bg-secondary/40"
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-0.5 rounded-xl p-2", theme.light)}>
                        <item.icon className={cn("h-4 w-4 shrink-0", theme.text)} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
                          {item.eyebrow}
                        </p>
                        <p className="mt-1 break-words text-sm font-bold leading-5 text-foreground">{item.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="min-w-0 items-center gap-3 rounded-2xl border border-border/30 bg-secondary/20 p-3 sm:flex">
                <Avatar className="h-10 w-10 border-2 border-background ring-1 ring-border/20 shadow-sm">
                  <AvatarImage src={creatorImage} />
                  <AvatarFallback className={cn("font-bold text-white", theme.bg)}>
                    {cls.creator.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-foreground/90">{cls.creator.name}</span>
                  <span className="flex items-center gap-1 truncate text-[10px] font-medium text-muted-foreground">
                    <ShieldCheck className="h-3 w-3" /> Created by class owner
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-border/40 pt-4 sm:mt-8 sm:pt-5">
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                {membership.memberRole === "CR" && (
                  <Link href={`/dashboard/classroom/${cls.id}/manage`} className="w-full">
                    <Button variant="outline" className="w-full rounded-2xl px-4 font-bold">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      CR Manage
                    </Button>
                  </Link>
                )}
                <Link
                  href={`/dashboard/classroom/${cls.id}`}
                  className={membership.memberRole === "CR" ? "w-full" : "w-full sm:col-span-2"}
                >
                  <Button
                    className={cn(
                      "w-full rounded-2xl px-4 font-bold text-white transition-all duration-300",
                      theme.bg,
                      "shadow-lg hover:brightness-110 hover:shadow-xl"
                    )}
                  >
                    Enter
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <Zap
            className={cn(
              "absolute -bottom-10 -right-10 h-40 w-40 rotate-12 opacity-[0.02] transition-all duration-1000 group-hover:scale-110 group-hover:rotate-[30deg] group-hover:opacity-[0.06]",
              theme.text
            )}
          />
        </Card>
      </motion.div>

      <AlertDialog open={leaveModalOpen} onOpenChange={setLeaveModalOpen}>
        <AlertDialogContent className="rounded-[2rem]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-black">
              Leave this classroom?
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-muted-foreground">
              You will lose access to <span className="font-bold text-foreground">{cls.name}</span> until you join again with the classroom code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={isLeaving} className="rounded-xl font-bold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isLeaving}
              onClick={() => handleLeaveClassroom(cls.id)}
              variant="destructive"
              className="rounded-xl font-bold"
            >
              {isLeaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Leave Classroom"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
