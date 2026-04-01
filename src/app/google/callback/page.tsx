"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Sparkles, LoaderCircle, ArrowRight } from "lucide-react";

const GoogleCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const completeGoogleLogin = async () => {
      try {
        const code = searchParams.get("code");
        const redirectPath = searchParams.get("redirect") || "/dashboard";
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiBaseUrl) {
          router.replace("/login?error=missing_api_base_url");
          return;
        }

        if (!code) {
          router.replace("/login?error=missing_oauth_code");
          return;
        }

        const exchangeResponse = await fetch(`${apiBaseUrl}/auth/oauth/code?code=${encodeURIComponent(code)}`, {
          method: "GET",
        });

        if (!exchangeResponse.ok) {
          router.replace("/login?error=oauth_exchange_failed");
          return;
        }

        const exchangePayload = await exchangeResponse.json();

        const completeResponse = await fetch("/api/auth/oauth/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...exchangePayload.data,
            redirectPath,
          }),
        });

        if (!completeResponse.ok) {
          router.replace("/login?error=oauth_cookie_sync_failed");
          return;
        }

        const completePayload = await completeResponse.json();
        router.replace(completePayload.redirectTo || "/dashboard");
      } catch (error) {
        console.error("Google login completion failed:", error);
        router.replace("/login?error=oauth_completion_failed");
      }
    };

    void completeGoogleLogin();
  }, [router, searchParams]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-10">
      <div className="absolute inset-0">
        <div className="absolute left-[-10%] top-[-8%] h-[420px] w-[420px] rounded-full bg-emerald-500/12 blur-[110px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[460px] w-[460px] rounded-full bg-sky-500/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.04] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] bg-[grid-black_1px_1px] dark:bg-[grid-white_1px_1px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-border/60 bg-card/75 shadow-2xl backdrop-blur-xl">
        <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
          <section className="relative p-8 md:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              Secure Google Handoff
            </div>

            <div className="mt-8 space-y-5">
              <h1 className="text-4xl font-black tracking-tight text-foreground md:text-5xl">
                Finishing your
                <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 bg-clip-text text-transparent">
                  Google sign in
                </span>
              </h1>

              <p className="max-w-xl text-base font-medium leading-7 text-muted-foreground md:text-lg">
                We&apos;re verifying your Google session, syncing your Acadex account, and preparing the fastest route to your dashboard.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <ProgressRow label="Verifying Google account" />
              <ProgressRow label="Syncing your Acadex session" />
              <ProgressRow label="Opening your workspace" />
            </div>
          </section>

          <aside className="relative border-t border-border/60 bg-muted/30 p-8 md:border-l md:border-t-0 md:p-12">
            <div className="mx-auto flex max-w-sm flex-col items-center text-center">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-500 to-sky-500 shadow-2xl shadow-emerald-500/20">
                <LoaderCircle className="h-12 w-12 animate-spin text-white" />
                <div className="absolute -right-2 -top-2 rounded-full bg-background p-2 shadow-lg">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Almost there
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  This usually takes just a moment. If everything is healthy, you&apos;ll be redirected automatically.
                </p>
              </div>

              <div className="mt-8 w-full rounded-3xl border border-border/60 bg-background/70 p-4 text-left shadow-sm">
                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>Redirect status</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    In progress
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

const ProgressRow = ({ label }: { label: string }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3 shadow-sm">
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
      <LoaderCircle className="h-4 w-4 animate-spin" />
    </div>
    <div>
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">Running now</p>
    </div>
  </div>
);

export default GoogleCallbackPage;
