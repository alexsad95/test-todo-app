"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "./button";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Показываем скелетон до определения темы
  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md bg-muted animate-pulse border border-border" />
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 transition-all duration-200 hover:scale-110 hover:shadow-md"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 transition-transform duration-200" />
      ) : (
        <Sun className="h-4 w-4 transition-transform duration-200" />
      )}
    </Button>
  );
}
