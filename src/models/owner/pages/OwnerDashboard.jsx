import { Link, useOutletContext } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../../store/useStore';

const STATUS_BADGE = {
    Delivered: 'bg-emerald-50 text-emerald-600',
    Processing: 'bg-blue-50 text-blue-600',
    Pending: 'bg-amber-50 text-amber-600',
    Cancelled: 'bg-red-50 text-red-600',
};
const ORDER_STATUS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const OwnerDashboard = () => {
    const { shop, accent } = useOutletContext();
    const { getShopOrders, updateOrderStatus } = useStore();
    const orders = getShopOrders(shop.id);
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const lowStock = shop.products.filter((p) => p.stock <= 10);
    const stats = [
        { label: 'Products', value: shop.products.length, icon: <Package size={20} />, to: '/panel/owner/products' },
        { label: 'Orders', value: orders.length, icon: <ShoppingCart size={20} />, to: '/panel/owner/orders' },
        { label: 'Revenue', value: `$${revenue.toLocaleString()}`, icon: <DollarSign size={20} />, to: '/panel/owner/orders' },
        { label: 'Low stock', value: lowStock.length, icon: <AlertTriangle size={20} />, to: '/panel/owner/products' },
    ];

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Owner Dashboard</h1>
                    <p className="text-sm text-gray-500">Welcome back to {shop.name}. 👋</p>
                </div>
                <Link to="/panel/owner/products" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: accent }}>
                    <Package size={18} /> Add Product
                </Link>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {stats.map((s, i) => (
                    <Link key={i} to={s.to} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow">
                        <div className="flex items-center justify-between">
                            <span className="w-11 h-11 rounded-lg flex items-center justify-center text-white shadow" style={{ backgroundColor: accent }}>{s.icon}</span>
                            <ArrowUpRight size={16} className="text-gray-300" />
                        </div>
                        <p className="mt-4 text-2xl font-bold text-gray-800">{s.value}</p>
                        <p className="text-sm text-gray-500">{s.label}</p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Recent Orders</h3>
                        <Link to="/panel/owner/orders" className="text-sm font-medium" style={{ color: accent }}>View all</Link>
                    </div>
                    {orders.length === 0 ? (
                        <p className="p-6 text-sm text-gray-500">No orders yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                                        <th className="px-5 py-3 font-medium">Order</th>
                                        <th className="px-5 py-3 font-medium">Customer</th>
                                        <th className="px-5 py-3 font-medium">Total</th>
                                        <th className="px-5 py-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map((o) => (
                                        <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                                            <td className="px-5 py-3 font-medium text-gray-800">{o.id}</td>
                                            <td className="px-5 py-3 text-gray-600">{o.customer}</td>
                                            <td className="px-5 py-3 text-gray-700">${o.total}</td>
                                            <td className="px-5 py-3">
                                                <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer focus:outline-none ${STATUS_BADGE[o.status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {ORDER_STATUS.map((s) => <option key={s}>{s}</option>)}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle size={18} className="text-amber-500" />
                        <h3 className="font-semibold text-gray-800">Low Stock Alert</h3>
                    </div>
                    {lowStock.length === 0 ? (
                        <p className="text-sm text-gray-500">All products stocked. ✅</p>
                    ) : (
                        <ul className="space-y-3">
                            {lowStock.map((p) => (
                                <li key={p.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-lg">{p.emoji}</span>
                                        <div className="leading-tight">
                                            <p className="text-sm font-medium text-gray-800">{p.name}</p>
                                            <p className="text-xs text-gray-400">{p.category}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {p.stock === 0 ? 'Out' : `${p.stock} left`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default OwnerDashboard;