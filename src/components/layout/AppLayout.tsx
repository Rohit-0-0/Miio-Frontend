import { Header } from './Header';
import { Footer } from './Footer';
import { getSiteSettings, getNavigation } from '@/lib/server/globals';

export async function AppLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings();
  const navigation = await getNavigation();

  return (
    <div className="w-full">
      <Header 
        logo={siteSettings?.logo} 
        navItems={navigation?.headerNav} 
      />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
