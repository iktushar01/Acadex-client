import { ArrowRight, Sparkles } from "lucide-react";

const Banner = () => {
  return (
    <section 
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background"
      style={{
        // This creates the horizontal notepad lines using your --muted color
        backgroundImage: `linear-gradient(var(--muted) 1px, transparent 1px)`,
        backgroundSize: '100% 3rem',
      }}
    >
      {/* The Vertical "Notebook Margin" Line */}
      <div className="absolute top-0 left-[10%] h-full w-[2px] bg-destructive/20 md:left-[15%]" />

      <div className="container relative z-10 flex flex-col items-center text-center px-4">
        
        {/* Badge: Welcome to Acadex */}
        <div className="mb-8 flex items-center gap-2 rounded-lg border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary md:text-base animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Sparkles className="size-4 fill-primary" />
          <span>Welcome to Acadex</span>
        </div>

        {/* Main Headline */}
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl">
          Study Smarter, <br />
          <span className="relative inline-block text-primary">
            Together
            {/* The underline from your image */}
            <span className="absolute -bottom-2 left-0 h-[4px] w-full rounded-full bg-primary" />
          </span>
        </h1>

        {/* Description with the vertical accent bar */}
        <div className="mt-12 flex max-w-2xl items-stretch gap-6 text-left animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <div className="w-1 rounded-full bg-border" />
          <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
            The modern platform for sharing notes, organizing courses, 
            and collaborating with classmates.
          </p>
        </div>

        {/* CTA Button */}
        <button className="group mt-10 flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] active:scale-95">
          Open Dashboard
          <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Subtle Background Glow (The dark purple blob from your image) */}
      <div className="absolute -bottom-[10%] -left-[5%] h-96 w-96 rounded-full bg-destructive/10 blur-[120px]" />
    </section>
  );
};

export default Banner;