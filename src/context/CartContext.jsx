'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage safely
  useEffect(() => {
    const saved = localStorage.getItem('clothing_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
    setMounted(true);
  }, []);

  // Persist changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('clothing_cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (product, variant, quantity = 1) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.variantId === variant.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const nextQty = Math.min(updated[existingIndex].quantity + quantity, variant.stock);
        updated[existingIndex] = { ...updated[existingIndex], quantity: nextQty };
        return updated;
      }

      return [
        ...prev,
        {
          variantId: variant.id,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0] || '/placeholder.png',
          price: Number(product.salePrice || product.basePrice),
          size: variant.size,
          color: variant.color,
          stock: variant.stock,
          quantity: Math.min(quantity, variant.stock),
        },
      ];
    });
    setIsOpen(true);
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  };

  const removeItem = (variantId) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};