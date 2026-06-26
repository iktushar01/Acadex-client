import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type ServicePageHeaderProps = {
  badge: string;
  title: string;
  description: string;
};

export function ServicePageHeader({ badge, title, description }: ServicePageHeaderProps) {
  return (
    <div className="space-y-4">
      <Button asChild variant="ghost" size="sm" className="rounded-xl -ml-2">
        <Link href="/dashboard/services">
          <ArrowLeft className="mr-2 h-4 w-4" />
          All services
        </Link>
      </Button>
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
          {badge}
        </div>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
