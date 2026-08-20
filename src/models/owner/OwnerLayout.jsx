import { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, BadgePercent, Store,
    ExternalLink, ShieldCheck, X, Menu, Search, Palette, Settings,
    Users
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import ToastContainer from '../../components/common/ToastContainer';
import GlobalSearchModal from '../../components/common/GlobalSearchModal';
import DemoRoleBar from '../../components/common/DemoRoleBar';

const OwnerLayout = () => {
    const location = useLocation();
    const { shops, currentAuthUser, setIsGlobalSearchOpen } = useStore();

    // Default to the shop matching user's shopId, or first active shop
    const [shopId, setShopId] = useState(() => {
        if (currentAuthUser?.shopId && currentAuthUser.shopId !== 'ALL') {
            const found = shops.find((s) => s.id === currentAuthUser.shopId);
            if (found) return found.id;
        }
        const active = shops.find((s) => s.status === 'Active') || shops[0];
        return active ? active.id : '';
    });

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const shop = shops.find((s) => s.id === shopId) || shops[0] || null;

    // Detect if we're on /owner or /panel/owner
    const basePath = location.pathname.startsWith('/panel/owner') ? '/panel/owner' : '/owner';

    const navItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: basePath, end: true },
        { name: 'Theme & Template Studio', icon: <Palette size={18} />, path: `${basePath}/themes` },
        { name: 'Products & Inventory', icon: <Package size={18} />, path: `${basePath}/products` },
        { name: 'Customer Orders', icon: <ShoppingCart size={18} />, path: `${basePath}/orders` },
        { name: 'Customer CRM & VIP', icon: <Users size={18} />, path: `${basePath}/customers` },
        { name: 'Discounts & Promo Codes', icon: <BadgePercent size={18} />, path: `${basePath}/discounts` },
        { name: 'Store Settings & Brand', icon: <Settings size={18} />, path: `${basePath}/settings` },
    ];

    if (!shop) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
                <DemoRoleBar />
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md">
                    <Store size={40} className="mx-auto text-indigo-600 mb-3" />
                    <h2 className="text-xl font-bold text-slate-800">No Boutique Authorized</h2>
                    <p className="text-sm text-slate-500 mt-1 mb-6">You need an approved boutique store to access this portal.</p>
                    <Link to="/signup" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow">
                        Register Brand Store
                    </Link>
                </div>
            </div>
        );
    }

    const accent = shop.accent || '#6366f1';

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <DemoRoleBar />
            <GlobalSearchModal />
            <ToastContainer />

            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Left Fixed Merchant Sidebar */}
            <aside
                className={`
                    fixed top-10 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200
                    flex flex-col justify-between transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div>
                    {/* Brand Header */}
                    <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            <span
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm shrink-0"
                                style={{ backgroundColor: accent }}
                            >
                                {shop.logo || 'ST'}
                            </span>
                            <div className="leading-tight min-w-0">
                                <p className="font-extrabold text-slate-900 text-sm truncate">{shop.name}</p>
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                                    {shop.plan} Plan
                                </span>
                            </div>
                        </div>

                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="md:hidden p-1.5 text-slate-400 hover:text-slate-900 rounded-lg"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="p-3 space-y-1 overflow-y-auto">
                        <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Merchant Operations
                        </p>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.end}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150
                                    ${isActive
                                        ? 'text-white shadow-md shadow-indigo-500/20'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                                `}
                                style={({ isActive }) => (isActive ? { backgroundColor: accent, color: '#fff' } : undefined)}
                            >
                                <span className="shrink-0">{item.icon}</span>
                                <span className="truncate">{item.name}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Bottom: Owner Info Card */}
                <div className="border-t border-slate-100 p-3 bg-slate-50/50 space-y-2">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                            {shop.ownerName?.slice(0, 2).toUpperCase() || 'OW'}
                        </div>
                        <div className="leading-tight min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-900 truncate">{shop.ownerName}</p>
                            <p className="text-[10px] text-slate-400 truncate">{shop.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Right Main Column (offset by sidebar width) */}
            <div className="transition-all duration-300 md:pl-64 flex flex-col min-h-[calc(100vh-2.5rem)]">
                
                {/* Sticky Merchant Top Navbar */}
                <header className="sticky top-10 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs flex items-center justify-between px-4 sm:px-6">
                    
                    {/* Left: Hamburger on mobile + Switch Store Selector */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title="Open menu"
                        >
                            <Menu size={19} />
                        </button>

                        <div className="hidden sm:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5">
                            <span className="text-xs font-semibold text-slate-500">Store:</span>
                            <select
                                value={shop.id}
                                onChange={(e) => setShopId(e.target.value)}
                                className="bg-transparent text-xs font-bold text-slate-800 cursor-pointer focus:outline-none pr-2"
                            >
                                {shops.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.status})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Right: Search, Live Storefront & Super Admin buttons */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => setIsGlobalSearchOpen(true)}
                            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition hidden sm:flex items-center gap-1.5 text-xs font-semibold"
                        >
                            <Search size={15} /> Search (⌘K)
                        </button>

                        <Link
                            to={`/shop/${shop.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition border border-slate-200 shadow-xs"
                        >
                            <Store size={14} className="text-indigo-600" />
                            <span className="hidden sm:inline">Live Storefront</span>
                            <ExternalLink size={12} className="text-slate-400" />
                        </Link>

                        <Link
                            to="/panel"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition active:scale-95"
                            style={{ backgroundColor: accent }}
                        >
                            <ShieldCheck size={14} />
                            <span className="hidden sm:inline">Super Admin</span>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <Outlet context={{ shop, accent }} />
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;