"use client";

import { useSyncExternalStore } from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark" | "system";

const THEME_OPTIONS: Array<{
  value: ThemeMode;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: "light",
    label: "Light",
    description: "Keep the interface bright and clean.",
    icon: <Sun className="size-5" />,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Use the darker interface for lower glare.",
    icon: <Moon className="size-5" />,
  },
  {
    value: "system",
    label: "System",
    description: "Follow your device appearance automatically.",
    icon: <Laptop className="size-5" />,
  },
];

const ThemeSettingsPage = ({
  scope,
  extraContent,
}: {
  scope: "student" | "admin";
  extraContent?: React.ReactNode;
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const activeTheme = (theme as ThemeMode | undefined) ?? "system";

  return (
    <div className={cn("min-h-screen p-4 sm:p-6 lg:p-8", scope === "admin" ? "admin-shell" : "bg-background")}>
      <div className="mx-auto max-w-5xl space-y-6">
        <section className={cn(
          "rounded-[2rem] border border-border bg-card px-5 py-6 shadow-sm sm:px-6 sm:py-8",
          scope === "admin" && "admin-panel",
        )}>
          <div className="space-y-3">
            <Badge
              className="px-3 py-1 text-white"
              style={scope === "admin" ? { backgroundColor: "var(--admin-accent-strong)" } : undefined}
            >
              Settings
            </Badge>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Appearance
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Choose how Acadex looks across your dashboard. For now this page only
              controls theme mode.
            </p>
          </div>
        </section>

        <section className={cn(
          "rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6",
          scope === "admin" && "admin-panel",
        )}>
          <div className="flex flex-col gap-4 border-b border-border/70 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className={cn(
                "text-xs font-black uppercase tracking-[0.25em] text-primary",
                scope === "admin" && "admin-section-label",
              )}>
                Theme Mode
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Light, dark, or system
              </h2>
            </div>
            <div className="rounded-2xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              Active theme:{" "}
              <span className="font-bold text-foreground">
                {mounted ? `${activeTheme} (${resolvedTheme ?? "loading"})` : "loading"}
              </span>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {THEME_OPTIONS.map((option) => {
              const isActive = mounted && activeTheme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "rounded-[1.75rem] border p-5 text-left transition-all duration-200",
                    "hover:-translate-y-1 hover:border-primary/40 hover:bg-muted/40",
                    isActive
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-background/80",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-foreground">
                      {option.icon}
                    </div>
                    {isActive && <Badge>Selected</Badge>}
                  </div>

                  <h3 className="mt-5 text-xl font-black tracking-tight">
                    {option.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {extraContent}
      </div>
    </div>
  );
};

export default ThemeSettingsPage;
