import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BadgePercent, Plus, Trash2, Copy } from 'lucide-react';

const OwnerDiscounts = () => {
    const { shop, accent } = useOutletContext();
    const [coupons, setCoupons] = useState([
        { code: 'SUMMER20', type: 'percentage', value: 20, active: true },
        { code: 'FREESHIP', type: 'fixed', value: 10, active: true },
    ]);
    const [showForm, setShowForm] = useState(false);
    const [copied, setCopied] = useState(null);

    const create = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        setCoupons((prev) => [...prev, { code: (fd.get('code') || '').toUpperCase(), type: fd.get('type'), value: Number(fd.get('value')) || 0, active: true }]);
        setShowForm(false);
    };

    const copy = (code) => {
        navigator.clipboard?.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 1200);
    };

    const input = 'w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100';
    const label = 'block text-sm font-medium text-gray-700 mb-1.5';

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Discounts & Coupons</h1>
                    <p className="text-sm text-gray-500">Create promo codes for seasonal clothing sales.</p>
                </div>
                <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: accent }}>
                    <Plus size={18} /> New Coupon
                </button>
            </div>

            {coupons.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center">
                    <BadgePercent size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No coupons yet. Create your first seasonal offer.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {coupons.map((c, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <div className="flex items-start justify-between">
                                <span className="w-11 h-11 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: accent }}>
                                    <BadgePercent size={20} />
                                </span>
                                <button onClick={() => setCoupons((prev) => prev.filter((_, j) => j !== i))} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50" title="Delete">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                            <p className="mt-3 font-mono font-bold text-gray-800 text-lg tracking-wide">{c.code}</p>
                            <p className="text-sm text-gray-500">{c.type === 'percentage' ? `${c.value}% off` : `$${c.value} off`} · {shop.name}</p>
                            <button onClick={() => copy(c.code)} className="mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100">
                                <Copy size={14} /> {copied === c.code ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                    <form onSubmit={create} className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">New Coupon</h3>
                        <div className="space-y-4">
                            <div>
                                <label className={label}>Coupon code *</label>
                                <input name="code" className={input} placeholder="e.g. SUMMER20" required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={label}>Type</label>
                                    <select name="type" className={input} defaultValue="percentage">
                                        <option value="percentage">Percentage %</option>
                                        <option value="fixed">Fixed $</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={label}>Value</label>
                                    <input name="value" type="number" min="0" className={input} placeholder="20" required />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100">Cancel</button>
                            <button type="submit" className="px-4 py-2 rounded-lg text-white text-sm font-semibold" style={{ backgroundColor: accent }}>Create Coupon</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default OwnerDiscounts;