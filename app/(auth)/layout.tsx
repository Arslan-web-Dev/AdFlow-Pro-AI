import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication | AdFlow Pro',
  description: 'Sign in or create an account on AdFlow Pro',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
