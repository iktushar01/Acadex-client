import Link from "next/link";
import { ArrowLeft, HeartCrack } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportCancelPage() {
  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-24">
      <div className="max-w-lg rounded-[3rem] border border-border bg-card p-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-500">
          <HeartCrack className="size-10" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">
          Checkout cancelled
        </h1>
        <p className="mt-4 font-medium leading-relaxed text-muted-foreground">
          No payment was made. You can return anytime if you&apos;d like to
          support Acadex.
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-8 h-12 rounded-2xl px-8 font-bold"
        >
          <Link href="/#support">
            <ArrowLeft className="mr-2 size-4" />
            Back to Support
          </Link>
        </Button>
      </div>
    </div>
  );
}
