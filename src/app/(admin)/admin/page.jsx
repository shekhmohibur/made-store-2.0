import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStoreSettings } from '@/lib/settings';
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') redirect('/login');

  const [products, categories, orders, slides, settings, users] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, variants: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.order.findMany({
      include: { user: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.heroSlide.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    }),
    getStoreSettings(),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
        accounts: { select: { provider: true } },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const revenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const serializedProducts = products.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
  }));

  const serializedOrders = orders.map((o) => ({
    ...o,
    totalAmount: Number(o.totalAmount),
  }));

  const serializedUsers = users.map((u) => ({
    id: u.id,
    name: u.name || 'Unnamed User',
    email: u.email,
    phone: u.phone,
    image: u.image,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    googleLinked: u.accounts.some((a) => a.provider === 'google'),
    orderCount: u._count.orders,
  }));

  const customerCount = serializedUsers.filter((u) => u.role === 'CUSTOMER').length;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">
          Store Management
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage inventory, homepage slides, categories, orders, users, and site settings.
        </p>
      </div>

      <AdminDashboardClient
        initialProducts={serializedProducts}
        initialCategories={categories}
        initialOrders={serializedOrders}
        initialSlides={slides}
        initialSettings={settings}
        initialUsers={serializedUsers}
        currentUserId={session.user.id}
        stats={{
          revenue,
          orderCount: orders.length,
          productCount: products.length,
          userCount: customerCount,
        }}
      />
    </main>
  );
}