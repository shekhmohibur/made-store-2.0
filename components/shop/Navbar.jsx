"use client";

import Link from "next/link";
import { ShoppingBag, SlidersHorizontal, User, LogIn } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function Navbar({ session, settings, categories = [], selectedCategory, onSelectCategory }) {
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <>
      <div
        style={{ backgroundColor: settings?.primaryColor || "#1C1917" }}
        className="text-white/95 text-[11px] font-medium tracking-[0.2em] uppercase text-center py-2 px-4"
      >
        {settings?.announcementBar || "Complimentary Express Shipping on Orders Over \$120"}
      </div>

      <header className="sticky top-0 z-30 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="font-serif font-bold tracking-[0.18em] text-xl text-stone-900">
            {settings?.storeName || "ATELIER THREADS"}
          </Link>

          {categories.length > 0 && onSelectCategory && (
            <nav className="hidden md:flex items-center gap-1.5 bg-stone-200/50 p-1 rounded-full">
              <button
                onClick={() => onSelectCategory("ALL")}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                  selectedCategory === "ALL"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                All Apparel
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                    selectedCategory === cat.id
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-2.5">
            {!session && (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-medium text-stone-700 px-3.5 py-2 rounded-full bg-white border border-stone-200 hover:border-stone-900 transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {session?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-xs font-medium text-stone-700 px-3.5 py-2 rounded-full bg-white border border-stone-200 hover:border-stone-900 transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Manage</span>
              </Link>
            )}

            {session && (
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-xs font-medium text-stone-700 px-3.5 py-2 rounded-full bg-white border border-stone-200 hover:border-stone-900 transition"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{session.name.split(" ")[0]}</span>
                <span className="sm:hidden">Account</span>
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition text-xs font-medium cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bag</span>
              {itemCount > 0 && (
                <span className="bg-white text-stone-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}