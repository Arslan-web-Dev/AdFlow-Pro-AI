'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Star, ArrowRight, Sparkles } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const packages = [
  {
    name: 'Basic',
    price: 'Free',
    period: '',
    features: ['30-day listing', 'Standard visibility', 'Up to 3 images', 'Email support', 'Basic analytics'],
    popular: false,
    color: 'from-gray-500 to-gray-600',
  },
  {
    name: 'Standard',
    price: '$9.99',
    period: '/month',
    features: ['30-day listing', 'Priority visibility', 'Up to 8 images', 'Priority support', 'Advanced analytics', 'Social sharing'],
    popular: true,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Premium',
    price: '$29.99',
    period: '/month',
    features: ['60-day listing', 'Featured placement', 'Unlimited images', '24/7 Priority support', 'Advanced analytics', 'Homepage highlight', 'AI Ad Generation'],
    popular: false,
    color: 'from-blue-500 to-cyan-500',
  },
];

export default function PackagesPage() {
  return (
    <DashboardLayout allowedRoles={['client']}>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Choose Your Package</h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Upgrade your advertising experience with our flexible packages
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl overflow-hidden ${
                pkg.popular ? 'ring-2 ring-[var(--primary-color)]' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-4 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              
              <div className="glass-card p-8 h-full flex flex-col">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-6`}>
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">{pkg.name}</h3>
                
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-[var(--text-primary)]">{pkg.price}</span>
                  {pkg.period && (
                    <span className="text-[var(--text-secondary)]">{pkg.period}</span>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <Check className="w-5 h-5 text-[var(--accent-success)] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link
                  href="/dashboard/client/payments"
                  className={`w-full text-center py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                    pkg.popular
                      ? 'btn-primary'
                      : 'bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border)]'
                  }`}
                >
                  {pkg.popular ? 'Get Started' : 'Select Package'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Current Plan Info */}
        <div className="glass-card p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Your Current Plan</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--text-primary)] font-medium">Free Plan</p>
              <p className="text-sm text-[var(--text-secondary)]">Basic features for casual sellers</p>
            </div>
            <Link href="/dashboard/client/payments" className="btn-primary">
              Upgrade Now
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
