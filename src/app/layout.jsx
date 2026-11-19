import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
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
  const [settings, firstSlide] = await Promise.all([
    getStoreSettings(),
    prisma.heroSlide.findFirst({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: { image: true },
    }),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const title = `${settings.storeName} | Modern Clothing & Apparel`;
  const description =
    settings.tagline ||
    'Shop curated everyday essentials, new drops, and seasonal collections.';
  const previewImage = firstSlide?.image || settings.logoUrl || '/placeholder.png';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | ${settings.storeName}`,
    },
    description,
    openGraph: {
      type: 'website',
      siteName: settings.storeName,
      title,
      description,
      url: baseUrl,
      images: [
        {
          url: previewImage,
          width: 1200,
          height: 630,
          alt: settings.storeName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [previewImage],
    },
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