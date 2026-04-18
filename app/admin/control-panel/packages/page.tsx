'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search, Edit, Trash2, ArrowLeft, Star } from 'lucide-react';
import Sidebar from '@/components/ui/sidebar';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import Link from 'next/link';
import StatusBadge from '@/components/ui/status-badge';

interface PackageItem {
  _id: string;
  name: string;
  durationDays: number;
  price: number;
  weight: number;
  isFeatured: boolean;
  homepageVisibility: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function PackagesManagement() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/packages');
      const data = await response.json();
      if (response.ok) {
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (packageId: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      const response = await fetch(`/api/packages/${packageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPackages(packages.filter(pkg => pkg._id !== packageId));
      } else {
        alert('Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Error deleting package');
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Package className="w-8 h-8 text-purple-400" />
                <div>
                  <h1 className="text-3xl font-bold">Packages Management</h1>
                  <p className="text-gray-400">Manage subscription packages</p>
                </div>
              </div>
              <Link href="/admin/control-panel/packages/new">
                <Button variant="primary" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Package
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <GlassCard className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
            </GlassCard>
          </motion.div>

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
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Name</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Duration</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Price</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Weight</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Features</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredPackages.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-gray-400">
                          No packages found
                        </td>
                      </tr>
                    ) : (
                      filteredPackages.map((pkg) => (
                        <tr key={pkg._id} className="hover:bg-white/5">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{pkg.name}</span>
                              {pkg.isFeatured && (
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{pkg.durationDays} days</td>
                          <td className="p-4 text-gray-300">${pkg.price}</td>
                          <td className="p-4 text-gray-300">{pkg.weight}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {pkg.isFeatured && (
                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                                  Featured
                                </span>
                              )}
                              {pkg.homepageVisibility && (
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                                  Homepage
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <StatusBadge status={pkg.isActive ? 'active' : 'inactive'} />
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Link href={`/admin/control-panel/packages/${pkg._id}/edit`}>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-1 text-red-400 hover:text-red-300"
                                onClick={() => handleDelete(pkg._id)}
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
              Showing {filteredPackages.length} of {packages.length} packages
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
