"use client";

import React from "react";
import {
  Scale,
  UserCircle,
  FileText,
  Ban,
  AlertTriangle,
  Zap,
  Mail,
  ChevronRight,
  MessageSquare,
  Bot,
  Users,
} from "lucide-react";

const TermsOfServicePage = () => {
  const lastUpdated = "June 26, 2026";

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative overflow-hidden bg-orange-500/5 py-16 md:py-24 border-b border-border/50 text-center">
        <div className="container max-w-3xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
            <Scale className="size-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground font-medium">
            Last updated: {lastUpdated}
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent)] pointer-events-none" />
      </div>

      <div className="container max-w-3xl mx-auto px-6 mt-16">
        <div className="space-y-16">

          <p className="text-xl leading-relaxed text-muted-foreground italic border-l-4 border-orange-500/20 pl-6">
            By accessing or using Acadex at{" "}
            <span className="font-mono text-sm not-italic">acadex-client.vercel.app</span>, you agree
            to these Terms of Service. If you do not agree, please do not use the platform.
          </p>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">1. The Service</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Acadex is an educational platform that provides digital classrooms, shared notes,
              comments and favorites, real-time group chat, a note-grounded study assistant,
              leaderboards, admin notices, and student utility tools (GPA calculator, timetables,
              cover pages, and more). Features may change, be added, or be limited during maintenance
              or beta periods.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCircle className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">2. Accounts & Eligibility</h2>
            </div>
            <div className="grid gap-3">
              {[
                "You must provide accurate registration information and keep it up to date.",
                "You are responsible for all activity under your account — keep credentials confidential.",
                "Notify us immediately if you suspect unauthorized access.",
                "One person may not maintain multiple accounts to evade moderation or bans.",
                "Platform admins may suspend accounts that violate these terms or harm the community.",
              ].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <ChevronRight className="size-4 mt-1 text-orange-500 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Users className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">3. Classrooms & Roles</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Classrooms are created by students and approved by platform admins. Inside each classroom,
              Class Representatives (CRs) may approve notes, manage curriculum structure, manage members,
              and moderate chat. CR actions must be fair and related to legitimate classroom management.
              Platform admins oversee classroom approval, bans, and global notices. Membership in a
              classroom does not grant access to other classrooms.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">4. User Content</h2>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-3">
              <p className="font-bold">You own your uploads.</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You retain ownership of notes, comments, and other content you submit. By uploading or
                posting, you grant Acadex a limited license to host, store, display, and process that
                content solely to operate the service — for example, showing approved notes to classmates,
                indexing note text for the study assistant, or delivering chat messages to classroom members.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You represent that you have the right to share what you upload and that it does not
                infringe copyright or violate academic integrity policies.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">5. Group Chat</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Classroom chat is for educational discussion among enrolled members. Do not post spam,
              harassment, hate speech, illegal content, or personal data of others without consent.
              You may delete your own messages. CRs may delete any message in their classroom.
              We may remove content or restrict accounts that abuse chat features.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Bot className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">6. Study Assistant (AI)</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The study assistant uses AI models and your classroom&apos;s indexed notes to generate
              answers. Outputs may be incomplete or incorrect — always verify important information
              against your official course materials. The assistant is a study aid, not a substitute
              for instructors, textbooks, or exam rules. Rate limits apply. Do not rely on AI outputs
              for cheating or submitting work that violates your institution&apos;s honor code.
            </p>
          </section>

          <section className="bg-destructive/5 border border-destructive/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6 text-destructive">
              <Ban className="size-6" />
              <h2 className="text-2xl font-bold">7. Prohibited Conduct</h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                { t: "Illegal content", d: "No unlawful material, threats, or exploitation." },
                { t: "Harassment", d: "Treat classmates, CRs, and admins with respect." },
                { t: "Copyright abuse", d: "Do not upload materials you cannot share." },
                { t: "Academic dishonesty", d: "No cheating, impersonation, or plagiarism." },
                { t: "System abuse", d: "No scraping, hacking, or circumventing rate limits." },
                { t: "Spam & malware", d: "No unsolicited promotion or harmful files." },
              ].map((item) => (
                <li key={item.t} className="space-y-1">
                  <span className="font-bold block text-sm">{item.t}</span>
                  <span className="text-xs text-muted-foreground">{item.d}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">8. Disclaimers & Liability</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Acadex is provided{" "}
              <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">&quot;AS IS&quot;</span>{" "}
              without warranties of any kind. We are not liable for data loss, service interruptions,
              incorrect AI responses, or disputes between classroom members. You are responsible for
              maintaining backups of critical study materials. Our total liability is limited to the
              extent permitted by applicable law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold">9. Termination & Changes</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may stop using Acadex at any time. We may suspend or terminate access for violations
              of these terms or to protect the platform. We may update these terms; material changes
              will be reflected in the &ldquo;Last updated&rdquo; date. Continued use after changes
              constitutes acceptance.
            </p>
          </section>

          <div className="pt-12 border-t border-border flex flex-col items-center text-center">
            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600 mb-4">
              <Mail className="size-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">Questions?</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              For questions about these terms, classroom moderation, or account issues, contact us.
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

export default TermsOfServicePage;
