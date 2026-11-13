import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import StorefrontClient from "@/components/StorefrontClient";

async function StorefrontData() {
  const [session, settings, categories, products] = await Promise.all([
    getSession(),
    prisma.siteSetting.findUnique({ where: { id: "default" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <StorefrontClient
      session={session}
      settings={settings}
      categories={categories}
      products={products}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-stone-500">Loading store...</div>}>
      <StorefrontData />
    </Suspense>
  );
}