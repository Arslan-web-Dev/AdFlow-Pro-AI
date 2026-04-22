'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Search,
  Filter,
  MoreHorizontal,
  CreditCard,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
} from 'lucide-react';

interface Payment {
  id: string;
  transactionId: string;
  userName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const result = await response.json();
        setPayments(result);
        const total = result
          .filter((p: Payment) => p.status === 'completed')
          .reduce((sum: number, p: Payment) => sum + p.amount, 0);
        setTotalRevenue(total);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Payments</h1>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 animate-in slide-in-from-bottom-4 duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/20">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div
            className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 animate-in slide-in-from-bottom-4 duration-300"
            style={{ animationDelay: '100ms' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Transactions</p>
                <p className="text-3xl font-bold text-white">{payments.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/20">
                <CreditCard className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Payments Table */}
        <div
          className="rounded-lg bg-slate-800/50 border border-slate-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-slate-600">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Method</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredPayments.map((payment, index) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-slate-700/30 transition-colors animate-in fade-in duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 text-sm font-mono text-slate-300">{payment.transactionId}</td>
                    <td className="px-6 py-4 text-sm text-white">{payment.userName}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-white">${payment.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{payment.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1 hover:bg-slate-700/50 rounded transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPayments.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-slate-400">No payments found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
