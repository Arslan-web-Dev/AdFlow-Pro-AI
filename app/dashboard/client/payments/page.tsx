'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Upload, FileText } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function PaymentsPage() {
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const packages = [
    { id: 'basic', name: 'Basic', price: 0, period: 'Free' },
    { id: 'standard', name: 'Standard', price: 9.99, period: '/month' },
    { id: 'premium', name: 'Premium', price: 29.99, period: '/month' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <DashboardLayout allowedRoles={['client']}>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Payments</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage your subscriptions and payment history</p>
        </div>

        {showSuccess && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Payment proof submitted successfully!</span>
          </div>
        )}

        {/* Select Package */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Select Package</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`p-4 rounded-lg border transition-all text-left ${
                  selectedPackage === pkg.id
                    ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/10'
                    : 'border-[var(--border)] hover:border-[var(--primary-color)]/50'
                }`}
              >
                <p className="font-medium text-[var(--text-primary)]">{pkg.name}</p>
                <p className="text-2xl font-bold text-[var(--primary-color)]">
                  ${pkg.price}
                  <span className="text-sm text-[var(--text-secondary)] font-normal">{pkg.period}</span>
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Payment Method</h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] cursor-pointer hover:border-[var(--primary-color)]/50 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={paymentMethod === 'bank'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <CreditCard className="w-5 h-5 text-[var(--primary-color)]" />
              <div>
                <p className="font-medium text-[var(--text-primary)]">Bank Transfer</p>
                <p className="text-sm text-[var(--text-secondary)]">Pay directly to our bank account</p>
              </div>
            </label>

            <div className="p-4 rounded-lg bg-[var(--surface)]">
              <p className="text-sm text-[var(--text-secondary)] mb-2">Bank Account Details:</p>
              <div className="space-y-1 text-[var(--text-primary)]">
                <p><span className="text-[var(--text-secondary)]">Bank:</span> Example Bank</p>
                <p><span className="text-[var(--text-secondary)]">Account:</span> 1234567890</p>
                <p><span className="text-[var(--text-secondary)]">IBAN:</span> PK00EXMP1234567890</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Proof */}
        <form onSubmit={handleSubmit} className="glass-card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Upload Payment Proof</h2>
          
          <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center hover:border-[var(--primary-color)]/50 transition-colors">
            <input
              type="file"
              id="proof"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="proof" className="cursor-pointer">
              <Upload className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
              <p className="text-[var(--text-primary)] font-medium">
                {proofFile ? proofFile.name : 'Click to upload payment proof'}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Supports: JPG, PNG, PDF
              </p>
            </label>
          </div>

          <button
            type="submit"
            disabled={!proofFile || isSubmitting}
            className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Payment Proof'}
          </button>
        </form>

        {/* Payment History */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Payment History</h2>
          <div className="text-center py-8 text-[var(--text-secondary)]">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No payment history yet</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
