import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Storefront = () => {
    const { shop, accent, addToCart } = useOutletContext();
        const [cat, setCat] = useState('All');

    const cats = ['All', ...Array.from(new Set(shop.products.map((p) => p.category)))];
    const filtered = cat === 'All' ? shop.products : shop.products.filter((p) => p.category === cat);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Hero */}
            <div className="rounded-2xl overflow-hidden mb-8" style={{ background: `linear-gradient(120deg, ${accent}, ${accent}cc)` }}>
                <div className="px-6 sm:px-10 py-12 sm:py-16 text-white">
                    <p className="text-sm font-semibold uppercase tracking-widest text-white/80">{shop.plan} store</p>
                    <h1 className="text-3xl sm:text-4xl font-bold mt-2">{shop.name}</h1>
                    <p className="mt-2 max-w-lg text-white/90">{shop.description}</p>
                    <span className="mt-5 inline-block rounded-lg bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
                        Free shipping · Browse {shop.products.length} items
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                {cats.map((c) => (
                    <button
                        key={c}
                        onClick={() => setCat(c)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${cat === c ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        style={cat === c ? { backgroundColor: accent } : undefined}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* Product grid */}
            {filtered.length === 0 ? (
                <p className="text-gray-500">No {cat} items right now.</p>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((p) => (
                        <div key={p.id} className="group rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                            <Link to={`/shop/${shop.slug}/product/${p.id}`} className="flex items-center justify-center aspect-square text-7xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-105 transition-transform">
                                {p.emoji}
                            </Link>
                            <div className="p-4 flex flex-col flex-1">
                                <Link to={`/shop/${shop.slug}/product/${p.id}`} className="font-medium text-gray-800 leading-snug">{p.name}</Link>
                                <div className="mt-1 flex items-center justify-between">
                                    <p className="font-bold text-gray-900">${p.price}</p>
                                    <p className="text-xs text-gray-400">{p.category}</p>
                                </div>
                                <button
                                    disabled={p.stock === 0}
                                    onClick={() => addToCart(p, 1, p.sizes[0] || '', p.colors[0] || '')}
                                    className={`mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-opacity ${p.stock === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-90'}`}
                                    style={{ backgroundColor: accent }}
                                >
                                    <ShoppingBag size={15} /> {p.stock === 0 ? 'Sold out' : `Add · $${p.price}`}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Storefront;