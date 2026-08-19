import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BadgePercent, Store, ExternalLink, ShieldCheck, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/useStore';

const OwnerLayout = () => {
    const { shops } = useStore();
    const [shopId, setShopId] = useState(() => {
        const active = shops.find((s) => s.status === 'Active') || shops[0];
        return active ? active.id : '';
    });

    const shop = shops.find((s) => s.id === shopId) || shops[0] || null;

    const navItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={19} />, path: '/panel/owner', end: true },
        { name: 'Products & Inventory', icon: <Package size={19} />, path: '/panel/owner/products' },
        { name: 'Orders', icon: <ShoppingCart size={19} />, path: '/panel/owner/orders' },
        { name: 'Discounts & Coupons', icon: <BadgePercent size={19} />, path: '/panel/owner/discounts' },
    ];

    if (!shop) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-700">No shop provisioned yet.</p>
                    <Link to="/panel/create-shop" className="mt-2 inline-block text-purple-600 hover:underline">Create one in the admin panel</Link>
                </div>
            </div>
        );
    }

    const accent = shop.accent || '#7c3aed';

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center px-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-black text-sm shadow" style={{ backgroundColor: accent }}>
                        {shop.logo || 'ST'}
                    </span>
                    <div className="leading-tight">
                        <p className="font-bold text-gray-800">{shop.name}</p>
                        <p className="text-[11px] text-gray-400">Owner Panel · {shop.plan} plan</p>
                    </div>
                </div>

                <div className="ml-6 hidden md:flex items-center gap-2">
                    <span className="text-sm text-gray-500">Managing:</span>
                    <div className="relative">
                        <select
                            value={shop.id}
                            onChange={(e) => setShopId(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:border-purple-400"
                        >
                            {shops.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <Link to={`/shop/${shop.slug}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
                        <Store size={16} /> <span className="hidden sm:inline">View Store</span> <ExternalLink size={14} />
                    </Link>
                    <Link to="/panel" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
                        <ShieldCheck size={16} /> <span className="hidden sm:inline">Admin</span>
                    </Link>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="hidden md:flex sticky top-16 self-start h-[calc(100vh-4rem)] w-60 shrink-0 flex-col border-r border-gray-200 bg-white">
                    <nav className="flex-1 p-3 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                                style={({ isActive }) => isActive ? { backgroundColor: accent, color: '#fff' } : undefined}
                            >
                                <span className="shrink-0">{item.icon}</span>
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="border-t border-gray-200 p-3">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                                {shop.ownerName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || 'MG'}
                            </div>
                            <div className="leading-tight min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{shop.ownerName}</p>
                                <p className="text-xs text-gray-400 truncate">{shop.email}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Mobile nav */}
                <div className="md:hidden w-full">
                    <nav className="sticky top-16 z-30 bg-white border-b border-gray-200 px-2 py-2 flex gap-1 overflow-x-auto">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) => `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-600'}`}
                                style={({ isActive }) => isActive ? { backgroundColor: accent } : undefined}
                            >
                                {item.icon}{item.name.split(' ')[0]}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Main */}
                    <main className="p-4 sm:p-6">
                        <Outlet context={{ shop, accent }} />
                    </main>
                </div>

                {/* Main (desktop) */}
                <main className="hidden md:block flex-1 p-4 sm:p-6">
                    <Outlet context={{ shop, accent }} />
                </main>
            </div>
        </div>
    );
};

export default OwnerLayout;