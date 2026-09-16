import { Header } from './Header';
import { Footer } from './Footer';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <Header />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
