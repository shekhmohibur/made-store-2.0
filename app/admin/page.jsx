import { prisma } from "@/lib/prisma";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [settings, categories, products, orders] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: "default" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AdminDashboard
      settings={settings}
      categories={categories}
      products={products}
      orders={orders}
    />
  );
}