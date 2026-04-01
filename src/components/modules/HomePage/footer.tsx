"use client";

import Logo from "@/components/shared/logo/logo";
import Link from "next/link";

const footerLinks = [
  { label: "Developer", href: "/Developer" },
  { label: "Help Center", href: "/Help-Center" },
  { label: "Privacy", href: "/Privacy-Policy" },
  { label: "Terms", href: "/Terms-of-Services" },
];

function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          
          {/* Left: Logo & Copyright */}
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden h-4 w-[1px] bg-border md:block" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
              © {new Date().getFullYear()} Acadex
            </p>
          </div>

          {/* Center: Simple Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-orange-500"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Credit */}
          <div className="text-[10px] font-medium text-muted-foreground/60">
            Built by{" "}
            <a
              href="https://iktushar01.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-foreground transition-colors hover:text-orange-500"
            >
              Tushar
            </a>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;