import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_GITHUB_APP_ADDRESS || process.env.BACKEND_URL || 'http://localhost:3001'

export async function POST(req: NextRequest) {
  try {
    const { repoFullName, branch, commit } = await req.json()
    if (!repoFullName || !branch) {
      return NextResponse.json({ message: 'repoFullName and branch are required' }, { status: 400 })
    }

    const installationId = req.cookies.get('gh_installation_id')?.value
    if (!installationId) {
      return NextResponse.json({ message: 'No installation. Please connect GitHub.' }, { status: 400 })
    }

    const res = await fetch(`${BACKEND_URL}/api/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ installation_id: installationId, repository: repoFullName, branch, commit }),
    })
    if (!res.ok) {
      const msg = await safeMessage(res)
      return NextResponse.json({ message: msg }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json({ success: true, ...data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to trigger deploy'
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


