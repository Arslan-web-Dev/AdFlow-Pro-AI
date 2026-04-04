'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { Bell, Search, Menu, Home, ShoppingBag, CreditCard, BarChart3, Users, UserCircle2, Settings, Plus, Bot, Sparkles } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { getDisplayName, getRoleLabel, getUsername } from '@/lib/auth-display'
import { Logo } from '@/components/ui/logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'

function getRole(pathname: string) {
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/moderator')) return 'moderator'
  return 'client'
}

function getLinks(role: string) {
  const base = [
    { name: 'Home', href: role === 'admin' ? '/admin' : '/dashboard', icon: Home },
    { name: 'Ads', href: '/dashboard/ads', icon: ShoppingBag },
    { name: 'Payments', href: role === 'admin' ? '/admin/payments' : '/dashboard/payments', icon: CreditCard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ]
  
  if (role === 'admin') {
    base.push({ name: 'Users', href: '/admin/users', icon: Users })
  }

  base.push(
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircle2 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings }
  )
  
  return base
}

export function DashboardTopBar({ 
  isAIActive, 
  onAIToggle 
}: { 
  isAIActive?: boolean
  onAIToggle?: () => void 
}) {
  const pathname = usePathname()
  const { user, profile, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const displayName = getDisplayName(user, profile)
  const username = getUsername(user)
  const roleLabel = getRoleLabel(profile?.role)
  const role = getRole(pathname)
  const links = getLinks(role)

  const PROFILE_IMAGE_URL = 'https://raw.githubusercontent.com/Arslan-web-Dev/My-projects-picks/refs/heads/main/personalpicks%20(1).png'

  return (
    <header className="af-glass-header sticky top-0 z-40 w-full border-b border-white/5">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo className="hidden md:flex flex-shrink-0" />
        
        {/* Mobile Logo & Menu Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-on-surface">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-r-white/5 bg-[#0f172a] p-0">
              <SheetHeader className="p-6 text-left border-b border-white/5">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 p-4">
                <button
                  onClick={() => {
                    onAIToggle?.()
                    setMobileOpen(false)
                  }}
                  className={cn(
                    "mb-2 flex items-center gap-3 rounded-xl px-4 py-4 text-sm font-bold transition-all",
                    isAIActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "bg-white/5 text-on-surface hover:bg-white/10"
                  )}
                >
                  {isAIActive ? <Sparkles className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  {isAIActive ? "Close AI Mode" : "Activate AI Mode"}
                </button>
                
                {links.map((link) => {
                  const Icon = link.icon
                  const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
                  return (
                    <Link 
                      key={link.href} 
                      href={link.href} 
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all",
                        active 
                          ? "bg-primary/10 text-primary" 
                          : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  )
                })}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <Link 
                    href="/dashboard/create" 
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25"
                  >
                    <Plus className="h-5 w-5" />
                    Create Campaign
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Logo showText={false} />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 mx-4 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all hover:text-on-surface",
                  active ? "text-primary font-bold" : "text-on-surface-variant"
                )}
              >
                {link.name}
                {active && (
                  <span className="absolute bottom-[-18px] left-0 right-0 h-1 rounded-t-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-3 px-2">
          <div className="hidden max-w-[200px] flex-1 items-center md:flex lg:max-w-xs">
            <div className="relative w-full group">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-full border border-white/5 bg-white/5 py-1.5 pl-9 pr-4 text-xs text-on-surface placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white/10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAIToggle}
              className={cn(
                "relative grid h-10 w-10 place-items-center rounded-full transition-all duration-300",
                isAIActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "text-on-surface-variant hover:bg-white/10 hover:text-on-surface"
              )}
              title={isAIActive ? "Close AI Assistant" : "Open AI Assistant"}
            >
              {isAIActive ? <Sparkles className="h-5 w-5 animate-pulse" /> : <Bot className="h-5 w-5" />}
              {!isAIActive && (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary animate-ping" />
              )}
            </button>

            <ThemeToggle />
            
            <button
              type="button"
              className="relative grid h-10 w-10 place-items-center rounded-full text-on-surface-variant transition hover:bg-white/10 hover:text-on-surface"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent ring-2 ring-background" />
            </button>

            <div className="hidden pl-2 text-right lg:block">
              {loading ? (
                <p className="text-xs text-muted-foreground">Loading…</p>
              ) : (
                <>
                  <p className="text-sm font-bold text-on-surface leading-tight">{displayName}</p>
                  <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                    {roleLabel}
                  </p>
                </>
              )}
            </div>

            <Link
              href="/dashboard/profile"
              className="group relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-primary/20 ring-4 ring-primary/5 transition-all hover:scale-110 active:scale-95"
              title="Open profile"
            >
              <Image
                src={PROFILE_IMAGE_URL}
                alt={displayName}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
