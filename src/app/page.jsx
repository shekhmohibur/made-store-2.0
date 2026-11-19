import Link from 'next/link';
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  RefreshCw,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getStoreSettings } from '@/lib/settings';
import { HeroCarousel } from '@/components/shared/HeroCarousel';
import { ProductCard } from '@/components/shared/ProductCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [slides, featuredProducts, latestProducts, categories, settings] =
    await Promise.all([
      prisma.heroSlide.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
      prisma.product.findMany({
        where: { isActive: true, featured: true },
        include: { category: true, variants: true },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        include: { category: true, variants: true },
        take: 4,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
        take: 4,
        orderBy: { name: 'asc' },
      }),
      getStoreSettings(),
    ]);

  const serializeProduct = (product) => ({
    ...product,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
  });

  const serializedFeatured = featuredProducts.map(serializeProduct);
  const serializedLatest = latestProducts.map(serializeProduct);

  const currency = settings?.currencySymbol || '৳';
  const whatsappLink = settings?.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
        `Hi ${settings.storeName || 'there'}, I need help choosing an outfit!`
      )}`
    : '/shop';

  return (
    <main className="bg-white">
      {/* 1. Full-Bleed Auto-Sliding Hero Carousel */}
      <HeroCarousel slides={slides} interval={5000} />

      {/* 2. Store Trust & Perks Strip */}
      <section className="border-b border-zinc-200 bg-zinc-50/80">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-900">
                Fast Nationwide Delivery
              </p>
              <p className="text-xs text-zinc-500">
                From {currency}
                {settings?.deliveryChargeInside ?? 60} inside city
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-900">
                Flexible Payments
              </p>
              <p className="text-xs text-zinc-500">
                COD, bKash, Nagad, Rocket &amp; Cards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-900">
                Easy Size Exchange
              </p>
              <p className="text-xs text-zinc-500">
                7-day hassle-free size replacement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-zinc-900">
                WhatsApp Express Order
              </p>
              <p className="text-xs text-zinc-500">
                Order directly in chat in seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curated Categories Lookbook */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Collections
              </span>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-900">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-zinc-900"
            >
              <span>Explore all categories</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-zinc-100 shadow-2xs"
              >
                <img
                  src={
                    cat.image ||
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={cat.name}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/20 to-transparent" />

                <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-zinc-900 backdrop-blur-xs">
                  {cat._count.products}{' '}
                  {cat._count.products === 1 ? 'Piece' : 'Pieces'}
                </div>

                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-white">
                      {cat.name}
                    </h3>
                    <span className="mt-1 inline-block text-xs font-medium text-zinc-300">
                      Browse collection
                    </span>
                  </div>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-950 transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. Featured Drops */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400">
              <Sparkles className="h-3.5 w-3.5 text-zinc-900" />
              Editor&apos;s Picks
            </span>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-900">
              Featured Drops
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-zinc-900"
          >
            <span>View entire catalog</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {serializedFeatured.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50/50 p-14 text-center">
            <p className="text-sm font-medium text-zinc-600">
              No featured products yet. Add products from your Admin Dashboard to showcase them here.
            </p>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {serializedFeatured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Mid-Page Editorial Promo Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-6 py-14 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-16 lg:py-16">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-zinc-300">
              Limited Season Offer
            </span>
            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Crafted for comfort. Styled for every occasion.
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400 sm:text-base">
              {settings?.tagline ||
                'Explore premium fabrics, tailored fits, and exclusive seasonal markdowns before they sell out.'}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/shop?sale=true"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-zinc-950 transition-colors hover:bg-zinc-200"
              >
                <span>Shop Sale Items</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/shop?sort=newest"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/60 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800"
              >
                <span>New Arrivals</span>
              </Link>
            </div>
          </div>

          {/* Decorative Right Visual Accent */}
          <div className="mt-10 grid grid-cols-2 gap-4 lg:mt-0 lg:w-[380px]">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5">
              <p className="text-3xl font-black text-white">100%</p>
              <p className="mt-1 text-xs text-zinc-400">
                Quality checked garments before dispatch
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5">
              <p className="text-3xl font-black text-white">24/7</p>
              <p className="mt-1 text-xs text-zinc-400">
                Direct WhatsApp styling &amp; order support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Just Landed (Latest Arrivals) */}
      {serializedLatest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Fresh Stock
              </span>
              <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-900">
                Just Landed
              </h2>
            </div>
            <Link
              href="/shop?sort=newest"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-zinc-900"
            >
              <span>See all new arrivals</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {serializedLatest.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. WhatsApp Personal Styling & Quick Order Banner */}
      {settings?.whatsappEnabled !== false && (
        <section className="border-t border-zinc-200 bg-zinc-50">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tight text-zinc-900">
                Need help with sizing or want to order on WhatsApp?
              </h3>
              <p className="text-sm text-zinc-600">
                Chat directly with {settings?.storeName || 'our team'} for instant measurements, live photos, and fast order placement.
              </p>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-emerald-700"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </section>
      )}
    </main>
  );
}