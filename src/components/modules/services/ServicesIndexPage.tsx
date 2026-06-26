import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Calendar,
  CalendarDays,
  FileStack,
  GraduationCap,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

type ServiceCategory = {
  id: string;
  title: string;
  emoji: string;
  items: ServiceItem[];
};

const categories: ServiceCategory[] = [
  {
    id: "documents",
    title: "Documents",
    emoji: "📄",
    items: [
      {
        id: "cover-page",
        title: "Lab report & Assignment cover page",
        description:
          "Generate a printable A4 cover page with institution logo, course details, and download as PNG or PDF.",
        href: "/dashboard/services/cover-page",
        icon: FileStack,
      },
    ],
  },
  {
    id: "study",
    title: "Study Tools",
    emoji: "📚",
    items: [
      {
        id: "exam-planner",
        title: "Exam Countdown & Study Planner",
        description:
          "Track exams, daily chapter targets, revision phases, urgency colors, and study streaks.",
        href: "/dashboard/services/exam-planner",
        icon: Calendar,
      },
      {
        id: "flashcards",
        title: "Flashcard Maker",
        description:
          "Turn pasted notes into flashcards. Study with classic, quiz, and write modes plus spaced repetition.",
        href: "/dashboard/services/flashcards",
        icon: Layers,
      },
    ],
  },
  {
    id: "academic",
    title: "Academic Utilities",
    emoji: "🎓",
    items: [
      {
        id: "gpa-calculator",
        title: "GPA / CGPA Calculator",
        description:
          "Calculate semester GPA and overall CGPA using the Bangladesh grade scale, with goal prediction and PDF export.",
        href: "/dashboard/services/gpa-calculator",
        icon: GraduationCap,
      },
    ],
  },
  {
    id: "campus",
    title: "Campus Life",
    emoji: "🗓️",
    items: [
      {
        id: "timetable",
        title: "Weekly Timetable",
        description:
          "Paste or build your class routine, detect conflicts, spot free time, and export a shareable PNG.",
        href: "/dashboard/services/timetable",
        icon: CalendarDays,
      },
    ],
  },
];

const ServicesIndexPage = () => {
  return (
    <div className="mx-auto max-w-5xl space-y-10 animate-in fade-in duration-500 pb-12">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
          <Sparkles className="h-3 w-3" />
          Student services
        </div>
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">Services</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Notes → flashcards → study planner → timetable → exam countdown → GPA tracking. Your complete learning pipeline.
        </p>
      </div>

      {categories.map((category) => (
        <section key={category.id} className="space-y-4">
          <h2 className="text-lg font-black tracking-tight">
            <span className="mr-2">{category.emoji}</span>
            {category.title}
          </h2>
          <ul className="grid gap-4">
            {category.items.map((s) => (
              <li key={s.id}>
                <Card className="group relative overflow-hidden rounded-[2rem] border border-border/50 bg-card/80 p-6 shadow-sm transition-all hover:border-primary/30 md:p-8">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <s.icon className="h-7 w-7" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black tracking-tight md:text-2xl">{s.title}</h3>
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
        </section>
      ))}
    </div>
  );
};

export default ServicesIndexPage;
