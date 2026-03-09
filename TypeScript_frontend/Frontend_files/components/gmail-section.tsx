"use client"

import * as React from "react"
import { Mail, RefreshCw, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface GmailSectionProps {
  onFetchEmail: (email: string) => void
}

// Simulated unread emails
const mockEmails = [
  {
    id: 1,
    subject: "Congratulations! You've won $1,000,000",
    from: "lottery@winner-mail.xyz",
    preview: "Click here to claim your prize immediately! Act now before it expires...",
    isSpam: true,
  },
  {
    id: 2,
    subject: "Meeting Tomorrow at 3 PM",
    from: "sarah.johnson@company.com",
    preview: "Hi, just a reminder about our project review meeting tomorrow afternoon...",
    isSpam: false,
  },
  {
    id: 3,
    subject: "URGENT: Your account has been compromised",
    from: "security@bankk-alerts.net",
    preview: "Dear customer, we detected suspicious activity. Click here to verify your identity...",
    isSpam: true,
  },
]

export function GmailSection({ onFetchEmail }: GmailSectionProps) {
  const [isConnected, setIsConnected] = React.useState(false)
  const [isConnecting, setIsConnecting] = React.useState(false)
  const [isFetching, setIsFetching] = React.useState(false)
  const [emails, setEmails] = React.useState<typeof mockEmails>([])

  const handleConnect = async () => {
    setIsConnecting(true)
    // Simulate OAuth connection
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsConnecting(false)
    setIsConnected(true)
  }

  const handleFetch = async () => {
    setIsFetching(true)
    // Simulate fetching emails
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setEmails(mockEmails)
    setIsFetching(false)
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-secondary">
            <Mail className="size-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium">Inbox Intelligence</h3>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "Connected to Gmail" : "Connect your inbox for live scanning"}
            </p>
          </div>
        </div>

        {!isConnected ? (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            variant="outline"
            className="gap-2 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card"
          >
            {isConnecting ? (
              <>
                <Spinner className="size-4" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Mail className="size-4" />
                <span>Connect Gmail</span>
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleFetch}
            disabled={isFetching}
            variant="outline"
            className="gap-2 rounded-xl border-safe/30 bg-safe/10 text-safe hover:bg-safe/20"
          >
            {isFetching ? (
              <>
                <Spinner className="size-4" />
                <span>Fetching...</span>
              </>
            ) : (
              <>
                <RefreshCw className="size-4" />
                <span>Fetch Latest Unread</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Email list */}
      {emails.length > 0 && (
        <div className="space-y-2 rounded-xl border border-border/50 bg-card/30 p-2 backdrop-blur-sm">
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => onFetchEmail(`Subject: ${email.subject}\nFrom: ${email.from}\n\n${email.preview}`)}
              className="group flex w-full items-start gap-3 rounded-lg p-3 text-left transition-all hover:bg-secondary/50"
            >
              <div
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${
                  email.isSpam
                    ? "bg-danger/10 text-danger"
                    : "bg-safe/10 text-safe"
                }`}
              >
                {email.isSpam ? (
                  <Mail className="size-4" />
                ) : (
                  <CheckCircle2 className="size-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{email.subject}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {email.from}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground/70">
                  {email.preview}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
