"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, Mail, RefreshCw, ShieldCheck, Timer } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { verifyEmailAction } from "@/app/(authRouteGroup)/verify-email/_verifyEmailAction";

const VerifyEmailForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "your email";

  // States
  const [otp, setOtp] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isResending, setIsResending] = useState(false);

  // Timer Countdown Logic
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  // Helper to format seconds into MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (otp: string) => verifyEmailAction({ email, otp }),
  });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (timeLeft <= 0) {
      setServerError("OTP has expired. Please request a new one.");
      return;
    }

    try {
      const result = await mutateAsync(otp);

      if (result?.success) {
        router.push("/login?verified=true");
      } else {
        setServerError(result?.message || "Invalid or expired code");
      }
    } catch (error: any) {
      setServerError("A network error occurred.");
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setServerError(null);
    try {
      // Logic for resending OTP would go here (calling a server action)
      // await resendOtpAction(email); 
      
      setTimeLeft(900); // Reset timer to 15 mins
      setOtp(""); // Clear input
      console.log("New OTP sent to:", email);
    } catch (error: any) {
      setServerError("Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background">
      {/* NOTEPAD BACKGROUND EFFECT */}
      <div
        className="absolute inset-0 z-0 opacity-30 dark:opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--muted) 1px, transparent 1px)`,
          backgroundSize: "100% 2.5rem",
        }}
      />
      <div className="absolute top-0 left-[10%] h-full w-[2px] bg-destructive/10 z-0 md:left-[15%] lg:left-[20%]" />

      <nav className="absolute top-6 left-6 z-20">
        <Link href="/register">
          <Button variant="ghost" className="group gap-2 rounded-full hover:bg-primary/10 hover:text-primary">
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </Link>
      </nav>

      <div className="relative w-full max-w-[500px] px-6 z-10">
        <div className="w-full rounded-[2.5rem] border border-border bg-card/80 p-8 md:p-12 shadow-2xl backdrop-blur-xl text-center">
          
          <div className="flex flex-col items-center mb-8">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <ShieldCheck className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground">Verify Your Identity</h2>
            
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground truncate max-w-[200px]">
                  {email}
                </span>
              </div>
              
              {/* TIMER DISPLAY */}
              <div className={`flex items-center gap-1.5 text-sm font-bold ${timeLeft < 60 ? "text-destructive animate-pulse" : "text-primary"}`}>
                <Timer className="h-4 w-4" />
                <span>Code expires in: {formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-10">
            <div className="flex flex-col items-center gap-4">
              <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Enter 6-Digit Code
              </Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={timeLeft <= 0}
              >
                <InputOTPGroup className="gap-2 md:gap-3">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="h-12 w-10 md:h-14 md:w-12 rounded-xl border-2 border-muted-foreground/20 text-lg font-bold transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {serverError && (
              <Alert variant="destructive" className="rounded-2xl border-destructive/20 bg-destructive/5 text-left animate-in fade-in zoom-in-95">
                <AlertDescription className="text-xs font-medium">{serverError}</AlertDescription>
              </Alert>
            )}

            <AppSubmitButton
              isPending={isPending}
              pendingLabel="Verifying..."
              disabled={otp.length !== 6 || isPending || timeLeft <= 0}
            >
              Verify Account
            </AppSubmitButton>
          </form>

          <div className="mt-10 pt-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-4">
              Didn't receive the code or is it expired?
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 rounded-xl gap-2 font-bold px-6 hover:bg-secondary border-dashed"
              onClick={handleResendOtp}
              disabled={isResending || isPending || (timeLeft > 840)} // Disable for first 1 min after resend
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
              {isResending ? "Resending..." : "Resend New Code"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VerifyEmailForm;