import { Suspense } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/shop/Navbar";
import { Footer } from "@/components/shop/Footer";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { ProductCard } from "@/components/shop/ProductCard";
import ProductDetailClient from "./ProductDetailClient";

async function ProductContent({ params }) {
  const { slug } = await params;

  const [session, settings, product] = await Promise.all([
    getSession(),
    prisma.siteSetting.findUnique({ where: { id: "default" } }),
    prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    }),
  ]);

  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    take: 4,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar session={session} settings={settings} />
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        <ProductDetailClient product={product} />

        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-stone-200">
            <h2 className="font-serif text-2xl font-semibold mb-6">Complete the Look</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer settings={settings} />
      <CartDrawer session={session} storeName={settings?.storeName} />
    </div>
  );
}

export default function ProductPage({ params }) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-stone-500">Loading product...</div>}>
      <ProductContent params={params} />
    </Suspense>
  );
}