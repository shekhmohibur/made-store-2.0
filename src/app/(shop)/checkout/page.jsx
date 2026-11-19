'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MessageCircle, Truck, Smartphone, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [settings, setSettings] = useState(null);
  const [deliveryZone, setDeliveryZone] = useState('inside'); // 'inside' | 'outside'
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [senderPhone, setSenderPhone] = useState('');
  const [paymentTrxId, setPaymentTrxId] = useState('');

  const [shipping, setShipping] = useState({
    fullName: session?.user?.name || '',
    phone: session?.user?.phone || '',
    street: '',
    city: 'Dhaka',
    postalCode: '',
    country: 'Bangladesh',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.codEnabled) setPaymentMethod('COD');
          else if (data.settings.whatsappEnabled) setPaymentMethod('WHATSAPP');
          else if (data.settings.bkashEnabled) setPaymentMethod('BKASH');
        }
      });
  }, []);

  const currency = settings?.currencySymbol || '৳';
  const deliveryFee = settings
    ? deliveryZone === 'outside'
      ? settings.deliveryChargeOutside
      : settings.deliveryChargeInside
    : 60;
  const grandTotal = subtotal + deliveryFee;

  const merchantNumbers = {
    BKASH: settings?.bkashNumber,
    NAGAD: settings?.nagadNumber,
    ROCKET: settings?.rocketNumber,
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        shipping,
        paymentMethod,
        deliveryZone,
        senderPhone,
        paymentTrxId,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Could not complete order.');
      setLoading(false);
      return;
    }

    clearCart();

    if (data.whatsappUrl) {
      window.open(data.whatsappUrl, '_blank');
    }

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
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black tracking-tight text-zinc-900">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid gap-10 lg:grid-cols-5">
        <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 lg:col-span-3">
          <h2 className="text-lg font-bold text-zinc-900">1. Shipping & Delivery Zone</h2>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              {error}
            </div>
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
            label="Full Delivery Address"
            placeholder="House, Road, Area..."
            value={shipping.street}
            onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="City / District"
              value={shipping.city}
              onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Delivery Zone
              </label>
              <select
                value={deliveryZone}
                onChange={(e) => setDeliveryZone(e.target.value)}
                className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm"
              >
                <option value="inside">
                  Inside Dhaka ({currency}{settings?.deliveryChargeInside ?? 60})
                </option>
                <option value="outside">
                  Outside Dhaka ({currency}{settings?.deliveryChargeOutside ?? 120})
                </option>
              </select>
            </div>
          </div>

          {/* 2. Payment & Order Method */}
          <div className="space-y-3 border-t border-zinc-100 pt-5">
            <h2 className="text-lg font-bold text-zinc-900">2. Order & Payment Method</h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {settings?.codEnabled !== false && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 text-zinc-800 hover:border-zinc-900'
                  }`}
                >
                  <Truck className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Cash on Delivery</p>
                    <p className="text-[11px] opacity-75">Pay when you receive</p>
                  </div>
                </button>
              )}

              {settings?.whatsappEnabled !== false && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('WHATSAPP')}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    paymentMethod === 'WHATSAPP'
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-zinc-200 text-zinc-800 hover:border-emerald-600'
                  }`}
                >
                  <MessageCircle className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Order via WhatsApp</p>
                    <p className="text-[11px] opacity-80">Send cart details to WhatsApp</p>
                  </div>
                </button>
              )}

              {settings?.bkashEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('BKASH')}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    paymentMethod === 'BKASH'
                      ? 'border-pink-600 bg-pink-600 text-white'
                      : 'border-zinc-200 text-zinc-800 hover:border-pink-600'
                  }`}
                >
                  <Smartphone className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">bKash Payment</p>
                    <p className="text-[11px] opacity-80">Send Money / Merchant Pay</p>
                  </div>
                </button>
              )}

              {settings?.nagadEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('NAGAD')}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    paymentMethod === 'NAGAD'
                      ? 'border-orange-600 bg-orange-600 text-white'
                      : 'border-zinc-200 text-zinc-800 hover:border-orange-600'
                  }`}
                >
                  <Smartphone className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Nagad Payment</p>
                    <p className="text-[11px] opacity-80">Send Money / Merchant Pay</p>
                  </div>
                </button>
              )}

              {settings?.rocketEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ROCKET')}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    paymentMethod === 'ROCKET'
                      ? 'border-purple-700 bg-purple-700 text-white'
                      : 'border-zinc-200 text-zinc-800 hover:border-purple-700'
                  }`}
                >
                  <Smartphone className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">Rocket (DBBL)</p>
                    <p className="text-[11px] opacity-80">Send Money / Bill Pay</p>
                  </div>
                </button>
              )}

              {settings?.sslcommerzEnabled && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('SSLCOMMERZ')}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    paymentMethod === 'SSLCOMMERZ'
                      ? 'border-blue-700 bg-blue-700 text-white'
                      : 'border-zinc-200 text-zinc-800 hover:border-blue-700'
                  }`}
                >
                  <CreditCard className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold">SSLCommerz</p>
                    <p className="text-[11px] opacity-80">Cards / Net Banking / MFS</p>
                  </div>
                </button>
              )}
            </div>

            {/* Mobile Banking Verification Box (bKash / Nagad / Rocket) */}
            {['BKASH', 'NAGAD', 'ROCKET'].includes(paymentMethod) && (
              <div className="mt-4 space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs leading-relaxed text-zinc-700">
                  Please send{' '}
                  <strong className="text-zinc-950">
                    {currency}{grandTotal.toFixed(2)}
                  </strong>{' '}
                  to our <strong>{paymentMethod}</strong> number:{' '}
                  <span className="rounded bg-zinc-900 px-2 py-0.5 font-mono text-white">
                    {merchantNumbers[paymentMethod] || 'Not configured'}
                  </span>{' '}
                  and enter your payment details below:
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input
                    label={`Your ${paymentMethod} Number`}
                    placeholder="01XXXXXXXXX"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    required
                  />
                  <Input
                    label="Transaction ID (TrxID)"
                    placeholder="e.g. 9H7A6B5C4D"
                    value={paymentTrxId}
                    onChange={(e) => setPaymentTrxId(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="h-fit space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 lg:col-span-2">
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
                  {currency}{(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-zinc-200 pt-3 text-sm">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal</span>
              <span>{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Delivery Fee</span>
              <span>{currency}{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-bold text-zinc-900">
              <span>Grand Total</span>
              <span>{currency}{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" size="lg" isLoading={loading} className="w-full">
            {paymentMethod === 'WHATSAPP'
              ? 'Send Order to WhatsApp'
              : `Confirm Order (${paymentMethod})`}
          </Button>
        </div>
      </form>
    </main>
  );
}