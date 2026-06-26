"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { confirmDonationAction } from "@/actions/donationActions/_confirmDonationAction";

export default function SupportSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    void confirmDonationAction(sessionId);
  }, [sessionId]);

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-24">
      <div className="max-w-lg rounded-[3rem] border border-border bg-card p-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-500">
          <CheckCircle2 className="size-10" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Thank you!</h1>
        <p className="mt-4 font-medium leading-relaxed text-muted-foreground">
          Your support helps keep Acadex running for students. We really
          appreciate you backing the project.
        </p>
        <Button
          asChild
          className="mt-8 h-12 rounded-2xl bg-orange-500 px-8 font-bold hover:bg-orange-600"
        >
          <Link href="/">
            <Heart className="mr-2 size-4 fill-current" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
