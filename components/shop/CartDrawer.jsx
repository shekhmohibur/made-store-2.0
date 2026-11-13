"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "@/app/actions/shopActions";
import { Drawer } from "@/components/ui/Drawer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function CartDrawer({ session, storeName }) {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, cartTotal } =
    useCart();
  const [form, setForm] = useState({
    name: session?.name || "",
    email: session?.email || "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    if (session) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || session.name || "",
        email: prev.email || session.email || "",
      }));
    }
  }, [session]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cart.length) return;
    setSubmitting(true);
    await placeOrder({
      customerName: form.name,
      customerEmail: form.email,
      address: form.address,
      cart,
    });
    setSubmitting(false);
    clearCart();
    setOrderComplete(true);
    setTimeout(() => {
      setOrderComplete(false);
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <Drawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title="Shopping Bag">
      {orderComplete ? (
        <div className="my-auto text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
          <h4 className="font-semibold text-lg">Order Confirmed</h4>
          <p className="text-sm text-stone-500">Thank you for shopping with {storeName}.</p>
        </div>
      ) : cart.length === 0 ? (
        <p className="text-sm text-stone-500 my-auto text-center">Your bag is empty.</p>
      ) : (
        <>
          <div className="space-y-4 flex-1">
            {cart.map((item) => (
              <div key={item.key} className="flex gap-3 border-b border-stone-200/70 pb-3">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-20 object-cover rounded" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-stone-500">
                    {item.selectedSize} / {item.selectedColor}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.key, -1)}
                      className="p-1 border border-stone-200 bg-white rounded hover:bg-stone-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.key, 1)}
                      className="p-1 border border-stone-200 bg-white rounded hover:bg-stone-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <span className="text-sm font-medium">
                    \${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleCheckout} className="border-t border-stone-200 pt-4 mt-4 space-y-3">
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>\${cartTotal.toFixed(2)}</span>
            </div>
            <Input
              required
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              required
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              required
              placeholder="Shipping Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <Button type="submit" disabled={submitting} className="w-full" size="lg">
              {submitting ? "Processing..." : "Complete Order"}
            </Button>
          </form>
        </>
      )}
    </Drawer>
  );
}