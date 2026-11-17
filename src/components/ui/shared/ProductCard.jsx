'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Check } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  // Extract unique colors with their hex codes from product variants
  const uniqueColors = Array.from(
    new Map(
      (product.variants || []).map((v) => [v.color, { color: v.color, hex: v.colorHex }])
    ).values()
  );

  const defaultVariant =
    product.variants?.find((v) => v.stock > 0) || product.variants?.[0];

  const hasDiscount =
    product.salePrice && Number(product.salePrice) < Number(product.basePrice);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!defaultVariant || defaultVariant.stock <= 0) return;

    addItem(product, defaultVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-zinc-100">
        <img
          src={product.images?.[0] || '/placeholder.png'}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {hasDiscount && <Badge variant="danger">Sale</Badge>}
          {!defaultVariant || defaultVariant.stock <= 0 ? (
            <Badge variant="dark">Sold Out</Badge>
          ) : null}
        </div>

        {/* Hover Quick Add Button */}
        {defaultVariant && defaultVariant.stock > 0 && (
          <button
            onClick={handleQuickAdd}
            className="absolute bottom-3 left-3 right-3 flex translate-y-2 items-center justify-center gap-2 rounded-xl bg-white/95 py-2.5 text-xs font-semibold text-zinc-900 opacity-0 shadow-md backdrop-blur-xs transition-all duration-200 hover:bg-zinc-900 hover:text-white group-hover:translate-y-0 group-hover:opacity-100"
          >
            {added ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Added ({defaultVariant.size})
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" />
                Quick Add ({defaultVariant.size})
              </>
            )}
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-3 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-zinc-900 group-hover:underline">
            {product.name}
          </h3>
          <div className="flex shrink-0 items-center gap-1.5 text-sm">
            {hasDiscount ? (
              <>
                <span className="font-bold text-red-600">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-xs text-zinc-400 line-through">
                  {formatPrice(product.basePrice)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-zinc-900">
                {formatPrice(product.basePrice)}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-zinc-500">{product.category?.name}</p>

        {/* Color Swatches */}
        {uniqueColors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {uniqueColors.map((c) => (
              <span
                key={c.color}
                title={c.color}
                className="h-3.5 w-3.5 rounded-full border border-zinc-300"
                style={{ backgroundColor: c.hex || '#27272a' }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}