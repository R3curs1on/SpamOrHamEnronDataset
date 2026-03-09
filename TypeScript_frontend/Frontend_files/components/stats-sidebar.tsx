"use client"

import * as React from "react"
import { Activity, Scan, AlertTriangle, TrendingUp } from "lucide-react"

interface StatsSidebarProps {
  stats: {
    totalScanned: number
    spamDetected: number
    topKeywords: string[]
  }
}

export function StatsSidebar({ stats }: StatsSidebarProps) {
  const accuracy = 97.3 // Enron dataset accuracy

  return (
    <div className="space-y-4">
      {/* Model Accuracy */}
      <div className="group rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Model Accuracy
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
              {accuracy}%
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Enron Dataset</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-safe/10 text-safe">
            <TrendingUp className="size-5" />
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-safe transition-all duration-1000"
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>

      {/* Total Scanned */}
      <div className="group rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Scanned
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
              {stats.totalScanned.toLocaleString()}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">This session</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Scan className="size-5" />
          </div>
        </div>
      </div>

      {/* Spam Detected */}
      <div className="group rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Spam Detected
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
              {stats.spamDetected}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {stats.totalScanned > 0
                ? `${Math.round((stats.spamDetected / stats.totalScanned) * 100)}% of total`
                : "No emails scanned"}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-danger/10 text-danger">
            <AlertTriangle className="size-5" />
          </div>
        </div>
      </div>

      {/* Top Keywords */}
      <div className="group rounded-xl border border-border/50 bg-card/50 p-5 backdrop-blur-sm transition-all hover:border-border hover:bg-card/80">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Top Spam Keywords
          </p>
          <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
            <Activity className="size-5" />
          </div>
        </div>
        {stats.topKeywords.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {stats.topKeywords.map((keyword, index) => (
              <span
                key={keyword}
                className="rounded-md bg-danger/10 px-2 py-1 text-xs font-medium text-danger"
                style={{
                  opacity: 1 - index * 0.15,
                }}
              >
                {keyword}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No spam keywords detected yet
          </p>
        )}
      </div>
    </div>
  )
}
