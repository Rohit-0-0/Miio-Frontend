import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminGuard } from '@/components/admin/layout/AdminGuard';

export const metadata = {
  title: 'Miio Admin',
  description: 'Admin dashboard for Miio CMS',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}
