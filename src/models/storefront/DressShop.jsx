import { Link } from 'react-router-dom';
import { Share2, ShoppingBag, MessageCircle, BadgeCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';

const DressShop = () => {
    const { shops } = useStore();
    const shop = shops.find((s) => s.slug === 'fb-dress-store') || shops[0];

    if (!shop) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Dress store not available.</p></div>;

    const accent = shop.accent || '#ec4899';

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top strip */}
            <div className="bg-gradient-to-r from-pink-600 to-rose-500 text-white text-center text-xs sm:text-sm py-2 px-4">
                🔥 Dress Season Sale — SAVE up to 20% · Ships nationwide · Order via Facebook DM
            </div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ backgroundColor: accent }}>FB</span>
                    <span className="font-bold text-lg tracking-wide text-gray-800">FB Dress Store</span>
                    <div className="ml-auto flex items-center gap-2">
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-pink-600 hover:bg-pink-50">
                            <MessageCircle size={16} /> DM us
                        </button>
                        <Link to="/shop/fb-dress-store" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: accent }}>
                            <ShoppingBag size={16} /> Shop Online
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="max-w-6xl mx-auto px-4 py-10">
                <div className="rounded-2xl overflow-hidden text-white" style={{ background: `linear-gradient(120deg, ${accent}, #be185d)` }}>
                    <div className="px-6 sm:px-10 py-14 text-center">
                        <p className="inline-flex items-center gap-1.5 text-sm font-medium bg-white/20 rounded-full px-3 py-1"><BadgeCheck size={15} /> Legit & verified dress seller</p>
                        <h1 className="text-3xl sm:text-5xl font-black mt-4">Gorgeous Dresses,<br />Sold the Facebook way 💃</h1>
                        <p className="mt-3 max-w-xl mx-auto text-white/90">Browse our handpicked collections, order online for delivery, or DM us on Facebook to reserve your size before it sells out.</p>
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link to="/shop/fb-dress-store" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white font-semibold" style={{ color: accent }}>
                                <ShoppingBag size={18} /> Browse the Store
                            </Link>
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/15 font-semibold hover:bg-white/25">
                                                                <MessageCircle size={18} /> Order via Facebook
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Collections */}
            <section className="max-w-6xl mx-auto px-4 pb-16">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Trending Dresses</h2>
                    <button className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
                        <Share2 size={15} /> Share
                    </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {shop.products.map((p) => (
                        <Link key={p.id} to={`/shop/${shop.slug}/product/${p.id}`} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="flex items-center justify-center aspect-square text-6xl bg-gradient-to-br from-pink-50 to-rose-50 group-hover:scale-105 transition-transform">
                                {p.emoji}
                            </div>
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-1">{p.name}</p>
                                <p className="font-bold text-gray-900 mt-1">${p.price}</p>
                                <span className="text-xs text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: accent }}>
                                    {p.sizes.length} sizes
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <Link to="/shop/fb-dress-store" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold" style={{ backgroundColor: accent }}>
                        View All Dresses <ShoppingBag size={17} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default DressShop;