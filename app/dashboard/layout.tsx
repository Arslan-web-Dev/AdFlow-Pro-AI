import { DashboardLayoutClient } from '@/components/layouts/dashboard-layout-client'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
