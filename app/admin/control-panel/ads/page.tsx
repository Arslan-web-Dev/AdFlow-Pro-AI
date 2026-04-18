'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Edit, Trash2, ArrowLeft, Eye, Filter } from 'lucide-react';
import Sidebar from '@/components/ui/sidebar';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import Link from 'next/link';
import StatusBadge from '@/components/ui/status-badge';

interface Ad {
  _id: string;
  title: string;
  slug: string;
  status: string;
  userId: { name: string; email: string } | string;
  categoryId: { name: string } | string;
  cityId: { name: string } | string;
  createdAt: string;
  isFeatured: boolean;
}

export default function AdsManagement() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads');
      const data = await response.json();
      if (response.ok) {
        setAds(data.ads || []);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      const response = await fetch(`/api/ads/${adId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAds(ads.filter(ad => ad._id !== adId));
      } else {
        alert('Failed to delete ad');
      }
    } catch (error) {
      console.error('Error deleting ad:', error);
      alert('Error deleting ad');
    }
  };

  const getUserName = (user: any) => {
    if (typeof user === 'string') return user;
    return user?.name || 'Unknown';
  };

  const getCategoryName = (category: any) => {
    if (typeof category === 'string') return category;
    return category?.name || 'Unknown';
  };

  const getCityName = (city: any) => {
    if (typeof city === 'string') return city;
    return city?.name || 'Unknown';
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getUserName(ad.userId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || ad.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      <Sidebar role="admin" />
      
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Link href="/admin/control-panel">
                <Button variant="ghost" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Control Panel
                </Button>
              </Link>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-cyan-400" />
                <div>
                  <h1 className="text-3xl font-bold">Ads Management</h1>
                  <p className="text-gray-400">Manage all advertisements</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <GlassCard className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search ads by title or user..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="published">Published</option>
                    <option value="expired">Expired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Ads Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Title</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Category</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">City</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Created</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredAds.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-400">
                          No ads found
                        </td>
                      </tr>
                    ) : (
                      filteredAds.map((ad) => (
                        <tr key={ad._id} className="hover:bg-white/5">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{ad.title}</span>
                              {ad.isFeatured && (
                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                                  Featured
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{getUserName(ad.userId)}</td>
                          <td className="p-4 text-gray-300">{getCategoryName(ad.categoryId)}</td>
                          <td className="p-4 text-gray-300">{getCityName(ad.cityId)}</td>
                          <td className="p-4">
                            <StatusBadge status={ad.status} />
                          </td>
                          <td className="p-4 text-gray-400">
                            {new Date(ad.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Link href={`/ads/${ad.slug}`} target="_blank">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Link href={`/admin/ads/${ad._id}/edit`}>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 text-red-400 hover:text-red-300"
                                onClick={() => handleDelete(ad._id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <p className="text-gray-400 text-sm">
              Showing {filteredAds.length} of {ads.length} ads
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
