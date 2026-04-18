'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, 
  FolderOpen, 
  MapPin, 
  Package, 
  CreditCard, 
  FileText,
  Settings,
  BarChart3,
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import Sidebar from '@/components/ui/sidebar';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Stats {
  totalUsers: number;
  totalCategories: number;
  totalCities: number;
  totalPackages: number;
  totalPayments: number;
  totalAds: number;
}

const managementCards = [
  { 
    title: 'Users', 
    icon: Users, 
    href: '/admin/control-panel/users',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    description: 'Manage user accounts and roles'
  },
  { 
    title: 'Categories', 
    icon: FolderOpen, 
    href: '/admin/control-panel/categories',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    description: 'Manage ad categories'
  },
  { 
    title: 'Cities', 
    icon: MapPin, 
    href: '/admin/control-panel/cities',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    description: 'Manage cities and locations'
  },
  { 
    title: 'Packages', 
    icon: Package, 
    href: '/admin/control-panel/packages',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    description: 'Manage subscription packages'
  },
  { 
    title: 'Payments', 
    icon: CreditCard, 
    href: '/admin/control-panel/payments',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
    description: 'View payment history'
  },
  { 
    title: 'Ads Management', 
    icon: FileText, 
    href: '/admin/control-panel/ads',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    description: 'Manage all advertisements'
  },
  { 
    title: 'Analytics', 
    icon: BarChart3, 
    href: '/admin/analytics',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    description: 'View platform analytics'
  },
  { 
    title: 'Settings', 
    icon: Settings, 
    href: '/admin/settings',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10',
    description: 'System settings'
  },
];

export default function ControlPanel() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        if (data.user.role !== 'admin' && data.user.role !== 'super_admin') {
          router.push('/client');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      if (response.ok) {
        setStats({
          totalUsers: data.totalUsers || 0,
          totalCategories: data.totalCategories || 0,
          totalCities: data.totalCities || 0,
          totalPackages: data.totalPackages || 0,
          totalPayments: data.totalPayments || 0,
          totalAds: data.totalAds || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <Sidebar role={user?.role || 'admin'} />
      
      <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-purple-400" />
              <h1 className="text-3xl font-bold">Control Panel</h1>
            </div>
            <p className="text-gray-400">Manage your platform data and settings</p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
          >
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{stats?.totalUsers || 0}</div>
              <div className="text-sm text-gray-400">Users</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats?.totalCategories || 0}</div>
              <div className="text-sm text-gray-400">Categories</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{stats?.totalCities || 0}</div>
              <div className="text-sm text-gray-400">Cities</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{stats?.totalPackages || 0}</div>
              <div className="text-sm text-gray-400">Packages</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-400">{stats?.totalPayments || 0}</div>
              <div className="text-sm text-gray-400">Payments</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{stats?.totalAds || 0}</div>
              <div className="text-sm text-gray-400">Ads</div>
            </GlassCard>
          </motion.div>

          {/* Management Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {managementCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={card.href}>
                  <GlassCard className="p-6 hover:bg-white/10 transition-colors cursor-pointer h-full">
                    <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center mb-4`}>
                      <card.icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-400">{card.description}</p>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <Link href="/admin/control-panel/users/new">
                  <Button variant="primary" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add User
                  </Button>
                </Link>
                <Link href="/admin/control-panel/categories/new">
                  <Button variant="primary" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Category
                  </Button>
                </Link>
                <Link href="/admin/control-panel/cities/new">
                  <Button variant="primary" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add City
                  </Button>
                </Link>
                <Link href="/admin/control-panel/packages/new">
                  <Button variant="primary" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Package
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
