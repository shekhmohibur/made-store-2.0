import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import './globals.css';
import { Navbar } from '@/components/ui/shared/Navbar';
import { CartDrawer } from '@/components/ui/shared/CartDrawer';
import { Footer } from '@/components/ui/shared/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ATELIER. | Modern Clothing Store',
  description: 'Curated modern apparel for everyday wear.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col bg-white text-zinc-900 antialiased`}>
        <SessionProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <div className="flex-1">{children}</div>
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}