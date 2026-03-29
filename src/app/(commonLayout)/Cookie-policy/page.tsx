"use client";

import React from 'react';
import { Cookie, ShieldCheck, Settings2, Fingerprint, MousePointerClick, HelpCircle, ChevronRight } from "lucide-react";

const CookiePolicyPage = () => {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    const cookieTypes = [
        {
            name: "Essential",
            purpose: "Required for logging in, security, and core functionality. Cannot be disabled.",
            status: "Active",
            icon: <ShieldCheck className="size-5 text-green-500" />
        },
        {
            name: "Preferences",
            purpose: "Remembers your theme (Dark/Light mode) and language settings.",
            status: "Optional",
            icon: <Settings2 className="size-5 text-blue-500" />
        },
        {
            name: "Analytics",
            purpose: "Helps us understand how students use Acadex so we can improve the UI.",
            status: "Optional",
            icon: <Fingerprint className="size-5 text-purple-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* --- HERO SECTION --- */}
            <div className="relative overflow-hidden bg-orange-500/5 py-16 md:py-24 border-b border-border/50 text-center">
                <div className="container max-w-3xl mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
                        <Cookie className="size-3.5" />
                        Transparency
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
                        Cookie Policy
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Last updated: {lastUpdated}
                    </p>
                </div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.05),transparent)] pointer-events-none" />
            </div>

            <div className="container max-w-3xl mx-auto px-6 mt-16">
                <div className="space-y-16">
                    
                    {/* Intro */}
                    <p className="text-xl leading-relaxed text-muted-foreground italic border-l-4 border-orange-500/20 pl-6">
                        At <span className="font-bold text-foreground underline decoration-orange-500/30 decoration-2 underline-offset-4">Acadex</span>, 
                        we use cookies to enhance your study experience. This policy explains how we use them and how you can manage your preferences.
                    </p>

                    {/* 1. What are Cookies */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                            <h2 className="text-2xl font-bold">1. What are Cookies?</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            Cookies are small text files stored on your device when you visit a website. They help
                            the site recognize your device and store information about your preferences or past actions.
                        </p>
                    </section>

                    {/* 2. Cookie Table */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                            <h2 className="text-2xl font-bold">2. How We Use Cookies</h2>
                        </div>
                        <div className="overflow-hidden border border-border rounded-2xl shadow-sm bg-card">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-muted/50 border-b border-border">
                                        <tr>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Purpose</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {cookieTypes.map((cookie, idx) => (
                                            <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {cookie.icon}
                                                        <span className="font-semibold text-sm">{cookie.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-muted-foreground leading-snug">
                                                    {cookie.purpose}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase border ${
                                                        cookie.status === 'Active'
                                                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                                                        : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                                                    }`}>
                                                        {cookie.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* 3. Management Section */}
                    <section className="bg-muted/40 rounded-3xl p-8 border border-dashed border-border flex flex-col md:flex-row gap-6 items-start">
                        <div className="p-3 bg-background rounded-xl border border-border shadow-sm shrink-0">
                            <MousePointerClick className="size-6 text-orange-500" />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold">3. Manage Your Preferences</h2>
                            <p className="text-muted-foreground">
                                Most browsers allow you to control cookies through settings. You can delete 
                                existing cookies and set your browser to prevent new ones.
                            </p>
                            <p className="text-sm italic font-medium text-orange-600">
                                Note: Disabling essential cookies may prevent you from logging into your Acadex workspace.
                            </p>
                        </div>
                    </section>

                    {/* Contact/Support */}
                    <div className="pt-12 border-t border-border flex flex-col items-center text-center">
                        <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600 mb-4">
                            <HelpCircle className="size-6" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Need more clarity?</h3>
                        <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">
                            If you have any questions about our use of cookies, reach out to our privacy team.
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

export default CookiePolicyPage;