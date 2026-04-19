'use client';

import { motion } from 'framer-motion';
import { Lock, Eye, Database, Share2, Cookie, UserCheck } from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';
import GlareCard from '@/components/animations/GlareCard';

const sections = [
  {
    icon: Lock,
    title: 'Information We Collect',
    content: `We collect information you provide directly, including name, email, phone number, 
    and business details when creating listings. We also automatically collect usage data, 
    IP addresses, and device information to improve our services and ensure platform security.`,
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: `Your information is used to provide and improve our services, process payments, 
    communicate with you about your listings, and personalize your experience. We analyze 
    usage patterns to enhance platform functionality and prevent fraudulent activities.`,
  },
  {
    icon: Database,
    title: 'Data Storage & Security',
    content: `We implement industry-standard security measures including encryption, 
    secure servers, and regular security audits. Your data is stored on secure cloud 
    infrastructure with redundancy. We retain information only as long as necessary 
    for business purposes or legal requirements.`,
  },
  {
    icon: Share2,
    title: 'Information Sharing',
    content: `We do not sell your personal information. We may share data with service 
    providers who assist our operations, or when required by law. Public listing 
    information (business name, contact details) is visible to all users as intended 
    by the platform's purpose.`,
  },
  {
    icon: Cookie,
    title: 'Cookies & Tracking',
    content: `We use cookies to enhance user experience, remember preferences, and analyze 
    traffic. You can control cookie settings through your browser. Essential cookies 
    for platform functionality cannot be disabled. Third-party analytics tools help 
    us understand usage patterns.`,
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: `You have the right to access, correct, or delete your personal information. 
    You may request a copy of your data or withdraw consent for certain processing. 
    Contact us to exercise these rights. We will respond to requests within 30 days 
    in accordance with applicable privacy laws.`,
  },
];

export default function PrivacyPage() {
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
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-[var(--muted-foreground)]">
              Your privacy is our priority. Learn how we protect your data.
            </p>
          </motion.div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-4 rounded-xl bg-gradient-to-r from-[var(--primary-color)]/10 to-purple-500/10 border border-[var(--primary-color)]/20"
          >
            <p className="text-sm text-[var(--foreground)] text-center">
              <strong>Our Commitment:</strong> We never sell your personal data. 
              Your information is used solely to provide and improve our services.
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

          {/* Data Retention */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8"
          >
            <GlareCard className="p-6">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-4">
                Data Retention
              </h2>
              <ul className="space-y-3 text-[var(--muted-foreground)]">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary-color)] mt-2 flex-shrink-0" />
                  Account information: Retained until account deletion
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary-color)] mt-2 flex-shrink-0" />
                  Listing data: Retained for 1 year after expiration
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary-color)] mt-2 flex-shrink-0" />
                  Payment records: Retained for 7 years (legal requirement)
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[var(--primary-color)] mt-2 flex-shrink-0" />
                  Usage logs: Retained for 90 days
                </li>
              </ul>
            </GlareCard>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-[var(--muted-foreground)] mb-4">
              Privacy concerns? Contact our Data Protection Officer
            </p>
            <a
              href="mailto:privacy@adflowpro.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl text-[var(--foreground)] font-medium transition-colors"
            >
              privacy@adflowpro.com
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
