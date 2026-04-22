'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Eye,
  MousePointer,
  TrendingUp,
  Plus,
  ArrowRight,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Stats {
  totalAds: number;
  activeAds: number;
  pendingAds: number;
  totalViews: number;
  totalClicks: number;
  ctr: number;
}

interface RecentAd {
  _id: string;
  title: string;
  status: string;
  views: number;
  clicks: number;
  createdAt: string;
}

export default function ClientDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalAds: 0,
    activeAds: 0,
    pendingAds: 0,
    totalViews: 0,
    totalClicks: 0,
    ctr: 0,
  });
  const [recentAds, setRecentAds] = useState<RecentAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/client/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentAds(data.recentAds || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Ads', value: stats.totalAds, icon: Megaphone, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { label: 'Active Ads', value: stats.activeAds, icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { label: 'Pending', value: stats.pendingAds, icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    { label: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      published: 'badge-success',
      pending: 'badge-warning',
      draft: 'badge-info',
      rejected: 'badge-error',
    };
    return styles[status] || 'badge-info';
  };

  return (
    <DashboardLayout allowedRoles={['client']}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard</h1>
            <p className="text-[var(--text-secondary)] mt-1">Welcome back! Here&apos;s your overview.</p>
          </div>
          <Link
            href="/dashboard/client/ads/create"
            className="btn-primary inline-flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            Create New Ad
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label}>
              <div className="glass-card p-6 h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                      {isLoading ? <span className="skeleton w-16 h-8 inline-block" /> : stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Chart Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Performance Overview</h2>
                <select className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)]">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              
              {/* Simple bar chart visualization */}
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
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="glass-card p-6 h-full">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/dashboard/client/ads/create"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-[var(--primary-color)]/10 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                    <Plus className="w-4 h-4 text-[var(--primary-color)]" />
                  </div>
                  <span className="font-medium text-[var(--text-primary)]">Create New Ad</span>
                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)] ml-auto" />
                </Link>
                
                <Link
                  href="/dashboard/client/packages"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <DollarSign className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="font-medium text-[var(--text-primary)]">Upgrade Package</span>
                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)] ml-auto" />
                </Link>

                <Link
                  href="/dashboard/client/analytics"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="font-medium text-[var(--text-primary)]">View Analytics</span>
                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)] ml-auto" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Ads */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Ads</h2>
            <Link
              href="/dashboard/client/ads"
              className="text-sm text-[var(--primary-color)] hover:text-[var(--primary-light)] flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass-card overflow-hidden">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="skeleton w-16 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton w-1/3 h-4" />
                      <div className="skeleton w-1/4 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentAds.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {recentAds.map((ad) => (
                  <Link
                    key={ad._id}
                    href={`/dashboard/client/ads/${ad._id}`}
                    className="flex items-center gap-4 p-4 hover:bg-[var(--surface)]/50 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
                      <Megaphone className="w-6 h-6 text-[var(--text-muted)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[var(--text-primary)] truncate">{ad.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`badge ${getStatusBadge(ad.status)}`}>
                          {ad.status}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {new Date(ad.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {ad.views}
                      </div>
                      <div className="flex items-center gap-1">
                        <MousePointer className="w-4 h-4" />
                        {ad.clicks}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Megaphone className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-[var(--text-secondary)]">No ads yet</p>
                <Link
                  href="/dashboard/client/ads/create"
                  className="btn-primary inline-flex items-center gap-2 mt-4"
                >
                  <Plus className="w-4 h-4" />
                  Create your first ad
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
