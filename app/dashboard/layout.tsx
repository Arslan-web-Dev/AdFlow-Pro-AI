import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | AdFlow Pro',
  description: 'Manage your ads and account',
};

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
