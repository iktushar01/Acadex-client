"use client";

import { motion } from "framer-motion";
import { 
  GraduationCap, MoreVertical, BookOpen, Building2, 
  ArrowRight, Zap, Layers, FlaskConical, Copy, ExternalLink 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const THEMES: Record<string, any> = {
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

export const ClassroomCard = ({ membership }: { membership: any }) => {
  const cls = membership.classroom;
  const theme = getTheme(cls.id);

  const copyJoinCode = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(cls.joinCode);
    toast.success("Code copied to clipboard", {
      description: `Class code ${cls.joinCode} is ready to share.`,
      icon: <Copy className="h-4 w-4" />,
    });
  };

  return (
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

        <div className="relative z-10 p-6">
          <div className="flex items-start justify-between">
            <motion.div 
              whileHover={{ rotate: -5, scale: 1.05 }}
              className={cn("flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl transition-all duration-500", theme.bg, theme.shadow)}
            >
              <GraduationCap className="h-7 w-7" />
            </motion.div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-1.5">
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
                  <DropdownMenuItem className="gap-2 cursor-pointer py-2.5 rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive">
                    Leave Class
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <h3 className="text-2xl font-black leading-tight tracking-tight group-hover:underline decoration-border/50 underline-offset-4">
                {cls.name}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex h-5 items-center rounded-md bg-muted/50 px-2 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                  CODE
                </div>
                <code className={cn("text-xs font-bold transition-colors", theme.text)}>
                  {cls.joinCode}
                </code>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Layers, label: cls.className },
                { icon: FlaskConical, label: cls.department }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl border border-border/30 bg-secondary/20 p-2.5 transition-colors group-hover:bg-secondary/40">
                  <item.icon className={cn("h-4 w-4 shrink-0", theme.text)} />
                  <span className="truncate text-xs font-bold leading-none tracking-tight">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-background ring-1 ring-border/20 shadow-sm">
                <AvatarImage src={cls.creator.image} />
                <AvatarFallback className={cn("text-white font-bold", theme.bg)}>
                  {cls.creator.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground/90">{cls.creator.name}</span>
                <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> {cls.institutionName}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between pt-5 border-t border-border/40">
            <div className="flex flex-col gap-1">
  
              <span className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">
                {cls._count.memberships} Active Students
              </span>
            </div>

            <Link href={`/dashboard/classroom/${cls.id}`}>
              <Button 
                className={cn(
                  "rounded-2xl px-6 font-bold text-white transition-all duration-300",
                  theme.bg, "shadow-lg hover:brightness-110 hover:shadow-xl group-hover:px-8"
                )}
              >
                Enter
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Watermark */}
        <Zap className={cn(
          "absolute -bottom-10 -right-10 h-40 w-40 rotate-12 transition-all duration-1000 opacity-[0.02] group-hover:opacity-[0.06] group-hover:rotate-[30deg] group-hover:scale-110",
          theme.text
        )} />
      </Card>
    </motion.div>
  );
};