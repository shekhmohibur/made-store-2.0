import { useOutletContext } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useStore } from '../../../store/useStore';

const STATUS_BADGE = {
    Delivered: 'bg-emerald-50 text-emerald-600',
    Processing: 'bg-blue-50 text-blue-600',
    Pending: 'bg-amber-50 text-amber-600',
    Cancelled: 'bg-red-50 text-red-600',
};
const ORDER_STATUS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const OwnerOrders = () => {
        const { shop } = useOutletContext();
    const { getShopOrders, updateOrderStatus } = useStore();
    const orders = getShopOrders(shop.id);

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                <p className="text-sm text-gray-500">Manage incoming customer orders for {shop.name}.</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center">
                    <ShoppingCart size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No orders yet. Share your store to start selling.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                                    <th className="px-5 py-3 font-medium">Order</th>
                                    <th className="px-5 py-3 font-medium">Customer</th>
                                    <th className="px-5 py-3 font-medium">Items</th>
                                    <th className="px-5 py-3 font-medium">Total</th>
                                    <th className="px-5 py-3 font-medium">Status</th>
                                    <th className="px-5 py-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 align-top">
                                        <td className="px-5 py-3 font-medium text-gray-800">{o.id}</td>
                                        <td className="px-5 py-3">
                                            <p className="text-gray-700">{o.customer}</p>
                                            <p className="text-xs text-gray-400">{o.email}</p>
                                        </td>
                                        <td className="px-5 py-3">
                                            {o.items.map((it, i) => (
                                                <p key={i} className="text-xs text-gray-600">{it.qty}× {it.name}</p>
                                            ))}
                                        </td>
                                        <td className="px-5 py-3 text-gray-800 font-medium">${o.total}</td>
                                        <td className="px-5 py-3">
                                            <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} className={`text-xs font-medium rounded-full px-2 py-1 border-0 cursor-pointer focus:outline-none ${STATUS_BADGE[o.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {ORDER_STATUS.map((s) => <option key={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-5 py-3 text-gray-500">{o.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default OwnerOrders;