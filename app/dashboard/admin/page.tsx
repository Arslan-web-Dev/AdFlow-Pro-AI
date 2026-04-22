'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Megaphone,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Activity,
  UserPlus,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Stats {
  totalUsers: number;
  newUsersToday: number;
  totalAds: number;
  pendingAds: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  userName: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    newUsersToday: 0,
    totalAds: 0,
    pendingAds: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentActivity(data.recentActivity || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, change: `+${stats.newUsersToday} today`, icon: Users, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { label: 'Total Ads', value: stats.totalAds, change: `${stats.pendingAds} pending`, icon: Megaphone, color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, change: `+${stats.monthlyGrowth}% this month`, icon: DollarSign, color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { label: 'Growth', value: `+${stats.monthlyGrowth}%`, change: 'vs last month', icon: TrendingUp, color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registered':
        return <UserPlus className="w-4 h-4" />;
      case 'ad_created':
        return <Megaphone className="w-4 h-4" />;
      case 'ad_approved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Admin Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">System overview and management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label}>
              <div className="glass-card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                    <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                      {isLoading ? '-' : stat.value}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Revenue Overview</h2>
                <select className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)]">
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This year</option>
                </select>
              </div>
              
              <div className="h-64 flex items-end justify-between gap-2 px-4">
                {[30, 45, 35, 60, 50, 70, 65, 80, 75, 90, 85, 100].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[var(--primary-gradient)] rounded-t-lg opacity-60 hover:opacity-100 transition-opacity"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-[var(--text-muted)]">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="glass-card p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Activity</h2>
                <Link
                  href="/dashboard/admin/activity"
                  className="text-sm text-[var(--primary-color)] hover:text-[var(--primary-light)]"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="skeleton w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton w-3/4 h-4" />
                        <div className="skeleton w-1/2 h-3" />
                      </div>
                    </div>
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-[var(--surface)] text-[var(--primary-color)]">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--text-primary)]">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)]">
                          <span>by {activity.userName}</span>
                          <span>•</span>
                          <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)] text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/admin/users"
            className="glass-card p-6 hover:bg-[var(--surface)]/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Manage Users</h3>
                  <p className="text-sm text-[var(--text-secondary)]">View and edit user accounts</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary-color)] transition-colors" />
            </div>
          </Link>

          <Link
            href="/dashboard/admin/ads"
            className="glass-card p-6 hover:bg-[var(--surface)]/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                  <Megaphone className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Manage Ads</h3>
                  <p className="text-sm text-[var(--text-secondary)]">View and manage all ads</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary-color)] transition-colors" />
            </div>
          </Link>

          <Link
            href="/dashboard/admin/payments"
            className="glass-card p-6 hover:bg-[var(--surface)]/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Payments</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Verify payment proofs</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary-color)] transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
