"use client";

import { syncAuthUserAction } from "@/actions/authActions/_syncAuthUserAction";
import Link from "next/link";
import { ModeToggle } from "@/components/shared/modeToggle";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Menu, LogOut, User, Loader2 } from "lucide-react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { logoutAction } from "./_logoutAction";
import { getCookie, deleteCookie } from "cookies-next";
import { useState } from "react";
import Logo from "@/components/shared/logo/logo";

const Navbar = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const [user, setUser] = useState<Record<string, string> | null>(() => {
    const userCookie = getCookie("user");
    if (!userCookie) return null;

    try {
      return JSON.parse(userCookie as string);
    } catch {
      return null;
    }
  });

  const { data: syncedUser } = useQuery({
    queryKey: ["auth-user-sync"],
    queryFn: syncAuthUserAction,
    enabled: !user,
    staleTime: 60_000,
    retry: false,
  });
  const resolvedUser =
    user ??
    (syncedUser?.success && syncedUser.data
      ? (syncedUser.data as Record<string, string>)
      : null);

  const { mutate: handleLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      deleteCookie("user");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("better-auth.session_token");
      deleteCookie("better-auth.session_data");
      setUser(null);
      setIsLogoutDialogOpen(false);
      window.location.assign("/");
    },
    onError: () => {
      deleteCookie("user");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("better-auth.session_token");
      deleteCookie("better-auth.session_data");
      setUser(null);
      setIsLogoutDialogOpen(false);
      window.location.assign("/");
    },
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />

        <div className="flex items-center gap-3">
          <ModeToggle />

          <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

          {resolvedUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full border-2 border-transparent p-0 hover:border-orange-500/50"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={resolvedUser.avatar || resolvedUser.image}
                      alt={resolvedUser.name}
                    />
                    <AvatarFallback className="bg-orange-500 font-bold text-white">
                      {resolvedUser.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="mt-2 w-56 rounded-2xl p-2 shadow-xl"
                align="end"
              >
                <DropdownMenuLabel className="p-2 font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold">{resolvedUser.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {resolvedUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 rounded-xl p-2.5 focus:bg-orange-500/10 focus:text-orange-600"
                    asChild
                  >
                    <Link href="/profile">
                      <User className="h-4 w-4 text-orange-500" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsLogoutDialogOpen(true)}
                  disabled={isLoggingOut}
                  className="cursor-pointer gap-2 rounded-xl p-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span className="font-bold">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="mt-2 w-48 rounded-xl p-2"
                  >
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-lg p-3 font-semibold"
                    >
                      <Link href="/login">Log In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer rounded-lg p-3 font-bold text-orange-500 focus:text-orange-600"
                    >
                      <Link href="/register">Join for Free</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <Button
                  variant="ghost"
                  asChild
                  className="font-bold hover:text-orange-500"
                >
                  <Link href="/login">Log In</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-xl bg-orange-500 px-5 font-bold text-white shadow-lg shadow-orange-500/20 transition-all active:scale-95 hover:bg-orange-600"
                >
                  <Link href="/register">Join Free</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="overflow-hidden rounded-[2rem] border border-border/60 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl">
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-destructive/10 via-orange-500/5 to-transparent" />
            <AlertDialogHeader className="relative px-6 pt-7 pb-4">
              <AlertDialogMedia className="mb-3 size-14 rounded-3xl border border-destructive/20 bg-destructive/10 text-destructive shadow-sm">
                <LogOut className="h-6 w-6" />
              </AlertDialogMedia>
              <div className="mb-3 inline-flex items-center rounded-full border border-destructive/15 bg-destructive/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-destructive/80">
                Session End
              </div>
              <AlertDialogTitle className="text-2xl font-black tracking-tight">
                Log out of Acadex?
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                You&apos;ll be signed out from this device and we&apos;ll refresh the
                page so your navbar and dashboard state reset completely.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mx-6 mb-6 rounded-[1.5rem] border border-border/50 bg-muted/30 px-4 py-3">
              <p className="text-xs font-semibold text-foreground/80">
                Unsaved work on the current page may be lost after the reload.
              </p>
            </div>

            <AlertDialogFooter className="border-t border-border/50 bg-background/80 px-6 py-5 sm:grid sm:grid-cols-2 sm:gap-3">
              <AlertDialogCancel
                disabled={isLoggingOut}
                className="h-11 rounded-2xl border-border/70 font-semibold"
              >
                Keep me signed in
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(event) => {
                  event.preventDefault();
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="h-11 rounded-2xl bg-destructive font-bold text-white shadow-lg shadow-destructive/20 hover:bg-destructive/90"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Yes, log me out"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};

export default Navbar;
