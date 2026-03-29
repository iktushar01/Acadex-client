"use client";

import React from 'react';
import { Search, BookOpen, UserPlus, FolderLock, CreditCard, MessageCircle, ArrowRight, LifeBuoy, Zap } from "lucide-react";

const HelpCenterPage = () => {
  const categories = [
    {
      title: "Getting Started",
      icon: <UserPlus className="size-6 text-orange-500" />,
      description: "Learn how to set up your profile, join classrooms, and start sharing.",
      articles: ["Creating an account", "Joining a classroom", "First-time setup guide"]
    },
    {
      title: "Managing Notes",
      icon: <BookOpen className="size-6 text-blue-500" />,
      description: "Everything you need to know about uploading, tagging, and organizing.",
      articles: ["Uploading your first note", "Organizing with folders", "Note visibility settings"]
    },
    {
      title: "Account & Security",
      icon: <FolderLock className="size-6 text-purple-500" />,
      description: "Manage your password, privacy settings, and data exports.",
      articles: ["Resetting your password", "Two-factor authentication", "Deleting your data"]
    },
    {
      title: "Billing & Plans",
      icon: <CreditCard className="size-6 text-green-500" />,
      description: "Questions about Acadex Pro, invoices, and payment methods.",
      articles: ["Subscription tiers", "Updating payment info", "Refund policy"]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* --- HERO SECTION --- */}
      <div className="relative overflow-hidden bg-orange-500/5 py-20 md:py-28 border-b border-border/50 text-center">
        <div className="container max-w-3xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
            <LifeBuoy className="size-3.5" />
            Support Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8 text-foreground">
            How can we help you?
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search for articles (e.g. 'how to share notes')..." 
              className="w-full h-14 pl-12 pr-4 rounded-2xl border border-border bg-background shadow-xl shadow-orange-500/5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08),transparent)] pointer-events-none" />
      </div>

      <div className="container max-w-5xl mx-auto px-6 mt-16">
        {/* --- CATEGORIES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <div key={idx} className="group bg-card border border-border rounded-3xl p-8 hover:border-orange-500/30 transition-all hover:shadow-lg hover:shadow-orange-500/5">
              <div className="p-3 bg-muted/50 rounded-2xl w-fit mb-6 group-hover:bg-orange-500/10 transition-colors">
                {cat.icon}
              </div>
              <h2 className="text-2xl font-bold mb-3">{cat.title}</h2>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {cat.description}
              </p>
              <ul className="space-y-3">
                {cat.articles.map((article, i) => (
                  <li key={i}>
                    <button className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors">
                      {article}
                      <ArrowRight className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- QUICK HELP SECTION --- */}
        <section className="mt-20 bg-orange-600 rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 max-w-md">
            <h2 className="text-3xl font-bold mb-4">Still stuck?</h2>
            <p className="text-orange-50 leading-relaxed mb-6">
              Our support team is online and ready to help you with any technical 
              issues or academic workflow questions.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-2xl hover:bg-orange-50 transition-colors shadow-lg shadow-black/10">
              <MessageCircle className="size-5" />
              Chat with Support
            </button>
          </div>
          <div className="relative z-10 hidden md:block opacity-20">
            <Zap className="size-48 rotate-12" />
          </div>
          <div className="absolute -bottom-10 -right-10 size-64 bg-white/10 rounded-full blur-3xl" />
        </section>

        {/* --- FAQ PREVIEW --- */}
        <div className="mt-20 text-center">
          <h3 className="text-xl font-bold mb-8">Frequently Asked Questions</h3>
          <div className="max-w-2xl mx-auto space-y-4 text-left">
            {[
              { q: "Is Acadex free for students?", a: "Yes! The core note-sharing and classroom features are free forever." },
              { q: "Can I use it offline?", a: "Acadex requires an internet connection to sync, but you can view cached notes offline on our mobile app." }
            ].map((faq, idx) => (
              <div key={idx} className="p-6 bg-muted/30 border border-border rounded-2xl">
                <p className="font-bold text-sm mb-1">{faq.q}</p>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;