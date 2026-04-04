'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClipboardList, CheckCircle2, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const stats = [
  { label: 'Pending Review', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/30' },
  { label: 'Approved Today', value: '34', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  { label: 'Rejected Today', value: '5', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/30' },
  { label: 'Total Reviewed', value: '1,284', icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/30' },
]

const recentActivity = [
  { action: 'Approved', title: 'Luxury Apartment Downtown', time: '2 minutes ago' },
  { action: 'Rejected', title: 'Fake iPhone 15 listing', time: '15 minutes ago' },
  { action: 'Approved', title: 'Toyota Corolla 2022 GLi', time: '1 hour ago' },
  { action: 'Flagged', title: 'Suspicious Job Offer', time: '2 hours ago' },
]

export default function ModeratorPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Moderator Dashboard</h1>
          <p className="text-muted-foreground text-lg">Review and moderate pending ads on the platform.</p>
        </div>
        <Link href="/moderator/queue">
          <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md shadow-indigo-500/20 h-11 px-6">
            Open Review Queue
          </Button>
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.label}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border/60">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Badge className={
                  item.action === 'Approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800 font-bold' :
                  item.action === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800 font-bold' :
                  'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800 font-bold'
                }>
                  {item.action}
                </Badge>
                <span className="font-medium text-foreground/80">{item.title}</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{item.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
