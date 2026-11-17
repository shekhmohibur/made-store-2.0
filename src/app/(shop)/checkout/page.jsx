'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [shipping, setShipping] = useState({
    fullName: session?.user?.name || '',
    phone: session?.user?.phone || '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, shipping, paymentMethod }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Could not complete order.');
      setLoading(false);
      return;
    }

    clearCart();
    router.push('/profile?orderSuccess=true');
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Your cart is empty</h1>
        <Button className="mt-4" onClick={() => router.push('/shop')}>
          Back to Shop
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black tracking-tight text-zinc-900">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 lg:col-span-3">
          <h2 className="text-lg font-bold text-zinc-900">Shipping Information</h2>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={shipping.fullName}
              onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
              required
            />
            <Input
              label="Contact Phone"
              value={shipping.phone}
              onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
              required
            />
          </div>

          <Input
            label="Street Address"
            value={shipping.street}
            onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
            required
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="City"
              value={shipping.city}
              onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
              required
            />
            <Input
              label="Postal Code"
              value={shipping.postalCode}
              onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
              required
            />
            <Input
              label="Country"
              value={shipping.country}
              onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
              required
            />
          </div>

          <div className="pt-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-700">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['COD', 'CARD'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-xl border p-3.5 text-left text-sm font-semibold transition-all ${
                    paymentMethod === method
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 text-zinc-800 hover:border-zinc-900'
                  }`}
                >
                  {method === 'COD' ? 'Cash on Delivery' : 'Online Card Payment'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="h-fit space-y-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-zinc-900">Order Summary</h2>
          <ul className="divide-y divide-zinc-200 text-sm">
            {items.map((item) => (
              <li key={item.variantId} className="flex justify-between py-3">
                <div>
                  <p className="font-semibold text-zinc-900">{item.name}</p>
                  <p className="text-xs text-zinc-500">
                    {item.color} · {item.size} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between border-t border-zinc-200 pt-4 text-base font-bold text-zinc-900">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <Button type="submit" size="lg" isLoading={loading} className="w-full">
            Confirm Order
          </Button>
        </div>
      </form>
    </main>
  );
}