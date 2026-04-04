'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
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
} from 'lucide-react'

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
  const { signOut } = useAuth()
  const role = getRole(pathname)
  const links = getLinks(role)

  const sidebarContent = (
    <div className="flex h-full flex-col text-on-surface">
      <div className="border-b border-border/20 px-5 py-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary shadow-lg shadow-primary/25">
            <LayoutGrid className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight text-on-surface">AdFlow Pro</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Premium Tier
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
              <span
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {link.name}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4">
        <Link href="/dashboard/create" onClick={() => setMobileOpen(false)}>
          <span className="af-gradient flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" />
            Create Ad
          </span>
        </Link>
      </div>

      <div className="mt-auto border-t border-border/20 px-3 py-4">
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
        >
          <LogOut className="h-5 w-5" />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="md:flex md:h-screen md:w-64 md:flex-shrink-0 md:flex-col">
      <button
        type="button"
        className="fixed left-4 top-4 z-50 grid h-11 w-11 place-items-center rounded-xl border border-border/40 bg-surface-container-low text-on-surface md:hidden"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col border-r border-border/20 bg-surface-container-low transition-transform duration-300 md:static md:z-0 md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {sidebarContent}
      </aside>
    </div>
  )
}
