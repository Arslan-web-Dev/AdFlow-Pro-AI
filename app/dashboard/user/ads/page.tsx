'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Eye, Search, Filter, X } from 'lucide-react';
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
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    city: '',
    status: '',
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/user/ads');
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
      const response = await fetch(`/api/user/ads/${adId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ad');
      }

      // Refresh ads list
      fetchAds();
      alert('Ad deleted successfully');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleView = (ad: Ad) => {
    setSelectedAd(ad);
    setViewModalOpen(true);
  };

  const handleUpdate = (ad: Ad) => {
    setSelectedAd(ad);
    setUpdateFormData({
      title: ad.title,
      description: ad.description,
      price: ad.price,
      category: ad.category,
      city: ad.city,
      status: ad.status,
    });
    setUpdateModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAd) return;

    try {
      const response = await fetch(`/api/user/ads/${selectedAd._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateFormData),
      });

      if (!response.ok) {
        throw new Error('Failed to update ad');
      }

      setUpdateModalOpen(false);
      fetchAds();
      alert('Ad updated successfully');
    } catch (error) {
      alert('Failed to update ad');
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
              <Link href="/dashboard/user/ads/create">
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
                      <button
                        onClick={() => handleView(ad)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleUpdate(ad)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Update
                      </button>
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

        {/* View Modal */}
        {viewModalOpen && selectedAd && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--surface)] rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Ad Details</h2>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="p-1 hover:bg-[var(--border)] rounded transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-[var(--text-muted)]">Title</label>
                  <p className="text-[var(--text-primary)] font-medium">{selectedAd.title}</p>
                </div>
                <div>
                  <label className="text-sm text-[var(--text-muted)]">Description</label>
                  <p className="text-[var(--text-primary)]">{selectedAd.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[var(--text-muted)]">Category</label>
                    <p className="text-[var(--text-primary)]">{selectedAd.category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-muted)]">City</label>
                    <p className="text-[var(--text-primary)]">{selectedAd.city}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-muted)]">Price</label>
                    <p className="text-[var(--text-primary)]">{selectedAd.currency} {selectedAd.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-muted)]">Status</label>
                    <p className="text-[var(--text-primary)]">{selectedAd.status}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[var(--text-muted)]">Views</label>
                    <p className="text-[var(--text-primary)]">{selectedAd.views}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-muted)]">Clicks</label>
                    <p className="text-[var(--text-primary)]">{selectedAd.clicks}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[var(--text-muted)]">Created At</label>
                  <p className="text-[var(--text-primary)]">{new Date(selectedAd.createdAt).toLocaleDateString()}</p>
                </div>
                {selectedAd.tags && selectedAd.tags.length > 0 && (
                  <div>
                    <label className="text-sm text-[var(--text-muted)]">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedAd.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-[var(--border)] rounded text-sm text-[var(--text-primary)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Update Modal */}
        {updateModalOpen && selectedAd && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--surface)] rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Update Ad</h2>
                <button
                  onClick={() => setUpdateModalOpen(false)}
                  className="p-1 hover:bg-[var(--border)] rounded transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-[var(--text-muted)] block mb-1">Title</label>
                  <input
                    type="text"
                    value={updateFormData.title}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text-primary)]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-[var(--text-muted)] block mb-1">Description</label>
                  <textarea
                    value={updateFormData.description}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text-primary)]"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[var(--text-muted)] block mb-1">Price</label>
                    <input
                      type="number"
                      value={updateFormData.price}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text-primary)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-muted)] block mb-1">Category</label>
                    <input
                      type="text"
                      value={updateFormData.category}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text-primary)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-muted)] block mb-1">City</label>
                    <input
                      type="text"
                      value={updateFormData.city}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text-primary)]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[var(--text-muted)] block mb-1">Status</label>
                    <select
                      value={updateFormData.status}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--text-primary)]"
                      required
                    >
                      <option value="published">Published</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    Update Ad
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpdateModalOpen(false)}
                    className="px-4 py-2 bg-[var(--border)] hover:bg-[var(--surface)] text-[var(--text-primary)] rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
