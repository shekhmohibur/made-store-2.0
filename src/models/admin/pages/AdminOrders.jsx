import { useState, useMemo } from 'react';
import {
    ShoppingCart, Search, Download, CheckCircle2,
    Clock, Eye, Printer,
    Store, DollarSign, X, Check, Copy
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { formatCurrency } from '../../../utils/currency';

const STATUS_BADGES = {
    Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
};

const AdminOrders = () => {
    const { orders, shops, updateOrderStatus, verifyOrderPayment, showToast, activeCurrency } = useStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedShopId, setSelectedShopId] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('ALL');
    const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);
    const [, setCopiedTrx] = useState(false);

    // Filtered multi-store orders
    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            const matchesShop = selectedShopId === 'ALL' || o.shopId === selectedShopId;
            const matchesStatus = selectedStatus === 'ALL' || o.status === selectedStatus;
            const matchesPayment = selectedPaymentStatus === 'ALL' || o.paymentStatus === selectedPaymentStatus;
            const matchesSearch =
                (o.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (o.customer || o.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (o.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (o.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (o.trxId || o.paymentDetails?.trxId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (o.shopName || '').toLowerCase().includes(searchTerm.toLowerCase());

            return matchesShop && matchesStatus && matchesPayment && matchesSearch;
        });
    }, [orders, selectedShopId, selectedStatus, selectedPaymentStatus, searchTerm]);

    // Financial calculations
    const totalGMV = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const completedRev = orders.filter((o) => o.status === 'Delivered' || o.paymentStatus === 'Paid').reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const pendingVerificationCount = orders.filter((o) => o.paymentStatus === 'Pending Verification' || (o.trxId && o.paymentStatus !== 'Paid')).length;

    // Export to CSV
    const exportToCSV = () => {
        if (filteredOrders.length === 0) {
            showToast('No orders to export in current filter', 'warning');
            return;
        }

        const headers = ['Order ID', 'Boutique', 'Customer', 'Email', 'Phone', 'Items Count', 'Total', 'Payment Method', 'Payment Status', 'TrxID', 'Order Status', 'Date'];
        const rows = filteredOrders.map((o) => [
            o.id,
            `"${o.shopName || 'Boutique'}"`,
            `"${o.customer || o.customerName || 'Shopper'}"`,
            o.email || '',
            o.phone || '',
            (o.items || []).length,
            o.total || 0,
            `"${o.paymentMethod || 'Credit Card'}"`,
            o.paymentStatus || 'Pending',
            o.trxId || o.paymentDetails?.trxId || 'N/A',
            o.status || 'Pending',
            o.date || 'Today',
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Trivora_Global_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`Exported ${filteredOrders.length} order records to CSV`, 'success');
    };

    const handleCopyTrx = (trx) => {
        navigator.clipboard?.writeText(trx);
        setCopiedTrx(true);
        showToast(`Transaction ID "${trx}" copied!`, 'info');
        setTimeout(() => setCopiedTrx(false), 2000);
    };

    return (
        <div className="space-y-6">
            {/* Header & KPI Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <ShoppingCart size={28} className="text-indigo-600" />
                        Global Orders Ledger
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Master real-time transaction ledger across all clothing boutiques & merchant storefronts.
                    </p>
                </div>
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={exportToCSV}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition shadow-xs cursor-pointer"
                    >
                        <Download size={15} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Quick KPI Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Platform GMV</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{formatCurrency(totalGMV, activeCurrency)}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{orders.length} lifetime orders placed</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                        <DollarSign size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Settled Revenue</p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">{formatCurrency(completedRev, activeCurrency)}</p>
                        <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Paid & Delivered</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle2 size={24} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Manual Verification Required</p>
                        <p className="text-2xl font-black text-amber-600 mt-1">{pendingVerificationCount}</p>
                        <p className="text-[11px] text-amber-600 font-semibold mt-0.5">bKash / Nagad TrxIDs awaiting review</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                        <Clock size={24} />
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Order ID, Customer, Phone, TrxID, or Boutique..."
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Filter Boutique */}
                <select
                    value={selectedShopId}
                    onChange={(e) => setSelectedShopId(e.target.value)}
                    className="px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                    <option value="ALL">All Boutiques ({shops.length})</option>
                    {shops.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>

                {/* Filter Order Status */}
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                    <option value="ALL">All Fulfillment Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>

                {/* Filter Payment Status */}
                <select
                    value={selectedPaymentStatus}
                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                    className="px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                    <option value="ALL">All Payment Statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Pending">Pending (COD)</option>
                    <option value="Verification Rejected">Verification Rejected</option>
                </select>
            </div>

            {/* Global Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-400 font-extrabold uppercase tracking-wider text-[10px]">
                                <th className="p-4">Order ID & Date</th>
                                <th className="p-4">Boutique</th>
                                <th className="p-4">Customer & Contact</th>
                                <th className="p-4">Payment & TrxID</th>
                                <th className="p-4 text-right">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-12 text-center text-slate-400 space-y-2">
                                        <ShoppingCart size={32} className="mx-auto text-slate-300" />
                                        <p className="font-bold text-sm text-slate-600">No orders match your criteria</p>
                                        <p className="text-xs">Adjust your search query or boutique filter above.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((o) => {
                                    const trxId = o.trxId || o.paymentDetails?.trxId;
                                    const isPendingVerif = o.paymentStatus === 'Pending Verification' || (trxId && o.paymentStatus !== 'Paid');

                                    return (
                                        <tr key={o.id} className="hover:bg-slate-50/80 transition">
                                            {/* Order ID & Date */}
                                            <td className="p-4 font-mono font-bold text-slate-900">
                                                <div className="flex items-center gap-1.5">
                                                    <span>{o.id}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-normal font-sans block mt-0.5">
                                                    {o.date || 'Today'}
                                                </span>
                                            </td>

                                            {/* Boutique */}
                                            <td className="p-4 font-bold text-slate-900">
                                                <div className="flex items-center gap-1.5">
                                                    <Store size={14} className="text-indigo-600 shrink-0" />
                                                    <span className="truncate max-w-[130px]">{o.shopName || 'Boutique Store'}</span>
                                                </div>
                                            </td>

                                            {/* Customer */}
                                            <td className="p-4">
                                                <p className="font-bold text-slate-900">{o.customer || o.customerName || 'Shopper'}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">{o.phone || o.email || 'No phone'}</p>
                                            </td>

                                            {/* Payment & TrxID */}
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                            o.paymentStatus === 'Paid'
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : isPendingVerif
                                                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                                                : 'bg-slate-100 text-slate-700'
                                                        }`}>
                                                            {o.paymentStatus || 'Pending'}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 font-semibold">
                                                            {o.paymentMethod || 'Credit Card'}
                                                        </span>
                                                    </div>

                                                    {trxId && (
                                                        <div className="flex items-center gap-1 text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 border border-slate-200">
                                                            <span className="font-bold select-all">{trxId}</span>
                                                            <button
                                                                onClick={() => handleCopyTrx(trxId)}
                                                                className="text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                                                                title="Copy TrxID"
                                                            >
                                                                <Copy size={11} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Amount */}
                                            <td className="p-4 text-right font-mono font-extrabold text-slate-900">
                                                {formatCurrency(o.total || 0, activeCurrency)}
                                                <span className="text-[10px] text-slate-400 font-sans font-normal block">
                                                    {(o.items || []).length} items
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="p-4">
                                                <select
                                                    value={o.status || 'Pending'}
                                                    onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border focus:outline-none cursor-pointer ${STATUS_BADGES[o.status] || 'bg-slate-100 text-slate-700'}`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 text-right space-x-1.5">
                                                {isPendingVerif && (
                                                    <button
                                                        onClick={() => verifyOrderPayment(o.id, true)}
                                                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-500 transition shadow-xs cursor-pointer inline-flex items-center gap-1"
                                                        title="Approve manual payment"
                                                    >
                                                        <Check size={11} /> Verify
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setActiveInvoiceOrder(o)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition inline-block cursor-pointer"
                                                    title="View Detailed Invoice"
                                                >
                                                    <Eye size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Invoice & Details Modal */}
            {activeInvoiceOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                    <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                                    Official Invoice
                                </span>
                                <h3 className="font-mono font-black text-xl text-slate-900 mt-1">
                                    {activeInvoiceOrder.id}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Store: <strong className="text-slate-800">{activeInvoiceOrder.shopName}</strong> · Placed: {activeInvoiceOrder.date || 'Today'}
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveInvoiceOrder(null)}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Customer & Shipping Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 text-xs">
                            <div className="space-y-1">
                                <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Client Information</p>
                                <p className="font-extrabold text-slate-900 text-sm">{activeInvoiceOrder.customer || activeInvoiceOrder.customerName}</p>
                                <p className="text-slate-600">{activeInvoiceOrder.email}</p>
                                <p className="font-mono font-bold text-slate-700">{activeInvoiceOrder.phone}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Delivery Courier Address</p>
                                <p className="text-slate-700 leading-relaxed">{activeInvoiceOrder.address || 'Address provided via WhatsApp / Checkout'}</p>
                                <p className="font-bold text-slate-900 pt-1">
                                    Payment: <span className="text-indigo-600">{activeInvoiceOrder.paymentMethod}</span>
                                </p>
                            </div>
                        </div>

                        {/* Items Breakdown */}
                        <div className="space-y-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Items</p>
                            <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                                {(activeInvoiceOrder.items || []).map((item, idx) => (
                                    <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50/50">
                                        <div className="flex items-center gap-3">
                                            {item.image && (
                                                <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                                            )}
                                            <div>
                                                <p className="font-bold text-slate-900">{item.name}</p>
                                                <p className="text-[10px] text-slate-400">
                                                    Size: <span className="font-bold text-slate-700">{item.size || 'M'}</span> · Color: <span className="font-bold text-slate-700">{item.color || 'Standard'}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono font-bold text-slate-900">{formatCurrency((item.price || 0) * (item.qty || 1), activeCurrency)}</p>
                                            <p className="text-[10px] text-slate-400">{item.qty || 1} x {formatCurrency(item.price || 0, activeCurrency)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1.5 text-xs font-mono">
                            <div className="flex justify-between text-slate-400">
                                <span>Subtotal</span>
                                <span>{formatCurrency(activeInvoiceOrder.subtotal || activeInvoiceOrder.total || 0, activeCurrency)}</span>
                            </div>
                            {activeInvoiceOrder.discount > 0 && (
                                <div className="flex justify-between text-emerald-400">
                                    <span>Promotional Discount</span>
                                    <span>-{formatCurrency(activeInvoiceOrder.discount, activeCurrency)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                                <span>Grand Total</span>
                                <span className="text-emerald-400 text-base">{formatCurrency(activeInvoiceOrder.total || 0, activeCurrency)}</span>
                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="flex items-center justify-between pt-2">
                            <button
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
                            >
                                <Printer size={15} /> Print Slip
                            </button>
                            <button
                                onClick={() => setActiveInvoiceOrder(null)}
                                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
