"use client";

import { motion } from "framer-motion";

const GlobalLoading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafafa] dark:bg-[#050505] overflow-hidden">
      
      {/* 1. Kinetic Background Layers */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[140px]"
        />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex items-center justify-center">
        
        {/* 2. Magnetic Field Rings */}
        {[0, 1].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.9, 1.4, 0.9],
              opacity: [0, 0.4, 0],
              rotate: i === 0 ? 360 : -360
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              delay: i * 2,
              ease: "easeInOut" 
            }}
            className="absolute h-40 w-40 rounded-[3.5rem] border-[0.5px] border-primary/40 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
          />
        ))}

        {/* 3. The Advanced Morphing Icon Container */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotateX: [0, 10, 0],
            rotateY: [0, 10, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="perspective-1000 relative flex h-28 w-28 items-center justify-center rounded-[2.8rem] bg-white/40 dark:bg-white/[0.03] backdrop-blur-3xl border border-white/40 dark:border-white/10 shadow-2xl shadow-primary/5"
        >
          {/* Internal Glow Pulse */}
          <motion.div 
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-6 rounded-full bg-primary/20 blur-2xl"
          />

          {/* ADVANCED SVG ANIMATION */}
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-primary relative z-20"
          >
            {/* The Mortarboard Top - Floating effect */}
            <motion.path 
              d="M22 10L12 5L2 10L12 15L22 10Z" 
              animate={{ 
                y: [0, -2, 0],
                strokeWidth: [1.5, 2, 1.5]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* The Tassel - Kinetic swing */}
            <motion.path 
              d="M6 12V21" 
              animate={{ 
                rotate: [-5, 15, -5],
                originX: "6px",
                originY: "12px"
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* The Cap Base - Structural pulse */}
            <motion.path 
              d="M7 10V15C7 15 9 17 12 17C15 17 17 15 17 15V10" 
              animate={{ 
                opacity: [0.7, 1, 0.7],
                d: [
                   "M7 10V15C7 15 9 17 12 17C15 17 17 15 17 15V10",
                   "M7 10V15.5C7 15.5 9 17.5 12 17.5C15 17.5 17 15.5 17 15.5V10",
                   "M7 10V15C7 15 9 17 12 17C15 17 17 15 17 15V10"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>

          {/* 4. The Orbital Particle */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2"
          >
            <motion.div 
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]" 
            />
          </motion.div>
        </motion.div>
      </div>

      {/* 5. Bottom Status Bar (Non-textual) */}
      <div className="absolute bottom-16 flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div 
            key={i}
            animate={{ 
              height: [4, 12, 4],
              opacity: [0.2, 1, 0.2]
            }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-[3px] rounded-full bg-primary"
          />
        ))}
      </div>
    </div>
  );
};

export default GlobalLoading;