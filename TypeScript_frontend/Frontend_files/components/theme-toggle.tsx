"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative size-10">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative size-10 overflow-hidden rounded-full border border-border/50 bg-secondary/50 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-secondary"
    >
      <Sun
        className={`absolute size-5 transition-all duration-500 ${
          isDark
            ? "translate-y-10 rotate-90 opacity-0"
            : "translate-y-0 rotate-0 opacity-100"
        }`}
      />
      <Moon
        className={`absolute size-5 transition-all duration-500 ${
          isDark
            ? "translate-y-0 rotate-0 opacity-100"
            : "-translate-y-10 -rotate-90 opacity-0"
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
