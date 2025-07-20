// import { MobileNav } from "@/components/mobile-nav";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";
import { fontSans } from "@/lib/fonts";
import Link from "@/node_modules/next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/toggle";
// import HeroPage from "./hero/page";
import { SiteFooter } from "@/components/site-footer";
// import PricingPage from "@/app/pricing/page";
import MobileNav from "@/components/mobile-nav";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/lib/session";
import { getAuthSession } from "@/lib/auth";
import { ChatProvider } from "@/components/chat/chat-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PMP",
  description: "Build your product",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "relative flex min-h-screen w-full flex-col justify-center scroll-smooth bg-background font-sans antialiased",
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ChatProvider>
            <main className="flex-1">{children}</main>
            <Analytics />
            <SpeedInsights />
            {/* </div>
             
            <SiteFooter /> */}
            <Toaster />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
