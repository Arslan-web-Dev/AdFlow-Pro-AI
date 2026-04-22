'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Check, X, User, Mail, Lock, ArrowRight } from 'lucide-react';

interface ValidationState {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

function validatePassword(password: string): ValidationState {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
}

function getPasswordStrength(validations: ValidationState): number {
  const validCount = Object.values(validations).filter(Boolean).length;
  return (validCount / 5) * 100;
}

function getStrengthLabel(strength: number): { label: string; color: string } {
  if (strength === 0) return { label: 'Enter password', color: 'bg-gray-600' };
  if (strength <= 20) return { label: 'Very Weak', color: 'bg-red-500' };
  if (strength <= 40) return { label: 'Weak', color: 'bg-orange-500' };
  if (strength <= 60) return { label: 'Fair', color: 'bg-yellow-500' };
  if (strength <= 80) return { label: 'Good', color: 'bg-blue-500' };
  return { label: 'Strong', color: 'bg-green-500' };
}

const validationItems = [
  { key: 'minLength' as const, label: 'Minimum 8 characters' },
  { key: 'hasUppercase' as const, label: 'One uppercase letter' },
  { key: 'hasLowercase' as const, label: 'One lowercase letter' },
  { key: 'hasNumber' as const, label: 'One number' },
  { key: 'hasSpecial' as const, label: 'One special character' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validations = validatePassword(formData.password);
  const strength = getPasswordStrength(validations);
  const strengthInfo = getStrengthLabel(strength);
  const allValid = Object.values(validations).every(Boolean);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!allValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to login
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[var(--background)]" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--primary-color)] rounded-full filter blur-[120px] opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--secondary-color)] rounded-full filter blur-[120px] opacity-20" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--primary-gradient)] mb-4 shadow-lg shadow-[var(--primary-color)]/30">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
          <p className="text-[var(--text-secondary)]">Join the AI-powered ads marketplace</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            <button
              onClick={() => {
                setFormData({ name: 'Test User', email: 'user@adflow.com', password: 'User123', confirmPassword: 'User123' });
              }}
              className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-all text-left"
            >
              <p className="font-semibold text-blue-400">User</p>
              <p className="text-xs text-blue-300">user@adflow.com / User123</p>
            </button>
            <button
              onClick={() => {
                setFormData({ name: 'Test Admin', email: 'admin@adflow.com', password: 'Admin123', confirmPassword: 'Admin123' });
              }}
              className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all text-left"
            >
              <p className="font-semibold text-red-400">Admin</p>
              <p className="text-xs text-red-300">admin@adflow.com / Admin123</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="input-field pl-12"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className="input-field pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {formData.password.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">Password Strength</span>
                    <span className={`font-medium ${strengthInfo.color.replace('bg-', 'text-')}`}>
                      {strengthInfo.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strengthInfo.color} transition-all duration-500`}
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Validation Checklist */}
              {formData.password.length > 0 && (
                <div className="space-y-2 pt-2">
                  {validationItems.map((item) => {
                    const isValid = validations[item.key];
                    return (
                      <div key={item.key} className="flex items-center gap-2 text-sm">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                            isValid ? 'bg-[var(--accent-success)]' : 'bg-[var(--surface)] border border-[var(--border)]'
                          }`}
                        >
                          {isValid ? (
                            <Check className="w-3 h-3 text-white" />
                          ) : (
                            <X className="w-3 h-3 text-[var(--text-muted)]" />
                          )}
                        </div>
                        <span className={isValid ? 'text-[var(--accent-success)]' : 'text-[var(--text-secondary)]'}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-primary)]">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`input-field pl-12 pr-12 ${
                    formData.confirmPassword && !passwordsMatch ? 'border-red-500' : ''
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-400">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="text-[var(--primary-color)] hover:text-[var(--primary-light)] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
