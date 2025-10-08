import { NextRequest, NextResponse } from 'next/server'

// Minimal stub to satisfy client. In a full flow, exchange code server-side.
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ message: 'code is required' }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }
}


