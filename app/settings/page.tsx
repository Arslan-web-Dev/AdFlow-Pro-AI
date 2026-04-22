'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bell,
  Moon,
  Shield,
  Globe,
  Trash2,
  Save,
  Loader2,
  User,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';

// Dynamic import for useTheme to avoid SSR issues
import dynamic from 'next/dynamic';

const themes = [
  { id: 'indigo', name: 'Indigo', color: '#4F46E5' },
  { id: 'blue', name: 'Blue', color: '#2563EB' },
  { id: 'purple', name: 'Purple', color: '#7C3AED' },
  { id: 'pink', name: 'Pink', color: '#EC4899' },
  { id: 'orange', name: 'Orange', color: '#F97316' },
  { id: 'green', name: 'Green', color: '#10B981' },
  { id: 'red', name: 'Red', color: '#EF4444' },
  { id: 'cyan', name: 'Cyan', color: '#06B6D4' },
  { id: 'emerald', name: 'Emerald', color: '#059669' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  
  // Safe theme handling without context
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('indigo');

  useState(() => {
    setMounted(true);
    const saved = typeof window !== 'undefined' ? localStorage.getItem('adflow-theme') : null;
    if (saved) setCurrentTheme(saved);
  });

  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('adflow-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  };
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    twoFactorAuth: false,
    language: 'en',
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
            <p className="text-sm text-[var(--text-secondary)]">Manage your preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <GlareCard className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--primary-color)]/10">
                <Moon className="w-5 h-5 text-[var(--primary-color)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Theme</h3>
                <p className="text-sm text-[var(--text-secondary)]">Choose your preferred color scheme</p>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                    currentTheme === t.id
                      ? 'bg-[var(--primary-color)]/10 ring-2 ring-[var(--primary-color)]'
                      : 'hover:bg-[var(--surface)]'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="text-xs text-[var(--text-secondary)]">{t.name}</span>
                </button>
              ))}
            </div>
          </GlareCard>

          {/* Notifications */}
          <GlareCard className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--accent-info)]/10">
                <Bell className="w-5 h-5 text-[var(--accent-info)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Notifications</h3>
                <p className="text-sm text-[var(--text-secondary)]">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications' },
                { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Promotional offers and news' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{item.label}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, [item.key]: !s[item.key as keyof typeof s] }))
                    }
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      settings[item.key as keyof typeof settings] ? 'bg-[var(--primary-color)]' : 'bg-[var(--surface)]'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        settings[item.key as keyof typeof settings] ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </GlareCard>

          {/* Security */}
          <GlareCard className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[var(--accent-success)]/10">
                <Shield className="w-5 h-5 text-[var(--accent-success)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Security</h3>
                <p className="text-sm text-[var(--text-secondary)]">Protect your account</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Two-Factor Authentication</p>
                  <p className="text-sm text-[var(--text-secondary)]">Add extra security to your account</p>
                </div>
                <button
                  onClick={() => setSettings((s) => ({ ...s, twoFactorAuth: !s.twoFactorAuth }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.twoFactorAuth ? 'bg-[var(--primary-color)]' : 'bg-[var(--surface)]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.twoFactorAuth ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <button className="w-full py-3 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors">
                Change Password
              </button>
            </div>
          </GlareCard>

          {/* Danger Zone */}
          <GlareCard className="glass-card p-6 border-red-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-400">Danger Zone</h3>
                <p className="text-sm text-[var(--text-secondary)]">Irreversible actions</p>
              </div>
            </div>

            <button className="w-full py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
              Delete Account
            </button>
          </GlareCard>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
