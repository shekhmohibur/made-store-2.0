import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    CheckCircle2, Sparkles, User, Mail, Palette, X, RefreshCw
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { THEME_CATALOG } from '../../../themes/themeCatalog';

const PendingApprovals = () => {
    const { shops, approveShop, rejectShop, showToast, registerMerchantSignup, isSyncing, syncWithBackend } = useStore();

    const [selectedShop, setSelectedShop] = useState(null); // Modal for approving with custom permissions
    const [allowedThemes, setAllowedThemes] = useState([
        'theme-streetwear',
        'theme-luxury',
        'theme-resort',
        'theme-viral',
    ]);
    const [customDomain, setCustomDomain] = useState(true);
    const [maxProducts, setMaxProducts] = useState(500);

    const pendingShops = shops.filter((s) => s.status === 'Pending');

    const openApproveModal = (shop) => {
        setSelectedShop(shop);
        setAllowedThemes(['theme-streetwear', 'theme-luxury', 'theme-resort', 'theme-viral']);
        setCustomDomain(true);
        setMaxProducts(shop.plan === 'Pro' ? 1000 : 500);
    };

    const handleConfirmApproval = () => {
        if (!selectedShop) return;
        approveShop(selectedShop.id, {
            allowedThemes,
            canUseCoupons: true,
            customDomain,
            maxProducts,
        });
        setSelectedShop(null);
    };

    const toggleTheme = (themeId) => {
        setAllowedThemes((prev) =>
            prev.includes(themeId) ? prev.filter((id) => id !== themeId) : [...prev, themeId]
        );
    };

    return (
        <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Merchant Approvals Queue</h1>
                        {pendingShops.length > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                                {pendingShops.length} Awaiting
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Review new clothing brand applications, authorize platform access, and grant theme & feature permissions.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => syncWithBackend(false)}
                        disabled={isSyncing}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                        {isSyncing ? 'Syncing...' : 'Refresh Queue'}
                    </button>
                    <Link
                        to="/panel/shops"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition active:scale-95"
                    >
                        Active Boutiques ({shops.length})
                    </Link>
                </div>
            </div>

            {/* Content */}
            {pendingShops.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow">
                        <CheckCircle2 size={36} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">All Approvals Clear!</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                        There are currently no merchant signups waiting in the queue. All brand stores have been approved and activated.
                    </p>
                    <div className="pt-2 flex items-center justify-center gap-3">
                        <Link
                            to="/panel/shops"
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow hover:bg-indigo-700 transition"
                        >
                            View Active Boutiques ({shops.length})
                        </Link>
                        <Link
                            to="/panel/create-shop"
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                        >
                            Create Storefront Manually
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {pendingShops.map((shp) => (
                        <div
                            key={shp.id}
                            className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                        >
                            {/* Brand Info */}
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base shadow"
                                        style={{ backgroundColor: shp.accent || '#6366f1' }}
                                    >
                                        {shp.logo || 'NB'}
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-extrabold text-slate-900 text-lg">{shp.name}</h3>
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                                                Pending Review
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                                {shp.plan} Tier
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-mono">
                                            https://{shp.slug}.trivora.top
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                                    {shp.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
                                    <div className="flex items-center gap-2">
                                        <User size={14} className="text-slate-400" />
                                        <span>Founder: <strong className="text-slate-800">{shp.ownerName}</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail size={14} className="text-slate-400" />
                                        <span>{shp.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Palette size={14} className="text-indigo-500" />
                                        <span>Initial Theme: <strong className="text-slate-800">{shp.activeTheme}</strong></span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 lg:flex-col lg:w-48 shrink-0">
                                <button
                                    onClick={() => openApproveModal(shp)}
                                    className="flex-1 lg:w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={16} /> Approve & Grant Access
                                </button>
                                <button
                                    onClick={() => rejectShop(shp.id, 'Identity verification incomplete')}
                                    className="px-4 py-3 rounded-2xl border border-slate-200 text-rose-600 font-bold text-xs hover:bg-rose-50 transition"
                                >
                                    Reject / Decline
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Approval & Permission Granter Modal */}
            {selectedShop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setSelectedShop(null)} />
                    
                    <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
                        
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                    <CheckCircle2 size={22} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-base">Authorize "{selectedShop.name}"</h3>
                                    <p className="text-xs text-slate-500">Configure theme access and feature permissions.</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedShop(null)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-5 text-xs">
                            
                            {/* Themes Permission Toggle */}
                            <div>
                                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                                    Allowed Themes / Templates for Merchant:
                                </label>
                                <div className="space-y-2">
                                    {THEME_CATALOG.map((th) => {
                                        const isAllowed = allowedThemes.includes(th.id);
                                        return (
                                            <div
                                                key={th.id}
                                                onClick={() => toggleTheme(th.id)}
                                                className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition ${isAllowed ? 'border-emerald-500 bg-emerald-50/50 text-slate-900' : 'border-slate-200 bg-slate-50 text-slate-400'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-4 h-4 rounded-full border border-slate-300" style={{ backgroundColor: th.accent }} />
                                                    <div>
                                                        <p className="font-bold text-xs">{th.name}</p>
                                                        <p className="text-[10px] text-slate-500">{th.tier} Tier</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${isAllowed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                    {isAllowed ? 'Permission Granted' : 'Locked'}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Additional Capabilities */}
                            <div className="space-y-3 pt-3 border-t border-slate-100">
                                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                                    Store Capacities:
                                </label>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div>
                                        <p className="font-bold text-slate-800">Custom Domain Mapping</p>
                                        <p className="text-[10px] text-slate-400">Allow custom .com/.store domain mapping</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={customDomain}
                                        onChange={(e) => setCustomDomain(e.target.checked)}
                                        className="w-4 h-4 accent-emerald-600 rounded"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                                    <div>
                                        <p className="font-bold text-slate-800">Inventory SKU Style Limit</p>
                                        <p className="text-[10px] text-slate-400">Maximum active apparel catalog items</p>
                                    </div>
                                    <select
                                        value={maxProducts}
                                        onChange={(e) => setMaxProducts(Number(e.target.value))}
                                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                                    >
                                        <option value={100}>100 styles</option>
                                        <option value={500}>500 styles</option>
                                        <option value={1000}>1,000 styles</option>
                                        <option value={9999}>Unlimited</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setSelectedShop(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmApproval}
                                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95 flex items-center gap-1.5"
                            >
                                <CheckCircle2 size={15} /> Confirm Approval & Launch Store
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingApprovals;
