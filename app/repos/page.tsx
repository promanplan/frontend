"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { ScrollArea } from "@/app/components/ui/scroll-area"

type Repo = {
  id: number
  full_name: string
  default_branch?: string
}

export default function ReposPage() {
  const router = useRouter()
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedRepoFullName, setSelectedRepoFullName] = useState<string>("")
  const selectedRepo = useMemo(
    () => repos.find(r => r.full_name === selectedRepoFullName),
    [repos, selectedRepoFullName]
  )

  const [branch, setBranch] = useState<string>("")

  useEffect(() => {
    let cancelled = false
    async function loadRepos() {
      setLoading(true)
      setError(null)
      try {
        const resp = await fetch("/api/github/repos", { cache: "no-store" })
        if (!resp.ok) {
          const body = await resp.text()
          throw new Error(body || "Failed to fetch repositories")
        }
        const data = await resp.json()
        if (!cancelled) {
          setRepos(Array.isArray(data) ? data : data?.repositories ?? [])
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "Unexpected error")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    loadRepos()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (selectedRepo && !branch) {
      setBranch(selectedRepo.default_branch || "main")
    }
  }, [selectedRepo, branch])

  async function handleDeploy() {
    setError(null)
    if (!selectedRepoFullName) {
      setError("Please select a repository.")
      return
    }
    if (!branch) {
      setError("Please enter a branch.")
      return
    }
    const res = await fetch("/api/github/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo: selectedRepoFullName, branch }),
    })
    if (!res.ok) {
      const body = await res.text()
      setError(body || "Failed to trigger deployment")
      return
    }
    router.push("/dashboard")
  }

  return (
    <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Select Repository</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a repository and branch to deploy.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-md border">
            <div className="border-b p-3 text-sm font-medium">Repositories</div>
            <ScrollArea className="h-72 p-3">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : repos.length === 0 ? (
                <p className="text-sm text-muted-foreground">No repositories found.</p>
              ) : (
                <ul className="space-y-2">
                  {repos.map((repo) => {
                    const checked = selectedRepoFullName === repo.full_name
                    return (
                      <li
                        key={repo.id}
                        className="flex items-center justify-between rounded-md p-2 hover:bg-accent"
                        onClick={() => setSelectedRepoFullName(repo.full_name)}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox checked={checked} onCheckedChange={() => setSelectedRepoFullName(repo.full_name)} />
                          <div className="text-sm">
                            <div className="font-medium">{repo.full_name}</div>
                            <div className="text-xs text-muted-foreground">
                              Default branch: {repo.default_branch || "main"}
                            </div>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </ScrollArea>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Input
              id="branch"
              value={branch}
              placeholder="e.g. main"
              onChange={(e) => setBranch(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleDeploy} disabled={!selectedRepoFullName || !branch}>
            Deploy
          </Button>

          <Button variant="outline" className="w-full" onClick={() => router.push("/connect")}>
            Back
          </Button>
        </div>
      </div>
    </div>
  )
}


