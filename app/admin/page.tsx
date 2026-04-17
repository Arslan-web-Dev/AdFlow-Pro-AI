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
import { Users, Shield, TrendingUp, Activity, DollarSign, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

interface Payment {
  _id: string;
  amount: number;
  method: string;
  transactionRef: string;
  senderName: string;
  status: string;
  adId: { title: string };
  createdAt: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchUsers();
    fetchPayments();
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

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payment-queue');
      const data = await response.json();
      if (response.ok) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' }),
      });
      if (response.ok) {
        setPayments(payments.filter(p => p._id !== paymentId));
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', rejectionReason: reason }),
      });
      if (response.ok) {
        setPayments(payments.filter(p => p._id !== paymentId));
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
    }
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: <Users className="w-5 h-5" />, color: 'text-purple-400' },
    { label: 'Active Users', value: users.filter(u => u.isActive).length, icon: <Activity className="w-5 h-5" />, color: 'text-green-400' },
    { label: 'Pending Payments', value: payments.filter(p => p.status === 'pending').length, icon: <DollarSign className="w-5 h-5" />, color: 'text-yellow-400' },
    { label: 'Verified Payments', value: payments.filter(p => p.status === 'verified').length, icon: <CheckCircle className="w-5 h-5" />, color: 'text-blue-400' },
  ];

  const roleColors: Record<string, string> = {
    client: 'text-blue-400 bg-blue-500/20',
    moderator: 'text-yellow-400 bg-yellow-500/20',
    admin: 'text-purple-400 bg-purple-500/20',
    super_admin: 'text-red-400 bg-red-500/20',
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
      <BlobCursor />
      <AntigravityBackground />
      
      <Sidebar
        role={user?.role || 'admin'}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
      />
      
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <FadeOnScroll>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">Manage users, payments, and system settings</p>
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

          {/* Payment Queue */}
          <FadeOnScroll delay={0.3}>
            <GlassCard className="p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Payment Verification Queue</h2>
                <Button variant="primary">View All Payments</Button>
              </div>
              
              {payments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No pending payments</p>
                  <p className="text-sm">Payments will appear here for verification</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.slice(0, 5).map((payment) => (
                    <motion.div
                      key={payment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{payment.adId?.title || 'Unknown Ad'}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          <span>Amount: ${payment.amount}</span>
                          <span>Method: {payment.method}</span>
                          <span>Ref: {payment.transactionRef}</span>
                          <span>Sender: {payment.senderName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Submitted: {new Date(payment.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleVerifyPayment(payment._id)}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Verify
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRejectPayment(payment._id)}
                          className="flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>
          </FadeOnScroll>

          {/* Users Table */}
          <FadeOnScroll delay={0.4}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">User Management</h2>
                <Button variant="primary">Add User</Button>
              </div>
              
              {users.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No users yet</p>
                  <p className="text-sm">Users will appear here when they register</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{user.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">{user.email}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                          <span className={`px-2 py-1 rounded-full ${roleColors[user.role]}`}>
                            {user.role}
                          </span>
                          {!user.isActive && <span className="text-red-400">Inactive</span>}
                          {!user.isVerified && <span className="text-yellow-400">Unverified</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="danger" size="sm">Delete</Button>
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
