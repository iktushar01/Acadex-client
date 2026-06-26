"use client";

import { useState } from "react";
import {
  Coffee,
  Heart,
  Loader2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDonationCheckoutAction } from "@/actions/donationActions/_createDonationCheckoutAction";
import { toast } from "sonner";

const presetAmounts = [
  { label: "$5", cents: 500, icon: Coffee },
  { label: "$10", cents: 1000, icon: Heart },
  { label: "$25", cents: 2500, icon: Sparkles },
  { label: "$50", cents: 5000, icon: Zap },
];

const perks = [
  "Keep Acadex free for students on campus",
  "Fund server costs, storage, and new classroom tools",
  "Support moderation, notes review, and AI chatbot improvements",
];

function SupportUs() {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);

  const handleSupport = async () => {
    setIsLoading(true);

    try {
      const result = await createDonationCheckoutAction(selectedAmount);

      if (!result.success || !result.data?.url) {
        toast.error(result.message || "Could not start checkout");
        return;
      }

      window.location.href = result.data.url;
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      id="support"
      className="relative overflow-hidden bg-background py-24 md:py-32"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.1),transparent_40%)]" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[3rem] border border-border bg-card shadow-2xl shadow-orange-500/10">
            <div className="grid lg:grid-cols-2">
              <div className="relative border-b border-border p-8 md:p-12 lg:border-b-0 lg:border-r">
                <div className="absolute -right-8 -top-8 size-32 rounded-full bg-orange-500/10 blur-3xl" />

                <div className="relative space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-2">
                    <Heart className="size-4 text-orange-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">
                      Support Us
                    </span>
                  </div>

                  <h2 className="text-4xl font-black tracking-tighter md:text-5xl">
                    Help Acadex
                    <span className="block bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent italic">
                      Stay Free for Students
                    </span>
                  </h2>

                  <p className="max-w-xl text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
                    Acadex is built for real classrooms — notes, folders,
                    leaderboards, and collaboration. Your support helps cover
                    hosting and keeps the platform accessible for everyone.
                  </p>

                  <ul className="space-y-3">
                    {perks.map((perk) => (
                      <li
                        key={perk}
                        className="flex items-start gap-3 text-sm font-medium text-muted-foreground"
                      >
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-orange-500" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Choose an amount
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {presetAmounts.map(({ label, cents, icon: Icon }) => {
                        const isSelected = selectedAmount === cents;

                        return (
                          <button
                            key={cents}
                            type="button"
                            onClick={() => setSelectedAmount(cents)}
                            className={`rounded-[1.5rem] border-2 p-4 text-center transition-all duration-300 ${
                              isSelected
                                ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/15"
                                : "border-border bg-muted/30 hover:border-orange-500/40 hover:bg-muted/60"
                            }`}
                          >
                            <Icon
                              className={`mx-auto mb-2 size-5 ${
                                isSelected
                                  ? "text-orange-500"
                                  : "text-muted-foreground"
                              }`}
                            />
                            <span className="text-lg font-black">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-dashed border-orange-500/30 bg-orange-500/5 p-6">
                    <p className="text-sm font-medium text-muted-foreground">
                      You&apos;re about to contribute
                    </p>
                    <p className="mt-1 text-3xl font-black tracking-tight text-foreground">
                      ${(selectedAmount / 100).toFixed(2)}
                      <span className="ml-2 text-sm font-bold text-muted-foreground">
                        USD
                      </span>
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Secure checkout powered by Stripe. Card and other eligible
                      payment methods are supported.
                    </p>
                  </div>

                  <Button
                    onClick={handleSupport}
                    disabled={isLoading}
                    className="h-16 w-full rounded-2xl bg-orange-500 text-lg font-black text-white shadow-xl shadow-orange-500/20 hover:bg-orange-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
                        Redirecting to Stripe...
                      </>
                    ) : (
                      <>
                        Support Acadex
                        <Heart className="ml-2 size-5 fill-current" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupportUs;
