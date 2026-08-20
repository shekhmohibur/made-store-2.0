import { useState } from 'react';
import {
    Search, CheckCircle2, Clock,
    AlertCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const TrackOrder = () => {
    const { orders } = useStore();

    const [searchId, setSearchId] = useState('');
    const [searchedOrder, setSearchedOrder] = useState(null);
    const [searched, setSearched] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmed = searchId.trim().toUpperCase();
        const found = orders.find(
            (o) => o.id.toUpperCase() === trimmed || o.email?.toLowerCase() === searchId.trim().toLowerCase()
        );
        setSearchedOrder(found || null);
        setSearched(true);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-12 bg-white text-slate-900 font-sans">
            
            {/* Header */}
            <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="text-[11px] font-bold tracking-[0.25em] text-slate-400 uppercase">
                    COURIER & DELIVERY STATUS
                </span>
                <h1 className="text-3xl sm:text-5xl font-serif tracking-[0.15em] uppercase text-slate-950 font-normal">
                    Track Your Package
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Enter your Order ID (e.g. <span className="font-mono font-bold text-slate-800">ORD-1001</span>) or checkout email address to view live courier status.
                </p>
            </div>

            {/* Search Box */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        required
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Enter Order ID or Email..."
                        className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 border border-slate-200 rounded-2xl uppercase font-mono font-bold focus:outline-none focus:border-slate-900"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-slate-950 text-white font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-slate-800 transition shadow"
                >
                    Track Order
                </button>
            </form>

            {/* Results */}
            {searched && (
                <div>
                    {searchedOrder ? (
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 animate-in fade-in zoom-in-95">
                            {/* Order Header Summary */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
                                <div>
                                    <span className="text-xs font-mono font-bold text-slate-400 uppercase">Order Reference</span>
                                    <h3 className="text-xl font-bold font-mono text-slate-950 mt-0.5">{searchedOrder.id}</h3>
                                    <p className="text-xs text-slate-500 mt-1">Recipient: <strong className="text-slate-800">{searchedOrder.customer}</strong> ({searchedOrder.email})</p>
                                </div>

                                <div className="text-left sm:text-right">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Status</span>
                                    <p className="text-base font-extrabold text-indigo-600 mt-0.5">{searchedOrder.status}</p>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">Total Paid: ${searchedOrder.total} USD</p>
                                </div>
                            </div>

                            {/* Visual Timeline Stepper */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Delivery Progress Timeline</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    {(searchedOrder.timeline || [
                                        { title: 'Order Placed', time: 'Completed', done: true },
                                        { title: 'Payment Confirmed', time: 'Verified', done: true },
                                        { title: 'Packing at Warehouse', time: 'Queued', done: false },
                                        { title: 'Courier Delivery', time: 'Pending', done: false },
                                    ]).map((step, idx) => (
                                        <div key={idx} className="flex flex-col items-center text-center p-3 bg-white rounded-2xl border border-slate-200">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step.done ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
                                                {step.done ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                                            </div>
                                            <p className="font-bold text-xs text-slate-900">{step.title}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{step.time}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Package Line Items */}
                            <div className="space-y-3 pt-4 border-t border-slate-200">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Garments in this Shipment</h4>
                                <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 p-4">
                                    {(searchedOrder.items || []).map((it, idx) => (
                                        <div key={idx} className="py-2.5 first:py-0 flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center font-bold">
                                                    {it.image ? <img src={it.image} alt="" className="w-full h-full object-cover" /> : it.emoji || '👗'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{it.name}</p>
                                                    <p className="text-[10px] text-slate-500">Qty: {it.qty} · Size: {it.size || 'M'} · Color: {it.color || 'Standard'}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-slate-900 font-mono">${it.price * it.qty} USD</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center text-slate-400 max-w-lg mx-auto space-y-3">
                            <AlertCircle size={40} className="mx-auto text-amber-500" />
                            <h4 className="font-bold text-slate-900 text-base">No Order Found</h4>
                            <p className="text-xs text-slate-500">
                                We could not locate any order with the reference "{searchId}". Please check your confirmation receipt email.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrackOrder;
