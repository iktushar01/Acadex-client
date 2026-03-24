"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */


import { loginAction } from "@/app/(authRouteGroup)/login/_action";
import AppField from "@/components/shared/form/ReUsableField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Mail, ChevronLeft, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface LoginFormProps {
    redirectPath?: string;
}

const LoginForm = ({ redirectPath }: LoginFormProps) => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: ILoginPayload) => loginAction(payload, redirectPath),
    })

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        onSubmit: async ({ value }) => {
            setServerError(null);
            try {
                const result = await mutateAsync(value) as any;
                if (!result.success) {
                    setServerError(result.message || "Login failed");
                }
            } catch (error: any) {
                setServerError(`Login failed: ${error.message}`);
            }
        }
    })

    return (
        <main className="relative flex min-h-screen w-full flex-col lg:flex-row overflow-hidden bg-background">
            {/* 1. NOTEPAD BACKGROUND EFFECT */}
            <div 
                className="absolute inset-0 z-0 opacity-30 dark:opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(var(--muted) 1px, transparent 1px)`,
                    backgroundSize: '100% 2.5rem',
                }}
            />
            <div className="absolute top-0 left-[8%] h-full w-[1px] bg-destructive/10 z-0 md:left-[12%]" />

            {/* 2. HOME NAVIGATION */}
            <nav className="absolute top-6 left-6 z-20">
                <Link href="/">
                    <Button variant="ghost" className="group gap-2 rounded-full hover:bg-primary/10 hover:text-primary">
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Home
                    </Button>
                </Link>
            </nav>

            {/* 3. LEFT BRANDING (DESKTOP) */}
            <div className="hidden lg:flex flex-1 flex-col items-start justify-center p-20 z-10">
                <div className="space-y-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
                        <GraduationCap className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-foreground">
                        Study <br /> 
                        <span className="text-primary underline decoration-primary/30 underline-offset-8">Together.</span>
                    </h1>
                    <p className="max-w-sm text-lg font-medium text-muted-foreground leading-relaxed">
                        Join the central hub for classroom collaboration. Access notes, sync with classmates, and ace your exams.
                    </p>
                </div>
            </div>

            {/* 4. FORM CARD (RIGHT-CENTERED) */}
            <div className="relative flex flex-1 items-center justify-center p-6 z-10 lg:justify-center lg:pr-32">
                <div className="w-full max-w-[440px] rounded-[2.5rem] border border-border bg-card/80 p-8 md:p-10 shadow-2xl backdrop-blur-xl">
                    
                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Sign In</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Welcome back to Acadex!</p>
                    </div>

                    <form
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-5"
                    >
                        <form.Field
                            name="email"
                            validators={{ onChange: loginZodSchema.shape.email }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="University Email"
                                    type="email"
                                    placeholder="you@college.edu"
                                    prepend={<Mail className="h-4 w-4" />}
                                />
                            )}
                        </form.Field>

                        <form.Field
                            name="password"
                            validators={{ onChange: loginZodSchema.shape.password }}
                        >
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    prepend={<Lock className="h-4 w-4" />}
                                    append={
                                        <Button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            variant="ghost"
                                            size="icon"
                                            className="hover:bg-transparent"
                                        >
                                            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </Button>
                                    }
                                />
                            )}
                        </form.Field>

                        <div className="text-right">
                            <Link href="/forgot-password"  className="text-xs font-bold text-primary hover:underline underline-offset-4">
                                Forgot password?
                            </Link>
                        </div>

                        {serverError && (
                            <Alert variant="destructive" className="rounded-xl bg-destructive/5 border-destructive/20">
                                <AlertDescription>{serverError}</AlertDescription>
                            </Alert>
                        )}

                        <form.Subscribe selector={(s) => [s.canSubmit] as const}>
                            {([canSubmit]) => (
                                <AppSubmitButton 
                                    isPending={isPending} 
                                    pendingLabel="Checking Credentials..." 
                                    disabled={!canSubmit}
                                >
                                    Log In
                                </AppSubmitButton>
                            )}
                        </form.Subscribe>
                    </form>

                    {/* DIVIDER */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                        </div>
                    </div>

                    {/* GOOGLE LOGIN */}
                    <Button 
                        variant="outline" 
                        className="w-full h-11 rounded-xl font-semibold gap-3 border-border hover:bg-secondary transition-all" 
                        onClick={() => {
                            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
                            window.location.href = `${baseUrl}/auth/login/google${redirectPath ? `?redirect=${redirectPath}` : ''}`;
                        }}
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        </svg>
                        Google Account
                    </Button>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-bold text-primary hover:underline underline-offset-4">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    
    );
}

export default LoginForm;