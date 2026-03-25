"use client";

import { useEffect, useState, useRef } from 'react'
import { Target, Heart, Lightbulb, TrendingUp } from 'lucide-react'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To make collaborative learning accessible and effortless for students everywhere.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'We believe in the power of community and helping each other succeed together.',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Continuously improving our platform with features that students actually need.',
    gradient: 'from-amber-400 to-orange-600',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    description: 'Supporting your academic journey with tools that scale with your needs.',
    gradient: 'from-orange-600 to-yellow-600',
  },
]

function About() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-value-index') || '0')
            // Using a Set prevents unnecessary re-renders for items already seen
            setVisibleItems((prev) => new Set([...prev, index]))
          }
        });
      },
      { threshold: 0.15 }
    )

    const elements = document.querySelectorAll('[data-value-card]')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-24 md:py-32 relative overflow-hidden bg-background">
      
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-orange-500/5 blur-[120px] -z-10 rotate-12" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-500/5 blur-[100px] -z-10 -rotate-12" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center space-y-6 mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 shadow-sm transition-transform hover:-rotate-2">
              <span className="text-xs font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">Our Story</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              Built for <br />
              <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent italic">
                Students, by Students
              </span>
            </h2>
            
            <p className="text-muted-foreground font-medium max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
              AcaDex was born from a simple idea: studying together should be easy, organized, and accessible. 
              We provide solutions that actually solve the late-night study grind.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              const isVisible = visibleItems.has(index)
              
              return (
                <div
                  key={value.title}
                  data-value-card
                  data-value-index={index}
                  className={`transition-all duration-1000 ease-out ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="group relative h-full bg-card border border-border rounded-[2.5rem] p-8 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2">
                    
                    {/* Icon - Modern Rounded Square */}
                    <div className={`mb-8 w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${value.gradient} flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-6 group-hover:scale-110`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    
                    <h3 className="text-2xl font-black tracking-tight mb-4 group-hover:text-orange-500 transition-colors">
                      {value.title}
                    </h3>
                    
                    <p className="text-muted-foreground font-medium text-sm leading-relaxed mb-6">
                      {value.description}
                    </p>

                    {/* Progress Detail Accent */}
                    <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                       <div className={`h-full bg-gradient-to-r ${value.gradient} w-0 group-hover:w-full transition-all duration-700 delay-300`} />
                    </div>

                    {/* Subtle Notebook "Ring" Holes */}
                    <div className="absolute top-8 left-4 flex flex-col gap-2 opacity-10">
                      {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-foreground" />)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About