"use client"

import { useEffect, useState, useRef } from 'react'
import {
  BookOpen,
  Cloud,
  Users,
  Search,
  Tag,
  Shield,
  FileText,
  Zap,
  FolderTree,
} from 'lucide-react'

const features = [
  { title: 'Smart Note Sharing', description: 'Upload and share study materials instantly. Support for PDFs, images, and documents.', icon: BookOpen, gradient: 'from-blue-500 to-cyan-500' },
  { title: 'Cloud Storage', description: 'Secure cloud storage for all your notes. Access them anywhere, anytime, on any device.', icon: Cloud, gradient: 'from-purple-500 to-pink-500' },
  { title: 'Course Organization', description: 'Organize notes by courses with custom categories. Keep everything structured.', icon: FolderTree, gradient: 'from-green-500 to-emerald-500' },
  { title: 'Powerful Search', description: 'Find any note instantly with intelligent search. Filter by course, title, or content.', icon: Search, gradient: 'from-orange-500 to-red-500' },
  { title: 'Smart Tagging', description: 'Tag and categorize notes for better organization. Create custom tags for quick access.', icon: Tag, gradient: 'from-pink-500 to-rose-500' },
  { title: 'Secure & Private', description: 'Your data is encrypted and secure. Control access and maintain your privacy.', icon: Shield, gradient: 'from-indigo-500 to-purple-500' },
  { title: 'Multiple Files', description: 'Upload multiple files at once. Support for PDFs, Word docs, and presentations.', icon: FileText, gradient: 'from-violet-500 to-purple-500' },
  { title: 'Lightning Fast', description: 'Optimized for speed. Upload, download, and browse notes with minimal loading times.', icon: Zap, gradient: 'from-yellow-500 to-orange-500' },
  { title: 'Collaborative', description: 'Work together with classmates. Share notes and organize study groups.', icon: Users, gradient: 'from-teal-500 to-cyan-500' },
]

function Features() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisibleItems((prev) => new Set([...prev, index]))
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('[data-feature-card]')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden bg-background">
      
      {/* Dynamic Background Auras */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center space-y-6 mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-sm transition-transform hover:-rotate-2">
              <span className="text-xs font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">Toolkit</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              Everything You Need to <br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent italic">
                Excel Together
              </span>
            </h2>
            <p className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg">
              Powerful features designed to make collaborative studying effortless.
            </p>
          </div>
          
          {/* Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isVisible = visibleItems.has(index)
              const rotation = index % 3 === 0 ? '-rotate-1' : index % 3 === 1 ? 'rotate-1' : 'rotate-0'
              
              return (
                <div
                  key={feature.title}
                  data-feature-card
                  data-index={index}
                  className={`transition-all duration-1000 ease-out ${
                    isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className={`group relative h-full bg-card/40 backdrop-blur-md rounded-[2rem] border border-border p-8 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 ${rotation}`}>
                    
                    {/* Icon Container */}
                    <div className={`mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6 group-hover:scale-110`}>
                      <Icon className="h-7 w-7" />
                    </div>

                    <h3 className="text-xl font-black tracking-tight mb-3 group-hover:text-orange-500 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Decorative Notebook "Holes" */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-20 transition-opacity">
                       {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-foreground" />)}
                    </div>

                    {/* Corner Accent */}
                    <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 blur-2xl transition-opacity rounded-full`} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(15deg); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
      `}</style>
    </section>
  )
}

export default Features