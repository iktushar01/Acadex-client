"use client";

import { useEffect, useState } from 'react'
import { UserPlus, Upload, Users, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const steps = [
  {
    title: 'Create Your Account',
    description: 'Sign up in seconds with your email. Join your course and connect with classmates instantly.',
    icon: UserPlus,
    step: '01',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Upload Your Notes',
    description: 'Drag and drop files or select multiple documents. Our platform supports all major file formats.',
    icon: Upload,
    step: '02',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Share & Collaborate',
    description: 'Organize notes by courses, share with classmates, and access everything from one central hub.',
    icon: Users,
    step: '03',
    gradient: 'from-green-500 to-emerald-500',
  },
]

function HowItWorks() {
  // FIX 1: Explicitly type the state as a number array
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexAttr = entry.target.getAttribute('data-step-index');
            if (indexAttr !== null) {
              const index = parseInt(indexAttr, 10);
              
              // Only add if not already visible to avoid duplicate state updates
              setVisibleSteps((prev) => 
                prev.includes(index) ? prev : [...prev, index]
              );
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    // FIX 2: Better selector scope
    const elements = document.querySelectorAll('[data-step-card]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden bg-background">
      {/* Floating Elements */}
      <div className="absolute top-32 right-20 w-40 h-40 bg-blue-500/5 rounded-2xl rotate-12 animate-float hidden xl:block" />
      <div className="absolute bottom-40 left-24 w-32 h-32 bg-orange-500/5 rounded-2xl -rotate-12 animate-float-delayed hidden xl:block" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center space-y-4 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 shadow-sm transition-transform hover:rotate-2">
              <span className="text-xs font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">Process</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              Get Started in <br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent italic">
                Three Simple Steps
              </span>
            </h2>
            <div className="w-24 h-1.5 bg-orange-500 rounded-full mx-auto mt-4" />
          </div>
          
          {/* Steps Grid */}
          <div className="grid gap-12 md:grid-cols-3 relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px border-t-2 border-dashed border-muted-foreground/20 -translate-y-12" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isVisible = visibleSteps.includes(index);
              
              return (
                <div
                  key={step.title}
                  data-step-card
                  data-step-index={index}
                  className={`relative transition-all duration-1000 ease-out ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="group relative bg-card rounded-[2.5rem] p-8 border border-border shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2">
                    
                    {/* Step Badge */}
                    <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-foreground text-background flex items-center justify-center font-black text-lg shadow-xl group-hover:rotate-12 transition-transform">
                      {step.step}
                    </div>

                    {/* Icon Box */}
                    <div className={`mb-6 w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="h-8 w-8" />
                    </div>

                    <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-orange-500 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">
                      {step.description}
                    </p>

                    {/* Decorative Detail */}
                    <div className="mt-6 flex gap-1.5">
                       {[1, 2, 3].map((i) => (
                         <div key={i} className={`h-1.5 w-1.5 rounded-full bg-orange-500/20 group-hover:bg-orange-500/50 transition-colors`} />
                       ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-15px) rotate(-10deg); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite 2s; }
      `}</style>
    </section>
  )
}

export default HowItWorks;