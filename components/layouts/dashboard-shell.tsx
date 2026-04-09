'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DashboardTopBar } from './dashboard-top-bar'
import { ThemeBar } from './site-header'
import { AIAssistant, AIToggle } from '@/components/ai/ai-assistant'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Home, 
  LayoutDashboard, 
  Package, 
  CreditCard, 
  Users, 
  Settings, 
  Shield,
  BarChart3,
  FileText,
  LogOut,
  LucideIcon
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const sidebarNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'My Ads', href: '/dashboard/ads', icon: LayoutDashboard },
  { label: 'Create Ad', href: '/dashboard/create', icon: Package },
  { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Profile', href: '/dashboard/profile', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

const adminNavItems: NavItem[] = [
  { label: 'Admin Dashboard', href: '/admin', icon: BarChart3 },
  { label: 'User Management', href: '/admin/users', icon: Users },
  { label: 'Payment Verification', href: '/admin/payments', icon: CreditCard },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
]

const moderatorNavItems: NavItem[] = [
  { label: 'Moderator Dashboard', href: '/moderator', icon: Shield },
  { label: 'Review Queue', href: '/moderator/queue', icon: FileText },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isAIActive, setIsAIActive] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isAdminRoute = pathname.startsWith('/admin')
  const isModeratorRoute = pathname.startsWith('/moderator')

  let navItems: NavItem[] = []
  if (isDashboardRoute) navItems = sidebarNavItems
  else if (isAdminRoute) navItems = adminNavItems
  else if (isModeratorRoute) navItems = moderatorNavItems

  return (
    <div className="af-shell relative flex min-h-screen overflow-hidden bg-background text-on-surface transition-colors duration-500">
      {/* Animated Background Glows */}
      <div className="af-bg-glow -left-[10%] -top-[10%] h-[500px] w-[500px]" />
      <div className="af-bg-glow -right-[5%] top-[20%] h-[400px] w-[400px] [animation-delay:-5s] opacity-20" />
      <div className="af-bg-glow bottom-[10%] left-[20%] h-[600px] w-[600px] [animation-delay:-10s] opacity-15" />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border/10 bg-surface-container transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center border-b border-border/10 px-6">
            <span className="text-lg font-bold tracking-tight">AdFlow Pro</span>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-border/10 p-4">
            <Button variant="outline" className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:ml-0">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden flex items-center border-b border-border/10 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>

        <DashboardTopBar isAIActive={isAIActive} onAIToggle={() => setIsAIActive(!isAIActive)} />
        <ThemeBar />

        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 custom-scrollbar">
          <div className="mx-auto max-w-7xl animate-fade-in">{children}</div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* AI Mode Components */}
      <AIAssistant isOpen={isAIActive} onClose={() => setIsAIActive(false)} />
      <AIToggle isOpen={isAIActive} onClick={() => setIsAIActive(!isAIActive)} />
    </div>
  )
}
