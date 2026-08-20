import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    ShoppingCart, Search, Filter, Eye, Printer,
    X, Phone, Mail, MapPin, CreditCard
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const STATUS_BADGES = {
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const OwnerOrders = () => {
    const { shop, accent } = useOutletContext();
    const { getShopOrders, updateOrderStatus } = useStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

    const orders = getShopOrders(shop.id);

    const filteredOrders = orders.filter((o) => {
        const matchesSearch =
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.address || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalRev = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const pendingCount = orders.filter((o) => o.status === 'Pending').length;
    const processingCount = orders.filter((o) => o.status === 'Processing' || o.status === 'Shipped').length;

    const handlePrintInvoice = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Customer Orders</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Manage order fulfillment, tracking status, and printable customer invoices for {shop.name}.
                    </p>
                </div>
            </div>

            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">Total Boutique Orders</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{orders.length}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">Awaiting Fulfillment</p>
                    <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">In Transit / Processing</p>
                    <p className="text-2xl font-extrabold text-blue-600 mt-1">{processingCount}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">Gross Sales Value</p>
                    <p className="text-2xl font-extrabold text-emerald-600 mt-1">${totalRev.toLocaleString()}</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search order ID, customer, address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <Filter size={14} /> Status:
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-none"
                    >
                        <option value="All">All Statuses</option>
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
                    <ShoppingCart size={36} className="mx-auto mb-2 opacity-30 text-indigo-400" />
                    <p className="font-bold text-slate-700 text-base">No customer orders found</p>
                    <p className="text-xs text-slate-400 mt-1">Orders placed by customers on your live storefront will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/70">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Line Items</th>
                                    <th className="px-6 py-4">Total Amount</th>
                                    <th className="px-6 py-4">Fulfillment Status</th>
                                    <th className="px-6 py-4">Order Date</th>
                                    <th className="px-6 py-4 text-right">Invoice & Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredOrders.map((o) => (
                                    <tr key={o.id} className="hover:bg-slate-50/80 transition">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2 py-1 rounded-lg">
                                                {o.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900 text-xs">{o.customer}</p>
                                            <p className="text-[11px] text-slate-400">{o.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-600">
                                            {(o.items || []).map((it, i) => (
                                                <p key={i} className="line-clamp-1">
                                                    {it.qty}x {it.name} {it.size ? `(${it.size})` : ''}
                                                </p>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 font-extrabold text-slate-900 text-sm">
                                            ${o.total}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={o.status}
                                                onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border cursor-pointer focus:outline-none ${STATUS_BADGES[o.status] || 'bg-slate-100 text-slate-700'}`}
                                            >
                                                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">{o.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setActiveInvoiceOrder(o)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-indigo-600 font-bold text-xs shadow-sm transition"
                                            >
                                                <Eye size={14} /> View Invoice
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Order Invoice & Fulfillment Modal */}
            {activeInvoiceOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm no-print" onClick={() => setActiveInvoiceOrder(null)} />
                    
                    <div
                        id="printable-invoice"
                        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between no-print">
                            <div className="flex items-center gap-3">
                                <span
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow"
                                    style={{ backgroundColor: accent }}
                                >
                                    {shop.logo}
                                </span>
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-base">Invoice #{activeInvoiceOrder.id}</h3>
                                    <p className="text-xs text-slate-500">{shop.name} · {activeInvoiceOrder.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrintInvoice}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 shadow"
                                >
                                    <Printer size={14} /> Print Receipt
                                </button>
                                <button
                                    onClick={() => setActiveInvoiceOrder(null)}
                                    className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Invoice Content */}
                        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                            
                            {/* Printable Branding */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">{shop.name}</h2>
                                    <p className="text-xs text-slate-500">{shop.tagline || 'Exclusive Fashion Storefront'}</p>
                                    <p className="text-xs text-slate-400 mt-1">{shop.email} · {shop.phone}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${STATUS_BADGES[activeInvoiceOrder.status]}`}>
                                        {activeInvoiceOrder.status}
                                    </span>
                                    <p className="font-mono text-xs text-slate-400 mt-1">Date: {activeInvoiceOrder.date}</p>
                                </div>
                            </div>

                            {/* Customer & Shipping Summary */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                                <div>
                                    <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Details</p>
                                    <p className="font-bold text-slate-900 text-sm">{activeInvoiceOrder.customer}</p>
                                    <p className="text-slate-600 mt-0.5 flex items-center gap-1.5"><Mail size={12} /> {activeInvoiceOrder.email}</p>
                                    <p className="text-slate-600 mt-0.5 flex items-center gap-1.5"><Phone size={12} /> {activeInvoiceOrder.phone || '+1 (555) 019-2834'}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">Delivery Destination</p>
                                    <p className="text-slate-800 font-medium flex items-start gap-1.5 leading-snug">
                                        <MapPin size={13} className="text-indigo-600 shrink-0 mt-0.5" />
                                        {activeInvoiceOrder.address || '742 Evergreen Terrace, Springfield, OR'}
                                    </p>
                                    <p className="text-slate-600 mt-2 flex items-center gap-1.5">
                                        <CreditCard size={12} /> Payment: <strong className="text-slate-800">{activeInvoiceOrder.paymentMethod || 'Credit Card'}</strong>
                                    </p>
                                </div>
                            </div>

                            {/* Items List Table */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Purchased Items</h4>
                                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                                                <th className="px-4 py-2.5 text-left">Item Description</th>
                                                <th className="px-4 py-2.5 text-center">Qty</th>
                                                <th className="px-4 py-2.5 text-right">Unit Price</th>
                                                <th className="px-4 py-2.5 text-right">Line Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {(activeInvoiceOrder.items || []).map((it, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-4 py-3">
                                                        <p className="font-bold text-slate-800">{it.name}</p>
                                                        <p className="text-slate-400 text-[11px]">{it.size && `Size: ${it.size}`} {it.color && `· Color: ${it.color}`}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-center font-bold text-slate-700">{it.qty}</td>
                                                    <td className="px-4 py-3 text-right text-slate-600">${it.price}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-slate-900">${it.price * it.qty}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className="flex justify-end">
                                <div className="w-64 space-y-2 text-xs">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-slate-800">${activeInvoiceOrder.subtotal || activeInvoiceOrder.total}</span>
                                    </div>
                                    {activeInvoiceOrder.discount > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-medium">
                                            <span>Coupon Discount</span>
                                            <span>-${activeInvoiceOrder.discount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-slate-500">
                                        <span>Delivery / Shipping</span>
                                        <span className="font-medium text-slate-800">Free</span>
                                    </div>
                                    <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                                        <span>Total Paid</span>
                                        <span>${activeInvoiceOrder.total}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer (Screen only) */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between no-print">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-600">Update Status:</span>
                                <select
                                    value={activeInvoiceOrder.status}
                                    onChange={(e) => {
                                        updateOrderStatus(activeInvoiceOrder.id, e.target.value);
                                        setActiveInvoiceOrder({ ...activeInvoiceOrder, status: e.target.value });
                                    }}
                                    className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 rounded-xl"
                                >
                                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <button
                                onClick={() => setActiveInvoiceOrder(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
                            >
                                Close Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerOrders;