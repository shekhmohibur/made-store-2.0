import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, Store, PlusCircle, Users, Settings,
    X, Clock, LogOut, ShoppingCart, TrendingUp,
    Megaphone, ShieldCheck, Database
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const Sidebar = ({ isMobileOpen, onCloseMobile, isCollapsed }) => {
    const { shops, users, orders, logout } = useStore();

    const pendingCount = shops.filter((s) => s.status === 'Pending').length;
    const pendingOrderCount = orders.filter((o) => o.paymentStatus === 'Pending Verification' || (o.trxId && o.paymentStatus !== 'Paid')).length;

    const navItems = [
        { to: '/panel', label: 'Dashboard', icon: LayoutDashboard, end: true },
        {
            to: '/panel/approvals',
            label: 'Approvals Queue',
            icon: Clock,
            badge: pendingCount > 0 ? String(pendingCount) : null,
            badgeColor: 'bg-amber-500 text-slate-950 font-black',
        },
        {
            to: '/panel/orders',
            label: 'Global Orders',
            icon: ShoppingCart,
            badge: pendingOrderCount > 0 ? String(pendingOrderCount) : (orders.length > 0 ? String(orders.length) : null),
            badgeColor: pendingOrderCount > 0 ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-700 text-slate-200',
        },
        {
            to: '/panel/shops',
            label: 'Clothing Shops',
            icon: Store,
            badge: String(shops.length),
        },
        { to: '/panel/analytics', label: 'Analytics & Financials', icon: TrendingUp },
        { to: '/panel/announcements', label: 'Broadcast Notices', icon: Megaphone },
        { to: '/panel/create-shop', label: 'Provision Boutique', icon: PlusCircle },
        {
            to: '/panel/users',
            label: 'Users & Roles',
            icon: Users,
            badge: String(users.length),
        },
        { to: '/panel/audit', label: 'Security & Audit Logs', icon: ShieldCheck },
        { to: '/panel/database', label: 'Database Studio', icon: Database },
        { to: '/panel/settings', label: 'Platform Settings', icon: Settings },
    ];

    const linkBase =
        'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all group relative';
    const linkActive =
        'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25';
    const linkInactive =
        'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80';

    return (
        <>
            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onCloseMobile}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`
                    fixed top-0 bottom-0 left-0 z-40
                    bg-slate-900 border-r border-slate-800 text-slate-200
                    flex flex-col justify-between transition-all duration-300 ease-in-out
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isCollapsed ? 'w-20' : 'w-64'}
                `}
            >
                {/* Top Brand Header */}
                <div>
                    <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
                        <NavLink to="/panel" className="flex items-center gap-3 group">
                            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform shrink-0">
                                T
                            </span>
                            {!isCollapsed && (
                                <div className="leading-tight overflow-hidden">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-extrabold text-sm tracking-tight text-white">Trivora Admin</span>
                                        <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-md border border-indigo-500/30">
                                            v2.0
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 font-medium">Fashion Cloud & Boutique OS</p>
                                </div>
                            )}
                        </NavLink>

                        {/* Mobile close */}
                        <button
                            onClick={onCloseMobile}
                            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="p-3.5 space-y-1.5">
                        {!isCollapsed && (
                            <p className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                                SaaS Management
                            </p>
                        )}
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    end={item.end}
                                    onClick={onCloseMobile}
                                    className={({ isActive }) =>
                                        `${linkBase} ${isActive ? linkActive : linkInactive} ${isCollapsed ? 'justify-center px-0' : ''}`
                                    }
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <Icon size={18} className="shrink-0 group-hover:scale-110 transition-transform" />
                                    {!isCollapsed && (
                                        <>
                                            <span className="flex-1 truncate">{item.label}</span>
                                            {item.badge && (
                                                <span
                                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                        item.badgeColor || 'bg-slate-800 text-slate-300'
                                                    }`}
                                                >
                                                    {item.badge}
                                                </span>
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Quick Tenant Switcher */}
                <div className="p-3.5 border-t border-slate-800 space-y-2">
                    {!isCollapsed ? (
                        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-400">Active Tenants</span>
                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                                    {shops.filter((s) => s.status === 'Active').length} Live
                                </span>
                            </div>

                            <div className="space-y-1">
                                {shops.slice(0, 3).map((s) => (
                                    <NavLink
                                        key={s.id}
                                        to={`/shop/${s.slug}`}
                                        target="_blank"
                                        className="flex items-center justify-between text-xs p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition group"
                                    >
                                        <span className="truncate flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.accent }} />
                                            {s.name}
                                        </span>
                                        <span className="text-[10px] text-slate-500 group-hover:text-indigo-400">↗</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" title="Platform Operational" />
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={() => logout()}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/15 border border-rose-500/20 transition ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title="Sign Out Session"
                    >
                        <LogOut size={15} />
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;