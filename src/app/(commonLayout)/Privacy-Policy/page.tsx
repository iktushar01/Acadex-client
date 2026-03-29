"use client";

import React from 'react';
import { Shield, Lock, Eye, Share2, UserCheck, RefreshCcw, Mail, Clock, ChevronRight } from "lucide-react";

const PrivacyPolicyPage = () => {
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
          
          {/* Intro */}
          <section className="text-center">
            <p className="text-xl leading-relaxed text-muted-foreground italic max-w-2xl mx-auto">
              Welcome to <span className="font-bold text-foreground underline decoration-orange-500/30 decoration-2 underline-offset-4">Acadex</span>. 
              Your privacy is our priority. We handle your data with transparency 
              and high-level security.
            </p>
          </section>

          {/* 1. Information We Collect */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Eye className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">1. Information We Collect</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
              {[
                { title: "Account Data", desc: "Name, email, and preferences." },
                { title: "Academic Content", desc: "Uploaded notes and resources." },
                { title: "Usage Insights", desc: "Metadata on tool interactions." }
              ].map((item, idx) => (
                <div key={idx} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <span className="font-bold block text-sm mb-1">{item.title}</span>
                  <span className="text-xs text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 2. How We Use Data */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <RefreshCcw className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">2. How We Use Data</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              We use your information to personalize your learning experience, facilitate 
              classroom management, and ensure seamless synchronization of your notes 
              across all your devices. We never sell your personal data to third parties.
            </p>
          </section>

          {/* 3. Data Security - Highlighted Box */}
          <section className="bg-orange-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="size-6" />
                <h2 className="text-2xl font-bold">3. Data Security</h2>
              </div>
              <p className="text-orange-50 leading-relaxed">
                We implement industry-standard encryption to protect your work. From SSL 
                certificates to secure database practices, we treat your academic notes 
                as highly sensitive assets.
              </p>
            </div>
            <Shield className="absolute -bottom-10 -right-10 size-40 text-white/10 rotate-12" />
          </section>

          {/* 4. Your Rights */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <UserCheck className="size-5 text-orange-500" />
              <h2 className="text-2xl font-bold">4. Your Rights</h2>
            </div>
            <div className="space-y-3">
              {[
                "Access and export your personal data at any time.",
                "Correct any inaccuracies in your account information.",
                "Request permanent deletion of your account and content."
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <ChevronRight className="size-4 mt-1 text-orange-500 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <div className="pt-12 border-t border-border flex flex-col items-center text-center">
            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600 mb-4">
              <Mail className="size-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Privacy Concerns?</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
              Our privacy team is available to answer any questions regarding your data.
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