import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#040B18', minHeight: '100vh' }}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
