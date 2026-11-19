import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { getStoreSettings } from '@/lib/settings';
import { SettingsProvider } from '@/context/SettingsContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/shared/Navbar';
import { CartDrawer } from '@/components/shared/CartDrawer';
import { Footer } from '@/components/shared/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const settings = await getStoreSettings();
  return {
    title: `${settings.storeName} | Modern Clothing Store`,
    description: settings.tagline || 'Curated modern apparel for everyday wear.',
    ...(settings.logoUrl && {
      icons: {
        icon: settings.logoUrl,
        apple: settings.logoUrl,
      },
    }),
  };
}

export default async function RootLayout({ children }) {
  const settings = await getStoreSettings();

  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col bg-white text-zinc-900 antialiased`}>
        <SessionProvider>
          <SettingsProvider initialSettings={settings}>
            <CartProvider>
              <Navbar />
              <CartDrawer />
              <div className="flex-1">{children}</div>
              <Footer />
            </CartProvider>
          </SettingsProvider>
        </SessionProvider>
      </body>
    </html>
  );
}