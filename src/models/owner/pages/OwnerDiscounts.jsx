import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
    BadgePercent, Plus, Trash2, Copy, Check, X
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const OwnerDiscounts = () => {
    const { shop, accent } = useOutletContext();
    const { coupons, addCoupon, deleteCoupon, showToast } = useStore();

    const [showForm, setShowForm] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    const handleCreate = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const code = (fd.get('code') || '').toUpperCase().trim();
        const type = fd.get('type');
        const value = Number(fd.get('value')) || 0;
        const minSpend = Number(fd.get('minSpend')) || 0;
        const description = fd.get('description') || `${value}${type === 'percentage' ? '%' : '$'} promotional coupon`;

        if (!code) {
            showToast('Please enter a coupon code', 'warning');
            return;
        }

        addCoupon({ code, type, value, minSpend, description });
        setShowForm(false);
    };

    const handleCopy = (code) => {
        navigator.clipboard?.writeText(code);
        setCopiedCode(code);
        showToast(`Coupon "${code}" copied to clipboard!`, 'info');
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const inputClass =
        'w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition';
    const labelClass = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5';

    return (
        <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Discounts & Promo Codes</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Drive conversions with seasonal markdown codes and customer vouchers for {shop.name}.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition"
                    style={{ backgroundColor: accent }}
                >
                    <Plus size={18} /> Create Promotional Code
                </button>
            </div>

            {/* Coupons List */}
            {coupons.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
                    <BadgePercent size={36} className="mx-auto mb-2 opacity-30 text-indigo-400" />
                    <p className="font-bold text-slate-700 text-base">No discount codes created</p>
                    <p className="text-xs text-slate-400 mt-1 mb-4">Set up a flash sale or seasonal promo code.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow"
                        style={{ backgroundColor: accent }}
                    >
                        + Create First Coupon
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {coupons.map((c) => (
                        <div
                            key={c.id}
                            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col relative"
                        >
                            {/* Card Top */}
                            <div className="p-6 pb-4 flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md font-bold"
                                        style={{ backgroundColor: accent }}
                                    >
                                        <BadgePercent size={22} />
                                    </span>
                                    <div>
                                        <p className="font-mono font-black text-slate-900 text-xl tracking-wider">{c.code}</p>
                                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            {c.type === 'percentage' ? `${c.value}% OFF` : `$${c.value} OFF`}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteCoupon(c.id)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                    title="Delete Coupon"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Ticket Divider */}
                            <div className="relative flex items-center justify-between px-2">
                                <div className="w-4 h-8 bg-slate-50 rounded-r-full border-r border-t border-b border-slate-200" />
                                <div className="flex-1 border-t border-dashed border-slate-200 mx-2" />
                                <div className="w-4 h-8 bg-slate-50 rounded-l-full border-l border-t border-b border-slate-200" />
                            </div>

                            {/* Card Details */}
                            <div className="p-6 pt-3 flex-1 flex flex-col justify-between space-y-4">
                                <div className="text-xs text-slate-500 space-y-1">
                                    <p className="font-medium text-slate-700">{c.description}</p>
                                    <p className="text-[11px] text-slate-400">
                                        {c.minSpend > 0 ? `Minimum spend: $${c.minSpend}` : 'No minimum spend required'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleCopy(c.code)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition active:scale-95"
                                >
                                    {copiedCode === c.code ? (
                                        <>
                                            <Check size={14} className="text-emerald-600" />
                                            <span className="text-emerald-600">Copied to Clipboard!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} />
                                            <span>Copy Code</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Coupon Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <form
                        onSubmit={handleCreate}
                        className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95"
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Create Promo Code</h3>
                                <p className="text-xs text-slate-500">Configure discount value and spend rules.</p>
                            </div>
                            <button type="button" onClick={() => setShowForm(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-200">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className={labelClass}>Coupon Code *</label>
                                <input
                                    name="code"
                                    className={`${inputClass} uppercase font-mono tracking-wider font-bold`}
                                    placeholder="e.g. FLASH25"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Discount Type</label>
                                    <select name="type" className={inputClass} defaultValue="percentage">
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Dollar ($)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Discount Value *</label>
                                    <input
                                        name="value"
                                        type="number"
                                        min="1"
                                        defaultValue="20"
                                        className={inputClass}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Minimum Spend Threshold ($)</label>
                                <input
                                    name="minSpend"
                                    type="number"
                                    min="0"
                                    defaultValue="0"
                                    className={inputClass}
                                    placeholder="0 for any amount"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Promotional Description</label>
                                <input
                                    name="description"
                                    className={inputClass}
                                    placeholder="e.g. 20% discount on all dresses"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition"
                                style={{ backgroundColor: accent }}
                            >
                                Launch Coupon
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default OwnerDiscounts;