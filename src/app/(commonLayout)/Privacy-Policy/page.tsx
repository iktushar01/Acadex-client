"use client";

import React from "react";
import {
  Shield,
  Lock,
  Eye,
  Share2,
  UserCheck,
  RefreshCcw,
  Mail,
  Clock,
  ChevronRight,
  Cookie,
  Server,
} from "lucide-react";

const PrivacyPolicyPage = () => {
  const lastUpdated = "June 26, 2026";

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative overflow-hidden bg-orange-500/5 py-16 md:py-24 border-b border-border/50 text-center">
        <div className="container max-w-3xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
            <Shield className="size-3.5" />
            Trust & Safety
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
            Privacy Policy
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground font-medium">
            <Clock className="size-4" />
            Last updated: {lastUpdated}
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.05),transparent)] pointer-events-none" />
      </div>

      <div className="container max-w-3xl mx-auto px-6 mt-16">
        <div className="space-y-16">

          <section className="text-center">
            <p className="text-xl leading-relaxed text-muted-foreground italic max-w-2xl mx-auto">
              Welcome to{" "}
              <span className="font-bold text-foreground underline decoration-orange-500/30 decoration-2 underline-offset-4">
                Acadex
              </span>
              . This policy explains what we collect, why we collect it, and how we protect your
              academic data when you use our classroom platform at{" "}
              <span className="font-mono text-sm not-italic">acadex-client.vercel.app</span>.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Eye className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">1. Information We Collect</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
              {[
                {
                  title: "Account data",
                  desc: "Name, email address, profile photo, role (Student/Admin), and authentication identifiers from email/password or Google sign-in.",
                },
                {
                  title: "Academic content",
                  desc: "Notes, files, comments, favorites, classroom memberships, subjects, folders, and chat messages you create or upload.",
                },
                {
                  title: "Study assistant data",
                  desc: "Questions you ask the AI, generated answers, and indexed note chunks/embeddings used to retrieve relevant class materials.",
                },
                {
                  title: "Usage & technical data",
                  desc: "IP address, browser type, device information, cookies, session tokens, and logs needed to operate and secure the service.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <span className="font-bold block text-sm mb-1">{item.title}</span>
                  <span className="text-xs text-muted-foreground leading-relaxed">{item.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <RefreshCcw className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">2. How We Use Your Data</h2>
            </div>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>We use your information to:</p>
              <ul className="space-y-2">
                {[
                  "Provide and maintain classrooms, note sharing, group chat, and study tools.",
                  "Authenticate you and keep your account secure.",
                  "Enable class representatives and admins to moderate content within their scope.",
                  "Power the study assistant by retrieving relevant passages from your classroom notes.",
                  "Send transactional emails (verification, password reset, notices).",
                  "Process optional support payments through Stripe.",
                  "Improve reliability, prevent abuse, and comply with legal obligations.",
                ].map((item) => (
                  <li key={item} className="flex gap-3 items-start">
                    <ChevronRight className="size-4 mt-1 text-orange-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-medium text-foreground">
                We do not sell your personal data to third parties.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Share2 className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">3. How Content Is Shared</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Classroom notes, comments, and chat messages are visible to members of that classroom
              according to role permissions. Approved notes are shared with classmates; pending notes
              are visible to CRs for review. Chat messages are delivered to classroom members in
              real time. The study assistant uses your classroom&apos;s indexed notes to answer your
              questions — it does not make your private questions public to other students.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Server className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">4. Third-Party Services</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use trusted providers to run Acadex. They process data only as needed to deliver the service:
            </p>
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              {[
                { name: "Neon", purpose: "PostgreSQL database hosting" },
                { name: "Vercel", purpose: "Application hosting" },
                { name: "Cloudinary / ImgBB", purpose: "File and image storage" },
                { name: "Google", purpose: "OAuth sign-in" },
                { name: "Pusher", purpose: "Real-time chat delivery" },
                { name: "OpenRouter", purpose: "AI embeddings and responses" },
                { name: "Stripe", purpose: "Optional support payments" },
                { name: "Gmail SMTP", purpose: "Transactional email" },
              ].map((item) => (
                <div key={item.name} className="rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <span className="font-bold text-foreground">{item.name}</span>
                  <span className="text-muted-foreground"> — {item.purpose}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="size-6" />
                <h2 className="text-2xl font-bold">5. Data Security</h2>
              </div>
              <p className="text-orange-50 leading-relaxed">
                We use HTTPS everywhere, httpOnly cookies for authentication tokens, hashed passwords,
                and access controls so users only see classrooms they belong to. Database connections
                use encrypted transport. No system is perfectly secure — please use a strong, unique
                password and report suspected breaches promptly.
              </p>
            </div>
            <Shield className="absolute -bottom-10 -right-10 size-40 text-white/10 rotate-12" />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Cookie className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">6. Cookies & Sessions</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We use essential cookies for authentication (access tokens, refresh tokens, and session
              identifiers). These are required to keep you signed in. We do not use third-party
              advertising cookies. You can clear cookies in your browser, but you will need to sign in again.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCheck className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">7. Your Rights</h2>
            </div>
            <div className="space-y-3">
              {[
                "Access the personal data we hold about you.",
                "Correct inaccurate account information from your profile settings.",
                "Delete your account and request removal of associated content, subject to legal retention requirements.",
                "Export your data where technically feasible — contact us for assistance.",
                "Withdraw consent for optional communications at any time.",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <ChevronRight className="size-4 mt-1 text-orange-500 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">8. Children & Changes</h2>
            <p className="text-muted-foreground leading-relaxed">
              Acadex is intended for students and educators. If you are under the age required to
              consent in your jurisdiction, use the service only with a parent or school&apos;s permission.
              We may update this policy from time to time; the &ldquo;Last updated&rdquo; date at the top
              will reflect changes. Continued use after updates means you accept the revised policy.
            </p>
          </section>

          <div className="pt-12 border-t border-border flex flex-col items-center text-center">
            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600 mb-4">
              <Mail className="size-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Privacy Concerns?</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              Contact us to exercise your rights or ask questions about how your data is handled.
            </p>
            <a
              href="mailto:support@acadex.com"
              className="text-orange-600 font-bold hover:underline underline-offset-4"
            >
              support@acadex.com
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
