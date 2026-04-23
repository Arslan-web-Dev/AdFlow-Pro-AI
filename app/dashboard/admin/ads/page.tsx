'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';

interface Ad {
  id: string;
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  city: string;
  status: 'active' | 'pending' | 'rejected' | 'draft' | 'published';
  price: number;
  currency: string;
  views: number;
  clicks: number;
  createdAt: string;
  createdBy: string;
  userId: string;
  media: string[];
  tags: string[];
}

export default function AllAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
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
      const response = await fetch('/api/admin/ads');
      if (response.ok) {
        const result = await response.json();
        setAds(result.ads || []);
      }
    } catch (error) {
      console.error('Failed to fetch ads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'published':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleDelete = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/ads/${adId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete ad');
      }

      // Refresh ads list
      fetchAds();
      alert('Ad deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete ad');
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
      const response = await fetch(`/api/admin/ads/${selectedAd.id}`, {
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
      console.error('Update error:', error);
      alert('Failed to update ad');
    }
  };

  const handleApprove = async (adId: string) => {
    try {
      const response = await fetch(`/api/admin/ads/${adId}/approve`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to approve ad');
      }

      fetchAds();
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to approve ad');
    }
  };

  const handleReject = async (adId: string) => {
    try {
      const response = await fetch(`/api/admin/ads/${adId}/reject`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to reject ad');
      }

      fetchAds();
    } catch (error) {
      console.error('Reject error:', error);
      alert('Failed to reject ad');
    }
  };

  const filteredAds = ads.filter((ad) => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || ad.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">All Ads</h1>

        {/* Status Tabs */}
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-[var(--primary-color)] text-white'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-[var(--surface)] rounded-full">
                  {ads.filter(ad => ad.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Ads Table */}
        <div className="rounded-lg bg-slate-800/50 border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Views</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Clicks</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Posted By</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredAds.map((ad) => (
                  <tr
                    key={ad.id}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-white">{ad.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{ad.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(ad.status)}`}>
                        {getStatusIcon(ad.status)}
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{ad.views}</td>
                    <td className="px-6 py-4 text-sm text-white">{ad.clicks}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{ad.createdBy}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(ad)}
                          className="p-1 hover:bg-blue-500/20 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleUpdate(ad)}
                          className="p-1 hover:bg-yellow-500/20 rounded transition-colors"
                          title="Update"
                        >
                          <Edit className="w-4 h-4 text-yellow-400" />
                        </button>
                        {ad.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(ad.id)}
                              className="p-1 hover:bg-green-500/20 rounded transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </button>
                            <button
                              onClick={() => handleReject(ad.id)}
                              className="p-1 hover:bg-red-500/20 rounded transition-colors"
                              title="Reject"
                            >
                              <AlertCircle className="w-4 h-4 text-red-400" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAds.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-slate-400">No ads found</p>
          </div>
        )}

        {/* View Modal */}
        {viewModalOpen && selectedAd && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Ad Details</h2>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400">Title</label>
                  <p className="text-white font-medium">{selectedAd.title}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Description</label>
                  <p className="text-white">{selectedAd.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Category</label>
                    <p className="text-white">{selectedAd.category}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">City</label>
                    <p className="text-white">{selectedAd.city}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Price</label>
                    <p className="text-white">${selectedAd.price} {selectedAd.currency}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Status</label>
                    <p className="text-white">{selectedAd.status}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400">Views</label>
                    <p className="text-white">{selectedAd.views}</p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400">Clicks</label>
                    <p className="text-white">{selectedAd.clicks}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Created At</label>
                  <p className="text-white">{new Date(selectedAd.createdAt).toLocaleDateString()}</p>
                </div>
                {selectedAd.tags && selectedAd.tags.length > 0 && (
                  <div>
                    <label className="text-sm text-slate-400">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedAd.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-700 rounded text-sm text-white">
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
            <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Update Ad</h2>
                <button
                  onClick={() => setUpdateModalOpen(false)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Title</label>
                  <input
                    type="text"
                    value={updateFormData.title}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Description</label>
                  <textarea
                    value={updateFormData.description}
                    onChange={(e) => setUpdateFormData({ ...updateFormData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Price</label>
                    <input
                      type="number"
                      value={updateFormData.price}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Category</label>
                    <input
                      type="text"
                      value={updateFormData.category}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">City</label>
                    <input
                      type="text"
                      value={updateFormData.city}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, city: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Status</label>
                    <select
                      value={updateFormData.status}
                      onChange={(e) => setUpdateFormData({ ...updateFormData, status: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
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
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
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
