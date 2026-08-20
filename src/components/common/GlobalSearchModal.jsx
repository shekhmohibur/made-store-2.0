import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Store, ShoppingBag, User, Settings, ArrowRight, X, Sparkles, ExternalLink } from 'lucide-react';
import { useStore } from '../../store/useStore';

const GlobalSearchModal = () => {
    const { isGlobalSearchOpen, setIsGlobalSearchOpen, shops, users } = useStore();
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    // Listen for Ctrl+K or Cmd+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsGlobalSearchOpen((prev) => !prev);
            }
            if (e.key === 'Escape' && isGlobalSearchOpen) {
                setIsGlobalSearchOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isGlobalSearchOpen, setIsGlobalSearchOpen]);

    if (!isGlobalSearchOpen) return null;

    const q = query.toLowerCase().trim();

    // Search Results
    const matchedShops = shops.filter((s) => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q) || s.ownerName.toLowerCase().includes(q));
    
    const allProducts = shops.flatMap((s) => s.products.map((p) => ({ ...p, shopName: s.name, shopSlug: s.slug })));
    const matchedProducts = allProducts.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

    const matchedUsers = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));

    const quickPages = [
        { label: 'Admin Dashboard', path: '/panel', icon: <Store size={16} /> },
        { label: 'Manage Clothing Shops', path: '/panel/shops', icon: <Store size={16} /> },
        { label: 'Create New Shop', path: '/panel/create-shop', icon: <Sparkles size={16} /> },
        { label: 'User & Owners Directory', path: '/panel/users', icon: <User size={16} /> },
        { label: 'Platform Settings', path: '/panel/settings', icon: <Settings size={16} /> },
        { label: 'Owner Panel', path: '/panel/owner', icon: <ShoppingBag size={16} /> },
        { label: 'Dress Shop Viral Page', path: '/dress-shop', icon: <ShoppingBag size={16} /> },
    ].filter((p) => p.label.toLowerCase().includes(q));

    const handleSelect = (path) => {
        setIsGlobalSearchOpen(false);
        setQuery('');
        navigate(path);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-20 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsGlobalSearchOpen(false)}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
                >
                    {/* Input Header */}
                    <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
                        <Search size={20} className="text-slate-400 shrink-0 mr-3" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Type a command, shop, product, or user..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-transparent text-slate-800 text-sm placeholder-slate-400 focus:outline-none"
                        />
                        <div className="flex items-center gap-1.5 ml-2">
                            <span className="text-[11px] font-medium bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">ESC</span>
                            <button
                                onClick={() => setIsGlobalSearchOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Results Container */}
                    <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 text-sm">
                        {/* Quick Pages */}
                        {quickPages.length > 0 && (
                            <div>
                                <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Navigation</p>
                                <div className="space-y-0.5">
                                    {quickPages.slice(0, 4).map((page) => (
                                        <button
                                            key={page.path}
                                            onClick={() => handleSelect(page.path)}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition text-left"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className="text-slate-400 group-hover:text-indigo-500">{page.icon}</span>
                                                <span className="font-medium">{page.label}</span>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-300" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tenant Shops */}
                        {matchedShops.length > 0 && (
                            <div>
                                <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tenant Shops</p>
                                <div className="space-y-0.5">
                                    {matchedShops.slice(0, 4).map((shop) => (
                                        <div
                                            key={shop.id}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                                        >
                                            <div
                                                onClick={() => handleSelect(`/shop/${shop.slug}`)}
                                                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                                            >
                                                <span
                                                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                                                    style={{ backgroundColor: shop.accent || '#6366f1' }}
                                                >
                                                    {shop.logo}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-slate-800 truncate">{shop.name}</p>
                                                    <p className="text-xs text-slate-400 truncate">Owner: {shop.ownerName} · {shop.products.length} products</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleSelect(`/panel/owner`)}
                                                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium"
                                                >
                                                    Owner
                                                </button>
                                                <button
                                                    onClick={() => handleSelect(`/shop/${shop.slug}`)}
                                                    className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium flex items-center gap-1"
                                                >
                                                    Store <ExternalLink size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Products */}
                        {matchedProducts.length > 0 && (
                            <div>
                                <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Products & Catalog</p>
                                <div className="space-y-0.5">
                                    {matchedProducts.slice(0, 4).map((prod) => (
                                        <button
                                            key={prod.id}
                                            onClick={() => handleSelect(`/shop/${prod.shopSlug}/product/${prod.id}`)}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition text-left"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg shrink-0">
                                                    {prod.emoji}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-800 truncate">{prod.name}</p>
                                                    <p className="text-xs text-slate-400 truncate">${prod.price} · in {prod.shopName} ({prod.category})</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">${prod.price}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Users */}
                        {matchedUsers.length > 0 && (
                            <div>
                                <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Users</p>
                                <div className="space-y-0.5">
                                    {matchedUsers.slice(0, 3).map((u) => (
                                        <button
                                            key={u.id}
                                            onClick={() => handleSelect('/panel/users')}
                                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                                                    {u.avatar}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-800">{u.name}</p>
                                                    <p className="text-xs text-slate-400">{u.email} · {u.role}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-slate-500">{u.status}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {matchedShops.length === 0 && matchedProducts.length === 0 && matchedUsers.length === 0 && quickPages.length === 0 && (
                            <div className="py-8 text-center text-slate-400">
                                <Search size={28} className="mx-auto mb-2 opacity-40" />
                                <p>No matching results for "{query}"</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                            <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono text-[10px]">↵</kbd> to select</span>
                            <span><kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono text-[10px]">ESC</kbd> to close</span>
                        </div>
                        <span className="font-medium text-indigo-600">Kaizer Search</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GlobalSearchModal;
