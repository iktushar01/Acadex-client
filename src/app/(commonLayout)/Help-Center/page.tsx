"use client";

import React, { useState } from "react";
import {
  Search,
  BookOpen,
  UserPlus,
  MessageSquare,
  Bot,
  Wrench,
  ArrowRight,
  LifeBuoy,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

type Article = { title: string; body: string };

type Category = {
  title: string;
  icon: React.ReactNode;
  description: string;
  articles: Article[];
};

const HelpCenterPage = () => {
  const [query, setQuery] = useState("");
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  const categories: Category[] = [
    {
      title: "Getting Started",
      icon: <UserPlus className="size-6 text-orange-500" />,
      description: "Create your account, join a classroom, and find your way around the dashboard.",
      articles: [
        {
          title: "Creating an account",
          body: "Register with email and password or use Continue with Google. Verify your email if prompted, then sign in. Students land on the classroom dashboard; admins go to the admin command center.",
        },
        {
          title: "Joining a classroom",
          body: "Go to Dashboard → Classroom → Join. Enter the join code shared by your class representative (CR). You can only join classrooms that are approved and active. Once joined, the classroom appears on your dashboard with subjects, notes, and chat.",
        },
        {
          title: "Understanding roles",
          body: "Every user is a Student or Admin at the platform level. Inside each classroom you are either a Student member or a Class Representative (CR). CRs can approve notes, manage subjects and folders, manage members, and moderate group chat.",
        },
      ],
    },
    {
      title: "Classrooms & Notes",
      icon: <BookOpen className="size-6 text-blue-500" />,
      description: "Upload, organize, and share study materials with your classmates.",
      articles: [
        {
          title: "Uploading your first note",
          body: "Open a classroom → subject → notes. Upload PDF or image files. New uploads start as Pending until a CR approves them. Approved notes are visible to all classroom members.",
        },
        {
          title: "Organizing with folders",
          body: "CRs create subjects and folders to structure the curriculum. Browse folders from the subject page, open notes inside each folder, and use search to find materials quickly.",
        },
        {
          title: "Comments and favorites",
          body: "Open any approved note to leave comments or add it to your favorites. Favorites are personal — they help you build a quick-access study list from across your classrooms.",
        },
      ],
    },
    {
      title: "Group Chat & Study Assistant",
      icon: <MessageSquare className="size-6 text-emerald-500" />,
      description: "Collaborate in real time and ask questions grounded in your class notes.",
      articles: [
        {
          title: "Using classroom group chat",
          body: "Open Group Chat from the sidebar or go to a classroom's chat page. Only enrolled members can read and send messages. Messages appear in real time. You can delete your own messages; CRs can delete any message in their classroom.",
        },
        {
          title: "Study Assistant (AI)",
          body: "The Study Assistant answers questions using your classroom's indexed notes — not the open internet. Open it from a classroom subject page. Responses cite note sources when available. Rate limits apply to keep the service fair for everyone.",
        },
        {
          title: "Note indexing for AI",
          body: "When notes are approved and indexed, their content is chunked and embedded for semantic search. Indexing may take a moment after upload. If the assistant cannot find an answer, try rephrasing or check that relevant notes are approved.",
        },
      ],
    },
    {
      title: "Study Tools & Account",
      icon: <Wrench className="size-6 text-purple-500" />,
      description: "Utility tools, profile settings, and account security.",
      articles: [
        {
          title: "Study tools (GPA, timetable, cover page)",
          body: "Visit Dashboard → Services for GPA calculator, exam planner, flashcards, timetable builder, and cover page generator. These tools run in the browser and do not require a classroom.",
        },
        {
          title: "Resetting your password",
          body: "Use Forgot password on the login page. Enter your email, follow the reset link, and choose a new password. If you signed up with Google only, use Google sign-in instead.",
        },
        {
          title: "Profile and settings",
          body: "Update your name, photo, and contact details from Dashboard → Settings or your profile page. Keep your email current so you receive classroom and security notifications.",
        },
      ],
    },
  ];

  const faqs = [
    {
      q: "Is Acadex free for students?",
      a: "Yes. Core features — classrooms, note sharing, group chat, comments, favorites, study tools, and the study assistant — are free. Optional support contributions via Stripe are available on the support page.",
    },
    {
      q: "Who can see my uploaded notes?",
      a: "Notes are visible only to members of the classroom they belong to, after CR approval. Admins moderate classrooms at the platform level but do not browse student note content routinely.",
    },
    {
      q: "Why can't I send chat messages?",
      a: "You must be a member of the classroom. If you just joined, refresh the page. Chat also requires Pusher to be configured — if messages fail to load, contact your CR or check that you are signed in.",
    },
    {
      q: "Can CRs remove members or messages?",
      a: "CRs can delete any chat message in their classroom and manage member roles. Platform admins handle classroom approval, bans, and global notices.",
    },
  ];

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCategories = normalizedQuery
    ? categories
        .map((cat) => ({
          ...cat,
          articles: cat.articles.filter(
            (a) =>
              a.title.toLowerCase().includes(normalizedQuery) ||
              a.body.toLowerCase().includes(normalizedQuery) ||
              cat.title.toLowerCase().includes(normalizedQuery),
          ),
        }))
        .filter((cat) => cat.articles.length > 0)
    : categories;

  const toggleArticle = (key: string) => {
    setOpenArticle((prev) => (prev === key ? null : key));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative overflow-hidden bg-orange-500/5 py-20 md:py-28 border-b border-border/50 text-center">
        <div className="container max-w-3xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
            <LifeBuoy className="size-3.5" />
            Support Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            How can we help you?
          </h1>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Guides for classrooms, notes, live chat, the study assistant, and account settings.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles (e.g. join classroom, chat, AI)..."
              className="w-full h-14 pl-12 pr-4 rounded-2xl border border-border bg-background shadow-xl shadow-orange-500/5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent)] pointer-events-none" />
      </div>

      <div className="container max-w-5xl mx-auto px-6 mt-16">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-medium">No articles match &ldquo;{query}&rdquo;.</p>
            <p className="text-sm mt-2">Try keywords like &ldquo;chat&rdquo;, &ldquo;notes&rdquo;, or &ldquo;join&rdquo;.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCategories.map((cat) => (
              <div
                key={cat.title}
                className="group bg-card border border-border rounded-3xl p-8 hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/5"
              >
                <div className="p-3 bg-muted/50 rounded-2xl w-fit mb-6 group-hover:bg-orange-500/10 transition-colors">
                  {cat.icon}
                </div>
                <h2 className="text-2xl font-bold mb-3">{cat.title}</h2>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {cat.description}
                </p>
                <ul className="space-y-2">
                  {cat.articles.map((article) => {
                    const key = `${cat.title}-${article.title}`;
                    const isOpen = openArticle === key;
                    return (
                      <li key={key} className="border border-border/60 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleArticle(key)}
                          className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-left text-orange-600 hover:bg-orange-500/5 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            {article.title}
                            <ArrowRight className="size-3" />
                          </span>
                          {isOpen ? (
                            <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                          )}
                        </button>
                        {isOpen && (
                          <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
                            {article.body}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        <section className="mt-20 bg-orange-600 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 max-w-md">
            <h2 className="text-3xl font-bold mb-4">Still stuck?</h2>
            <p className="text-orange-50 leading-relaxed mb-6">
              Email us with your classroom name, a screenshot if possible, and what you were trying to do.
              We typically respond within 1–2 business days.
            </p>
            <a
              href="mailto:support@acadex.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-2xl hover:bg-orange-50 transition-colors shadow-lg shadow-black/10"
            >
              <Mail className="size-5" />
              support@acadex.com
            </a>
          </div>
          <div className="relative z-10 hidden md:flex flex-col gap-3 text-orange-100 text-sm">
            <span className="flex items-center gap-2"><Bot className="size-4" /> Study assistant issues</span>
            <span className="flex items-center gap-2"><MessageSquare className="size-4" /> Group chat not updating</span>
            <span className="flex items-center gap-2"><BookOpen className="size-4" /> Note approval questions</span>
          </div>
          <div className="absolute -bottom-10 -right-10 size-64 bg-white/10 rounded-full blur-3xl" />
        </section>

        <div className="mt-20 text-center">
          <h3 className="text-xl font-bold mb-8">Frequently Asked Questions</h3>
          <div className="max-w-2xl mx-auto space-y-4 text-left">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-6 bg-muted/30 border border-border rounded-2xl">
                <p className="font-bold text-sm mb-2">{faq.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Building locally? See the{" "}
          <Link href="/Developer" className="text-orange-600 font-semibold hover:underline">
            Developer page
          </Link>{" "}
          for setup instructions and repository links.
        </p>
      </div>
    </div>
  );
};

export default HelpCenterPage;
