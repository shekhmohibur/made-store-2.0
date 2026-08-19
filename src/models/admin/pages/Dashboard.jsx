import {
    Store, Users as UsersIcon, DollarSign, TrendingUp, Plus, Activity,
    ShoppingCart, CheckCircle2, XCircle,
} from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { label: 'Total Shops', value: '248', delta: '+12.5%', icon: <Store size={20} />, color: 'from-purple-500 to-indigo-600' },
        { label: 'Active Users', value: '1,024', delta: '+8.2%', icon: <UsersIcon size={20} />, color: 'from-blue-500 to-cyan-600' },
        { label: 'Monthly Revenue', value: '$86,420', delta: '+15.4%', icon: <DollarSign size={20} />, color: 'from-emerald-500 to-teal-600' },
        { label: 'Conversion Rate', value: '3.6%', delta: '+0.8%', icon: <TrendingUp size={20} />, color: 'from-amber-500 to-orange-600' },
    ];

    const orders = [
        { id: '#ORD-2109', shop: 'Urban Threads', customer: 'Amina Yusuf', amount: '$240.00', status: 'Completed', date: 'Aug 18' },
        { id: '#ORD-2110', shop: 'Street Vogue', customer: 'Daniel Okafor', amount: '$95.50', status: 'Pending', date: 'Aug 18' },
        { id: '#ORD-2111', shop: 'Linen & Co', customer: 'Grace Mensah', amount: '$312.00', status: 'Completed', date: 'Aug 17' },
        { id: '#ORD-2112', shop: 'Heritage Wear', customer: 'Tunde Bakare', amount: '$74.99', status: 'Refunded', date: 'Aug 17' },
        { id: '#ORD-2113', shop: 'Urban Threads', customer: 'Blessing Ade', amount: '$188.40', status: 'Completed', date: 'Aug 16' },
    ];

    return (
        <>
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-sm text-gray-500">Welcome back, Super Admin 👋 Here's what's happening today.</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow hover:opacity-95">
                    <Plus size={18} /> New Shop
                </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow transition-shadow">
                        <div className="flex items-center justify-between">
                            <span className={`w-11 h-11 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow`}>
                                {s.icon}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <TrendingUp size={12} /> {s.delta}
                            </span>
                        </div>
                        <p className="mt-4 text-2xl font-bold text-gray-800">{s.value}</p>
                        <p className="text-sm text-gray-500">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
    {/* Revenue Chart */}
    <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Revenue Overview</h3>
            <div className="flex items-center gap-2 text-xs">
                <button className="px-3 py-1 rounded-md bg-purple-600 text-white">7 Days</button>
                <button className="px-3 py-1 rounded-md text-gray-500 hover:bg-gray-100">30 Days</button>
                <button className="px-3 py-1 rounded-md text-gray-500 hover:bg-gray-100">12 Months</button>
            </div>
        </div>
        <div className="flex items-end gap-1.5 h-56">
            {[45, 60, 38, 75, 52, 88, 66, 95, 72, 84, 58, 100].map((h, i) => (
                <div key={i} className="flex-1 flex items-end rounded-t-md bg-gradient-to-t from-purple-500 to-indigo-400 hover:from-purple-600 transition-all" style={{ height: `${h}%` }} />
            ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].concat(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']).map((d, i) => (
                <span key={i}>{d}</span>
            ))}
        </div>
    </div>

    {/* Activity */}
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
            {[
                { icon: <ShoppingCart size={16} />, c: 'bg-purple-100 text-purple-600', t: 'New order placed', s: '2 min ago' },
                { icon: <CheckCircle2 size={16} />, c: 'bg-emerald-100 text-emerald-600', t: 'Shop approved', s: '35 min ago' },
                { icon: <UsersIcon size={16} />, c: 'bg-blue-100 text-blue-600', t: 'New user registered', s: '1 hr ago' },
                { icon: <XCircle size={16} />, c: 'bg-red-100 text-red-600', t: 'Payment declined', s: '3 hrs ago' },
                { icon: <Activity size={16} />, c: 'bg-amber-100 text-amber-600', t: 'System backup', s: '5 hrs ago' },
            ].map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-lg ${a.c} flex items-center justify-center shrink-0`}>{a.icon}</span>
                    <div className="min-w-0">
                        <p className="text-sm text-gray-700 truncate">{a.t}</p>
                        <p className="text-xs text-gray-400">{a.s}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>

{/* Recent Orders Table */}
<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
        <button className="text-sm text-purple-600 font-medium hover:underline">View all</button>
    </div>
    <div className="overflow-x-auto">
        <table className="w-full text-sm">
            <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Shop</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((o, i) => {
                    const badge = o.status === 'Completed' ? 'bg-emerald-50 text-emerald-600'
                        : o.status === 'Pending' ? 'bg-amber-50 text-amber-600'
                        : 'bg-red-50 text-red-500';
                    return (
                        <tr key={o.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i === orders.length - 1 ? 'border-b-0' : ''}`}>
                            <td className="px-5 py-3 font-medium text-gray-800">{o.id}</td>
                            <td className="px-5 py-3 text-gray-600">{o.shop}</td>
                            <td className="px-5 py-3 text-gray-600">{o.customer}</td>
                            <td className="px-5 py-3 text-gray-700">{o.amount}</td>
                            <td className="px-5 py-3">
                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${badge}`}>{o.status}</span>
                            </td>
                            <td className="px-5 py-3 text-gray-500">{o.date}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
</div>
        </>
    );
};

export default Dashboard;