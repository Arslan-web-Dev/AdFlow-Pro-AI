'use client'

import { usePathname } from 'next/navigation'
import { DashboardShell } from '@/components/layouts/dashboard-shell'
import { MeetTheCreator } from '@/components/dashboard/meet-the-creator'

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboardHome = pathname === '/dashboard'

  return (
    <DashboardShell topContent={isDashboardHome ? <MeetTheCreator /> : null}>
      {children}
    </DashboardShell>
  )
}
