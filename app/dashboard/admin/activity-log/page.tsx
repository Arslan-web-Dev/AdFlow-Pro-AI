'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Search,
  Filter,
  Users,
  Megaphone,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info,
  Trash2,
  Clock,
} from 'lucide-react';

interface ActivityLog {
  id: string;
  type: 'user' | 'ad' | 'payment' | 'system' | 'moderation';
  action: string;
  description: string;
  userName: string;
  createdAt: string;
  status?: 'success' | 'warning' | 'error';
}

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch('/api/admin/activity-log');
      if (response.ok) {
        const result = await response.json();
        setLogs(result);
      }
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return Users;
      case 'ad':
        return Megaphone;
      case 'payment':
        return DollarSign;
      case 'system':
        return Info;
      case 'moderation':
        return AlertCircle;
      default:
        return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'bg-blue-500/20 text-blue-400';
      case 'ad':
        return 'bg-purple-500/20 text-purple-400';
      case 'payment':
        return 'bg-green-500/20 text-green-400';
      case 'system':
        return 'bg-gray-500/20 text-gray-400';
      case 'moderation':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Activity Log</h1>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="user">User</option>
            <option value="ad">Ad</option>
            <option value="payment">Payment</option>
            <option value="system">System</option>
            <option value="moderation">Moderation</option>
          </select>
        </div>

        {/* Activity Timeline */}
        <div className="space-y-3">
          {filteredLogs.map((log, index) => {
            const TypeIcon = getTypeIcon(log.type);
            return (
              <div
                key={log.id}
                className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all animate-in slide-in-from-left-4 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(log.type)}`}>
                    <TypeIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white">{log.action}</p>
                        <p className="text-sm text-slate-400">{log.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-slate-500">By {log.userName}</span>
                          <span className="text-xs text-slate-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {log.status && (
                        <div className="flex items-center gap-1">
                          {getStatusIcon(log.status)}
                          <span className="text-xs text-slate-400">{log.status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredLogs.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-slate-400">No activity logs found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
