'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/providers/auth-provider'
import { getDisplayName, getUsername } from '@/lib/auth-display'
import { motion, AnimatePresence } from 'framer-motion'
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const PROFILE_IMAGE_URL = 'https://raw.githubusercontent.com/Arslan-web-Dev/My-projects-picks/refs/heads/main/personalpicks%20(1).png'

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

export function DashboardSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const { user, profile, signOut } = useAuth()
  const role = getRole(pathname)
  const links = getLinks(role)

  const displayName = getDisplayName(user, profile)
  const username = getUsername(user)

  // Persist collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved !== null) setIsCollapsed(saved === 'true')
    setMounted(true)
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
  }

  if (!mounted) return <div className="hidden md:flex md:w-72 md:flex-shrink-0" />

  const sidebarContent = (
    <div className="flex h-full flex-col text-on-surface">
      {/* Brand Header */}
      <div className={cn("px-6 py-8 transition-all duration-300", isCollapsed ? "px-4" : "px-6")}>
        <Link href="/" className="flex items-center gap-3.5 group" onClick={() => setMobileOpen(false)}>
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-tr from-primary to-accent opacity-20 blur-sm transition group-hover:opacity-40" />
            <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-primary shadow-xl shadow-primary/30 transition-transform group-hover:scale-105">
              <LayoutGrid className="h-6.5 w-6.5 text-primary-foreground" />
            </div>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="text-xl font-black tracking-tight text-on-surface">
                  AdFlow <span className="text-primary">Pro</span>
                </span>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                    Enterprise AI
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-4 py-2 custom-scrollbar overflow-y-auto">
        {!isCollapsed && (
          <div className="mb-4 px-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">
            Main Menu
          </div>
        )}
        {links.map((link) => {
          const Icon = link.icon
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
          return (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} title={isCollapsed ? link.name : ""}>
              <span
                className={cn(
                  'group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 relative overflow-hidden',
                  active
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface hover:translate-x-1',
                  isCollapsed && "justify-center px-0"
                )}
              >
                {active && (
                  <motion.span 
                    layoutId="active-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary" 
                  />
                )}
                <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300", active ? "scale-110" : "group-hover:scale-110")} />
                {!isCollapsed && <span className="flex-1">{link.name}</span>}
                {!isCollapsed && (
                  <ChevronRight className={cn("h-4 w-4 opacity-0 transition-all duration-300 -translate-x-2", active ? "opacity-40 translate-x-0" : "group-hover:opacity-40 group-hover:translate-x-0")} />
                )}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Action Button */}
      <div className="px-4 py-6">
        <Link href="/dashboard/create" onClick={() => setMobileOpen(false)}>
          <span className={cn(
            "relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] group",
            isCollapsed ? "h-11 w-11 p-0" : "px-4 py-3.5"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Plus className="h-5 w-5" />
            {!isCollapsed && <span>Create Campaign</span>}
          </span>
        </Link>
      </div>

      {/* User Quick Profile & Logout */}
      <div className="mt-auto bg-white/[0.02] backdrop-blur-md px-4 py-5">
        <div className={cn("mb-4 flex items-center gap-3", isCollapsed ? "justify-center px-0" : "px-2")}>
          <div className="relative h-10 w-10 shrink-0">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-primary to-accent opacity-30" />
            <Image 
              src={PROFILE_IMAGE_URL} 
              alt="User" 
              width={40}
              height={40}
              className="relative h-full w-full rounded-full border border-white/10 object-cover shadow-sm"
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#1a1f2e] bg-green-500" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="min-w-0 flex-1 overflow-hidden"
              >
                <p className="truncate text-sm font-bold text-on-surface">{displayName}</p>
                <p className="truncate text-[11px] text-muted-foreground/60">@{username}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => signOut()}
          className={cn(
            "group flex items-center gap-3.5 rounded-xl text-left text-sm font-semibold text-on-surface-variant transition-all hover:bg-destructive/10 hover:text-destructive",
            isCollapsed ? "justify-center p-3" : "w-full px-4 py-3"
          )}
          title={isCollapsed ? "Sign Out" : ""}
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse Toggle Button (Desktop Only) */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-24 hidden h-6 w-6 place-items-center rounded-full border border-white/10 bg-[#1a1f2e] text-muted-foreground shadow-lg transition-colors hover:bg-primary hover:text-primary-foreground md:grid"
      >
        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle */}
      <button
        type="button"
        className="fixed left-6 top-6 z-50 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-[#1a1f2e]/80 text-on-surface backdrop-blur-xl shadow-lg md:hidden"
        onClick={() => setMobileOpen((open) => !open)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/40 backdrop-blur-md md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Aside */}
      <motion.aside
        initial={false}
        animate={{ width: mobileOpen ? 288 : (isCollapsed ? 80 : 288) }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-[#0f172a] transition-all duration-300 md:relative md:translate-x-0',
          !mobileOpen && "-translate-x-full",
          mobileOpen && "translate-x-0 shadow-2xl shadow-black/40",
          !isCollapsed && "shadow-[20px_0_60px_-15px_rgba(0,0,0,0.5)]"
        )}
      >
        {sidebarContent}
      </motion.aside>
    </>
  )
}

