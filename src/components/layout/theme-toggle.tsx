"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyDark(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>("system");
  const [isDark, setIsDark] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // On mount: read saved preference and apply
  React.useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem("theme") ?? "system") as Theme;
    setTheme(saved);

    if (saved === "dark") {
      applyDark(true);
      setIsDark(true);
    } else if (saved === "light") {
      applyDark(false);
      setIsDark(false);
    } else {
      // system
      const prefersDark = getSystemPrefersDark();
      applyDark(prefersDark);
      setIsDark(prefersDark);
    }
  }, []);

  // Listen for OS colour-scheme changes when in "system" mode
  React.useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme") === "system") {
        applyDark(e.matches);
        setIsDark(e.matches);
      }
    };

    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mounted]);

  const cycleTheme = () => {
    setTheme((prev) => {
      let next: Theme;
      if (prev === "light") next = "dark";
      else if (prev === "dark") next = "system";
      else next = "light";

      localStorage.setItem("theme", next);

      if (next === "dark") {
        applyDark(true);
        setIsDark(true);
      } else if (next === "light") {
        applyDark(false);
        setIsDark(false);
      } else {
        const prefersDark = getSystemPrefersDark();
        applyDark(prefersDark);
        setIsDark(prefersDark);
      }

      return next;
    });
  };

  // Avoid hydration mismatch: render placeholder until mounted
  if (!mounted) {
    return <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />;
  }

  const icon =
    theme === "dark" ? (
      <Moon className="h-4 w-4" />
    ) : theme === "light" ? (
      <Sun className="h-4 w-4" />
    ) : (
      <Monitor className="h-4 w-4" />
    );

  const label =
    theme === "light"
      ? "Light mode (click → Dark)"
      : theme === "dark"
      ? "Dark mode (click → System)"
      : "System mode (click → Light)";

  return (
    <button
      onClick={cycleTheme}
      aria-label={label}
      title={label}
      className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 relative group"
    >
      <span className="transition-all duration-300 inline-block group-hover:scale-110">
        {icon}
      </span>
      {/* Visual indicator dot */}
      <span
        className={`absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full transition-colors ${
          theme === "dark"
            ? "bg-indigo-500"
            : theme === "light"
            ? "bg-amber-400"
            : "bg-slate-400"
        }`}
      />
    </button>
  );
}
