import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { AccountLinkCard } from '@/components/ui/auth/AccountLinkCard';

export const dynamic = 'force-dynamic';

export default async function ProfilePage({ searchParams }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const resolvedParams = await searchParams;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { variant: { include: { product: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">
          My Account
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your connected sign-in methods and track your orders.
        </p>
      </div>

      {resolvedParams?.orderSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          Your order has been placed successfully!
        </div>
      )}

      {/* Google + Email + Phone Link Manager */}
      <AccountLinkCard />

      {/* Order History */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Order History</h2>
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-500">
            You haven&apos;t placed any orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                  <div>
                    <span className="text-sm font-bold text-zinc-900">
                      {order.orderNumber}
                    </span>
                    <span className="ml-3 text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        order.status === 'DELIVERED'
                          ? 'success'
                          : order.status === 'CANCELLED'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {order.status}
                    </Badge>
                    <span className="text-sm font-bold text-zinc-900">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                <ul className="mt-3 space-y-1.5 text-xs text-zinc-600">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>
                        {item.variant.product.name} ({item.variant.color} /{' '}
                        {item.variant.size}) × {item.quantity}
                      </span>
                      <span className="font-medium text-zinc-900">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}