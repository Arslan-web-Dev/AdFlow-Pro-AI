'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import TopNavbar from '@/components/layout/TopNavbar';

const faqs = [
  {
    question: 'How do I create a listing?',
    answer: 'To create a listing, sign up as a client, go to your dashboard, and click "Create New Ad". Fill in the details, select a package, and submit for moderation. Once approved and payment is verified, your ad will go live.',
  },
  {
    question: 'What packages are available?',
    answer: 'We offer three packages: Basic (7 days), Standard (15 days with category priority), and Premium (30 days with homepage featured placement). Each package offers different visibility levels and benefits.',
  },
  {
    question: 'How long does moderation take?',
    answer: 'Moderation typically takes 24-48 hours. Our moderators review each ad for content quality and policy compliance. You will receive a notification once your ad is approved or if any changes are needed.',
  },
  {
    question: 'How do I verify payment?',
    answer: 'After submitting your ad, you will be directed to the payment section. Enter your transaction details and upload proof of payment. An admin will verify within 24 hours.',
  },
  {
    question: 'Can I edit my ad after posting?',
    answer: 'You can edit your ad while it is in draft status. Once submitted for review or published, significant changes require moderation approval. Contact support for urgent modifications.',
  },
  {
    question: 'What happens when my ad expires?',
    answer: 'When your ad expires, it becomes inactive and is no longer visible to the public. You can renew it by selecting a new package and completing payment.',
  },
  {
    question: 'How do I report a suspicious listing?',
    answer: 'Click the "Report" button on any ad to flag suspicious content. Our moderation team will review the report within 12 hours and take appropriate action.',
  },
  {
    question: 'Is my payment information secure?',
    answer: 'Yes, we never store your payment details. All transactions are processed through secure, encrypted channels. We only keep transaction reference numbers for verification purposes.',
  },
];

function FAQItem({ question, answer, isOpen, onClick }: { 
  question: string; 
  answer: string; 
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-[var(--border-color)] last:border-0">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left"
      >
        <span className="text-lg font-medium text-[var(--foreground)] pr-4">
          {question}
        </span>
        <ChevronDown 
          className={`w-5 h-5 text-[var(--primary-color)] flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <p className="pb-5 text-[var(--muted-foreground)] leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <TopNavbar />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div
            className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-300"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary-color)] to-purple-600 mb-6">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-[var(--muted-foreground)]">
              Everything you need to know about AdFlow Pro
            </p>
          </div>

          {/* FAQ List */}
          <div
            className="animate-in slide-in-from-bottom-4 duration-300"
            style={{ animationDelay: '100ms' }}
          >
            <div className="glass-card p-6 sm:p-8">
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div
            className="mt-12 text-center animate-in slide-in-from-bottom-4 duration-300"
            style={{ animationDelay: '200ms' }}
          >
            <p className="text-[var(--muted-foreground)] mb-4">
              Still have questions?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-xl text-[var(--foreground)] font-medium transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
