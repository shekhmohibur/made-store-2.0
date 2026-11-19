'use client';

import { useState, useMemo } from 'react';
import { ShoppingBag, Check, Shield, Truck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';

export function ProductDetailClient({ product }) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { formatMoney } = useSettings();
  const colors = useMemo(() => {
    return Array.from(
      new Map(
        product.variants.map((v) => [v.color, { name: v.color, hex: v.colorHex }])
      ).values()
    );
  }, [product.variants]);

  const [selectedColor, setSelectedColor] = useState(colors[0]?.name || '');

  const availableSizesForColor = useMemo(() => {
    return product.variants.filter((v) => v.color === selectedColor);
  }, [product.variants, selectedColor]);

  const [selectedSize, setSelectedSize] = useState(
    availableSizesForColor.find((v) => v.stock > 0)?.size ||
      availableSizesForColor[0]?.size ||
      ''
  );

  // Sync size when switching colors
  const handleColorSelect = (colorName) => {
    setSelectedColor(colorName);
    const matching = product.variants.filter((v) => v.color === colorName);
    const stillValid = matching.find((v) => v.size === selectedSize && v.stock > 0);
    if (!stillValid) {
      const fallback = matching.find((v) => v.stock > 0) || matching[0];
      setSelectedSize(fallback?.size || '');
    }
  };

  const activeVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const hasDiscount =
    product.salePrice && product.salePrice < product.basePrice;

  const handleAddToCart = () => {
    if (!activeVariant || activeVariant.stock <= 0) return;
    addItem(product, activeVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-zinc-100">
          <img
            src={product.images?.[selectedImage] || '/placeholder.png'}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
        {product.images?.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  selectedImage === idx ? 'border-zinc-900' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details & Variant Picker */}
      <div className="flex flex-col justify-center space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              {product.category?.name}
            </span>
            {hasDiscount && <Badge variant="danger">Sale</Badge>}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-3 pt-1">
            {hasDiscount ? (
              <>
                <span className="text-2xl font-bold text-red-600">
                  {formatMoney(product.salePrice)}
                </span>
                <span className="text-base text-zinc-400 line-through">
                  {formatMoney(product.basePrice)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-zinc-900">
                {formatMoney(product.basePrice)}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed text-zinc-600">
          {product.description}
        </p>

        {/* Color Selector */}
        {colors.length > 0 && (
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Color: <span className="font-normal text-zinc-500">{selectedColor}</span>
            </span>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleColorSelect(c.name)}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                    selectedColor === c.name
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-900'
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-white/40"
                    style={{ backgroundColor: c.hex || '#27272a' }}
                  />
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              Select Size
            </span>
            {activeVariant && (
              <span className="text-xs text-zinc-500">
                {activeVariant.stock > 0
                  ? `${activeVariant.stock} in stock`
                  : 'Out of stock'}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-6">
            {availableSizesForColor.map((variant) => {
              const isOut = variant.stock <= 0;
              const isSelected = selectedSize === variant.size;

              return (
                <button
                  key={variant.id}
                  disabled={isOut}
                  onClick={() => setSelectedSize(variant.size)}
                  className={`rounded-xl border py-3 text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : isOut
                      ? 'cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-300 line-through'
                      : 'border-zinc-300 bg-white text-zinc-900 hover:border-zinc-900'
                  }`}
                >
                  {variant.size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add to Bag CTA */}
        <div className="pt-2">
          <Button
            size="lg"
            className="w-full"
            disabled={!activeVariant || activeVariant.stock <= 0}
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check className="h-5 w-5 text-emerald-400" />
                Added to Bag
              </>
            ) : !activeVariant || activeVariant.stock <= 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingBag className="h-5 w-5" />
                Add to Bag — {formatMoney(product.salePrice || product.basePrice)}
              </>
            )}
          </Button>
        </div>

        {/* Store Guarantees */}
        <div className="grid grid-cols-3 gap-3 border-t border-zinc-200 pt-6 text-center text-xs text-zinc-600">
          <div className="flex flex-col items-center gap-1.5">
            <Truck className="h-4 w-4 text-zinc-900" />
            <span>Fast Delivery</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <RefreshCw className="h-4 w-4 text-zinc-900" />
            <span>14-Day Exchange</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Shield className="h-4 w-4 text-zinc-900" />
            <span>Quality Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}