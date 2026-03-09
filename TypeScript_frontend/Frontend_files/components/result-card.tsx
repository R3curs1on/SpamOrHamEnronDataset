"use client"

import * as React from "react"
import { ShieldCheck, AlertTriangle, Info, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface ResultCardProps {
  result: {
    isSpam: boolean
    confidence: number
    keywords: string[]
  } | null
  onDismiss: () => void
}

export function ResultCard({ result, onDismiss }: ResultCardProps) {
  if (!result) return null

  const isSpam = result.isSpam
  const confidencePercent = Math.round(result.confidence * 100)

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border p-8 shadow-lg backdrop-blur-xl transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4 ${
        isSpam
          ? "border-danger/30 bg-danger/5 shadow-danger/10 dark:bg-danger/10 dark:shadow-danger/20"
          : "border-safe/30 bg-safe/5 shadow-safe/10 dark:bg-safe/10 dark:shadow-safe/20"
      }`}
    >
      {/* Glow effect */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          isSpam
            ? "bg-gradient-to-br from-danger/10 via-transparent to-danger/5"
            : "bg-gradient-to-br from-safe/10 via-transparent to-safe/5"
        }`}
      />

      {/* Dismiss button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onDismiss}
        className="absolute right-4 top-4 size-8 rounded-full opacity-60 hover:opacity-100"
      >
        <X className="size-4" />
        <span className="sr-only">Dismiss</span>
      </Button>

      <div className="relative flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div
          className={`flex size-20 items-center justify-center rounded-full ${
            isSpam
              ? "bg-danger/15 text-danger"
              : "bg-safe/15 text-safe"
          }`}
        >
          {isSpam ? (
            <AlertTriangle className="size-10" strokeWidth={1.5} />
          ) : (
            <ShieldCheck className="size-10" strokeWidth={1.5} />
          )}
        </div>

        {/* Badge */}
        <Badge
          className={`px-4 py-1.5 text-sm font-semibold ${
            isSpam
              ? "border-danger/30 bg-danger/20 text-danger hover:bg-danger/25"
              : "border-safe/30 bg-safe/20 text-safe hover:bg-safe/25"
          }`}
        >
          {isSpam ? "Caution - Likely Spam" : "Safe - Legitimate Email"}
        </Badge>

        {/* Confidence */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Classification Confidence
          </p>
          <div className="flex items-center justify-center gap-2">
            <span
              className={`text-3xl font-semibold tabular-nums ${
                isSpam ? "text-danger" : "text-safe"
              }`}
            >
              {confidencePercent}%
            </span>

            {isSpam && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Info className="size-4" />
                    <span className="sr-only">Why is this spam?</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-left">
                  <p className="font-medium">Naive Bayes Classification</p>
                  <p className="mt-1 text-muted-foreground">
                    This email was classified as spam based on word frequency
                    analysis trained on the Enron dataset. Key indicators:{" "}
                    {result.keywords.slice(0, 3).join(", ")}.
                  </p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Keywords detected */}
        {isSpam && result.keywords.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Spam Indicators Detected
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {result.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-md bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
