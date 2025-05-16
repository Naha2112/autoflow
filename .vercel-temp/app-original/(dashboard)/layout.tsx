"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { BarChart3, FileText, Mail, Settings, Menu, Home, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

// Simple Skeleton component for loading states
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user, status, signOut } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Close mobile nav when path changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Email Templates", href: "/email-templates", icon: Mail },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Automation", href: "/automation", icon: Clock },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    )
  }

  const NavLinks = () => (
    <>
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="h-6 w-6 rounded-md bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
            AF
          </span>
          <span>AutoFlow</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
        {isMobile && (
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 sm:max-w-none">
              <NavLinks />
            </SheetContent>
          </Sheet>
        )}

        <div className="flex flex-1 items-center justify-end gap-4">
          <ModeToggle />
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 gap-1"
            onClick={() => signOut()}
          >
            <span className="hidden sm:inline-flex">
              {user?.name || user?.email || "Account"}
            </span>
            <Avatar className="h-6 w-6">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 border-r md:block">
          <NavLinks />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
