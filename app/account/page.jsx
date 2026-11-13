import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Package, ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signOutAction } from "@/app/actions/authActions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

async function AccountContent() {
  const session = await getSession();
  if (!session) redirect("/login");

  const orders = await prisma.order.findMany({
    where: {
      OR: [{ userId: session.id }, { customerEmail: session.email }],
    },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900">
      <header className="bg-white border-b border-stone-200/80">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
          </Link>

          <div className="flex items-center gap-3">
            {session.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-stone-900 text-white"
              >
                Open Admin Panel
              </Link>
            )}
            <form action={signOutAction}>
              <Button variant="secondary" size="sm" type="submit">
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white p-6 rounded-xl border border-stone-200/80 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-stone-400 font-semibold">
              Member Profile
            </span>
            <h1 className="font-serif text-3xl font-semibold mt-1">{session.name}</h1>
            <p className="text-xs text-stone-500 mt-0.5">{session.email}</p>
          </div>
          <Badge status={session.role === "ADMIN" ? "SHIPPED" : "DELIVERED"}>
            {session.role} ACCOUNT
          </Badge>
        </div>

        <h2 className="font-serif text-2xl font-semibold mb-4">Order History</h2>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-stone-200/80 text-center">
            <Package className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-stone-800">No orders placed yet</p>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Explore our catalog and your orders will appear here.
            </p>
            <Link href="/">
              <Button size="sm">Browse Collection</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-xl border border-stone-200/80 flex flex-col sm:flex-row justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-stone-400">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <Badge status={order.status}>{order.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {order.items.map((item) => (
                      <span
                        key={item.id}
                        className="text-xs bg-stone-50 border border-stone-200/80 px-3 py-1 rounded-md"
                      >
                        {item.quantity}× {item.product?.name} ({item.size}, {item.color})
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-base">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-[11px] text-stone-400 mt-1">{order.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-stone-500">Loading account...</div>}>
      <AccountContent />
    </Suspense>
  );
}