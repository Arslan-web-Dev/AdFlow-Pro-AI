'use client';

import { motion } from 'framer-motion';
import { FileText, Shield, Users, DollarSign, Gavel } from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';
import GlareCard from '@/components/animations/GlareCard';

const sections = [
  {
    icon: FileText,
    title: 'Acceptance of Terms',
    content: `By accessing or using AdFlow Pro, you agree to be bound by these Terms of Service. 
    If you disagree with any part of the terms, you may not access the service. 
    These terms apply to all users, including clients, moderators, and administrators.`,
  },
  {
    icon: Users,
    title: 'User Accounts',
    content: `When you create an account, you must provide accurate and complete information. 
    You are responsible for safeguarding your password and for all activities under your account. 
    Notify us immediately of any unauthorized use. We reserve the right to terminate accounts 
    for violation of these terms.`,
  },
  {
    icon: Shield,
    title: 'Content Guidelines',
    content: `All listings must be legal, accurate, and not misleading. Prohibited items include 
    illegal goods, counterfeit products, harmful substances, and adult content. We reserve 
    the right to remove any listing that violates our policies without prior notice. 
    Repeated violations may result in account suspension.`,
  },
  {
    icon: DollarSign,
    title: 'Payments & Refunds',
    content: `Package fees are non-refundable once an ad is published. In case of rejection 
    by moderators, you may edit and resubmit without additional charges. Failed payments 
    must be resolved within 7 days or listings will be removed. We use secure third-party 
    processors for all transactions.`,
  },
  {
    icon: Gavel,
    title: 'Dispute Resolution',
    content: `Any disputes arising from the use of AdFlow Pro shall be resolved through 
    binding arbitration in accordance with the rules of the American Arbitration Association. 
    Both parties agree to attempt mediation before arbitration. These terms are governed 
    by the laws of the State of New York.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <TopNavbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary-color)] to-purple-600 mb-6">
              <Gavel className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-[var(--muted-foreground)]">
              Last updated: January 2025
            </p>
          </motion.div>

          {/* Last Updated Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border-color)]"
          >
            <p className="text-sm text-[var(--muted-foreground)] text-center">
              Please read these terms carefully. By using AdFlow Pro, you agree to comply with 
              all applicable laws and our community guidelines.
            </p>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <GlareCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface)] flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-[var(--primary-color)]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                        {section.title}
                      </h2>
                      <p className="text-[var(--muted-foreground)] leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </GlareCard>
              </motion.div>
            ))}
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-[var(--muted-foreground)] mb-4">
              Questions about our Terms?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl text-[var(--foreground)] font-medium transition-colors"
            >
              Contact Legal Team
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
