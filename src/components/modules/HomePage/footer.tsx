"use client";

import Logo from '@/components/shared/logo/logo';
import { Mail, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const footerLinks = {
  support: [
    { label: 'Developer', href: '/Developer' },
    { label: 'Help Center', href: '/Help-Center' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/Privacy-Policy' },
    { label: 'Terms of Service', href: '/Terms-of-Services' },
    { label: 'Cookie Policy', href: '/Cookie-Policy' },
  ],
}

const socialLinks = [
  { icon: Mail, href: 'mailto:iktushar01@gmail.com', label: 'Email' },
]

function Footer() {
  return (
    <footer className="relative bg-card border-t border-border mt-auto overflow-hidden">
      {/* ── DESIGN ELEMENTS ── */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto py-12 md:py-20">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            {/* ── BRAND PILLAR ── */}
            <div className="md:col-span-6 space-y-6">
              <div className="inline-block transition-transform hover:scale-105 duration-300">
                <Logo />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-medium">
                The high-performance platform for academic synthesis. 
                Organize, collaborate, and master your curriculum with the 
                Acadex digital ecosystem.
              </p>
              
              <div className="flex items-center gap-2 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className="group relative w-10 h-10 rounded-xl bg-muted/50 border border-border flex items-center justify-center text-muted-foreground hover:text-orange-500 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300"
                      aria-label={social.label}
                    >
                      <Icon className="h-4 w-4 relative z-10 group-hover:scale-110 transition-transform" />
                    </a>
                  )
                })}
              </div>
            </div>

            {/* ── NAV PILLARS ── */}
            <div className="md:col-span-6 grid grid-cols-2 gap-8">
              {[
                { title: 'Support', links: footerLinks.support },
                { title: 'Legal', links: footerLinks.legal },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-foreground mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {section.title}
                  </h4>
                  <ul className="space-y-4">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm font-bold text-muted-foreground hover:text-orange-500 transition-all duration-300 flex items-center gap-1 group w-fit"
                        >
                          {link.label}
                          <ArrowUpRight className="size-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ── BOTTOM TERMINAL ── */}
          <div className="pt-8 border-t border-border/60">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-[11px] font-black tracking-widest text-muted-foreground/60 uppercase">
                  © {new Date().getFullYear()} Acadex International
                </p>
                <p className="text-[10px] font-medium text-muted-foreground/40 mt-1">
                  Precision engineered for the modern student.
                </p>
              </div>

              <div className="flex items-center gap-6 px-5 py-2.5 rounded-xl bg-muted/30 border border-border group transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Users className="h-3.5 w-3.5 text-orange-500" />
                    <div className="absolute inset-0 bg-orange-500 blur-md opacity-0 group-hover:opacity-40 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter">
                    Built for the Community
                  </span>
                </div>
                <div className="h-3 w-px bg-border" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  v2.0.4-stable
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;