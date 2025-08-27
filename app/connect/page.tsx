"use client"

import { useCallback, useMemo } from "react"
import { Button } from "@/app/components/ui/button"

export default function ConnectGitHubPage() {
  const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME
  const oauthClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID

  const installationUrl = useMemo(() => {
    if (!appName) return undefined
    return `https://github.com/apps/${appName}/installations/new`
  }, [appName])

  const handleOAuth = useCallback(() => {
    if (!oauthClientId) return
    const redirectUri = `${window.location.origin}/callback`
    const scopes = [
      "read:user",
      "user:email",
      // Request repo scope only if you need it directly; the App handles installs.
      // "repo",
    ].join(" ")
    const state = Math.random().toString(36).slice(2)
    try {
      window.localStorage.setItem("github_oauth_state", state)
    } catch (_) {
      // ignore storage errors
    }
    const url = new URL("https://github.com/login/oauth/authorize")
    url.searchParams.set("client_id", oauthClientId)
    url.searchParams.set("redirect_uri", redirectUri)
    url.searchParams.set("scope", scopes)
    url.searchParams.set("state", state)
    window.location.href = url.toString()
  }, [oauthClientId])

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Connect GitHub</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Install the GitHub App to grant access to your repositories.
        </p>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Button
          asChild
          className="w-full"
          disabled={!installationUrl}
        >
          <a href={installationUrl ?? "#"}>Install GitHub App</a>
        </Button>

        {oauthClientId ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={handleOAuth}
          >
            Continue with GitHub (OAuth)
          </Button>
        ) : null}
      </div>

      {!appName ? (
        <p className="mt-2 text-xs text-destructive">
          Missing NEXT_PUBLIC_GITHUB_APP_NAME environment variable.
        </p>
      ) : null}
    </div>
  )
}


