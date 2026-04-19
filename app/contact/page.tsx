'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';
import GlareCard from '@/components/animations/GlareCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'support@adflowpro.com',
    description: 'For general inquiries',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+1 (555) 123-4567',
    description: 'Mon-Fri, 9am-6pm EST',
  },
  {
    icon: MapPin,
    title: 'Office',
    value: 'New York, NY',
    description: 'Headquarters',
  },
  {
    icon: Clock,
    title: 'Hours',
    value: '24/7 Support',
    description: 'Online system always active',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <TopNavbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Have questions about AdFlow Pro? We are here to help. Reach out to our team 
              for support, partnerships, or general inquiries.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlareCard className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-color)] to-purple-600 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--foreground)]">
                          {info.title}
                        </h3>
                        <p className="text-[var(--primary-color)] font-medium">
                          {info.value}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </GlareCard>
                </motion.div>
              ))}
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <GlareCard className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-[var(--primary-color)]" />
                  <h2 className="text-xl font-semibold text-[var(--foreground)]">
                    Send us a Message
                  </h2>
                </div>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Send className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-[var(--muted-foreground)]">
                      We will get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                          Your Name
                        </label>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Subject
                      </label>
                      <Input
                        type="text"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Message
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--primary-color)] resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full button-primary">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </GlareCard>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
