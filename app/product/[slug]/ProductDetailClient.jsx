"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const [size, setSize] = useState(product.sizes[0] || "");
  const [color, setColor] = useState(product.colors[0] || "");

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-neutral-100 overflow-hidden rounded">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
            {product.category?.name}
          </p>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{product.name}</h1>
          <p className="text-xl font-semibold mb-6">${product.price.toFixed(2)}</p>
          <p className="text-sm text-neutral-600 leading-relaxed mb-8">{product.description}</p>

          {/* Size Pills */}
          <div className="mb-6">
            <span className="block text-xs font-semibold uppercase tracking-wider mb-2">
              Size
            </span>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 text-xs border transition ${
                    size === s
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 hover:border-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color Pills */}
          <div className="mb-8">
            <span className="block text-xs font-semibold uppercase tracking-wider mb-2">
              Color
            </span>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-4 py-2 text-xs border transition ${
                    color === c
                      ? "border-black bg-black text-white"
                      : "border-neutral-300 hover:border-black"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            disabled={product.stock === 0}
            onClick={() => addToCart(product, size, color)}
            className="w-full"
          >
            {product.stock > 0 ? `Add to Bag — $${product.price.toFixed(2)}` : "Sold Out"}
          </Button>

          <div className="mt-4">
            {product.stock > 0 && product.stock <= 5 && (
              <Badge status="PENDING">Only {product.stock} left in stock</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}