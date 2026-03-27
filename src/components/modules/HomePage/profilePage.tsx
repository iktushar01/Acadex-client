"use client";

import { useQuery } from "@tanstack/react-query";
import { getCurrentUserAction } from "@/actions/_getCurrentUserAction";
import {
  Phone, MapPin, Calendar, User, Lock,
  MailCheck, Pencil, Camera, Loader2,
  CheckCircle2, ShieldCheck, Zap, Copy,
  Globe, BadgeCheck, Mail, ChevronRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ProfilePage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await getCurrentUserAction(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase animate-pulse">
          Decrypting Profile...
        </p>
      </div>
    );
  }

  const user = data?.data;

  if (isError || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4 p-12 rounded-[2.5rem] border border-destructive/20 bg-destructive/5 backdrop-blur-md">
          <ShieldCheck className="h-12 w-12 text-destructive mx-auto opacity-50" />
          <h2 className="text-2xl font-black italic tracking-tighter">Access Denied</h2>
          <p className="text-sm text-muted-foreground font-medium">
            {error?.message || "Internal system sync failure."}
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="rounded-2xl border-destructive/20 hover:bg-destructive/10 font-bold"
          >
            Re-authenticate
          </Button>
        </div>
      </div>
    );
  }

  const student = user.student;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-12 animate-in fade-in duration-1000">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* --- HEADER BLOCK (BENTO STYLE) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Identity Card */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-[3rem] border border-border bg-card p-8 md:p-10 shadow-premium group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
              <Zap className="size-64" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <Avatar className="h-40 w-40 border-[8px] border-background shadow-2xl transition-transform duration-500 hover:scale-105">
                  <AvatarImage src={user.image} className="object-cover" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-5xl font-black">
                    {user.name?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-2 right-2 p-3 bg-primary text-primary-foreground rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-background">
                  <Camera className="size-5" />
                </button>
              </div>

              <div className="text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">{user.name}</h1>
                    {user.emailVerified && <BadgeCheck className="size-8 text-primary fill-primary/10" />}
                  </div>
                  <p className="text-muted-foreground font-bold flex items-center justify-center md:justify-start gap-2">
                    {user.email} <Copy className="size-3 cursor-pointer hover:text-primary transition-colors" />
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1.5 rounded-xl font-black tracking-widest text-[10px] uppercase">
                    {user.role}
                  </Badge>
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary px-4 py-1.5 rounded-xl font-black tracking-widest text-[10px] uppercase">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Bento */}
          <div className="rounded-[3rem] bg-primary p-8 text-primary-foreground flex flex-col justify-between shadow-glow group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                <ShieldCheck className="size-6" />
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                <Pencil className="size-4" />
              </Button>
            </div>
            
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">Account Standing</p>
              <h3 className="text-3xl font-black italic tracking-tighter">Verified Member</h3>
              <p className="text-sm font-medium opacity-80 mt-2 leading-tight">
                Your profile is synchronized with the Acadex Core Registry.
              </p>
            </div>
          </div>
        </div>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CORE DATA */}
          <section className="lg:col-span-1 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-4">Core Dossier</h3>
            <div className="rounded-[2.5rem] border border-border bg-card p-4 space-y-2 shadow-sm">
              <InfoRow icon={<Phone />} label="Registry Contact" value={student?.contactNumber} />
              <InfoRow icon={<MapPin />} label="Base Location" value={student?.address} />
              <InfoRow icon={<User />} label="Gender Identity" value={student?.gender} />
              <InfoRow 
                icon={<Calendar />} 
                label="Enrolled Since" 
                value={new Date(user.createdAt).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })} 
              />
            </div>
          </section>

          {/* SYSTEM STATUS */}
          <section className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary px-4">System Integration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-6 rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-sm space-y-4 group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-green-500/10 text-green-600">
                    <MailCheck className="size-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Status</p>
                    <p className="font-bold">Primary Verified</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-sm space-y-4 opacity-60 group hover:opacity-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-muted text-muted-foreground">
                    <Lock className="size-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">2FA Layer</p>
                    <p className="font-bold">Not Enabled</p>
                  </div>
                </div>
              </div>

              {/* Advanced "Action" Card */}
              <div className="sm:col-span-2 p-8 rounded-[2.5rem] border border-border bg-muted/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="h-16 w-16 rounded-3xl bg-card border border-border flex items-center justify-center shadow-sm">
                    <Globe className="size-8 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-black text-xl tracking-tight">Security Audit</h4>
                    <p className="text-sm text-muted-foreground font-medium">Review your last login IP and device fingerprints.</p>
                  </div>
                </div>
                <Button className="rounded-2xl font-black bg-card text-foreground border border-border hover:bg-primary hover:text-primary-foreground h-12 px-6 transition-all group">
                  Access Logs <ChevronRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

// Reusable Small Component
const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors group">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
      {cloneElement(icon as React.ReactElement)}
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">{label}</p>
      <p className={`text-sm font-bold tracking-tight ${!value ? "text-muted-foreground/40 italic" : "text-foreground"}`}>
        {value || "Pending Update"}
      </p>
    </div>
  </div>
);

import { cloneElement } from "react";

export default ProfilePage;