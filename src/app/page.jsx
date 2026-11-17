import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/shared/ProductCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, featured: true },
      include: { category: true, variants: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      take: 4,
      orderBy: { name: 'asc' },
    }),
  ]);

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="space-y-6">
            <span className="inline-block rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-zinc-300">
              Season 2026 Collection
            </span>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Tailored for everyday movement.
            </h1>
            <p className="max-w-lg text-base text-zinc-400 sm:text-lg">
              Heavyweight organic cottons, structured outerwear, and clean minimalist silhouettes built to last.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/shop">
                <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-200">
                  Shop Collection
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/shop?sale=true">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-zinc-700 bg-transparent text-white hover:bg-zinc-900"
                >
                  Explore Sale
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-zinc-900">
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80"
              alt="Minimalist clothing rack"
              className="h-full w-full object-cover opacity-90"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
                Shop by Category
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Curated essentials across every wardrobe staple.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-zinc-900 hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100"
              >
                <img
                  src={
                    cat.image ||
                    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                  <span className="text-xs font-medium text-zinc-300">
                    Explore collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Featured Drops
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Our most-wanted pieces restocked for the season.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-zinc-900 hover:underline"
          >
            Shop all products →
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center">
            <p className="text-sm text-zinc-500">
              No featured products yet. Add products from the Admin Dashboard!
            </p>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  basePrice: Number(product.basePrice),
                  salePrice: product.salePrice ? Number(product.salePrice) : null,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}