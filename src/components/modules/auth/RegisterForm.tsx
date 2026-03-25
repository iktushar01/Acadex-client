"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerAction } from "@/app/(authRouteGroup)/register/_action";
import AppField from "@/components/shared/form/ReUsableField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
    Eye, EyeOff, Lock, Mail, ChevronLeft,
    GraduationCap, User, Camera, X
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";

const RegisterForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (payload: FormData) => registerAction(payload),
    });

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            image: null as any,
        },
        // Inside RegisterForm.tsx
// Inside RegisterForm.tsx -> onSubmit
onSubmit: async ({ value }) => {
    setServerError(null);
    try {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("email", value.email);
        formData.append("password", value.password);
        
        // Use the actual file object from TanStack Form state
        if (value.image) {
            formData.append("image", value.image); 
        }

        // CORRECT: Pass the formData instance itself
        const result = await mutateAsync(formData); 
        
        if (!result.success) {
            setServerError(result.message || "Registration failed");
        }
    } catch (error: any) {
        setServerError(`Registration failed: ${error.message}`);
    }
}
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const file = e.target.files?.[0];
    if (file) {
        field.handleChange(file);
        const url = URL.createObjectURL(file);
        setPreviews([url]); // We only need one preview for a profile pic
    }
};

const removeImage = (field: any) => {
    if (previews[0]) URL.revokeObjectURL(previews[0]);
    setPreviews([]);
    field.handleChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
};

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
            <div className="absolute top-0 left-[8%] h-full bg-destructive/10 z-0 md:left-[12%]" />

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
            <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-20 z-10 relative">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-[100px] animate-pulse" />
                <div className="relative space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="group relative flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-2xl shadow-primary/20 transition-transform hover:rotate-3">
                        <GraduationCap className="h-12 w-12 text-primary-foreground transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-7xl font-black tracking-tighter text-foreground leading-[1.1]">
                            Join the <br />
                            <span className="relative inline-block text-primary">
                                Community.
                                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>
                        <p className="max-w-md text-xl font-medium text-muted-foreground leading-relaxed">
                            Create your account to start sharing notes and collaborating with your classmates.
                        </p>
                    </div>
                </div>
            </div>

            {/* 4. FORM CARD (RIGHT-CENTERED) */}
            <div className="relative flex flex-1 items-center justify-center p-6 z-10 lg:justify-center lg:pr-32">
                <div className="w-full max-w-[550px] rounded-[2.5rem] border border-border bg-card/80 p-8 md:p-10 shadow-2xl backdrop-blur-xl">

                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground">Sign Up</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Start your journey with Acadex today!</p>
                    </div>

                    <form
                        noValidate
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        className="space-y-5"
                    >
                        <form.Field name="image">
    {(field) => (
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="relative group">
                {/* THE AVATAR CIRCLE */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative h-28 w-28 cursor-pointer rounded-full border-2 border-dashed border-muted-foreground/30 bg-secondary/20 transition-all hover:border-primary hover:bg-secondary/40 overflow-hidden"
                >
                    {previews[0] ? (
                        <Image 
                            src={previews[0]} 
                            alt="Profile" 
                            fill 
                            className="object-cover animate-in fade-in duration-300" 
                        />
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                            <User className="h-10 w-10 opacity-50" />
                        </div>
                    )}

                    {/* OVERLAY ON HOVER */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-6 w-6 text-white" />
                    </div>
                </div>

                {/* REMOVE BUTTON (Only shows if image exists) */}
                {previews[0] && (
                    <button
                        type="button"
                        onClick={() => removeImage(field)}
                        className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-white shadow-lg hover:bg-destructive/90 transition-transform active:scale-90"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* STATUS TEXT */}
            <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                    {previews[0] ? "Looking sharp!" : "Upload Profile Photo"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                    Recommended: Square JPG or PNG
                </p>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageChange(e, field)}
            />
        </div>
    )}
</form.Field>

                        <form.Field name="name" validators={{ onChange: registerZodSchema.shape.name }}>
                            {(field) => (
                                <AppField
                                    field={field}
                                    label="Full Name"
                                    placeholder="Ibrahim Khalil"
                                    prepend={<User className="h-4 w-4" />}
                                />
                            )}
                        </form.Field>

                        <form.Field name="email" validators={{ onChange: registerZodSchema.shape.email }}>
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

                        <form.Field name="password" validators={{ onChange: registerZodSchema.shape.password }}>
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

                        {serverError && (
                            <Alert variant="destructive" className="rounded-xl bg-destructive/5 border-destructive/20">
                                <AlertDescription>{serverError}</AlertDescription>
                            </Alert>
                        )}

                        <form.Subscribe selector={(s) => [s.canSubmit] as const}>
                            {([canSubmit]) => (
                                <AppSubmitButton
                                    isPending={isPending}
                                    pendingLabel="Creating Account..."
                                    disabled={!canSubmit}
                                >
                                    Create Account
                                </AppSubmitButton>
                            )}
                        </form.Subscribe>
                    </form>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-bold text-primary hover:underline underline-offset-4">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default RegisterForm;