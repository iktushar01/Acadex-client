import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileStack, Sparkles } from "lucide-react";

const services = [
  {
    id: "cover-page",
    title: "Lab report cover page",
    description:
      "Generate a printable A4 cover page for lab reports and assignments. Add your institution logo, course details, and download as PNG or PDF.",
    href: "/dashboard/services/cover-page",
    icon: FileStack,
  },
];

const ServicesIndexPage = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
          <Sparkles className="h-3 w-3" />
          Student services
        </div>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">Services</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tools that help you prepare coursework — starting with cover pages for lab reports.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-1">
        {services.map((s) => (
          <li key={s.id}>
            <Card className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/80 p-6 shadow-sm transition-all hover:border-primary/30 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <s.icon className="h-7 w-7" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-black tracking-tight md:text-2xl">{s.title}</h2>
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                  </div>
                </div>
                <Button asChild size="lg" className="shrink-0 rounded-2xl font-bold">
                  <Link href={s.href}>
                    Open
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServicesIndexPage;
