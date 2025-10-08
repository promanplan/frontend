import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_GITHUB_APP_ADDRESS || process.env.BACKEND_URL || 'http://localhost:3001'

export async function GET(req: NextRequest) {
  try {
    const cookies = req.cookies
    const installationId = cookies.get('gh_installation_id')?.value
    if (!installationId) {
      return NextResponse.json({ message: 'No installation. Please connect GitHub.' }, { status: 400 })
    }

    const res = await fetch(`${BACKEND_URL}/api/repositories?installation_id=${encodeURIComponent(installationId)}`)
    if (!res.ok) {
      const msg = await safeMessage(res)
      return NextResponse.json({ message: msg }, { status: res.status })
    }
    const data = await res.json()
    const repos = (data.repositories || []).map((r: any) => ({
      id: r.id,
      full_name: r.full_name,
      default_branch: r.default_branch,
      private: r.private,
    }))
    return NextResponse.json({ repos })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch repositories'
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


