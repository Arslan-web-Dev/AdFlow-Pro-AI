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
import { CheckCircle, XCircle, Clock, Eye, AlertTriangle } from 'lucide-react';

interface Ad {
  _id: string;
  title: string;
  description: string;
  status: string;
  categoryId: { name: string };
  cityId: { name: string };
  packageId: { name: string; durationDays: number };
  userId: string;
  user?: { name: string; email: string };
  createdAt: string;
  moderationNote?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ModeratorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchModerationQueue();
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

  const fetchModerationQueue = async () => {
    try {
      const response = await fetch('/api/moderator/review-queue?status=under_review');
      const data = await response.json();
      if (response.ok) {
        setAds(data.ads);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (adId: string) => {
    try {
      const response = await fetch(`/api/moderator/review-queue/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      });
      if (response.ok) {
        setAds(ads.filter(ad => ad._id !== adId));
      }
    } catch (error) {
      console.error('Error approving ad:', error);
    }
  };

  const handleReject = async (adId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const response = await fetch(`/api/moderator/review-queue/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', rejectionReason: reason }),
      });
      if (response.ok) {
        setAds(ads.filter(ad => ad._id !== adId));
      }
    } catch (error) {
      console.error('Error rejecting ad:', error);
    }
  };

  const handleFlag = async (adId: string) => {
    const note = prompt('Add moderation note:');
    if (!note) return;

    try {
      const response = await fetch(`/api/moderator/review-queue/${adId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', moderationNote: note }),
      });
      if (response.ok) {
        alert('Moderation note added');
      }
    } catch (error) {
      console.error('Error flagging ad:', error);
    }
  };

  const stats = [
    { label: 'Pending Review', value: ads.length, icon: <Clock className="w-5 h-5" />, color: 'text-yellow-400' },
    { label: 'Approved Today', value: 0, icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-400' },
    { label: 'Rejected Today', value: 0, icon: <XCircle className="w-5 h-5" />, color: 'text-red-400' },
    { label: 'Flagged', value: 0, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-orange-400' },
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
        role={user?.role || 'moderator'}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <FadeOnScroll>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Moderation Dashboard</h1>
              <p className="text-gray-400">Review and approve submitted ads</p>
            </div>
          </FadeOnScroll>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
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

          {/* Moderation Queue */}
          <FadeOnScroll delay={0.3}>
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Moderation Queue</h2>
              
              {ads.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">All caught up!</p>
                  <p className="text-sm">No ads pending review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ads.map((ad) => (
                    <motion.div
                      key={ad._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{ad.title}</h3>
                          <p className="text-gray-400 text-sm mb-3">{ad.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            <span>Category: {ad.categoryId.name}</span>
                            <span>City: {ad.cityId.name}</span>
                            <span>Package: {ad.packageId.name} ({ad.packageId.durationDays} days)</span>
                            <span>Submitted: {new Date(ad.createdAt).toLocaleDateString()}</span>
                            <span>By: {ad.user?.name || ad.user?.email || 'Unknown'}</span>
                          </div>
                          {ad.moderationNote && (
                            <div className="mt-2 p-2 bg-orange-500/20 border border-orange-500/30 rounded text-xs text-orange-300">
                              Note: {ad.moderationNote}
                            </div>
                          )}
                        </div>
                        <StatusBadge status={ad.status} />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleApprove(ad._id)}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleReject(ad._id)}
                          className="flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleFlag(ad._id)}
                          className="flex items-center gap-2"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Flag/Note
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                      </div>
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
