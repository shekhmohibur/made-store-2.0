import { useState, useMemo } from 'react';
import {
    TrendingUp, DollarSign, Store, ShoppingBag,
    Percent, ArrowUpRight, Award,
    PieChart as PieIcon, Download
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { formatCurrency } from '../../../utils/currency';

const AdminAnalytics = () => {
    const { orders, shops, activeCurrency, showToast } = useStore();

    const [commissionRate, setCommissionRate] = useState(2.5); // 2.5% SaaS commission
    const [timeframe, setTimeframe] = useState('30D');

    // Aggregate metrics
    const totalGMV = useMemo(() => {
        return orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    }, [orders]);

    const totalPlatformCommission = useMemo(() => {
        return (totalGMV * (commissionRate / 100));
    }, [totalGMV, commissionRate]);

    const aov = useMemo(() => {
        return orders.length > 0 ? (totalGMV / orders.length) : 0;
    }, [totalGMV, orders]);

    // Boutique Leaderboard
    const boutiqueLeaderboard = useMemo(() => {
        const stats = {};
        shops.forEach((s) => {
            stats[s.id] = {
                id: s.id,
                name: s.name,
                slug: s.slug,
                ownerName: s.ownerName || 'Merchant',
                theme: s.activeTheme || s.active_theme || 'theme-bangla-fusion',
                status: s.status,
                orderCount: 0,
                totalRevenue: 0,
                productCount: (s.products || []).length,
            };
        });

        orders.forEach((o) => {
            if (stats[o.shopId]) {
                stats[o.shopId].orderCount += 1;
                stats[o.shopId].totalRevenue += (Number(o.total) || 0);
            }
        });

        return Object.values(stats).sort((a, b) => b.totalRevenue - a.totalRevenue);
    }, [shops, orders]);

    // Category Distribution
    const categoryStats = useMemo(() => {
        const counts = { 'Men': 0, 'Women': 0, 'Dresses': 0, 'Casuals': 0, 'Accessories': 0 };
        shops.forEach((s) => {
            (s.products || []).forEach((p) => {
                const cat = p.category || 'Casuals';
                if (counts[cat] !== undefined) counts[cat] += 1;
                else counts['Casuals'] += 1;
            });
        });
        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
        return Object.entries(counts).map(([name, count]) => ({
            name,
            count,
            pct: Math.round((count / total) * 100),
        }));
    }, [shops]);

    // Payment Methods Breakdown
    const paymentBreakdown = useMemo(() => {
        const methods = { 'bKash / Mobile Money': 0, 'Nagad': 0, 'Cash on Delivery (COD)': 0, 'Card / Online': 0 };
        orders.forEach((o) => {
            const m = (o.paymentMethod || '').toLowerCase();
            if (m.includes('bkash')) methods['bKash / Mobile Money'] += 1;
            else if (m.includes('nagad')) methods['Nagad'] += 1;
            else if (m.includes('cod') || m.includes('cash')) methods['Cash on Delivery (COD)'] += 1;
            else methods['Card / Online'] += 1;
        });
        const total = orders.length || 1;
        return Object.entries(methods).map(([name, count]) => ({
            name,
            count,
            pct: Math.round((count / total) * 100),
        }));
    }, [orders]);

    // Export Analytics Summary to CSV
    const handleExportSummary = () => {
        const headers = ['Boutique Name', 'Owner', 'Status', 'Products in Catalog', 'Orders Handled', 'Total Revenue Generated (GMV)', 'Est. Platform Commission'];
        const rows = boutiqueLeaderboard.map((b) => [
            `"${b.name}"`,
            `"${b.ownerName}"`,
            b.status,
            b.productCount,
            b.orderCount,
            b.totalRevenue,
            (b.totalRevenue * (commissionRate / 100)).toFixed(2),
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Trivora_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Analytics summary report downloaded', 'success');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <TrendingUp size={28} className="text-indigo-600" />
                        Platform Analytics & Financials
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Gross merchandise volume (GMV), monetization commission take-rates, and multi-tenant leaderboards.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Timeframe selector */}
                    <div className="flex p-1 bg-white border border-slate-200 rounded-2xl shadow-2xs text-xs font-bold">
                        {['7D', '30D', '90D', 'ALL'].map((tf) => (
                            <button
                                key={tf}
                                onClick={() => setTimeframe(tf)}
                                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${timeframe === tf ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleExportSummary}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-2xl hover:bg-slate-800 transition shadow-xs cursor-pointer"
                    >
                        <Download size={14} /> Export Report
                    </button>
                </div>
            </div>

            {/* Core Financial KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* GMV */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Gross Platform GMV</span>
                        <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600"><DollarSign size={18} /></span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{formatCurrency(totalGMV, activeCurrency)}</p>
                    <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <ArrowUpRight size={14} /> Across {shops.length} live boutiques
                    </p>
                </div>

                {/* SaaS Commission */}
                <div className="bg-white p-5 rounded-3xl border border-indigo-200 bg-gradient-to-br from-white to-indigo-50/40 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">Platform Commission</span>
                        <span className="p-2 rounded-xl bg-indigo-600 text-white"><Percent size={18} /></span>
                    </div>
                    <p className="text-3xl font-black text-indigo-600">{formatCurrency(totalPlatformCommission, activeCurrency)}</p>
                    <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] font-bold text-slate-500">Take Rate:</span>
                        <input
                            type="number"
                            min="0"
                            max="30"
                            step="0.5"
                            value={commissionRate}
                            onChange={(e) => setCommissionRate(Number(e.target.value) || 0)}
                            className="w-14 px-1.5 py-0.5 text-xs font-bold bg-white border border-indigo-200 rounded-lg text-center font-mono focus:outline-none"
                        />
                        <span className="text-xs font-bold text-slate-500">%</span>
                    </div>
                </div>

                {/* Order Volume */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Total Transactions</span>
                        <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><ShoppingBag size={18} /></span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{orders.length}</p>
                    <p className="text-xs text-slate-500 font-semibold">
                        Avg Basket Size: <strong className="text-slate-800">{formatCurrency(aov, activeCurrency)}</strong>
                    </p>
                </div>

                {/* Boutiques Active */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold uppercase tracking-wider">Active Boutiques</span>
                        <span className="p-2 rounded-xl bg-purple-50 text-purple-600"><Store size={18} /></span>
                    </div>
                    <p className="text-3xl font-black text-slate-900">{shops.filter((s) => s.status === 'Active').length}</p>
                    <p className="text-xs text-purple-600 font-bold">
                        {shops.filter((s) => s.status === 'Pending').length} awaiting KYC review
                    </p>
                </div>
            </div>

            {/* Middle Section: Leaderboard & Distribution Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Boutique Performance Leaderboard */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <Award size={20} className="text-amber-500" />
                            <h2 className="text-base font-extrabold text-slate-900">Top Performing Boutiques</h2>
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ranked by Revenue</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {boutiqueLeaderboard.slice(0, 6).map((b, idx) => (
                            <div key={b.id} className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition px-2 rounded-2xl">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                                        idx === 0 ? 'bg-amber-100 text-amber-800' : idx === 1 ? 'bg-slate-200 text-slate-700' : idx === 2 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        #{idx + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-extrabold text-slate-900 text-xs truncate">{b.name}</p>
                                        <p className="text-[11px] text-slate-400 truncate">
                                            Owner: {b.ownerName} · {b.productCount} apparel items · Subdomain: <span className="font-mono text-indigo-600">{b.slug}.trivora.top</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-mono font-black text-xs text-slate-900">{formatCurrency(b.totalRevenue, activeCurrency)}</p>
                                    <p className="text-[10px] text-slate-400 font-semibold">{b.orderCount} orders handled</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right 1 Col: Payment & Category Share */}
                <div className="space-y-6">
                    {/* Payment Distribution */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <PieIcon size={18} className="text-indigo-600" />
                            <h2 className="text-sm font-extrabold text-slate-900">Payment Gateway Share</h2>
                        </div>
                        <div className="space-y-3">
                            {paymentBreakdown.map((pm) => (
                                <div key={pm.name} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                        <span>{pm.name}</span>
                                        <span className="font-mono">{pm.pct}% ({pm.count})</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${pm.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Catalog Category Share */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                        <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3">Apparel Categories Catalog</h2>
                        <div className="space-y-2.5">
                            {categoryStats.map((c) => (
                                <div key={c.name} className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-600">{c.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-slate-900">{c.count} items</span>
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">{c.pct}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
