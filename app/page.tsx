'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import AntigravityBackground from '@/components/animations/antigravity-bg';
import BlobCursor from '@/components/animations/blob-cursor';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import MagnetButton from '@/components/animations/magnet-button';
import GlareHover from '@/components/animations/glare-hover';
import FadeOnScroll from '@/components/animations/fade-on-scroll';
import ElectricBorder from '@/components/animations/electric-border';
import { Sparkles, Zap, Shield, TrendingUp, Users, Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <BlobCursor />
      <AntigravityBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="text-white font-bold text-xl">AdFlow Pro</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">AI-Powered Advertising Platform</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Transform Your Ads
              </span>
              <br />
              <span className="text-white">with AI Intelligence</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              The next-generation sponsored ads marketplace powered by artificial intelligence. 
              Create, manage, and optimize your advertising campaigns with cutting-edge automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagnetButton>
                <Link href="/register">
                  <Button variant="primary" size="lg" className="px-8">
                    Start Free Trial
                  </Button>
                </Link>
              </MagnetButton>
              <MagnetButton>
                <Link href="/marketplace">
                  <Button variant="secondary" size="lg" className="px-8">
                    View Marketplace
                  </Button>
                </Link>
              </MagnetButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeOnScroll direction="up">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-gray-400 text-lg">Everything you need to succeed in advertising</p>
            </div>
          </FadeOnScroll>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Bot className="w-8 h-8 text-purple-400" />,
                title: 'AI Ad Generation',
                description: 'Automatically generate compelling ad content using advanced AI technology.',
              },
              {
                icon: <Zap className="w-8 h-8 text-blue-400" />,
                title: 'Lightning Fast',
                description: 'Deploy your ads in seconds with our optimized infrastructure.',
              },
              {
                icon: <Shield className="w-8 h-8 text-green-400" />,
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security with dual database redundancy.',
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-pink-400" />,
                title: 'Advanced Analytics',
                description: 'Track performance with real-time analytics and insights.',
              },
              {
                icon: <Users className="w-8 h-8 text-orange-400" />,
                title: 'Role-Based Access',
                description: 'Multi-role system with granular permissions for teams.',
              },
              {
                icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
                title: 'Smart Workflow',
                description: 'Automated approval workflow from draft to publication.',
              },
            ].map((feature, index) => (
              <FadeOnScroll key={index} delay={index * 0.1}>
                <GlareHover>
                  <GlassCard className="p-6 h-full">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </GlassCard>
                </GlareHover>
              </FadeOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeOnScroll>
            <ElectricBorder>
              <GlassCard glow className="p-12 text-center">
                <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-gray-400 text-lg mb-8">
                  Join thousands of advertisers using AdFlow Pro to transform their campaigns.
                </p>
                <MagnetButton>
                  <Link href="/register">
                    <Button variant="primary" size="lg" className="px-12">
                      Create Free Account
                    </Button>
                  </Link>
                </MagnetButton>
              </GlassCard>
            </ElectricBorder>
          </FadeOnScroll>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 AdFlow Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
