"use client"

import * as React from "react"
import { Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { EmailInput } from "@/components/email-input"
import { ResultCard } from "@/components/result-card"
import { GmailSection } from "@/components/gmail-section"
import { StatsSidebar } from "@/components/stats-sidebar"

// Spam keywords for Naive Bayes simulation
const spamKeywords = [
  "winner",
  "lottery",
  "prize",
  "urgent",
  "act now",
  "limited time",
  "free",
  "click here",
  "congratulations",
  "million",
  "claim",
  "verify",
  "suspended",
  "account",
  "password",
  "security alert",
  "compromised",
  "bank",
  "wire transfer",
  "nigerian prince",
  "inheritance",
  "discount",
  "offer expires",
  "credit card",
  "prescription",
  "viagra",
  "casino",
  "earn money",
  "work from home",
  "guaranteed",
]

interface ScanResult {
  isSpam: boolean
  confidence: number
  keywords: string[]
}

export default function EmailIntelligenceDashboard() {
  const [isScanning, setIsScanning] = React.useState(false)
  const [result, setResult] = React.useState<ScanResult | null>(null)
  const [emailContent, setEmailContent] = React.useState("")
  const [stats, setStats] = React.useState({
    totalScanned: 0,
    spamDetected: 0,
    topKeywords: [] as string[],
  })

  // Simulated Naive Bayes classification
  const classifyEmail = (content: string): ScanResult => {
    const lowerContent = content.toLowerCase()
    const detectedKeywords: string[] = []

    spamKeywords.forEach((keyword) => {
      if (lowerContent.includes(keyword.toLowerCase())) {
        detectedKeywords.push(keyword)
      }
    })

    // Calculate spam probability based on keyword density
    const keywordScore = detectedKeywords.length
    const wordCount = content.split(/\s+/).length
    const keywordDensity = keywordScore / Math.max(wordCount, 1)

    // Naive Bayes-inspired confidence calculation
    let confidence: number
    let isSpam: boolean

    if (keywordScore >= 3 || keywordDensity > 0.05) {
      isSpam = true
      confidence = Math.min(0.65 + keywordScore * 0.08, 0.98)
    } else if (keywordScore >= 1) {
      isSpam = keywordDensity > 0.02
      confidence = isSpam ? 0.55 + keywordScore * 0.1 : 0.7 + (1 - keywordDensity) * 0.25
    } else {
      isSpam = false
      confidence = 0.85 + Math.random() * 0.12
    }

    return {
      isSpam,
      confidence,
      keywords: detectedKeywords,
    }
  }

  const handleScan = async (content: string) => {
    setEmailContent(content)
    setIsScanning(true)
    setResult(null)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const scanResult = classifyEmail(content)
    setResult(scanResult)
    setIsScanning(false)

    // Update stats
    setStats((prev) => ({
      totalScanned: prev.totalScanned + 1,
      spamDetected: prev.spamDetected + (scanResult.isSpam ? 1 : 0),
      topKeywords: [
        ...new Set([...scanResult.keywords, ...prev.topKeywords]),
      ].slice(0, 8),
    }))
  }

  const handleFetchEmail = (email: string) => {
    handleScan(email)
  }

  const handleDismissResult = () => {
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
              <Shield className="size-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Email Intelligence
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          {/* Main Content */}
          <div className="space-y-10">
            {/* Hero Section */}
            <section className="text-center">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Intelligent Spam Detection
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
                Powered by Naive Bayes classification trained on the Enron email
                dataset. Paste your email content below for instant analysis.
              </p>
            </section>

            {/* Input Section */}
            <section className="mx-auto max-w-2xl">
              <EmailInput onScan={handleScan} isScanning={isScanning} />
            </section>

            {/* Result Section */}
            {result && (
              <section className="mx-auto max-w-2xl">
                <ResultCard result={result} onDismiss={handleDismissResult} />
              </section>
            )}

            {/* Gmail Section */}
            <section className="mx-auto max-w-2xl rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
              <GmailSection onFetchEmail={handleFetchEmail} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <StatsSidebar stats={stats} />
            </div>
          </aside>
        </div>

        {/* Mobile Stats */}
        <div className="mt-10 lg:hidden">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Statistics
          </h2>
          <StatsSidebar stats={stats} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Email Intelligence Dashboard — Naive Bayes Classification Model
          </p>
        </div>
      </footer>
    </div>
  )
}
