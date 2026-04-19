'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import AntigravityBackground from '@/components/animations/AntigravityBackground';
import BlobCursor from '@/components/animations/BlobCursor';
import GlareCard from '@/components/animations/GlareCard';
import MagnetButton from '@/components/animations/MagnetButton';
import ElectricBorder from '@/components/animations/ElectricBorder';
// import ThemeSwitcher from '@/components/theme/ThemeSwitcher';
import ClickSpark from '@/components/animations/ClickSpark';
import { 
  Sparkles, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Bot, 
  ArrowRight,
  Play,
  Globe,
  Star
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI Ad Generation',
    description: 'Generate compelling ad titles, descriptions, and tags with AI in seconds.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Deploy your ads instantly with our optimized global infrastructure.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Secure & Trusted',
    description: 'Enterprise-grade security with encrypted data and secure payments.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    title: 'Advanced Analytics',
    description: 'Track views, clicks, and engagement with detailed insights.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Role-Based System',
    description: 'Client, Moderator, and Admin roles with granular permissions.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Post ads in any city worldwide. Reach local or international audiences.',
    color: 'from-cyan-500 to-blue-500',
  },
];

const packages = [
  {
    name: 'Basic',
    price: 'Free',
    features: ['30-day listing', 'Standard visibility', 'Up to 3 images', 'Email support'],
    popular: false,
  },
  {
    name: 'Standard',
    price: '$9.99',
    period: '/month',
    features: ['30-day listing', 'Priority visibility', 'Up to 8 images', 'Priority support', 'Basic analytics'],
    popular: true,
  },
  {
    name: 'Premium',
    price: '$29.99',
    period: '/month',
    features: ['60-day listing', 'Featured placement', 'Unlimited images', 'Priority support', 'Advanced analytics', 'Homepage highlight'],
    popular: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] overflow-hidden">
      <BlobCursor />
      <AntigravityBackground />
      
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[var(--border)] rounded-none"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-10 h-10 rounded-xl bg-[var(--primary-gradient)] flex items-center justify-center shadow-lg shadow-[var(--primary-color)]/30"
            >
              <span className="text-white font-bold text-xl">A</span>
            </motion.div>
            <span className="text-[var(--text-primary)] font-bold text-xl hidden sm:block">AdFlow Pro</span>
          </Link>
          
          {/* Theme Switcher */}
          <div className="hidden md:block">
            {/* ThemeSwitcher removed temporarily */}
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <Link 
              href="/marketplace" 
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors hidden sm:block"
            >
              Marketplace
            </Link>
            <Link 
              href="/login"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
            >
              Login
            </Link>
            <ClickSpark>
              <MagnetButton strength={0.15}>
                <Link 
                  href="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </MagnetButton>
            </ClickSpark>
          </motion.div>
        </div>
        
        {/* Mobile Theme Switcher */}
        <div className="md:hidden px-6 pb-3">
          {/* ThemeSwitcher removed temporarily */}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-[var(--primary-color)]/30 mb-8"
            >
              <Sparkles className="w-4 h-4 text-[var(--primary-color)]" />
              <span className="text-[var(--primary-light)] text-sm font-medium">AI-Powered Ads Marketplace</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Sell Smarter.</span>
              <br />
              <span className="text-[var(--text-primary)]">Reach Further.</span>
            </h1>
            
            <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              The next-generation AI-powered advertising platform. Create compelling ads with AI, 
              reach global audiences, and track your success in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ClickSpark>
                <MagnetButton strength={0.2}>
                  <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                    Start Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </MagnetButton>
              </ClickSpark>
              <ClickSpark>
                <MagnetButton strength={0.2}>
                  <Link href="/marketplace" className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4">
                    <Play className="w-5 h-5" />
                    Explore Marketplace
                  </Link>
                </MagnetButton>
              </ClickSpark>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 mt-16"
            >
              {[
                { value: '10K+', label: 'Active Ads' },
                { value: '50K+', label: 'Users' },
                { value: '100+', label: 'Cities' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Everything you need to create, manage, and optimize your advertising campaigns
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlareCard className="glass-card p-8 h-full group">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3">{feature.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
                </GlareCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
              Flexible packages to suit every need, from casual sellers to professional marketers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ElectricBorder className={`h-full ${pkg.popular ? 'ring-2 ring-[var(--primary-color)]' : ''}`}>
                  <div className="glass-card p-8 h-full flex flex-col relative overflow-hidden">
                    {pkg.popular && (
                      <div className="absolute top-0 right-0 bg-[var(--primary-gradient)] text-white text-xs font-semibold px-4 py-1 rounded-bl-lg">
                        POPULAR
                      </div>
                    )}
                    
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
                          <Star className="w-4 h-4 text-[var(--accent-success)] flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <ClickSpark>
                      <Link 
                        href="/register" 
                        className={`w-full text-center py-3 rounded-lg font-semibold transition-all ${
                          pkg.popular 
                            ? 'btn-primary' 
                            : 'bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] border border-[var(--border)]'
                        }`}
                      >
                        Get Started
                      </Link>
                    </ClickSpark>
                  </div>
                </ElectricBorder>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ElectricBorder className="rounded-3xl">
              <div className="glass-card p-12 md:p-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-6">
                  Ready to Transform Your Ads?
                </h2>
                <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
                  Join thousands of successful advertisers using AdFlow Pro to reach their audience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ClickSpark>
                    <MagnetButton strength={0.2}>
                      <Link href="/register" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
                        Create Free Account
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </MagnetButton>
                  </ClickSpark>
                </div>
              </div>
            </ElectricBorder>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-gradient)] flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-bold text-[var(--text-primary)]">AdFlow Pro</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm">
              © 2024 AdFlow Pro. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/marketplace" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors">
                Marketplace
              </Link>
              <Link href="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
