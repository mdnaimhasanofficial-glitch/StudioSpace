"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * Sun/Moon visibility is driven purely by the `.dark` class (CSS), so the
 * server and client render identical markup — no hydration mismatch. The
 * click handler reads the resolved theme at interaction time.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      className={className}
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
    >
      <Sun className="hidden dark:inline-block" aria-hidden />
      <Moon className="inline-block dark:hidden" aria-hidden />
    </Button>
  );
}
