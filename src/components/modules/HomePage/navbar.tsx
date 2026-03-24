import Link from "next/link";
import { ModeToggle } from "@/components/shared/modeToggle";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
import { Search, Menu } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            {/* The "A" from your logo would go here as an SVG or Image */}
            <span className="text-xl font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground hidden sm:block">
            Acadex
          </span>
        </Link>

        {/* Navigation Links - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/notes" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Notes
          </Link>
          <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Courses
          </Link>
          <Link href="/community" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Community
          </Link>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-2">
          {/* Quick Search Icon */}
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Search className="h-5 w-5" />
          </Button>

          {/* Mode Toggle from your import */}
          <ModeToggle />

          <div className="ml-2 hidden sm:block">
            <Button variant="outline" className="mr-2">Log In</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Join Free
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;