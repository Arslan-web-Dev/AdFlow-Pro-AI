'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react';
import Button from '@/components/ui/button';
import StatusBadge from '@/components/ui/status-badge';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Ad {
  _id: string;
  title: string;
  slug: string;
  description: string;
  status: string;
  category: string;
  city: string;
  price: number;
  currency: string;
  tags: string[];
  media: { url: string; type: string }[];
  views: number;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
}

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/client/ads');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ads');
      }
      
      setAds(data.ads || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) {
      return;
    }

    try {
      const response = await fetch(`/api/client/ads/${adId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ad');
      }

      // Refresh ads list
      fetchAds();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ad.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['user']}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--surface)] rounded w-1/2" />
          <div className="h-64 bg-[var(--surface)] rounded" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout allowedRoles={['user']}>
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={['user']}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">My Ads</h1>
            <p className="text-[var(--text-secondary)] mt-1">Manage your advertisements</p>
          </div>
          <Link href="/dashboard/client/ads/create">
            <Button className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Ad
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search ads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-[var(--text-primary)]"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] text-[var(--text-primary)]"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Ads List */}
        {filteredAds.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--surface)] flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No ads found</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'You haven\'t created any ads yet'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Link href="/dashboard/client/ads/create">
                <Button className="btn-primary">
                  Create Your First Ad
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredAds.map((ad) => (
              <div key={ad._id} className="glass-card p-6 rounded-lg">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Thumbnail */}
                  {ad.media && ad.media.length > 0 && ad.media[0].url && (
                    <div className="lg:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--surface)] relative">
                      <Image
                        src={ad.media[0].url}
                        alt={ad.title}
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] truncate">
                          {ad.title}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                          {ad.category} • {ad.city}
                        </p>
                      </div>
                      <StatusBadge status={ad.status} />
                    </div>

                    <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
                      {ad.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)] mb-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {ad.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-medium text-[var(--primary-color)]">
                          {ad.currency} {ad.price.toLocaleString()}
                        </span>
                      </span>
                      <span>
                        Created: {new Date(ad.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/ads/${ad.slug}`}>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/dashboard/client/ads/create?edit=${ad._id}`}>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </Link>
                      <button
                        onClick={() => handleDelete(ad._id)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
