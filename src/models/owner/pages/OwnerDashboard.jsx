import { Link, useOutletContext } from 'react-router-dom';
import {
    Package, ShoppingCart, DollarSign, AlertTriangle, ArrowUpRight,
    Plus, TrendingUp, CheckCircle2, Store
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const STATUS_BADGE = {
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const ORDER_STATUS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const OwnerDashboard = () => {
    const { shop, accent } = useOutletContext();
    const { getShopOrders, updateOrderStatus, updateProductStock } = useStore();

    const orders = getShopOrders(shop.id);
    const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
    const lowStockProducts = (shop.products || []).filter((p) => Number(p.stock) <= 15);

    const stats = [
        {
            label: 'Total Boutique Revenue',
            value: `$${revenue.toLocaleString()}`,
            icon: <DollarSign size={22} />,
            to: '/panel/owner/orders',
            delta: '+14.2%',
        },
        {
            label: 'Total Orders Received',
            value: orders.length,
            icon: <ShoppingCart size={22} />,
            to: '/panel/owner/orders',
            delta: '+8.5%',
        },
        {
            label: 'Active Fashion Styles',
            value: shop.products?.length || 0,
            icon: <Package size={22} />,
            to: '/panel/owner/products',
            delta: `${shop.products?.length || 0} styles`,
        },
        {
            label: 'Low Stock Inventory',
            value: lowStockProducts.length,
            icon: <AlertTriangle size={22} />,
            to: '/panel/owner/products',
            delta: lowStockProducts.length > 0 ? 'Requires attention' : 'Optimal',
            isWarning: lowStockProducts.length > 0,
        },
    ];

    return (
        <div className="space-y-6">
            
            {/* Top Welcome Banner */}
            <div
                className="rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${accent}, #1e1b4b)` }}
            >
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-2 border border-white/20">
                        <Store size={13} /> {shop.plan} Tier Merchant Portal
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{shop.name} Control Center</h1>
                    <p className="text-sm text-white/80 mt-1 max-w-xl">
                        Welcome back, {shop.ownerName}. Track your incoming boutique orders, adjust clothing stock, and manage promotions.
                    </p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <Link
                        to="/panel/owner/products"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm shadow-lg hover:bg-slate-50 transition active:scale-95"
                    >
                        <Plus size={18} /> Add New Apparel Style
                    </Link>
                </div>
            </div>

            {/* Published Live Subdomain & Domain Routing Hub */}
            <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <span className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg shrink-0">
                        🌐
                    </span>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">Published Merchant Subdomain:</span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <CheckCircle2 size={11} /> Live & Active
                            </span>
                        </div>
                        <a
                            href={`https://${shop.slug}.trivora.top`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm sm:text-base font-extrabold text-white hover:text-indigo-300 transition font-mono flex items-center gap-1.5 mt-0.5 break-all"
                        >
                            <span>https://{shop.slug}.trivora.top</span>
                            <ArrowUpRight size={15} className="text-indigo-400 shrink-0" />
                        </a>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-0.5 break-all">
                            Owner Portal: <span className="text-slate-200 font-bold">https://{shop.slug}.trivora.top/owner</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
                    <a
                        href={`https://${shop.slug}.trivora.top`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                    >
                        <span>Open Customer Store</span>
                        <ArrowUpRight size={14} />
                    </a>
                    <Link
                        to={`/shop/${shop.slug}`}
                        className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl text-center transition"
                    >
                        Direct Preview
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                {stats.map((s, i) => (
                    <Link
                        key={i}
                        to={s.to}
                        className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between">
                            <span
                                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform"
                                style={{ backgroundColor: accent }}
                            >
                                {s.icon}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 py-1 rounded-full border ${s.isWarning ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                                <TrendingUp size={13} /> {s.delta}
                            </span>
                        </div>
                        <div className="mt-3 sm:mt-4">
                            <p className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{s.value}</p>
                            <p className="text-xs font-semibold text-slate-500 mt-1">{s.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Low Stock Alerts & Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Recent Customer Orders</h3>
                            <p className="text-[11px] sm:text-xs text-slate-500">Manage fulfillment & delivery status</p>
                        </div>
                        <Link
                            to="/panel/owner/orders"
                            className="text-xs font-bold hover:underline shrink-0"
                            style={{ color: accent }}
                        >
                            View all ({orders.length}) →
                        </Link>
                    </div>

                    {orders.length === 0 ? (
                        <div className="p-8 sm:p-12 text-center text-slate-400">
                            <ShoppingCart size={36} className="mx-auto mb-2 opacity-30 text-indigo-400" />
                            <p className="font-semibold text-slate-700">No orders received yet</p>
                            <p className="text-xs text-slate-400 mt-1">Share your storefront link to start generating sales.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-sm min-w-[560px]">
                                <thead>
                                    <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/80">
                                        <th className="px-4 sm:px-6 py-3">Order ID</th>
                                        <th className="px-4 sm:px-6 py-3">Customer</th>
                                        <th className="px-4 sm:px-6 py-3">Items</th>
                                        <th className="px-4 sm:px-6 py-3">Total</th>
                                        <th className="px-4 sm:px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {orders.slice(0, 5).map((o) => (
                                        <tr key={o.id} className="hover:bg-slate-50/70 transition">
                                            <td className="px-4 sm:px-6 py-3 font-mono font-bold text-xs text-slate-800">{o.id}</td>
                                            <td className="px-4 sm:px-6 py-3">
                                                <p className="font-semibold text-slate-900 text-xs">{o.customer}</p>
                                                <p className="text-[11px] text-slate-400">{o.email}</p>
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 text-xs text-slate-600">
                                                {o.items?.length || 1} item(s)
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 font-bold text-slate-900">${o.total}</td>
                                            <td className="px-4 sm:px-6 py-3">
                                                <select
                                                    value={o.status}
                                                    onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                    className={`text-xs font-bold rounded-xl px-2.5 py-1 border cursor-pointer focus:outline-none ${STATUS_BADGE[o.status] || 'bg-slate-100 text-slate-700'}`}
                                                >
                                                    {ORDER_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Low Stock Warning Card with 1-Click Restock */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-500" />
                            <h3 className="font-bold text-slate-900">Low Stock Alert</h3>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                            {lowStockProducts.length} items
                        </span>
                    </div>

                    {lowStockProducts.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                            <CheckCircle2 size={36} className="text-emerald-500 mb-2" />
                            <p className="font-bold text-slate-800">All styles in healthy stock!</p>
                            <p className="text-xs text-slate-400 mt-1">No items currently below 15 units.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 flex-1 overflow-y-auto max-h-80 pr-1">
                            {lowStockProducts.map((p) => (
                                <div
                                    key={p.id}
                                    className="p-3 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-3"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shrink-0 shadow-sm">
                                            {p.emoji}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="font-bold text-xs text-slate-900 truncate">{p.name}</p>
                                            <p className="text-[11px] font-bold text-rose-600">
                                                {p.stock === 0 ? 'Out of Stock' : `Only ${p.stock} units left`}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => updateProductStock(shop.id, p.id, 10)}
                                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-xs font-bold text-indigo-600 shadow-sm transition active:scale-95 shrink-0"
                                        title="Add 10 units"
                                    >
                                        +10 Stock
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Link
                        to="/panel/owner/products"
                        className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 hover:underline"
                    >
                        <span>Manage full inventory catalog</span>
                        <ArrowUpRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;