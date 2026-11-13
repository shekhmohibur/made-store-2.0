"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/Badge";

const COLOR_MAP = {
  black: "#18181B",
  "washed black": "#27272A",
  charcoal: "#3F3F46",
  slate: "#64748B",
  white: "#FFFFFF",
  "off-white": "#F5F5F4",
  cream: "#FEF3C7",
  sand: "#E7E5E4",
  camel: "#C29B61",
  olive: "#4D5D53",
  navy: "#1E293B",
};

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [size, setSize] = useState(product.sizes[0] || "");
  const [color, setColor] = useState(product.colors[0] || "");

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-stone-200/70 p-3 hover:border-stone-300 hover:shadow-md transition-all duration-300">
      {/* Image Frame */}
      <div className="relative aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden mb-3.5">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {product.stock === 0 && <Badge status="SOLD_OUT">Sold Out</Badge>}
          {product.featured && product.stock > 0 && <Badge status="FEATURED">Featured</Badge>}
        </div>

        {/* Hover Quick-Add Overlay */}
        {product.stock > 0 && (
          <button
            onClick={() => addToCart(product, size, color)}
            className="absolute bottom-2.5 inset-x-2.5 bg-white/95 backdrop-blur-xs text-stone-900 border border-stone-200 py-2.5 rounded-md text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-200 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Quick Add · {size}
          </button>
        )}
      </div>

      {/* Title & Price */}
      <div className="flex justify-between items-baseline gap-2 px-1">
        <Link
          href={`/product/${product.slug}`}
          className="font-medium text-sm text-stone-900 hover:text-stone-600 transition line-clamp-1"
        >
          {product.name}
        </Link>
        <span className="font-semibold text-sm text-stone-900 shrink-0">
          ${product.price.toFixed(2)}
        </span>
      </div>

      <p className="text-xs text-stone-500 px-1 mt-1 mb-3 line-clamp-1">{product.description}</p>

      {/* Interactive Size Pills & Color Swatches */}
      <div className="mt-auto pt-2.5 border-t border-stone-100 px-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`min-w-[26px] h-6 px-1.5 text-[10px] font-medium rounded transition ${
                size === s
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {product.colors.map((c) => {
            const hex = COLOR_MAP[c.toLowerCase()] || "#A8A29E";
            return (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => setColor(c)}
                style={{ backgroundColor: hex }}
                className={`w-4 h-4 rounded-full border border-stone-300 transition ${
                  color === c ? "ring-2 ring-offset-1 ring-stone-900 scale-110" : "opacity-80 hover:opacity-100"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}