"use client";

import React from 'react';
import { Scale, UserCircle, FileText, Ban, AlertTriangle, Zap, Mail, ChevronRight } from "lucide-react";

const TermsOfServicePage = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* --- HERO SECTION --- */}
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
          
          {/* Intro */}
          <p className="text-xl leading-relaxed text-muted-foreground italic border-l-4 border-orange-500/20 pl-6">
            By using Acadex, you agree to these terms. They are designed to keep our 
            academic community safe, respectful, and productive.
          </p>

          {/* 1. Use of Service */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Zap className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">1. Use of the Service</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Acadex provides tools for note-sharing and classroom organization. You agree to 
              use these services only for lawful, educational purposes and in a manner 
              that does not infringe on the rights of others.
            </p>
          </section>

          {/* 2. User Accounts */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCircle className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">2. User Accounts</h2>
            </div>
            <div className="grid gap-3">
              {[
                "Keep your login credentials confidential.",
                "Provide accurate and up-to-date information.",
                "Notify us immediately of unauthorized account access."
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <ChevronRight className="size-4 mt-1 text-orange-500 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Content Ownership */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">3. User Content</h2>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <p className="font-bold mb-2">You own your data.</p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                You retain 100% ownership of the content you upload. By sharing, you grant 
                Acadex a license to host and display your work solely to provide the service 
                (e.g., showing your notes to your classmates).
              </p>
            </div>
          </section>

          {/* 4. Prohibited Activities */}
          <section className="bg-destructive/5 border border-destructive/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6 text-destructive">
              <Ban className="size-6" />
              <h2 className="text-2xl font-bold">4. Prohibited Activities</h2>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {[
                { t: "Harmful Content", d: "No illegal or abusive material." },
                { t: "System Abuse", d: "No hacking or scraping data." },
                { t: "Harassment", d: "Respect all community members." },
                { t: "Plagiarism", d: "Follow academic integrity rules." }
              ].map((item, idx) => (
                <li key={idx} className="space-y-1">
                  <span className="font-bold block text-sm">{item.t}</span>
                  <span className="text-xs text-muted-foreground">{item.d}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 5. Limitation of Liability */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">5. Limitation of Liability</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Acadex is provided <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">"AS IS"</span>. 
              We are not liable for data loss or service interruptions. Users are 
              encouraged to keep backups of their most critical study materials.
            </p>
          </section>

          {/* Contact Section */}
          <div className="pt-12 border-t border-border flex flex-col items-center text-center">
            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600 mb-4">
              <Mail className="size-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">Questions?</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              If you have concerns about these terms, reach out to our team.
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