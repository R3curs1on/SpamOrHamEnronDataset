"use client"

import * as React from "react"
import { Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface EmailInputProps {
  onScan: (content: string) => void
  isScanning: boolean
}

export function EmailInput({ onScan, isScanning }: EmailInputProps) {
  const [content, setContent] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim()) {
      onScan(content)
    }
  }

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`
    }
  }, [content])

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste your email content here for intelligent spam analysis..."
          className="w-full min-h-[140px] max-h-[300px] resize-none rounded-2xl border border-border/50 bg-card/80 px-6 py-5 text-base leading-relaxed text-foreground placeholder:text-muted-foreground/60 shadow-sm backdrop-blur-xl transition-all duration-300 focus:border-primary/30 focus:outline-none focus:ring-4 focus:ring-primary/10 dark:bg-card/40 dark:shadow-2xl dark:shadow-black/20"
          disabled={isScanning}
        />
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.02] to-transparent" />
      </div>

      <div className="flex justify-center">
        <Button
          type="submit"
          disabled={!content.trim() || isScanning}
          size="lg"
          className="group relative h-12 min-w-[200px] gap-3 rounded-xl bg-foreground px-8 text-base font-medium text-background shadow-lg transition-all duration-300 hover:bg-foreground/90 hover:shadow-xl disabled:opacity-50 dark:bg-foreground dark:text-background dark:hover:bg-foreground/90"
        >
          {isScanning ? (
            <>
              <Spinner className="size-5" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Scan className="size-5 transition-transform duration-300 group-hover:scale-110" />
              <span>Scan for Spam</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
