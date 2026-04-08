'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, Sparkles } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { AccentThemeButtons } from '@/components/theme/accent-theme-buttons'
import { ThemeBar } from '@/components/theme/theme-bar'
import { motion } from 'framer-motion'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Marketplace', href: '/explore' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Creator', href: '#creator' },
]

export { ThemeBar }

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled 
          ? "af-glass-header border-b border-white/5 py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-8">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const active = item.href.startsWith('#') 
                ? false // Handle anchor links
                : pathname === item.href
              
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-semibold transition-all hover:text-primary",
                    active ? "text-primary" : "text-on-surface-variant"
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span 
                      layoutId="nav-underline"
                      className="absolute bottom-[-22px] left-0 right-0 h-1 rounded-t-full bg-primary shadow-[0_-2px_10px_rgba(var(--primary),0.5)]" 
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop Controls */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Link href="/dashboard">
              <Button variant="ghost" className="text-sm font-bold gap-2 hover:bg-white/5">
                Login
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="af-gradient rounded-xl px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger 
                render={
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-on-surface" />
                }
              >
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] border-l-white/5 bg-[#0f172a] p-0 shadow-2xl">
                <SheetHeader className="p-6 text-left border-b border-white/5">
                  <SheetTitle>
                    <Logo />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 p-4">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href} 
                      href={item.href} 
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between rounded-xl px-4 py-4 text-base font-bold text-on-surface transition-all hover:bg-white/5"
                    >
                      {item.label}
                      <Sparkles className="h-4 w-4 opacity-20" />
                    </Link>
                  ))}
                  
                  <div className="mt-4 space-y-4 border-t border-white/5 pt-6 px-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Theme & Accents</p>
                    <div className="flex flex-wrap gap-2">
                      <AccentThemeButtons />
                    </div>
                    
                    <div className="flex flex-col gap-3 pt-4">
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 font-bold">
                          Dashboard Access
                        </Button>
                      </Link>
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                        <Button className="af-gradient w-full h-12 rounded-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                          Create Free Account
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
