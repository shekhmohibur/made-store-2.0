import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getStoreSettings } from '@/lib/settings';
import { ProductDetailClient } from '@/components/shared/ProductDetailsClient';


export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug);

  const [product, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: cleanSlug },
      include: { category: true },
    }),
    getStoreSettings(),
  ]);

  if (!product || !product.isActive) {
    return { title: 'Product Not Found' };
  }

  const currency = settings.currencySymbol || '৳';
  const activePrice = product.salePrice
    ? Number(product.salePrice)
    : Number(product.basePrice);
  const priceTag = product.salePrice
    ? `${currency}${activePrice.toFixed(0)} (Was ${currency}${Number(product.basePrice).toFixed(0)})`
    : `${currency}${activePrice.toFixed(0)}`;

  const title = `${product.name} — ${priceTag}`;
  const description =
    product.description?.slice(0, 160) ||
    `Shop ${product.name} in ${product.category?.name || 'our collection'} at ${settings.storeName}.`;
  const mainImage = product.images?.[0] || settings.logoUrl || '/placeholder.png';

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      siteName: settings.storeName,
      title: `${title} | ${settings.storeName}`,
      description,
      url: `/products/${product.slug}`,
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${settings.storeName}`,
      description,
      images: [mainImage],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const cleanSlug = decodeURIComponent(slug);

  const product = await prisma.product.findUnique({
    where: { slug: cleanSlug },
    include: {
      category: true,
      variants: { orderBy: { size: 'asc' } },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const serializedProduct = {
    ...product,
    basePrice: Number(product.basePrice),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ProductDetailClient product={serializedProduct} />
    </main>
  );
}