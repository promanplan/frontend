"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/app/components/ui/button"

export default function GitHubCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<string>("Processing...")
  const [error, setError] = useState<string | null>(null)

  const code = useMemo(() => searchParams.get("code"), [searchParams])
  const installationId = useMemo(
    () => searchParams.get("installation_id"),
    [searchParams]
  )
  const state = useMemo(() => searchParams.get("state"), [searchParams])

  useEffect(() => {
    let cancelled = false

    async function run() {
      try {
        // If OAuth code exists, exchange it
        if (code) {
          const storedState = typeof window !== "undefined" ? window.localStorage.getItem("github_oauth_state") : null
          if (state && storedState && state !== storedState) {
            throw new Error("State mismatch. Please retry GitHub login.")
          }
          setStatus("Signing in with GitHub...")
          const resp = await fetch("/api/github/oauth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          })
          if (!resp.ok) {
            const body = await resp.text()
            throw new Error(body || "OAuth exchange failed")
          }
        }

        // If installation id exists, send it to backend
        if (installationId) {
          setStatus("Saving installation...")
          const resp = await fetch("/api/github/installation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ installation_id: installationId }),
          })
          if (!resp.ok) {
            const body = await resp.text()
            throw new Error(body || "Failed to save installation")
          }
        }

        if (!cancelled) {
          router.replace("/repos")
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message || "Unexpected error")
          setStatus("")
        }
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [code, installationId, state, router])

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Finalizing</h1>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
      {error ? (
        <div className="w-full rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <Button variant="outline" onClick={() => router.push("/connect")}>Back</Button>
    </div>
  )
}


