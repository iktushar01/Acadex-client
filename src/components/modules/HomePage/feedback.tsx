"use client";

import { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, Bug, Sparkles, Lightbulb, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming standard Shadcn or custom path

const feedbackTypes = [
  {
    id: 'ui',
    label: 'UI Design',
    icon: Sparkles,
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Suggest design tweaks or UI enhancements',
  },
  {
    id: 'feature',
    label: 'Feature Request',
    icon: Lightbulb,
    gradient: 'from-orange-500 to-amber-500', // Synced with our brand colors
    description: 'What tools should we build next?',
  },
  {
    id: 'bug',
    label: 'Bug Report',
    icon: Bug,
    gradient: 'from-rose-500 to-red-600',
    description: 'Report technical glitches or errors',
  },
];

function FeedBack() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setStatus('success');
    setFormData({ name: '', email: '', feedbackType: '', message: '' });

    // Reset back to idle after a few seconds
    setTimeout(() => setStatus('idle'), 5000);
  };

  return (
    <section id="feedback" className="py-24 md:py-32 relative overflow-hidden bg-background">
      {/* Visual background noise/glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--muted)_0%,transparent_70%)] opacity-30 -z-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 text-sm font-bold">
              <MessageSquare className="size-4" />
              Community Driven
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              Help Us Build <br/>
              <span className="italic text-orange-500">The Future of Study</span>
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-5 items-start">
            
            {/* Left Column: Feedback Types */}
            <div className="lg:col-span-2 space-y-4">
              {feedbackTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.feedbackType === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setFormData(prev => ({ ...prev, feedbackType: type.id }))}
                    className={`w-full p-5 rounded-[2rem] text-left transition-all duration-300 border-2 group ${
                      isSelected 
                        ? 'bg-card border-orange-500 shadow-xl shadow-orange-500/10 scale-[1.02]' 
                        : 'bg-card/50 border-transparent hover:border-border hover:bg-card'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`size-12 rounded-2xl bg-gradient-to-br ${type.gradient} flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform`}>
                        <Icon className="size-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{type.label}</h4>
                        <p className="text-xs text-muted-foreground leading-snug">{type.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
              
              <div className="p-6 rounded-[2rem] bg-orange-500/5 border border-dashed border-orange-500/20 mt-8">
                <div className="flex items-center gap-3 text-orange-600">
                  <Mail className="size-5" />
                  <span className="text-sm font-bold tracking-tight">direct: iktushar01@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Right Column: The Form Card */}
            <div className="lg:col-span-3 relative">
              <div className="bg-card border border-border rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                
                {/* Decorative Notebook Lines */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px)`, backgroundSize: '100% 2.5rem' }} />

                {status === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
                    <div className="size-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mb-6 border border-green-500/20">
                      <CheckCircle2 className="size-10" />
                    </div>
                    <h3 className="text-2xl font-black mb-2">Note Received!</h3>
                    <p className="text-muted-foreground font-medium">We've added your feedback to our study list.</p>
                    <Button variant="ghost" className="mt-8 font-bold" onClick={() => setStatus('idle')}>Send another?</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Name</label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Study Buddy"
                          className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 focus:ring-2 ring-orange-500 transition-all outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email</label>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="hello@college.edu"
                          className="w-full bg-muted/50 border-none rounded-2xl px-5 py-4 focus:ring-2 ring-orange-500 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                      <textarea
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={
                          formData.feedbackType 
                            ? `Tell us more about this ${formData.feedbackType}...` 
                            : "Select a type on the left and tell us your thoughts..."
                        }
                        className="w-full bg-muted/50 border-none rounded-3xl px-5 py-4 focus:ring-2 ring-orange-500 transition-all outline-none resize-none"
                        required
                      />
                    </div>

                    <Button 
                      disabled={status === 'submitting' || !formData.feedbackType}
                      className="w-full h-16 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-lg shadow-xl shadow-orange-500/20 transition-all disabled:opacity-50"
                    >
                      {status === 'submitting' ? (
                        <Loader2 className="animate-spin size-6" />
                      ) : (
                        <>
                          Send Feedback
                          <Send className="ml-2 size-5" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default FeedBack;