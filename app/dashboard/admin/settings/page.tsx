'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  Settings,
  Bell,
  Lock,
  Database,
  Mail,
  Save,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface SettingsData {
  emailNotifications: boolean;
  maintenanceMode: boolean;
  autoApproveAds: boolean;
  maxAdsPerUser: number;
  commissionRate: number;
  siteName: string;
  adminEmail: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    emailNotifications: true,
    maintenanceMode: false,
    autoApproveAds: false,
    maxAdsPerUser: 10,
    commissionRate: 10,
    siteName: 'AdFlow Pro',
    adminEmail: 'admin@adflow.com',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const result = await response.json();
        setSettings(result);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const settingsSections = [
    {
      title: 'General Settings',
      icon: Settings,
      fields: [
        { label: 'Site Name', key: 'siteName', type: 'text' },
        { label: 'Admin Email', key: 'adminEmail', type: 'email' },
      ],
    },
    {
      title: 'Ad Management',
      icon: Database,
      fields: [
        { label: 'Max Ads Per User', key: 'maxAdsPerUser', type: 'number' },
        { label: 'Commission Rate (%)', key: 'commissionRate', type: 'number' },
        { label: 'Auto Approve Ads', key: 'autoApproveAds', type: 'toggle' },
      ],
    },
    {
      title: 'System',
      icon: Lock,
      fields: [
        { label: 'Maintenance Mode', key: 'maintenanceMode', type: 'toggle' },
        { label: 'Email Notifications', key: 'emailNotifications', type: 'toggle' },
      ],
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Save Status */}
        {saveStatus !== 'idle' && (
          <div
            className={`flex items-center gap-2 p-4 rounded-lg animate-in slide-in-from-top-2 duration-300 ${
              saveStatus === 'success'
                ? 'bg-green-500/20 border border-green-600 text-green-400'
                : 'bg-red-500/20 border border-red-600 text-red-400'
            }`}
          >
            {saveStatus === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {saveStatus === 'success' ? 'Settings saved successfully!' : 'Failed to save settings'}
          </div>
        )}

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;
          return (
            <div
              key={section.title}
              className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 animate-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${sectionIndex * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <SectionIcon className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              </div>

              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key} className="flex items-center justify-between">
                    <label className="text-sm text-slate-300">{field.label}</label>
                    {field.type === 'toggle' ? (
                      <button
                        onClick={() =>
                          setSettings({
                            ...settings,
                            [field.key]: !settings[field.key as keyof SettingsData],
                          })
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings[field.key as keyof SettingsData]
                            ? 'bg-blue-600'
                            : 'bg-slate-600'
                        }`}
                      >
                        <div
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings[field.key as keyof SettingsData] ? 'translate-x-6' : ''
                          }`}
                        />
                      </button>
                    ) : (
                      <input
                        type={field.type}
                        value={String(settings[field.key as keyof SettingsData] ?? '')}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            [field.key]:
                              field.type === 'number' ? parseInt(e.target.value) : e.target.value,
                          })
                        }
                        className="px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
