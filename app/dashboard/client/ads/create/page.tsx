'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Camera,
  Check,
  ChevronRight,
  Loader2,
  MapPin,
  Tag,
  DollarSign,
  FileText,
  Send,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface AIResponse {
  title: string;
  description: string;
  tags: string[];
  suggestedPrice: number;
}

const categories = [
  'Electronics', 'Vehicles', 'Real Estate', 'Jobs', 'Services',
  'Fashion', 'Home & Garden', 'Sports', 'Books', 'Other'
];

const steps = ['Basic Info', 'Media', 'AI Generate', 'Review'];

export default function CreateAdPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    city: '',
    price: '',
    tags: [] as string[],
    media: [] as string[],
    contactEmail: '',
    contactPhone: '',
  });

  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [tagInput, setTagInput] = useState('');

  const handleGenerateWithAI = async () => {
    if (!formData.description && !formData.title) {
      setError('Please enter at least a title or description');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/ai/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ad content');
      }

      const data = await response.json();
      setAiResponse(data);
      
      // Auto-fill if fields are empty
      setFormData(prev => ({
        ...prev,
        title: prev.title || data.title,
        description: prev.description || data.description,
        tags: prev.tags.length > 0 ? prev.tags : data.tags,
        price: prev.price || String(data.suggestedPrice),
      }));
    } catch (err) {
      setError('AI generation failed. Please fill in manually.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          isAIGenerated: !!aiResponse,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create ad');
      }

      // Refresh auth/session state before redirecting
      await refresh();
      router.push('/dashboard/client/ads');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return formData.title && formData.description && formData.category && formData.city && formData.price;
    }
    if (currentStep === 1) {
      return true; // Media is optional
    }
    return true;
  };

  return (
    <DashboardLayout allowedRoles={['client']}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard/client/ads"
            className="p-2 rounded-lg bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Create New Ad</h1>
            <p className="text-sm text-[var(--text-secondary)]">Fill in the details below</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                index === currentStep
                  ? 'bg-[var(--primary-color)] text-white'
                  : index < currentStep
                  ? 'bg-[var(--accent-success)]/20 text-[var(--accent-success)]'
                  : 'bg-[var(--surface)] text-[var(--text-muted)]'
              }`}>
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                )}
                <span className="text-sm font-medium hidden sm:inline">{step}</span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
              )}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Step 1: Basic Info */}
        {currentStep === 0 && (
          <div>
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Basic Information</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., iPhone 13 Pro Max - Like New"
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="input-field"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        City *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="e.g., New York"
                          className="input-field pl-12"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Enter price"
                        className="input-field pl-12"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your item or service..."
                      rows={4}
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Media */}
          {currentStep === 1 && (
            <div>
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Add Photos</h2>
                
                <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-12 text-center hover:border-[var(--primary-color)] transition-colors cursor-pointer">
                  <Camera className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
                  <p className="text-[var(--text-primary)] font-medium">Click to upload photos</p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    or drag and drop here
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    Supports: JPG, PNG up to 5MB each
                  </p>
                </div>

                {formData.media.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    {formData.media.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: AI Generate */}
          {currentStep === 2 && (
            <div>
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">AI Enhancement</h2>
                  <span className="text-xs text-[var(--text-muted)]">Optional</span>
                </div>
                
                <p className="text-[var(--text-secondary)] mb-6">
                  Let AI help you improve your ad with better titles, descriptions, tags, and pricing suggestions.
                </p>

                <button
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate with AI
                    </>
                  )}
                </button>

                {aiResponse && (
                  <div className="mt-6 p-4 rounded-lg bg-[var(--surface)]">
                    <div className="flex items-center gap-2 mb-3">
                      <Check className="w-5 h-5 text-[var(--accent-success)]" />
                      <span className="text-[var(--accent-success)] font-medium">AI Generated Content</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      AI has suggested improvements that have been applied to your ad.
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add a tag and press Enter"
                        className="input-field pl-12"
                      />
                    </div>
                    <button
                      onClick={addTag}
                      className="px-4 py-2 rounded-lg bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-sm flex items-center gap-2"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 3 && (
            <div>
              <div className="glass-card p-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Review & Submit</h2>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[var(--surface)]">
                    <h3 className="font-semibold text-[var(--text-primary)]">{formData.title}</h3>
                    <p className="text-[var(--text-secondary)] mt-2">{formData.description}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-[var(--text-muted)]">
                      <span>{formData.category}</span>
                      <span>•</span>
                      <span>{formData.city}</span>
                      <span>•</span>
                      <span className="text-[var(--primary-color)] font-semibold">${formData.price}</span>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 rounded bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-yellow-400 font-medium">Your ad will be reviewed</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">
                          After submission, your ad will go through a quick review process before being published.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full mt-6 py-4 rounded-xl bg-[var(--primary-gradient)] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit for Review
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 rounded-lg bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={!canProceed()}
              className="px-6 py-3 rounded-lg bg-[var(--primary-color)] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </DashboardLayout>
  );
}
