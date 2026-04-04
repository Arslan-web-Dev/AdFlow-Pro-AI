'use client'

import { AccentThemeButtons } from '@/components/theme/accent-theme-buttons'
import { Palette } from 'lucide-react'

export function LandingAccentBar() {
  return (
    <div className="border-b border-border/40 bg-surface-container-low/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <Palette className="h-4 w-4 text-primary" aria-hidden />
          <span>Theme</span>
          <span className="hidden text-[10px] font-semibold normal-case tracking-normal text-on-surface-variant sm:inline">
            — applies across the whole app
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <AccentThemeButtons />
        </div>
      </div>
    </div>
  )
}
