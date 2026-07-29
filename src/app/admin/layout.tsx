import { AdminLayout } from '@/components/admin/layout/AdminLayout';

export const metadata = {
  title: 'Miio Admin',
  description: 'Admin dashboard for Miio CMS',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
