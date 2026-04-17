'use client';

import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  draft: { color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Draft' },
  submitted: { color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'Submitted' },
  under_review: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'Under Review' },
  approved: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'Approved' },
  payment_pending: { color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Payment Pending' },
  published: { color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'Published' },
  expired: { color: 'text-gray-500', bg: 'bg-gray-600/20', label: 'Expired' },
  rejected: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Rejected' },
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${config.color} ${config.bg}
        ${className}
      `}
    >
      <span className="w-2 h-2 rounded-full bg-current mr-2" />
      {config.label}
    </motion.span>
  );
}
