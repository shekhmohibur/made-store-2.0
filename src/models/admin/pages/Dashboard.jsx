import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Store, ShoppingCart, DollarSign, TrendingUp, Plus,
    Package, Sparkles, ChevronRight, Activity, Megaphone,
    ShieldCheck, Database
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { formatCurrency } from '../../../utils/currency';

const Dashboard = () => {
    const { shops, orders, activities, activeCurrency, showToast } = useStore();
    const [timeframe, setTimeframe] = useState('30D');
    const [chartMetric, setChartMetric] = useState('revenue');
    const [hoveredBar, setHoveredBar] = useState(null);

    // Calculate real dynamic platform metrics
    const totalShops = shops.length;
    const totalProducts = shops.reduce((acc, s) => acc + (s.products?.length || 0), 0);
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00';

    const pendingOrdersCount = orders.filter((o) => o.paymentStatus === 'Pending Verification' || (o.trxId && o.paymentStatus !== 'Paid')).length;

    const stats = [
        {
            label: 'Total Platform GMV',
            value: formatCurrency(totalRevenue, activeCurrency),
            delta: '+18.4%',
            icon: <DollarSign size={22} />,
            color: 'from-emerald-500 to-teal-600',
            sub: 'Across all tenant shops',
            link: '/panel/analytics',
        },
        {
            label: 'Active Clothing Shops',
            value: totalShops,
            delta: `+${totalShops}`,
            icon: <Store size={22} />,
            color: 'from-indigo-500 to-purple-600',
            sub: 'SaaS multi-tenant boutiques',
            link: '/panel/shops',
        },
        {
            label: 'Total Orders Processed',
            value: totalOrders,
            delta: pendingOrdersCount > 0 ? `${pendingOrdersCount} pending verif` : '+12.1%',
            icon: <ShoppingCart size={22} />,
            color: 'from-blue-500 to-cyan-600',
            sub: 'Avg ' + formatCurrency(Number(avgOrderValue), activeCurrency) + ' / order',
            link: '/panel/orders',
        },
        {
            label: 'Catalog Items Listed',
            value: totalProducts,
            delta: '+9.5%',
            icon: <Package size={22} />,
            color: 'from-amber-500 to-orange-600',
            sub: 'Fashion & apparel inventory',
            link: '/panel/shops',
        },
    ];

    // Real Live Data for Chart dynamically calculated from actual orders
    const getRealChartData = () => {
        if (timeframe === '7D') {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const today = new Date();
            const last7 = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const dayLabel = days[d.getDay()];
                const dateKey = d.toISOString().slice(0, 10);
                const dayOrders = orders.filter((o) => (o.date || o.created_at || '').startsWith(dateKey));
                const dayRev = dayOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
                last7.push({ label: dayLabel, revenue: dayRev, orders: dayOrders.length });
            }
            return last7;
        }

        if (timeframe === '30D') {
            const weeks = [
                { label: 'Wk 1', revenue: 0, orders: 0 },
                { label: 'Wk 2', revenue: 0, orders: 0 },
                { label: 'Wk 3', revenue: 0, orders: 0 },
                { label: 'Wk 4', revenue: 0, orders: 0 },
            ];
            const now = Date.now();
            orders.forEach((o) => {
                const orderTime = o.created_at ? new Date(o.created_at).getTime() : (o.date ? new Date(o.date).getTime() : now);
                const diffDays = Math.floor((now - orderTime) / (1000 * 60 * 60 * 24));
                if (diffDays <= 7) {
                    weeks[3].revenue += Number(o.total) || 0;
                    weeks[3].orders += 1;
                } else if (diffDays <= 14) {
                    weeks[2].revenue += Number(o.total) || 0;
                    weeks[2].orders += 1;
                } else if (diffDays <= 21) {
                    weeks[1].revenue += Number(o.total) || 0;
                    weeks[1].orders += 1;
                } else if (diffDays <= 30) {
                    weeks[0].revenue += Number(o.total) || 0;
                    weeks[0].orders += 1;
                }
            });
            return weeks;
        }

        // 12M
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonthIdx = new Date().getMonth();
        const lastMonths = [];
        for (let i = 11; i >= 0; i--) {
            const mIdx = (currentMonthIdx - i + 12) % 12;
            const mName = months[mIdx];
            const mOrders = orders.filter((o) => {
                if (!o.created_at && !o.date) return false;
                const d = new Date(o.created_at || o.date);
                return d.getMonth() === mIdx;
            });
            const mRev = mOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
            lastMonths.push({ label: mName, revenue: mRev, orders: mOrders.length });
        }
        return lastMonths;
    };

    const chartData = getRealChartData();
    const maxVal = Math.max(...chartData.map((d) => (chartMetric === 'revenue' ? d.revenue : d.orders))) || 1;

    // Calculate shop leaderboard
    const shopLeaderboard = shops.map((s) => {
        const shopOrders = orders.filter((o) => o.shopId === s.id);
        const shopRev = shopOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
        return {
            ...s,
            orderCount: shopOrders.length,
            revenue: shopRev,
        };
    }).sort((a, b) => b.revenue - a.revenue);

    return (
        <div className="space-y-6">
            
            {/* Header with Welcome banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-md mb-2 border border-white/10">
                        <Sparkles size={13} /> Platform Intelligence Center
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Welcome back, Super Admin 👋</h1>
                    <p className="text-sm text-indigo-200 mt-1 max-w-xl">
                        Here is the live performance overview across your {totalShops} boutique tenants, active inventory, and customer orders.
                    </p>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                    <Link
                        to="/panel/create-shop"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-900 font-bold text-sm shadow-lg hover:bg-indigo-50 active:scale-95 transition"
                    >
                        <Plus size={18} /> Provision New Shop
                    </Link>
                </div>
                {/* Subtle background glow circle */}
                <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
            </div>

            {/* Quick Action Navigation Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <Link to="/panel/orders" className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm hover:border-indigo-300 transition flex items-center gap-2.5 text-xs font-bold text-slate-800">
                    <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600"><ShoppingCart size={15} /></span>
                    <div>
                        <p className="truncate">Global Orders</p>
                        <p className="text-[10px] text-slate-400 font-normal">{orders.length} total</p>
                    </div>
                </Link>
                <Link to="/panel/analytics" className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm hover:border-emerald-300 transition flex items-center gap-2.5 text-xs font-bold text-slate-800">
                    <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><TrendingUp size={15} /></span>
                    <div>
                        <p className="truncate">Analytics</p>
                        <p className="text-[10px] text-slate-400 font-normal">GMV & Take Rate</p>
                    </div>
                </Link>
                <Link to="/panel/announcements" className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm hover:border-purple-300 transition flex items-center gap-2.5 text-xs font-bold text-slate-800">
                    <span className="p-2 rounded-xl bg-purple-50 text-purple-600"><Megaphone size={15} /></span>
                    <div>
                        <p className="truncate">Broadcasts</p>
                        <p className="text-[10px] text-slate-400 font-normal">System Notices</p>
                    </div>
                </Link>
                <Link to="/panel/audit" className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm hover:border-amber-300 transition flex items-center gap-2.5 text-xs font-bold text-slate-800">
                    <span className="p-2 rounded-xl bg-amber-50 text-amber-600"><ShieldCheck size={15} /></span>
                    <div>
                        <p className="truncate">Audit Logs</p>
                        <p className="text-[10px] text-slate-400 font-normal">Security Trail</p>
                    </div>
                </Link>
                <Link to="/panel/database" className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm hover:border-blue-300 transition flex items-center gap-2.5 text-xs font-bold text-slate-800 col-span-2 sm:col-span-1">
                    <span className="p-2 rounded-xl bg-blue-50 text-blue-600"><Database size={15} /></span>
                    <div>
                        <p className="truncate">Database</p>
                        <p className="text-[10px] text-slate-400 font-normal">MySQL Studio</p>
                    </div>
                </Link>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                {stats.map((s, i) => (
                    <Link
                        key={i}
                        to={s.link}
                        className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group block"
                    >
                        <div className="flex items-center justify-between">
                            <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                                {s.icon}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                <TrendingUp size={13} /> {s.delta}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">{s.value}</p>
                            <p className="text-sm font-semibold text-slate-600 mt-0.5">{s.label}</p>
                            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Interactive Analytics Chart & Activity Feed */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Revenue Chart Visualizer */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Platform Growth & Revenue</h3>
                            <p className="text-xs text-slate-500">Live multi-tenant transaction telemetry</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-xs font-semibold">
                                <button
                                    onClick={() => setChartMetric('revenue')}
                                    className={`px-3 py-1.5 rounded-lg transition ${chartMetric === 'revenue' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    Revenue ($)
                                </button>
                                <button
                                    onClick={() => setChartMetric('orders')}
                                    className={`px-3 py-1.5 rounded-lg transition ${chartMetric === 'orders' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    Orders
                                </button>
                            </div>
                            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-xs font-semibold">
                                {['7D', '30D', '12M'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTimeframe(t)}
                                        className={`px-2.5 py-1.5 rounded-lg transition ${timeframe === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Chart Bars */}
                    <div className="flex-1 flex flex-col justify-end min-h-[220px]">
                        <div className="flex items-end gap-3 h-52 pt-6">
                            {chartData.map((d, i) => {
                                const val = chartMetric === 'revenue' ? d.revenue : d.orders;
                                const pct = Math.max(15, (val / maxVal) * 100);
                                const isHov = hoveredBar === i;
                                return (
                                    <div
                                        key={i}
                                        onMouseEnter={() => setHoveredBar(i)}
                                        onMouseLeave={() => setHoveredBar(null)}
                                        className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
                                    >
                                        {/* Tooltip */}
                                        {isHov && (
                                            <div className="absolute -top-10 z-20 px-2.5 py-1 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap animate-in fade-in">
                                                {chartMetric === 'revenue' ? `$${val.toLocaleString()}` : `${val} Orders`}
                                            </div>
                                        )}
                                        <div
                                            style={{ height: `${pct}%` }}
                                            className={`w-full rounded-t-xl transition-all duration-300 ${isHov ? 'bg-gradient-to-t from-indigo-600 to-purple-500 shadow-lg shadow-indigo-500/30' : 'bg-gradient-to-t from-indigo-100 to-indigo-400 group-hover:from-indigo-400 group-hover:to-indigo-500'}`}
                                        />
                                        <span className="text-[11px] font-semibold text-slate-500 mt-2 truncate w-full text-center">
                                            {d.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Platform commission avg: <strong className="text-slate-800">2.5%</strong></span>
                        <button onClick={() => showToast('Analytics report exported', 'success')} className="text-indigo-600 font-semibold hover:underline">
                            Export Analytics CSV
                        </button>
                    </div>
                </div>

                {/* Live Platform Activity Feed */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Activity size={18} className="text-indigo-600" />
                            <h3 className="font-bold text-slate-800">Real-Time Activity</h3>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                            Live
                        </span>
                    </div>

                    <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[300px] pr-1">
                        {activities.slice(0, 6).map((act, i) => (
                            <div key={act.id || i} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                                    {act.type === 'order' ? <ShoppingCart size={15} /> : act.type === 'shop' ? <Store size={15} /> : <Sparkles size={15} />}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-slate-800 leading-snug">{act.text}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link
                        to="/panel/shops"
                        className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                        <span>View all tenant stores</span>
                        <ChevronRight size={15} />
                    </Link>
                </div>
            </div>

            {/* Tenant Leaderboard & Recent Orders */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* Top Performing Shops */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800">Boutique Leaderboard</h3>
                        <Link to="/panel/shops" className="text-xs font-semibold text-indigo-600 hover:underline">
                            View all ({shops.length})
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {shopLeaderboard.map((s, idx) => (
                            <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="w-6 text-center font-extrabold text-sm text-slate-400">
                                        #{idx + 1}
                                    </span>
                                    <span
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black shadow shrink-0"
                                        style={{ backgroundColor: s.accent || '#6366f1' }}
                                    >
                                        {s.logo}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-bold text-slate-800 text-sm truncate">{s.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{s.ownerName} · {s.products?.length || 0} items</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-bold text-slate-800 text-sm">${s.revenue.toLocaleString()}</p>
                                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                        {s.plan}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Platform Orders Table */}
                <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <div>
                            <h3 className="font-bold text-slate-800">Recent Customer Orders</h3>
                            <p className="text-xs text-slate-500">Real-time checkout transactions</p>
                        </div>
                        <Link to="/panel/orders" className="text-xs font-semibold text-indigo-600 hover:underline">
                            View Global Orders Ledger →
                        </Link>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-slate-400 border-b border-slate-100 bg-slate-50/80">
                                    <th className="px-6 py-3.5">Order ID</th>
                                    <th className="px-6 py-3.5">Shop</th>
                                    <th className="px-6 py-3.5">Customer</th>
                                    <th className="px-6 py-3.5">Amount</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {orders.slice(0, 5).map((o) => {
                                    const badgeClass =
                                        o.status === 'Delivered'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : o.status === 'Processing'
                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                            : o.status === 'Shipped'
                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200';
                                    return (
                                        <tr key={o.id} className="hover:bg-slate-50/70 transition">
                                            <td className="px-6 py-3.5 font-bold text-slate-800 font-mono text-xs">{o.id}</td>
                                            <td className="px-6 py-3.5 text-slate-700 font-medium">{o.shopName}</td>
                                            <td className="px-6 py-3.5">
                                                <p className="font-semibold text-slate-800 text-xs">{o.customer}</p>
                                                <p className="text-[11px] text-slate-400">{o.email}</p>
                                            </td>
                                            <td className="px-6 py-3.5 font-bold text-slate-800">${o.total}</td>
                                            <td className="px-6 py-3.5">
                                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3.5 text-xs text-slate-500">{o.date}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;