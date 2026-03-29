"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/shared/modeToggle";
import { Button } from "@/components/ui/button";
import { Search, Menu, LogOut, User, Settings, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation } from "@tanstack/react-query";
import { logoutAction } from "./_logoutAction";
import { useRouter } from "next/navigation";
import { getCookie, deleteCookie } from "cookies-next";
import { useState } from "react";
import Logo from "@/components/shared/logo/logo";

const Navbar = () => {
  const router = useRouter();

  // ✅ Fix 1: Use lazy initialization to set initial state from cookie
  // This avoids setState calls in useEffect and only runs once on mount
  const [user, setUser] = useState<Record<string, string> | null>(() => {
    const userCookie = getCookie("user");
    if (!userCookie) return null;
    
    try {
      return JSON.parse(userCookie as string);
    } catch {
      return null;
    }
  });

  // ✅ Fix 2: Delete the cookie client-side immediately, then push to "/".
  // router.refresh() only re-runs server components; it does NOT reset
  // local React state or re-trigger useEffect, so the avatar would linger.
  const { mutate: handleLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      deleteCookie("user");        // Clear immediately so UI reacts at once
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      setUser(null);               // Optimistically clear the avatar
      router.push("/");            // Navigate away — triggers a full page remount
    },
    onError: () => {
      // Even on error, clear local state and redirect
      deleteCookie("user");
      setUser(null);
      router.push("/");
    },
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* LOGO */}
            <Logo />

        {/* NAVIGATION */}
        {/* <div className="hidden md:flex items-center gap-8">
          {["Notes", "Courses", "Community"].map((item) => (
                <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-sm font-bold text-muted-foreground hover:text-orange-500 transition-colors"
            >
              {item}
                </Link>
          ))}
        </div> */}

      {/* ACTIONS */}
<div className="flex items-center gap-3">
  <ModeToggle />

  <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

  {user ? (
    // PROFILE DROPDOWN (Works for both Mobile & Desktop)
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full border-2 border-transparent hover:border-orange-500/50 p-0"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar || user.image} alt={user.name} />
            <AvatarFallback className="bg-orange-500 text-white font-bold">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-2 rounded-2xl p-2 shadow-xl" align="end">
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer rounded-xl gap-2 p-2.5 focus:bg-orange-500/10 focus:text-orange-600" asChild>
            <Link href="/profile">
              <User className="h-4 w-4 text-orange-500" />
              Profile
            </Link>
          </DropdownMenuItem>
          
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleLogout()}
          disabled={isLoggingOut}
          className="cursor-pointer rounded-xl gap-2 p-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          <span className="font-bold">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <>
      {/* MOBILE VIEW: Auth Dropdown */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 mt-2 rounded-xl p-2">
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-3 font-semibold">
              <Link href="/login">Log In</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg p-3 font-bold text-orange-500 focus:text-orange-600">
              <Link href="/register">Join for Free</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* DESKTOP VIEW: Login/Register Buttons */}
      <div className="hidden sm:flex items-center gap-2">
        <Button variant="ghost" asChild className="font-bold hover:text-orange-500">
          <Link href="/login">Log In</Link>
        </Button>
        <Button
          asChild
          className="bg-orange-500 text-white hover:bg-orange-600 rounded-xl font-bold px-5 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
        >
          <Link href="/register">Join Free</Link>
        </Button>
      </div>
    </>
  )}
</div>
        </div>
      </nav>
  );
};

export default Navbar;