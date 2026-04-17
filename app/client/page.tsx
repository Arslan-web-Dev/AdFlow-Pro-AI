'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AntigravityBackground from '@/components/animations/antigravity-bg';
import BlobCursor from '@/components/animations/blob-cursor';
import Sidebar from '@/components/ui/sidebar';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import FadeOnScroll from '@/components/animations/fade-on-scroll';
import { Plus, Bot, TrendingUp, Clock, CheckCircle, FileText, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface Ad {
  _id: string;
  title: string;
  status: string;
  categoryId: { name: string };
  cityId: { name: string };
  packageId: { name: string };
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  draftAds: number;
  submittedAds: number;
  underReviewAds: number;
  paymentPendingAds: number;
  paymentSubmittedAds: number;
  scheduledAds: number;
  publishedAds: number;
  expiredAds: number;
  rejectedAds: number;
}

export default function ClientDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAds, setRecentAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchDashboardData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/client/dashboard');
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
        setRecentAds(data.recentAds);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsConfig = [
    { label: 'Published', value: stats?.publishedAds || 0, icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-400' },
    { label: 'Pending Review', value: (stats?.underReviewAds || 0) + (stats?.submittedAds || 0), icon: <Clock className="w-5 h-5" />, color: 'text-yellow-400' },
    { label: 'Payment Pending', value: (stats?.paymentPendingAds || 0) + (stats?.paymentSubmittedAds || 0), icon: <DollarSign className="w-5 h-5" />, color: 'text-blue-400' },
    { label: 'Draft', value: stats?.draftAds || 0, icon: <FileText className="w-5 h-5" />, color: 'text-gray-400' },
    { label: 'Scheduled', value: stats?.scheduledAds || 0, icon: <Calendar className="w-5 h-5" />, color: 'text-purple-400' },
    { label: 'Expired', value: stats?.expiredAds || 0, icon: <AlertCircle className="w-5 h-5" />, color: 'text-red-400' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <BlobCursor />
      <AntigravityBackground />
      
      <Sidebar
        role={user?.role || 'client'}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />
      
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          <FadeOnScroll>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
              <p className="text-gray-400">Manage your advertisements</p>
            </div>
          </FadeOnScroll>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {statsConfig.map((stat, index) => (
              <FadeOnScroll key={index} delay={index * 0.1}>
                <GlassCard className="p-6">
                  <div className={`flex items-center gap-3 mb-2 ${stat.color}`}>
                    {stat.icon}
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </GlassCard>
              </FadeOnScroll>
            ))}
          </div>

          {/* Quick Actions */}
          <FadeOnScroll delay={0.4}>
            <div className="flex gap-4 mb-8">
              <Link href="/client/create-ad">
                <Button variant="primary" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create New Ad
                </Button>
              </Link>
              <Link href="/packages">
                <Button variant="secondary" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  View Packages
                </Button>
              </Link>
            </div>
          </FadeOnScroll>

          {/* Recent Ads */}
          <FadeOnScroll delay={0.5}>
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Ads</h2>
              
              {recentAds.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No ads yet</p>
                  <p className="text-sm">Create your first ad to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentAds.map((ad) => (
                    <motion.div
                      key={ad._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{ad.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{ad.categoryId.name}</span>
                          <span>{ad.cityId.name}</span>
                          <span>{ad.packageId.name}</span>
                          <span>Created: {new Date(ad.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <StatusBadge status={ad.status} />
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>
          </FadeOnScroll>
        </div>
      </main>
    </div>
  );
}
