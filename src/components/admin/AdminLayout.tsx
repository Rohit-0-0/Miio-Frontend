import { AdminSidebar } from './AdminSidebar';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Mobile Header (basic) */}
        <header className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between">
          <span className="font-serif font-bold tracking-widest">MIIO Admin</span>
        </header>
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
