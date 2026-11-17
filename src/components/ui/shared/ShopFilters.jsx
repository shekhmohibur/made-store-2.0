'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function ShopFilters({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') || '';
  const activeSize = searchParams.get('size') || '';
  const activeSort = searchParams.get('sort') || 'newest';
  const onSale = searchParams.get('sale') === 'true';

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push('/shop');
  };

  return (
    <aside className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Sort By
        </label>
        <select
          value={activeSort}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Category
        </label>
        <div className="flex flex-col space-y-1.5">
          <button
            onClick={() => updateFilter('category', '')}
            className={`rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
              activeCategory === ''
                ? 'bg-zinc-900 font-semibold text-white'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            All Clothing
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateFilter('category', cat.slug)}
              className={`rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                activeCategory === cat.slug
                  ? 'bg-zinc-900 font-semibold text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
          Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() =>
                updateFilter('size', activeSize === size ? '' : size)
              }
              className={`rounded-lg border py-2 text-xs font-semibold transition-all ${
                activeSize === size
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-200 text-zinc-700 hover:border-zinc-900'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Sale Toggle */}
      <label className="flex cursor-pointer items-center gap-2.5 pt-2">
        <input
          type="checkbox"
          checked={onSale}
          onChange={(e) => updateFilter('sale', e.target.checked ? 'true' : '')}
          className="h-4 w-4 rounded border-zinc-300 accent-zinc-900"
        />
        <span className="text-sm font-medium text-zinc-800">On Sale Only</span>
      </label>
    </aside>
  );
}