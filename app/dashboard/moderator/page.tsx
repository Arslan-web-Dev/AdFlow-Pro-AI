'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Megaphone,
  ArrowRight,
  Eye,
  Search,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface PendingAd {
  _id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

interface Stats {
  pendingCount: number;
  approvedToday: number;
  rejectedToday: number;
  totalReviewed: number;
}

export default function ModeratorDashboard() {
  const [pendingAds, setPendingAds] = useState<PendingAd[]>([]);
  const [stats, setStats] = useState<Stats>({
    pendingCount: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalReviewed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [pendingRes, statsRes] = await Promise.all([
        fetch('/api/moderator/pending'),
        fetch('/api/moderator/stats'),
      ]);

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingAds(pendingData.ads || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (adId: string) => {
    setProcessingId(adId);
    try {
      const response = await fetch(`/api/moderator/ads/${adId}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        setPendingAds(prev => prev.filter(ad => ad._id !== adId));
        setStats(prev => ({
          ...prev,
          pendingCount: prev.pendingCount - 1,
          approvedToday: prev.approvedToday + 1,
        }));
      }
    } catch (error) {
      console.error('Failed to approve ad:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (adId: string) => {
    setProcessingId(adId);
    try {
      const response = await fetch(`/api/moderator/ads/${adId}/reject`, {
        method: 'POST',
      });

      if (response.ok) {
        setPendingAds(prev => prev.filter(ad => ad._id !== adId));
        setStats(prev => ({
          ...prev,
          pendingCount: prev.pendingCount - 1,
          rejectedToday: prev.rejectedToday + 1,
        }));
      }
    } catch (error) {
      console.error('Failed to reject ad:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const statCards = [
    { label: 'Pending Review', value: stats.pendingCount, icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    { label: 'Approved Today', value: stats.approvedToday, icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/10' },
    { label: 'Rejected Today', value: stats.rejectedToday, icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-500/10' },
    { label: 'Total Reviewed', value: stats.totalReviewed, icon: CheckSquare, color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  ];

  return (
    <DashboardLayout allowedRoles={['moderator', 'admin']}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Moderation Dashboard</h1>
          <p className="text-[var(--text-secondary)] mt-1">Review and manage pending advertisements</p>
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
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Ads */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Pending Ads ({pendingAds.length})
            </h2>
            <Link
              href="/dashboard/moderator/pending"
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
                  <div key={i} className="skeleton w-full h-20 rounded-lg" />
                ))}
              </div>
            ) : pendingAds.length > 0 ? (
              <div className="divide-y divide-[var(--border)]">
                {pendingAds.map((ad) => (
                  <div
                    key={ad._id}
                    className="p-4 hover:bg-[var(--surface)]/50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-[var(--text-primary)]">{ad.title}</h3>
                          <span className="badge badge-warning">Pending</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-2">
                          {ad.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
                          <span>{ad.category}</span>
                          <span>•</span>
                          <span>{ad.city}</span>
                          <span>•</span>
                          <span>By {ad.userName}</span>
                          <span>•</span>
                          <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/ads/${ad._id}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleReject(ad._id)}
                          disabled={processingId === ad._id}
                          className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors font-medium text-sm disabled:opacity-50"
                        >
                          {processingId === ad._id ? 'Processing...' : 'Reject'}
                        </button>
                        <button
                          onClick={() => handleApprove(ad._id)}
                          disabled={processingId === ad._id}
                          className="px-4 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors font-medium text-sm disabled:opacity-50"
                        >
                          {processingId === ad._id ? 'Processing...' : 'Approve'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-[var(--accent-success)] mx-auto mb-4" />
                <p className="text-[var(--text-primary)] font-medium">All caught up!</p>
                <p className="text-[var(--text-secondary)] text-sm mt-1">
                  No pending ads require moderation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/moderator/ads"
            className="glass-card p-6 hover:bg-[var(--surface)]/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-[var(--primary-color)]/10 group-hover:bg-[var(--primary-color)]/20 transition-colors">
                  <Megaphone className="w-5 h-5 text-[var(--primary-color)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">All Ads</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Browse and search all advertisements</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary-color)] transition-colors" />
            </div>
          </Link>

          <Link
            href="/dashboard/moderator/activity"
            className="glass-card p-6 hover:bg-[var(--surface)]/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                  <Search className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Activity Log</h3>
                  <p className="text-sm text-[var(--text-secondary)]">View moderation history</p>
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
