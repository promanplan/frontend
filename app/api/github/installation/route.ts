import { NextRequest, NextResponse } from 'next/server'

// Stores installation_id in a cookie so subsequent requests can use it
export async function POST(req: NextRequest) {
  try {
    const { installation_id } = await req.json()
    if (!installation_id) {
      return NextResponse.json({ message: 'installation_id is required' }, { status: 400 })
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set('gh_installation_id', String(installation_id), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    })
    return res
  } catch (err) {
    return NextResponse.json({ message: 'Invalid request' }, { status: 400 })
  }
}


