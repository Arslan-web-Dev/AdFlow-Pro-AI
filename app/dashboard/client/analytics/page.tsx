'use client';

import React from 'react';
import { TrendingUp, Eye, MousePointer, BarChart3 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AnalyticsPage() {
  const stats = [
    { label: 'Total Views', value: '1,245', change: '+12.5%', icon: Eye },
    { label: 'Total Clicks', value: '89', change: '-5.2%', icon: MousePointer },
    { label: 'CTR', value: '7.15%', change: '+2.1%', icon: BarChart3 },
    { label: 'Active Ads', value: '5', change: '0%', icon: TrendingUp },
  ];

  return (
    <DashboardLayout allowedRoles={['client']}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Analytics</h1>
          <p className="text-[var(--text-secondary)] mt-1">Track your ad performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{stat.value}</p>
                  <p className="text-xs text-[var(--accent-success)] mt-1">{stat.change}</p>
                </div>
                <div className="p-3 rounded-lg bg-[var(--primary-color)]/10">
                  <stat.icon className="w-5 h-5 text-[var(--primary-color)]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Performance Chart</h2>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[40, 65, 45, 80, 55, 70, 60].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-[var(--primary-gradient)] rounded-t-lg opacity-60 hover:opacity-100 transition-opacity"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-[var(--text-muted)]">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
