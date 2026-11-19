'use client';

import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal } = useCart();

const handleDirectWhatsApp = async () => {
    const res = await fetch('/api/admin/settings');
    const { settings } = await res.json();
    const phone = settings?.whatsappNumber || '8801700000000';
    const currency = settings?.currencySymbol || '৳';

    const itemLines = items
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.name}* (${item.color} / Size ${item.size}) x${item.quantity} = ${currency}${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join('\n');

    const text = [
      `Hello *${settings?.storeName || 'ATELIER.'}*, I want to place an order:`,
      ``,
      itemLines,
      ``,
      `*Subtotal: ${currency}${subtotal.toFixed(2)}*`,
      `(Please confirm delivery charge & availability)`,
    ].join('\n');

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer Panel */}
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-zinc-900" />
            <h2 className="text-base font-bold text-zinc-900">Shopping Bag</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="mb-3 h-12 w-12 text-zinc-300" />
              <p className="text-sm font-semibold text-zinc-900">Your bag is empty</p>
              <p className="mt-1 text-xs text-zinc-500">
                Explore our latest collection and add items to get started.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5"
                onClick={() => setIsOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {items.map((item) => (
                <li key={item.variantId} className="flex gap-4 py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-20 shrink-0 rounded-xl bg-zinc-100 object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="text-sm font-semibold text-zinc-900 hover:underline"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-zinc-400 hover:text-red-600"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {item.color} · Size {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-zinc-200">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1.5 text-zinc-600 hover:bg-zinc-50"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1.5 text-zinc-600 hover:bg-zinc-50 disabled:opacity-40"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-zinc-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="border-t border-zinc-200 bg-zinc-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-zinc-600">Subtotal</span>
              <span className="text-lg font-bold text-zinc-900">
                {formatPrice(subtotal)}
              </span>
            </div>
            <Link href="/checkout" onClick={() => setIsOpen(false)}>
              <Button className="w-full" size="lg">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}