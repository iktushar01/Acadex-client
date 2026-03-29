"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { forgotPasswordAction } from "@/actions/authActions/_forgotPasswordAction";
import { resetPasswordAction } from "@/actions/authActions/_resetPasswordAction";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import AppField from "@/components/shared/form/ReUsableField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { resetPasswordZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") || "";
  const sentFromQuery = searchParams.get("sent") === "true";

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(
    sentFromQuery
      ? "A reset code was sent if the account exists and the email is verified."
      : null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: resetPasswordAction,
  });

  const { mutateAsync: resendCode, isPending: isResending } = useMutation({
    mutationFn: forgotPasswordAction,
  });

  const form = useForm({
    defaultValues: {
      email: emailFromQuery,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMessage(null);

      try {
        const result = await mutateAsync(value);

        if (!result.success) {
          setServerError(result.message || "Failed to reset password");
          return;
        }

        router.push(
          `/login?reset=success&email=${encodeURIComponent(value.email)}`
        );
      } catch (error: any) {
        setServerError(error.message || "Failed to reset password");
      }
    },
  });

  const handleResendCode = async () => {
    const enteredEmail = form.getFieldValue("email");
    const validation = resetPasswordZodSchema.shape.email.safeParse(enteredEmail);

    setServerError(null);

    if (!validation.success) {
      setServerError(validation.error.issues[0]?.message || "Invalid email");
      return;
    }

    const result = await resendCode({ email: validation.data });

    if (!result.success) {
      setServerError(result.message || "Failed to resend reset code");
      return;
    }

    setSuccessMessage(
      "A new reset code was requested. Check your inbox and spam folder."
    );
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6 py-10">
      <div
        className="absolute inset-0 z-0 opacity-30 pointer-events-none dark:opacity-10"
        style={{
          backgroundImage: "linear-gradient(var(--muted) 1px, transparent 1px)",
          backgroundSize: "100% 2.5rem",
        }}
      />
      <div className="absolute top-0 left-[10%] h-full w-[2px] bg-destructive/10 z-0 md:left-[15%] lg:left-[20%]" />

      <nav className="absolute top-6 left-6 z-20">
        <Link href={emailFromQuery ? `/forgot-password` : "/login"}>
          <Button
            variant="ghost"
            className="group gap-2 rounded-full hover:bg-primary/10 hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Button>
        </Link>
      </nav>

      <div className="relative w-full max-w-[560px] z-10">
        <div className="w-full rounded-[2.5rem] border border-border bg-card/80 p-8 md:p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <KeyRound className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground">
              Reset Your Password
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the email, OTP, and your new password to finish recovery.
            </p>
          </div>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            <form.Field
              name="email"
              validators={{ onChange: resetPasswordZodSchema.shape.email }}
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
              name="otp"
              validators={{ onChange: resetPasswordZodSchema.shape.otp }}
            >
              {(field) => (
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <Label className="text-sm font-semibold tracking-wide text-foreground/70">
                      Reset OTP
                    </Label>
                    <span className="text-[10px] uppercase opacity-30 font-bold tracking-widest">
                      otp
                    </span>
                  </div>

                  <InputOTP
                    maxLength={6}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(value) => field.handleChange(value)}
                  >
                    <InputOTPGroup className="grid w-full grid-cols-6 gap-2">
                      {[...Array(6)].map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-12 w-full rounded-xl border-2 border-muted-foreground/20 text-lg font-bold transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="px-1 text-xs font-medium text-destructive">
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="newPassword"
              validators={{ onChange: resetPasswordZodSchema.shape.newPassword }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  prepend={<Lock className="h-4 w-4" />}
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      variant="ghost"
                      size="icon"
                      className="hover:bg-transparent"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            <form.Field
              name="confirmPassword"
              validators={{ onChange: resetPasswordZodSchema.shape.confirmPassword }}
            >
              {(field) => (
                <AppField
                  field={field}
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  prepend={<Lock className="h-4 w-4" />}
                  append={
                    <Button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      variant="ghost"
                      size="icon"
                      className="hover:bg-transparent"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  }
                />
              )}
            </form.Field>

            {serverError && (
              <Alert
                variant="destructive"
                className="rounded-xl bg-destructive/5 border-destructive/20"
              >
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="rounded-xl border-primary/20 bg-primary/5 text-primary">
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe selector={(s) => [s.canSubmit] as const}>
              {([canSubmit]) => (
                <AppSubmitButton
                  isPending={isPending}
                  pendingLabel="Resetting Password..."
                  disabled={!canSubmit}
                >
                  Update Password
                </AppSubmitButton>
              )}
            </form.Subscribe>
          </form>

          <div className="mt-8 border-t border-border/50 pt-6 text-center">
            <p className="mb-4 text-xs text-muted-foreground">
              Didn&apos;t receive the OTP yet?
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 rounded-xl gap-2 font-bold px-6 hover:bg-secondary border-dashed"
              onClick={handleResendCode}
              disabled={isResending}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`}
              />
              {isResending ? "Resending..." : "Resend Reset Code"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordForm;
