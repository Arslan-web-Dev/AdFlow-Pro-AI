'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { getDisplayName, getUsername } from '@/lib/auth-display'
import {
  BarChart3,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Settings,
  ShoppingBag,
  Users,
  X,
  Plus,
  LayoutGrid,
  UserCircle2,
  ChevronRight,
} from 'lucide-react'

const PROFILE_IMAGE_URL = 'https://raw.githubusercontent.com/Arslan-web-Dev/My-projects-picks/refs/heads/main/personalpicks%20(1).png'

function getRole(pathname: string) {
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/moderator')) return 'moderator'
  return 'client'
}

function getLinks(role: string) {
  if (role === 'admin') {
    return [
      { name: 'Home', href: '/admin', icon: Home },
      { name: 'Ads', href: '/dashboard/ads', icon: ShoppingBag },
      { name: 'Payments', href: '/admin/payments', icon: CreditCard },
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Profile', href: '/dashboard/profile', icon: UserCircle2 },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]
  }

  return [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Ads', href: '/dashboard/ads', icon: ShoppingBag },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircle2 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const role = getRole(pathname)
  const links = getLinks(role)

  const displayName = getDisplayName(user, profile)
  const username = getUsername(user)

  const sidebarContent = (
    <div className="flex h-full flex-col text-on-surface">
      {/* Brand Header */}
      <div className="px-6 py-8">
        <Link href="/" className="flex items-center gap-3.5 group" onClick={() => setMobileOpen(false)}>
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-primary to-accent opacity-20 blur-sm transition group-hover:opacity-40" />
            <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-primary shadow-xl shadow-primary/30 transition-transform group-hover:scale-105">
              <LayoutGrid className="h-6.5 w-6.5 text-primary-foreground" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-on-surface">AdFlow <span className="text-primary">Pro</span></span>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                Enterprise AI
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-2 custom-scrollbar overflow-y-auto">
        <div className="mb-4 px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60">
          Main Menu
        </div>
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
              <span
                className={cn(
                  'group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 relative overflow-hidden',
                  active
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface hover:translate-x-1'
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary" />
                )}
                <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300", active ? "scale-110" : "group-hover:scale-110")} />
                <span className="flex-1">{link.name}</span>
                <ChevronRight className={cn("h-4 w-4 opacity-0 transition-all duration-300 -translate-x-2", active ? "opacity-40 translate-x-0" : "group-hover:opacity-40 group-hover:translate-x-0")} />
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Action Button */}
      <div className="px-4 py-6">
        <Link href="/dashboard/create" onClick={() => setMobileOpen(false)}>
          <span className="relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-4 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Plus className="h-5 w-5" />
            Create Campaign
          </span>
        </Link>
      </div>

      {/* User Quick Profile & Logout */}
      <div className="mt-auto border-t border-border/10 bg-surface-container-low/50 backdrop-blur-md px-4 py-5">
        <div className="mb-4 flex items-center gap-3 px-2">
          <div className="relative h-10 w-10 shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-tr from-primary to-accent opacity-30" />
            <img 
              src={PROFILE_IMAGE_URL} 
              alt="User" 
              className="relative h-full w-full rounded-full border border-white/10 object-cover shadow-sm"
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface-container-low bg-green-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-on-surface">{displayName}</p>
            <p className="truncate text-[11px] text-muted-foreground/80">@{username}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => signOut()}
          className="group flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-sm font-semibold text-on-surface-variant transition-all hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="md:flex md:h-screen md:w-72 md:flex-shrink-0 md:flex-col">
      <button
        type="button"
        className="fixed left-6 top-6 z-50 grid h-12 w-12 place-items-center rounded-2xl border border-border/40 bg-surface-container-low/80 text-on-surface backdrop-blur-xl shadow-lg md:hidden"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-background/40 backdrop-blur-md transition-opacity duration-300 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-72 flex-col border-r border-border/10 bg-surface-container-low transition-all duration-500 ease-in-out md:static md:z-0 md:translate-x-0',
          mobileOpen ? 'translate-x-0 shadow-2xl shadow-black/40' : '-translate-x-full md:translate-x-0'
        )}
      >
        {sidebarContent}
      </aside>
    </div>
  )
}

