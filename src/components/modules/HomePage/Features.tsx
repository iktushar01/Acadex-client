"use client"

import { useEffect, useState } from 'react'
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
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    title: 'Smart Note Sharing',
    description: 'Upload and share study materials instantly. Support for PDFs, images, documents, and more.',
    icon: BookOpen,
    gradient: 'from-blue-500 to-cyan-500',
    color: 'blue',
  },
  {
    title: 'Cloud Storage',
    description: 'Secure cloud storage for all your notes. Access them anywhere, anytime, on any device.',
    icon: Cloud,
    gradient: 'from-purple-500 to-pink-500',
    color: 'purple',
  },
  {
    title: 'Course Organization',
    description: 'Organize notes by courses with custom categories. Keep everything structured and easy to find.',
    icon: FolderTree,
    gradient: 'from-green-500 to-emerald-500',
    color: 'green',
  },
  {
    title: 'Powerful Search',
    description: 'Find any note instantly with intelligent search. Filter by course, title, or content.',
    icon: Search,
    gradient: 'from-orange-500 to-red-500',
    color: 'orange',
  },
  {
    title: 'Smart Tagging',
    description: 'Tag and categorize notes for better organization. Create custom tags for quick access.',
    icon: Tag,
    gradient: 'from-pink-500 to-rose-500',
    color: 'pink',
  },
  {
    title: 'Secure & Private',
    description: 'Your data is encrypted and secure. Control access and maintain your privacy.',
    icon: Shield,
    gradient: 'from-indigo-500 to-purple-500',
    color: 'indigo',
  },
  {
    title: 'Multiple Files',
    description: 'Upload multiple files at once. Support for PDFs, Word docs, images, and presentations.',
    icon: FileText,
    gradient: 'from-violet-500 to-purple-500',
    color: 'violet',
  },
  {
    title: 'Lightning Fast',
    description: 'Optimized for speed. Upload, download, and browse notes with minimal loading times.',
    icon: Zap,
    gradient: 'from-yellow-500 to-orange-500',
    color: 'yellow',
  },
  {
    title: 'Collaborative',
    description: 'Work together with classmates. Share notes, organize study groups, and learn together.',
    icon: Users,
    gradient: 'from-teal-500 to-cyan-500',
    color: 'teal',
  },
]

function Features() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setTimeout(() => {
              setVisibleItems((prev) => [...prev, index])
            }, index * 80)
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('[data-feature-card]')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-32 right-20 w-40 h-40 bg-yellow-200/20 dark:bg-yellow-900/10 rounded-lg rotate-12 animate-float hidden xl:block" style={{
        animation: 'float 8s ease-in-out infinite',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }} />
      <div className="absolute bottom-40 left-24 w-32 h-32 bg-pink-200/20 dark:bg-pink-900/10 rounded-lg -rotate-12 animate-float-delayed hidden xl:block" style={{
        animation: 'float 10s ease-in-out infinite 2s',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header - Notebook Style */}
          <div className="text-center space-y-6 mb-20 pl-0 sm:pl-4 lg:pl-0">
            {/* Sticky Note Badge */}
            <div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-yellow-300 dark:bg-yellow-900/40 border-2 border-yellow-400 dark:border-yellow-700 shadow-lg rotate-[-1deg] hover:rotate-0 transition-transform duration-300"
              style={{
                boxShadow: '0 4px 8px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)'
              }}
            >
              <span className="text-sm font-bold text-yellow-900 dark:text-yellow-100">Features</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-foreground">Everything You Need to</span>
              <br />
              <span 
                className="bg-linear-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent inline-block relative"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  transform: 'rotate(-0.5deg)',
                  display: 'inline-block'
                }}
              >
                Excel Together
              </span>
              {/* Decorative underline */}
              <span className="block mt-3 w-40 h-1 bg-linear-to-r from-orange-500 to-yellow-500 rounded-full mx-auto" />
            </h2>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto border-l-0 sm:border-l-4 pl-0 sm:pl-4 border-primary/30">
              Powerful features designed to make collaborative studying effortless and productive.
            </p>
          </div>
          
          {/* Features Grid - Notebook Style Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pl-0 sm:pl-4 lg:pl-0">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isVisible = visibleItems.includes(index)
              
              // Random rotation for each card (notebook style)
              const rotation = index % 3 === 0 ? '-rotate-1' : index % 3 === 1 ? 'rotate-1' : 'rotate-0'
              
              return (
                <div
                  key={feature.title}
                  data-feature-card
                  data-index={index}
                  className={`transition-all duration-700 ${
                    isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-12 scale-95'
                  }`}
                >
                  {/* Notebook Style Card */}
                  <div 
                    className={`group relative h-full bg-white dark:bg-amber-950/20 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-rotate-1 ${rotation}`}
                    style={{
                      boxShadow: '0 8px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
                      transform: isVisible ? 'none' : 'translateY(50px) scale(0.9)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05) rotate(0deg) translateY(-8px)'
                      e.currentTarget.style.zIndex = '10'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = ''
                      e.currentTarget.style.zIndex = '1'
                    }}
                  >
                    {/* Content */}
                    <div className="relative p-6 z-10">
                      {/* Icon - Sticky Note Style */}
                      <div 
                        className={`mb-4 w-16 h-16 rounded-lg bg-linear-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 relative`}
                        style={{
                          boxShadow: '0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
                        }}
                      >
                        <Icon className="h-8 w-8 text-white relative z-10" />
                        {/* Decorative corner fold */}
                        <div className="absolute top-0 right-0 w-4 h-4 bg-black/10 rounded-bl-lg" />
                      </div>
                      
                      {/* Title - Handwritten Style */}
                      <h3 
                        className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors relative inline-block"
                        style={{
                          transform: 'rotate(-0.3deg)',
                        }}
                      >
                        {feature.title}
                        {/* Underline decoration */}
                        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r ${feature.gradient} opacity-30 group-hover:opacity-60 transition-opacity`} />
                      </h3>
                      
                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {feature.description}
                      </p>
                      
                      {/* Decorative Dots (Notebook Style) */}
                      <div className="flex gap-1 mt-4 opacity-30">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full bg-linear-to-br ${feature.gradient}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Corner Tear Effect */}
                    <div className="absolute top-2 right-2 w-6 h-6 opacity-20">
                      <div className="w-full h-full border-t-2 border-r-2 border-gray-400 dark:border-gray-600 rounded-tr-lg" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 10s ease-in-out infinite 2s;
        }
      `}</style>
    </section>
  )
}

export default Features
