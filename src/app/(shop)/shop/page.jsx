import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ui/shared/ProductCard';
import { ShopFilters } from '@/components/ui/shared/ShopFilters';


export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const { category, size, sort, sale, q } = resolvedParams || {};

  const where = {
    isActive: true,
    ...(category && { category: { slug: category } }),
    ...(sale === 'true' && { salePrice: { not: null } }),
    ...(size && {
      variants: {
        some: { size, stock: { gt: 0 } },
      },
    }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    }),
  };

  const orderBy =
    sort === 'price-asc'
      ? { basePrice: 'asc' }
      : sort === 'price-desc'
      ? { basePrice: 'desc' }
      : { createdAt: 'desc' };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, variants: true },
      orderBy,
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">
          {q ? `Search results for "${q}"` : 'All Apparel'}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Showing {products.length} {products.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ShopFilters categories={categories} />
        </div>

        <div className="lg:col-span-3">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-16 text-center">
              <p className="text-base font-semibold text-zinc-900">
                No matching clothing found
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Try clearing some filters or searching for another term.
              </p>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
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
        </div>
      </div>
    </main>
  );
}