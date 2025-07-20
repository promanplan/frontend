"use client"
import * as React from "react"
import { useTheme } from "next-themes";
// import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { TypingAnimation } from "@/components/magicui/typing-animation"
import Link from "next/link"
// import { ModeToggle } from "@/components/mode-toggle"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container px-4 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <Icons.logo className="h-8 w-8" />
              <span className="font-bold text-xl">PMP</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your AI Co-Founder that builds your startup from idea to launch.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="https://twitter.com" className="hover:text-primary">
                <Icons.twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <a href="https://linkedin.com" className="hover:text-primary">
                <span className="font-medium text-lg">in</span>
                <span className="sr-only">LinkedIn</span>
              </a>
              <Link href="https://github.com" className="hover:text-primary">
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
          
          {/* Product Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium text-base">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#features" className="hover:underline">Features</Link></li>
              <li><Link href="/pricing" className="hover:underline">Pricing</Link></li>
              <li><Link href="/request-demo" className="hover:underline">Request Demo</Link></li>
              <li><Link href="/join-waitlist" className="hover:underline">Join Waitlist</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium text-base">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:underline">Blog</Link></li>
              <li><Link href="/documentation" className="hover:underline">Documentation</Link></li>
              <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
              <li><Link href="/support" className="hover:underline">Support</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-medium text-base">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/careers" className="hover:underline">Careers</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} PMP. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <TypingAnimation className="text-sm text-muted-foreground">
              From idea to launch, powered by AI.
            </TypingAnimation>
          </div>
        </div>
      </div>
    </footer>
  )
}