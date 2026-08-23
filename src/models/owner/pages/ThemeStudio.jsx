import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
    Palette, Check, Sparkles, Eye, Lock, ExternalLink,
    Save, CheckCircle2, X
} from 'lucide-react';
import { THEME_CATALOG, findThemeById } from '../../../themes/themeCatalog';
import { useStore } from '../../../store/useStore';

const COLOR_PRESETS = [
    '#881337', // Jamdani Maroon / Royal Crimson
    '#d97706', // Festive Gold / Zari
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#0284c7', // Sky
    '#059669', // Emerald
    '#be185d', // Velvet Rose
    '#0f172a', // Onyx Black
];

const ThemeStudio = () => {
    const { shop, accent } = useOutletContext();
    const { setShopActiveTheme, updateShop, showToast } = useStore();

    const [previewTheme, setPreviewTheme] = useState(null); // theme object for preview modal
    const [customAccent, setCustomAccent] = useState(shop.accent || '#881337');
    const [tagline, setTagline] = useState(shop.tagline || '');
    const [bannerUrl, setBannerUrl] = useState(shop.banner || '');

    const activeThemeId = shop.activeTheme || shop.active_theme || 'theme-bangla-fusion';
    const currentTheme = findThemeById(activeThemeId);
    const allowedThemes = Array.isArray(shop.permissions?.allowedThemes) && shop.permissions.allowedThemes.length > 0 
        ? shop.permissions.allowedThemes 
        : ['theme-bangla-fusion', 'theme-streetwear', 'theme-luxury', 'theme-resort', 'theme-viral'];

    const handleApplyTheme = (themeId) => {
        setShopActiveTheme(shop.id, themeId);
        showToast(`Theme activated! Your live store is now using "${findThemeById(themeId).name}"`, 'success');
        if (previewTheme) setPreviewTheme(null);
    };

    const handleSaveBranding = (e) => {
        e.preventDefault();
        updateShop(shop.id, {
            accent: customAccent,
            tagline,
            banner: bannerUrl,
        });
        showToast('Boutique visual branding updated!', 'success');
    };

    return (
        <div className="space-y-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Theme & Template Studio</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Customize storefront aesthetics, switch templates in 1-click, and preview live customer rendering for {shop.name}.
                    </p>
                </div>
                <Link
                    to={`/shop/${shop.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-lg transition active:scale-95"
                    style={{ backgroundColor: accent }}
                >
                    <ExternalLink size={15} /> View Live Storefront
                </Link>
            </div>

            {/* Active Theme Highlight Banner */}
            <div
                className="rounded-3xl p-5 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${accent}, #0f172a)` }}
            >
                <div className="space-y-2 max-w-xl z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur">
                        <Sparkles size={13} /> Current Active Template
                    </div>
                    <h2 className="text-xl sm:text-3xl font-black">{currentTheme.name}</h2>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                        {currentTheme.description}
                    </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 z-10 shrink-0 w-full sm:w-auto flex-wrap">
                    <button
                        onClick={() => setPreviewTheme(currentTheme)}
                        className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur border border-white/20 transition flex items-center justify-center gap-1.5"
                    >
                        <Eye size={14} /> Fullscreen Preview
                    </button>
                    <Link
                        to={`/shop/${shop.slug}`}
                        target="_blank"
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white text-slate-900 font-extrabold text-xs shadow hover:bg-slate-50 transition text-center"
                    >
                        Open Live Store
                    </Link>
                </div>
            </div>

            {/* Available Theme Templates Catalog */}
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Available Designer Themes</h3>
                    <p className="text-xs text-slate-500">
                        Choose any template permitted by Super Admin. Switch styles instantly without losing products or catalog data.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {THEME_CATALOG.map((th) => {
                        const isActive = activeThemeId === th.id;
                        const isPermitted = allowedThemes.includes(th.id);

                        return (
                            <div
                                key={th.id}
                                className={`bg-white rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between ${isActive ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200'}`}
                            >
                                <div>
                                    {/* Thumbnail Preview */}
                                    <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                                        <img src={th.previewImage} alt={th.name} className="w-full h-full object-cover" />
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            {isActive && (
                                                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-600 text-white shadow">
                                                    ✓ Active on Store
                                                </span>
                                            )}
                                            {!isPermitted && (
                                                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-slate-900/90 text-white backdrop-blur flex items-center gap-1">
                                                    <Lock size={12} /> Locked by Admin
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="p-6 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-indigo-600">{th.category}</span>
                                            <span className="text-xs font-mono text-slate-400 font-bold">{th.tier}</span>
                                        </div>
                                        <h4 className="text-lg font-extrabold text-slate-900">{th.name}</h4>
                                        <p className="text-xs text-slate-500 leading-relaxed">{th.description}</p>

                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {th.features.map((f, i) => (
                                                <span key={i} className="text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-md">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Actions */}
                                <div className="p-6 pt-0 flex items-center justify-between gap-3 border-t border-slate-100 mt-4">
                                    <button
                                        onClick={() => setPreviewTheme(th)}
                                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition flex items-center gap-1.5"
                                    >
                                        <Eye size={14} /> Preview
                                    </button>

                                    {isActive ? (
                                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                            <CheckCircle2 size={15} /> Currently Live
                                        </span>
                                    ) : isPermitted ? (
                                        <button
                                            onClick={() => handleApplyTheme(th.id)}
                                            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow transition active:scale-95"
                                        >
                                            Activate Theme
                                        </button>
                                    ) : (
                                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                            <Lock size={13} /> Requires Plan Upgrade
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Visual Customizer Form */}
            <form onSubmit={handleSaveBranding} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Palette size={18} className="text-indigo-600" /> Boutique Visual Customizer
                    </h3>
                    <p className="text-xs text-slate-500">Fine-tune brand colors, hero photography, and store pitch.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Brand Color Presets */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Primary Accent Color Swatch
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                            {COLOR_PRESETS.map((color) => (
                                <button
                                    type="button"
                                    key={color}
                                    onClick={() => setCustomAccent(color)}
                                    className={`w-9 h-9 rounded-2xl transition border-2 ${customAccent === color ? 'border-slate-900 scale-110 shadow-md ring-2 ring-indigo-500/20' : 'border-transparent hover:scale-105'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                            <input
                                type="color"
                                value={customAccent}
                                onChange={(e) => setCustomAccent(e.target.value)}
                                className="w-9 h-9 rounded-2xl cursor-pointer border border-slate-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Storefront Tagline
                        </label>
                        <input
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            placeholder="e.g. Curated Contemporary Fashion & Apparel"
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Hero Banner Image URL
                        </label>
                        <input
                            value={bannerUrl}
                            onChange={(e) => setBannerUrl(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center gap-1.5"
                        style={{ backgroundColor: customAccent }}
                    >
                        <Save size={15} /> Save Brand Styling
                    </button>
                </div>
            </form>

            {/* Theme Live Preview Modal */}
            {previewTheme && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setPreviewTheme(null)} />
                    
                    <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
                        
                        {/* Header */}
                        <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                            <div>
                                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                                    <Palette size={16} style={{ color: previewTheme.accent }} /> Preview: {previewTheme.name}
                                </h3>
                                <p className="text-xs text-slate-500">Live preview simulation of your products in this theme.</p>
                            </div>
                            <button onClick={() => setPreviewTheme(null)} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Preview Mockup Body */}
                        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-slate-50/50">
                            {/* Simulated Hero */}
                            <div
                                className="rounded-2xl p-8 text-white text-center shadow-lg"
                                style={{ background: `linear-gradient(135deg, ${previewTheme.accent}, #0f172a)` }}
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur">
                                    {previewTheme.subtitle}
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black mt-3">{shop.name}</h2>
                                <p className="text-xs text-white/80 mt-1 max-w-md mx-auto">{shop.tagline}</p>
                            </div>

                            {/* Simulated Products Grid */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                                    Your Product Catalog ({shop.products?.length || 0} styles):
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {(shop.products || []).slice(0, 4).map((p) => (
                                        <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-2.5 shadow-sm text-xs">
                                            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-2">
                                                {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">{p.emoji}</div>}
                                            </div>
                                            <p className="font-bold text-slate-900 truncate">{p.name}</p>
                                            <p className="font-black text-slate-900 mt-1">${p.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <button
                                onClick={() => setPreviewTheme(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
                            >
                                Close Preview
                            </button>
                            <button
                                onClick={() => handleApplyTheme(previewTheme.id)}
                                className="px-6 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center gap-1.5"
                                style={{ backgroundColor: previewTheme.accent }}
                            >
                                <Check size={15} /> Apply "{previewTheme.name}" to Live Store
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeStudio;
