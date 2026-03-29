"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  GraduationCap, MoreVertical, Building2,
  ArrowRight, Zap, Layers, FlaskConical, Copy, LogOut, Loader2, ShieldCheck
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
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
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { leaveClassroomAction } from "@/actions/classroomActions/_leaveClassroomAction";
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
        <Card className={cn(
          "group relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-xl transition-all duration-500",
          "hover:border-border/80 hover:ring-1 hover:ring-border/50",
          theme.glow
        )}>
        {/* Dynamic Gradient Background Glow */}
        <div className={cn(
          "absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[80px] opacity-0 transition-opacity duration-700 group-hover:opacity-20",
          theme.bg
        )} />

        <div className="relative z-10 flex h-full flex-col p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <motion.div 
              whileHover={{ rotate: -5, scale: 1.05 }}
              className={cn("flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl transition-all duration-500", theme.bg, theme.shadow)}
            >
              <GraduationCap className="h-7 w-7" />
            </motion.div>

            <div className="flex flex-col gap-3 sm:items-end">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="bg-background/50 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                  {cls.level}
                </Badge>
                <Badge className={cn("border-none text-[10px] font-bold text-white uppercase tracking-wider", theme.bg)}>
                  {membership.memberRole}
                </Badge>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-secondary/80">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl p-2 border-border/40 bg-background/95 backdrop-blur-xl">
                  <DropdownMenuItem onClick={copyJoinCode} className="gap-2 cursor-pointer py-2.5 rounded-lg focus:bg-primary/5">
                    <Copy className="h-4 w-4" /> Copy Join Code
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="opacity-50" />
                  <DropdownMenuItem
                    disabled={membership.memberRole === "CR"}
                    onClick={(event) => {
                      event.preventDefault();
                      setLeaveModalOpen(true);
                    }}
                    className="gap-2 cursor-pointer py-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Leave Class
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-6 flex-1 space-y-5 sm:mt-8">
            <div className="min-w-0">
              <h3 className="break-words text-xl font-black leading-tight tracking-tight group-hover:underline decoration-border/50 underline-offset-4 sm:text-2xl">
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
                { icon: Layers, label: cls.className || "Class not set" },
                { icon: FlaskConical, label: cls.department || "Department not set" }
              ].map((item, i) => (
                <div key={i} className="min-w-0 flex items-center gap-2 rounded-xl border border-border/30 bg-secondary/20 p-2.5 transition-colors group-hover:bg-secondary/40">
                  <item.icon className={cn("h-4 w-4 shrink-0", theme.text)} />
                  <span className="truncate text-xs font-bold leading-none tracking-tight">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/30 bg-secondary/20 px-3 py-2.5">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">
                Active Students
              </span>
              <span className={cn("text-sm font-black tracking-tight", theme.text)}>
                {cls._count.memberships}
              </span>
            </div>

            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-background ring-1 ring-border/20 shadow-sm">
                <AvatarImage src={cls.creator.image} />
                <AvatarFallback className={cn("text-white font-bold", theme.bg)}>
                  {cls.creator.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-foreground/90">{cls.creator.name}</span>
                <span className="flex items-center gap-1 truncate text-[10px] font-medium text-muted-foreground">
                  <Building2 className="h-3 w-3" /> {cls.institutionName}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border/40 pt-5">
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[260px]">
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
                    "shadow-lg hover:brightness-110 hover:shadow-xl lg:group-hover:px-6"
                  )}
                >
                  Enter
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative Watermark */}
        <Zap className={cn(
          "absolute -bottom-10 -right-10 h-40 w-40 rotate-12 transition-all duration-1000 opacity-[0.02] group-hover:opacity-[0.06] group-hover:rotate-[30deg] group-hover:scale-110",
          theme.text
        )} />
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
            <AlertDialogCancel
              disabled={isLeaving}
              className="rounded-xl font-bold"
            >
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
