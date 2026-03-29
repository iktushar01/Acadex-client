"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { logoutAction } from "@/components/modules/HomePage/_logoutAction";
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, ChevronUp, Loader2 } from "lucide-react";
import { SidebarData } from "@/types/sidebar";
import SidebarLogo from "./SidebarLogo";
import { iconRegistry } from "@/components/shared/Iconregistry";
import { UserFromCookie } from "@/types/auth.types";
import { deleteCookie } from "cookies-next";
import { useState } from "react";

type AppSidebarProps = {
  data: SidebarData;
  user: UserFromCookie | null;
};

export const AppSidebar = ({ data, user }: AppSidebarProps) => {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await logoutAction();
      if (res.success) {
        deleteCookie("user");
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        deleteCookie("better-auth.session_token");
        deleteCookie("better-auth.session_data");
        toast.success("Logged out successfully");
        if (isMobile) setOpenMobile(false);
        setIsLogoutDialogOpen(false);
        window.location.assign("/");
      }
    } catch {
      toast.error("An error occurred during logout");
      deleteCookie("user");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("better-auth.session_token");
      deleteCookie("better-auth.session_data");
      setIsLogoutDialogOpen(false);
      window.location.assign("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const settingsHref =
    user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
      ? "/admin/dashboard/settings"
      : "/dashboard/settings";

  return (
    <Sidebar>
      {/* Header: Logo */}
      <SidebarHeader className="p-4">
        <SidebarLogo />
      </SidebarHeader>

      <SidebarSeparator />

      {/* Navigation groups */}
      <SidebarContent>
        {data.navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  // ✅ Resolve icon component here, inside the Client Component
                  const Icon = iconRegistry[item.icon];

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <Link
                          href={item.href}
                          onClick={() => isMobile && setOpenMobile(false)}
                        >
                          {Icon && <Icon className="h-4 w-4" />}
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>

                      {item.badge !== undefined && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      {/* Footer: User info + dropdown */}
      <SidebarFooter className="p-3">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="w-full data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>

                <ChevronUp className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              align="end"
              className="w-56"
              sideOffset={8}
            >
              <div className="px-2 py-1.5">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="truncate text-sm font-medium">{user.email}</p>
                <span className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  {user.role}
                </span>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  href={settingsHref}
                  className="cursor-pointer"
                  onClick={() => isMobile && setOpenMobile(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={() => setIsLogoutDialogOpen(true)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <p className="px-2 text-xs text-muted-foreground">Not signed in</p>
        )}
      </SidebarFooter>

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="overflow-hidden rounded-[2rem] border border-border/60 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl">
          <div className="relative">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-destructive/10 via-orange-500/5 to-transparent" />
            <AlertDialogHeader className="relative px-6 pt-7 pb-4">
              <AlertDialogMedia className="mb-3 size-14 rounded-3xl border border-destructive/20 bg-destructive/10 text-destructive shadow-sm">
                <LogOut className="h-6 w-6" />
              </AlertDialogMedia>
              <div className="mb-3 inline-flex items-center rounded-full border border-destructive/15 bg-destructive/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-destructive/80">
                Confirm Exit
              </div>
              <AlertDialogTitle className="text-2xl font-black tracking-tight">
                Sign out now?
              </AlertDialogTitle>
              <AlertDialogDescription className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                This will end your current session and reload the app so the
                sidebar and protected views return to a signed-out state.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="mx-6 mb-6 rounded-[1.5rem] border border-border/50 bg-muted/30 px-4 py-3">
              <p className="text-xs font-semibold text-foreground/80">
                Make sure you&apos;ve saved any in-progress work before continuing.
              </p>
            </div>

            <AlertDialogFooter className="border-t border-border/50 bg-background/80 px-6 py-5 sm:grid sm:grid-cols-2 sm:gap-3">
              <AlertDialogCancel
                disabled={isLoggingOut}
                className="h-11 rounded-2xl border-border/70 font-semibold"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(event) => {
                  event.preventDefault();
                  void handleLogout();
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
                  "Yes, sign out"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
};
