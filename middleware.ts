// Disabled NextAuth middleware - allowing all access
import { NextResponse } from "next/server"

export function middleware() {
  // No checks - allowing all requests to pass through
  return NextResponse.next()
}

// Setting matcher to empty array to disable the middleware entirely
export const config = {
  matcher: [],
}