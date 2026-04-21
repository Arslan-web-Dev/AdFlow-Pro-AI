'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  TrendingUp,
  Users,
  Eye,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  totalUsers: number;
  conversionRate: number;
  averageSessionDuration: number;
  bounceRate: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalViews: 0,
    totalClicks: 0,
    totalUsers: 0,
    conversionRate: 0,
    averageSessionDuration: 0,
    bounceRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyticsCards = [
    {
      title: 'Total Views',
      value: data.totalViews,
      icon: Eye,
      color: 'from-blue-500 to-blue-600',
      trend: '+12%',
      isPositive: true,
    },
    {
      title: 'Total Clicks',
      value: data.totalClicks,
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      trend: '+8%',
      isPositive: true,
    },
    {
      title: 'Total Users',
      value: data.totalUsers,
      icon: Users,
      color: 'from-green-500 to-green-600',
      trend: '+5%',
      isPositive: true,
    },
    {
      title: 'Conversion Rate',
      value: `${data.conversionRate}%`,
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      trend: '+2%',
      isPositive: true,
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300">Last 30 days</span>
          </div>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold">
                    {card.isPositive ? (
                      <ArrowUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={card.isPositive ? 'text-green-400' : 'text-red-400'}>
                      {card.trend}
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-lg bg-slate-800/50 border border-slate-700"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Session Duration</h2>
            <p className="text-3xl font-bold text-white">
              {data.averageSessionDuration.toFixed(2)}m
            </p>
            <p className="text-sm text-slate-400 mt-2">Average session duration</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 rounded-lg bg-slate-800/50 border border-slate-700"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Bounce Rate</h2>
            <p className="text-3xl font-bold text-white">{data.bounceRate}%</p>
            <p className="text-sm text-slate-400 mt-2">Percentage of bounced sessions</p>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
