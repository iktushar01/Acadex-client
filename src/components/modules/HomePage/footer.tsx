"use client";

import Logo from "@/components/shared/logo/logo";
import { ArrowUpRight, Globe, Heart, Mail, Sparkles } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  support: [
    { label: "Developer", href: "/Developer" },
    { label: "Help Center", href: "/Help-Center" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/Privacy-Policy" },
    { label: "Terms of Service", href: "/Terms-of-Services" },
    { label: "Cookie Policy", href: "/Cookie-Policy" },
  ],
};

const socialLinks = [
  { icon: Mail, href: "mailto:iktushar01@gmail.com", label: "Email" },
  {
    icon: Globe,
    href: "https://iktushar01.netlify.app/",
    label: "Portfolio",
  },
];

function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-card">
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 -translate-y-1/2 rounded-full bg-orange-500/6 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 translate-y-1/2 rounded-full bg-rose-500/6 blur-[110px]" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="mx-auto max-w-7xl py-12 md:py-20">
          <div className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="space-y-6 lg:col-span-6">
              <div className="inline-block transition-transform duration-300 hover:scale-105">
                <Logo />
              </div>

              <div className="max-w-xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/15 bg-orange-500/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.28em] text-orange-500">
                  <Sparkles className="h-3.5 w-3.5" />
                  Classroom-first workflow
                </div>

                <p className="max-w-md text-sm font-medium leading-relaxed text-muted-foreground">
                  Acadex brings subjects, folders, notes, favorites, comments, and leaderboard
                  activity into one clean academic workspace for real classrooms.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  const isExternal = social.href.startsWith("http");

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="group inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-background/60 px-4 text-sm font-bold text-muted-foreground transition-all duration-300 hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-500"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                      <span>{social.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:col-span-3">
              {[
                { title: "Support", links: footerLinks.support },
                { title: "Legal", links: footerLinks.legal },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    {section.title}
                  </h4>
                  <ul className="space-y-4">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="group flex w-fit items-center gap-1 text-sm font-bold text-muted-foreground transition-all duration-300 hover:text-orange-500"
                        >
                          {link.label}
                          <ArrowUpRight className="size-3 -translate-y-1 translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-[2rem] border border-border/60 bg-background/50 p-5 shadow-sm backdrop-blur-xl">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-muted-foreground/70">
                  Crafted by
                </p>
                <a
                  href="https://iktushar01.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 group block"
                >
                  <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-transparent bg-card px-4 py-4 transition-all duration-300 group-hover:border-orange-500/25 group-hover:bg-orange-500/5">
                    <div>
                      <p className="text-base font-black tracking-tight text-foreground">
                        Tushar
                      </p>
                      <p className="text-xs font-medium text-muted-foreground">
                        Design, frontend and product craft
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-orange-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </a>

                <div className="mt-4 rounded-[1.5rem] border border-orange-500/15 bg-gradient-to-br from-orange-500/10 via-transparent to-rose-500/10 px-4 py-4">
                  <p className="flex items-center gap-2 text-sm font-black tracking-tight text-foreground">
                    Built with love
                    <Heart className="h-4 w-4 fill-orange-500 text-orange-500" />
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Made for students who want classroom collaboration to feel simple, fast, and
                    actually enjoyable.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/60 pt-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="text-center md:text-left">
                <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60">
                  {"\u00A9"} {new Date().getFullYear()} Acadex
                </p>
                <p className="mt-1 text-[10px] font-medium text-muted-foreground/45">
                  Built with love by{" "}
                  <a
                    href="https://iktushar01.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-orange-500 transition-colors hover:text-orange-600"
                  >
                    Tushar
                  </a>{" "}
                  for smarter classroom collaboration.
                </p>
              </div>

              <div className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-border bg-muted/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-foreground md:self-auto">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Acadex experience
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
