"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import githubApi, { RepoInfo } from "@/lib/services/github"
import { Button } from "@/app/components/ui/button"
import { Checkbox } from "@/app/components/ui/checkbox"
import { toast } from "@/app/components/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"

type RepoSelection = {
    [repoFullName: string]: { selected: boolean; branch: string }
}

export default function GithubReposPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [repos, setRepos] = useState<RepoInfo[]>([])
    const [selection, setSelection] = useState<RepoSelection>({})
    const [deploying, setDeploying] = useState(false)
    const [branches, setBranches] = useState<Record<string, string[]>>({})
    const [branchesLoading, setBranchesLoading] = useState<Record<string, boolean>>({})
    const [commitInfo, setCommitInfo] = useState<Record<string, { sha: string; message: string; author: { name: string; date: string }; url: string } | null>>({})
    const [commitLoading, setCommitLoading] = useState<Record<string, boolean>>({})

    useEffect(() => {
        // Handle GitHub callback redirect
        const code = searchParams.get('code')
        const installation_id = searchParams.get('installation_id')
        const setup_action = searchParams.get('setup_action')
        
        if (installation_id && setup_action === 'install') {
            console.log('GitHub App installed successfully! Installation ID:', installation_id)
            
            // Store in localStorage for persistence
            localStorage.setItem('github_installation_id', installation_id)
            // Ensure httpOnly cookie is set for API routes
            void fetch('/api/github/installation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ installation_id }),
            })
            
            // Clean up URL parameters
            router.replace('/github/repos')
        } else if (installation_id) {
            console.log('GitHub App connected! Installation ID:', installation_id)
            
            // Store in localStorage for persistence
            localStorage.setItem('github_installation_id', installation_id)
            // Ensure httpOnly cookie is set for API routes
            void fetch('/api/github/installation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ installation_id }),
            })
            
            // Clean up URL parameters
            router.replace('/github/repos')
        }

        // On initial load without callback params, try to set cookie from localStorage
        if (!installation_id) {
            const storedId = localStorage.getItem('github_installation_id')
            if (storedId) {
                void fetch('/api/github/installation', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ installation_id: storedId }),
                })
            }
        }

        const run = async () => {
            try {
                const data = await githubApi.getRepos()
                setRepos(data.repos || [])
                const initial: RepoSelection = {}
                ;(data.repos || []).forEach((r) => {
                    initial[r.full_name] = { selected: false, branch: r.default_branch || "main" }
                })
                setSelection(initial)
            } catch (err: any) {
                const message = err?.message || "Failed to fetch repositories"
                toast({ title: "Error", description: message })
            } finally {
                setLoading(false)
            }
        }
        run()
    }, [router, searchParams])

    const selectedItems = useMemo(() => Object.entries(selection).filter(([_, v]) => v.selected), [selection])

    const loadBranches = async (repoFullName: string, defaultBranch?: string) => {
        setBranchesLoading((prev) => ({ ...prev, [repoFullName]: true }))
        try {
            const res = await githubApi.getBranches(repoFullName)
            const names = (res.branches || []).map((b) => b.name)
            setBranches((prev) => ({ ...prev, [repoFullName]: names }))
            const branchToUse = defaultBranch && names.includes(defaultBranch) ? defaultBranch : names[0]
            if (branchToUse) {
                setSelection((prev) => ({ ...prev, [repoFullName]: { selected: true, branch: branchToUse } }))
                void loadCommit(repoFullName, branchToUse)
            }
        } catch (err: any) {
            const message = err?.message || "Failed to load branches"
            toast({ title: "Branch error", description: message })
        } finally {
            setBranchesLoading((prev) => ({ ...prev, [repoFullName]: false }))
        }
    }

    const loadCommit = async (repoFullName: string, branch: string) => {
        setCommitLoading((prev) => ({ ...prev, [repoFullName]: true }))
        try {
            const res = await githubApi.getCommit(repoFullName, branch)
            setCommitInfo((prev) => ({ ...prev, [repoFullName]: res.commit }))
        } catch (_) {
            setCommitInfo((prev) => ({ ...prev, [repoFullName]: null }))
        } finally {
            setCommitLoading((prev) => ({ ...prev, [repoFullName]: false }))
        }
    }

    const triggerDeploy = async () => {
        if (selectedItems.length === 0) {
            toast({ title: "Select a repository", description: "Please choose at least one repository." })
            return
        }
        setDeploying(true)
        try {
            const [repoFullName, { branch }] = selectedItems[0]
            await githubApi.deploy({ repoFullName, branch })
            toast({ title: "Deployment triggered", description: `${repoFullName}@${branch}` })
        } catch (err: any) {
            const message = err?.message || "Failed to trigger deployment"
            toast({ title: "Deploy error", description: message })
        } finally {
            setDeploying(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-3xl px-4 py-8">
            <h1 className="mb-2 text-xl font-semibold">Select repository</h1>
            <p className="mb-6 text-sm text-neutral-500">Choose a repository and branch to deploy.</p>

            {loading ? (
                <div className="text-sm text-neutral-500">Loading repositories…</div>
            ) : repos.length === 0 ? (
                <div className="text-sm text-neutral-500">No repositories available.</div>
            ) : (
                <div className="space-y-3">
                    {repos.map((repo) => {
                        const s = selection[repo.full_name]
                        return (
                            <div key={repo.id} className="flex flex-col gap-3 rounded-md border border-neutral-200 p-3 dark:border-neutral-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={s?.selected || false}
                                            onCheckedChange={(v) => {
                                                const nextSelected = Boolean(v)
                                                setSelection((prev) => ({
                                                    ...prev,
                                                    [repo.full_name]: { selected: nextSelected, branch: s?.branch || repo.default_branch || "main" },
                                                }))
                                                if (nextSelected) {
                                                    void loadBranches(repo.full_name, repo.default_branch || "main")
                                                }
                                            }}
                                        />
                                        <div>
                                            <div className="text-sm font-medium">{repo.full_name}</div>
                                            <div className="text-xs text-neutral-500">Default branch: {repo.default_branch || "main"}</div>
                                        </div>
                                    </div>
                                    {s?.selected && (
                                        <div className="flex items-center gap-2">
                                            {branchesLoading[repo.full_name] ? (
                                                <div className="text-xs text-neutral-500">Loading branches…</div>
                                            ) : (
                                                <Select
                                                    value={s?.branch || ""}
                                                    onValueChange={(val) => {
                                                        setSelection((prev) => ({
                                                            ...prev,
                                                            [repo.full_name]: { selected: true, branch: val },
                                                        }))
                                                        void loadCommit(repo.full_name, val)
                                                    }}
                                                >
                                                    <SelectTrigger className="h-9 w-48">
                                                        <SelectValue placeholder="Select branch" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(branches[repo.full_name] || []).map((b) => (
                                                            <SelectItem key={b} value={b}>
                                                                {b}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {s?.selected && (
                                    <div className="rounded-md border border-neutral-200 p-3 text-xs dark:border-neutral-800">
                                        {commitLoading[repo.full_name] ? (
                                            <div className="text-neutral-500">Loading commit information…</div>
                                        ) : commitInfo[repo.full_name] ? (
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="font-mono">{commitInfo[repo.full_name]!.sha.substring(0, 8)}</div>
                                                    <div className="mt-1 text-neutral-700 dark:text-neutral-300">{commitInfo[repo.full_name]!.message}</div>
                                                    <div className="mt-1 text-neutral-500">{commitInfo[repo.full_name]!.author.name} • {new Date(commitInfo[repo.full_name]!.author.date).toLocaleString()}</div>
                                                </div>
                                                <a href={commitInfo[repo.full_name]!.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">View</a>
                                            </div>
                                        ) : (
                                            <div className="text-neutral-500">No commit information available.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <div className="mt-6 flex justify-end">
                <Button onClick={triggerDeploy} disabled={deploying || selectedItems.length === 0}>
                    {deploying ? "Deploying…" : "Deploy"}
                </Button>
            </div>
        </div>
    )
}

//
