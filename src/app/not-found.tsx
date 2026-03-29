"use client";

import Link from "next/link";
import { MoveLeft, Home, AlertCircle, RefreshCcw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background px-6">
      {/* 1. Animated Ambient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* 2. Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] bg-[grid-black_1px_1px] dark:bg-[grid-white_1px_1px]" />

      <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
        {/* 3. The "404" Hero Section */}
        <div className="relative inline-block">
          <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/10 select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
             <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none px-4 py-1 text-lg rounded-full shadow-xl shadow-orange-500/20 rotate-[-5deg]">
               Lost in Space?
             </Badge>
          </div>
        </div>

        {/* 4. Text Content */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight flex items-center justify-center gap-3">
            <AlertCircle className="h-8 w-8 text-orange-500" />
            Classroom Not Found
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto font-medium">
            The page you're looking for has been moved, deleted, or perhaps never existed in this curriculum.
          </p>
        </div>

        {/* 5. Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            variant="default" 
            size="lg" 
            asChild
            className="rounded-2xl px-8 h-14 font-bold text-base shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Link>
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.location.reload()}
            className="rounded-2xl px-8 h-14 font-bold text-base bg-background/50 backdrop-blur-md transition-all hover:bg-muted"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
        </div>

        {/* 6. Breadcrumb-style footer */}
        <div className="pt-12">
            <Link 
              href="/dashboard" 
              className="text-sm font-bold text-muted-foreground hover:text-orange-500 transition-colors flex items-center justify-center gap-2 group"
            >
              <MoveLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>
        </div>
      </div>

      {/* 7. Decorative Subtle Icon */}
      <Zap className="absolute bottom-10 right-10 h-32 w-32 text-foreground/5 -rotate-12 pointer-events-none" />
    </div>
  );
};

// Simple Badge component if not using shadcn/ui
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </span>
);

export default NotFound;