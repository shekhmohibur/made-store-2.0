"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hydrate cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("atelier_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Persist cart changes
  useEffect(() => {
    localStorage.setItem("atelier_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, selectedSize, selectedColor) => {
    const size = selectedSize || product.sizes[0];
    const color = selectedColor || product.colors[0];
    const key = `${product.id}-${size}-${color}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...product, key, selectedSize: size, selectedColor: color, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (key, delta) => {
    setCart((prev) =>
      prev
        .map((item) => (item.key === key ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (key) => {
    setCart((prev) => prev.filter((item) => item.key !== key));
  };

  const clearCart = () => setCart([]);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);