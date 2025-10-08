import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const appName = process.env.NEXT_PUBLIC_GITHUB_APP_NAME || process.env.GITHUB_APP_NAME || 'pmp-deployer'
    const installUrl = `https://github.com/apps/${appName}/installations/new`
    return NextResponse.json({ installUrl, success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate install URL' }, { status: 500 })
  }
}


