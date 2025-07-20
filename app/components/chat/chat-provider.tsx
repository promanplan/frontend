"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { GlobalChat } from "./global-chat";

interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const pathname = usePathname() || "";
  
  // Check if the current route is a project or dashboard route
  const isProjectOrDashboardRoute = 
    pathname.startsWith("/projects/") || 
    pathname.startsWith("/dashboard");
  
  return (
    <>
      {children}
      {isProjectOrDashboardRoute && <GlobalChat position="bottom-right" />}
    </>
  );
} 