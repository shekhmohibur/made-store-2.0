import { useState } from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';
import { ShoppingBag, X, Plus, Minus, Trash2, CreditCard, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../../store/useStore';

const StorefrontLayout = () => {
    const { slug } = useParams();
    const { getShopBySlug, placeOrder } = useStore();
    const shop = getShopBySlug(slug);

    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [checkout, setCheckout] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(null);
    const [form, setForm] = useState({ name: '', email: '' });

    const accent = shop ? shop.accent || '#7c3aed' : '#7c3aed';
    const cartCount = cart.reduce((s, it) => s + it.qty, 0);
    const subtotal = cart.reduce((s, it) => s + it.price * it.qty, 0);

    const addToCart = (product, qty = 1, size = '', color = '') => {
        setCart((prev) => {
            const existing = prev.find((it) => it.productId === product.id && it.size === size && it.color === color);
            if (existing) return prev.map((it) => (it === existing ? { ...it, qty: it.qty + qty } : it));
            return [...prev, { productId: product.id, name: product.name, emoji: product.emoji, price: product.price, qty, size, color }];
        });
        setCartOpen(true);
    };

    const updateQty = (index, delta) =>
        setCart((prev) =>
            prev
                .map((it, i) => (i === index ? { ...it, qty: Math.max(1, it.qty + delta) } : it))
        );

    const removeItem = (index) => setCart((prev) => prev.filter((_, i) => i !== index));

    const submitOrder = (e) => {
        e.preventDefault();
        const order = placeOrder(shop.id, cart, form);
        setCart([]);
        setCheckout(false);
        setCartOpen(false);
        setOrderPlaced(order);
    };

    if (!shop) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700">Store not found.</p>
                    <Link to="/panel" className="mt-2 inline-block text-purple-600 hover:underline">Back to admin</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Store header */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
                    <Link to={`/shop/${shop.slug}`} className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm shadow" style={{ backgroundColor: accent }}>
                            {shop.logo || 'ST'}
                        </span>
                        <span className="font-bold text-lg tracking-wide">{shop.name}</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-5 ml-8 text-sm font-medium text-gray-600">
                        <Link to={`/shop/${shop.slug}`} className="hover:text-gray-900">Home</Link>
                        <Link to={`/shop/${shop.slug}`} className="hover:text-gray-900">Shop All</Link>
                    </nav>
                    <button onClick={() => setCartOpen(true)} className="ml-auto relative p-2.5 rounded-lg hover:bg-gray-100" title="Cart">
                        <ShoppingBag size={21} />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-0.5 rounded-full text-white text-[11px] font-bold flex items-center justify-center" style={{ backgroundColor: accent }}>
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <main>
                <Outlet context={{ shop, accent, addToCart }} />
            </main>

            <footer className="border-t border-gray-100 py-8 mt-12">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
                    <p>© 2025 {shop.name}. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1.5"><Truck size={15} /> Fast delivery</span>
                        <span className="inline-flex items-center gap-1.5"><ShieldCheck size={15} /> Secure checkout</span>
                    </div>
                </div>
            </footer>

            {/* Cart drawer */}
            {cartOpen && (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-gray-900/50" onClick={() => setCartOpen(false)} />
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-800">Your Cart ({cartCount})</h3>
                            <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X size={18} /></button>
                        </div>
                        {orderPlaced ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                <CheckCircle2 size={48} className="text-emerald-500 mb-3" />
                                <h4 className="text-lg font-bold text-gray-800">Order placed!</h4>
                                <p className="text-sm text-gray-500 mt-1">Order <span className="font-mono font-medium">{orderPlaced.id}</span> confirmed for {shop.name}. We'll email you the details.</p>
                                <button onClick={() => setOrderPlaced(null)} className="mt-6 px-5 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: accent }}>Continue shopping</button>
                            </div>
                        ) : cart.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                                <ShoppingBag size={40} className="text-gray-300 mb-3" />
                                <p className="text-gray-500">Your cart is empty.</p>
                            </div>
                        ) : checkout ? (
                            <form onSubmit={submitOrder} className="flex-1 flex flex-col p-5">
                                <h4 className="font-semibold text-gray-800 mb-4">Checkout</h4>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name *</label>
                                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:border-purple-400" placeholder="Jane Doe" />
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:border-purple-400" placeholder="jane@example.com" />
                                <div className="mt-auto space-y-3">
                                    <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium">${subtotal}</span></div>
                                    <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Delivery</span><span className="font-medium">Free</span></div>
                                    <div className="flex items-center justify-between font-semibold"><span>Total</span><span>${subtotal}</span></div>
                                    <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: accent }}>
                                        <CreditCard size={17} /> Place Order
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                                    {cart.map((it, i) => (
                                        <div key={i} className="flex gap-3">
                                            <span className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center text-2xl shrink-0">{it.emoji}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-800 text-sm">{it.name}</p>
                                                <p className="text-xs text-gray-400">{it.size && `Size ${it.size} · `}{it.color && `${it.color}`}</p>
                                                <p className="text-sm text-gray-700 mt-0.5">${it.price} × {it.qty}</p>
                                            </div>
                                            <div className="flex flex-col items-end justify-between">
                                                <button onClick={() => removeItem(i)} className="p-1 text-red-400 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                                                <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg">
                                                    <button onClick={() => updateQty(i, -1)} className="p-1 text-gray-500 hover:text-gray-800"><Minus size={13} /></button>
                                                    <span className="w-5 text-center text-sm">{it.qty}</span>
                                                    <button onClick={() => updateQty(i, 1)} className="p-1 text-gray-500 hover:text-gray-800"><Plus size={13} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 p-5 space-y-3">
                                    <div className="flex items-center justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold">${subtotal}</span></div>
                                    <button onClick={() => setCheckout(true)} className="w-full px-4 py-3 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: accent }}>
                                        Checkout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StorefrontLayout;