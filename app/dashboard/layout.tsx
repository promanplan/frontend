// "use client";
import { getCurrentUser } from "@/lib/session"

import { getAuthSession } from "@/lib/auth"

{/* @ts-ignore */}

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({ 
  children, 
}: DashboardLayoutProps) {
  // No longer using actual auth - these will return null
  const user = await getCurrentUser()
  const session = await getAuthSession();

  // Use a default guest user instead of requiring authentication
  const guestUser = {
    name: "Guest User",
    email: "guest@example.com",
    image: null,
  }

  return (
    <>
      {children}
    </>
  )
}