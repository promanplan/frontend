import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_GITHUB_APP_ADDRESS || process.env.BACKEND_URL || 'http://localhost:3001'

export async function GET(req: NextRequest) {
    try {
        const search = new URL(req.url).searchParams
        const repo = search.get('repo')
        const branch = search.get('branch')
        if (!repo || !branch) return NextResponse.json({ message: 'repo and branch are required' }, { status: 400 })

        const installationId = req.cookies.get('gh_installation_id')?.value
        if (!installationId) return NextResponse.json({ message: 'No installation. Please connect GitHub.' }, { status: 400 })

        const res = await fetch(`${BACKEND_URL}/api/commit?installation_id=${encodeURIComponent(installationId)}&repo=${encodeURIComponent(repo)}&branch=${encodeURIComponent(branch)}`)
        if (!res.ok) {
            const msg = await safeMessage(res)
            return NextResponse.json({ message: msg }, { status: res.status })
        }
        const data = await res.json()
        return NextResponse.json(data)
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch commit'
        return NextResponse.json({ message }, { status: 500 })
    }
}

async function safeMessage(res: Response) {
    try {
        const data = await res.json()
        return data?.message || data?.error || res.statusText
    } catch {
        return res.statusText
    }
}


