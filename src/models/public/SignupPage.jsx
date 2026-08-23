import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Sparkles, Store, Palette, User
} from 'lucide-react';
import { THEME_CATALOG } from '../../themes/themeCatalog';
import { useStore } from '../../store/useStore';
import ToastContainer from '../../components/common/ToastContainer';

const CATEGORIES = [
    "Streetwear & Contemporary",
    "Luxury & Evening Dresses",
    "Natural Linen & Resort",
    "Casuals & Denim",
    "Activewear & Loungewear",
    "Afro-Fusion & Artisanal",
];

const SignupPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { registerMerchantSignup, showToast } = useStore();

    const initialThemeParam = searchParams.get('theme') || 'theme-streetwear';
    const initialPlanParam = searchParams.get('plan') || 'Growth';

    const [form, setForm] = useState({
        name: '',
        category: CATEGORIES[0],
        tagline: '',
        ownerName: '',
        email: '',
        phone: '',
        password: '',
        theme: initialThemeParam,
        plan: initialPlanParam,
    });

    const slug = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'your-brand';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.ownerName.trim() || !form.email.trim()) {
            showToast('Please fill in all required brand fields', 'warning');
            return;
        }

        const selectedThemeObj = THEME_CATALOG.find((t) => t.id === form.theme) || THEME_CATALOG[0];

        registerMerchantSignup({
            ...form,
            slug,
            accent: selectedThemeObj.accent,
        });

        navigate('/pending-approval');
    };

    const inputClass =
        'w-full px-4 py-3 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition placeholder:text-slate-600';
    const labelClass = 'block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5';

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <ToastContainer />

            {/* Header */}
            <header className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-xs shadow-lg">
                        T
                    </span>
                    <span className="font-extrabold text-white text-base">Trivora Commerce</span>
                </Link>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Already have an approved store?</span>
                    <Link to="/login" className="text-indigo-400 font-bold hover:underline">Log In</Link>
                </div>
            </header>

            {/* Form Container */}
            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
                <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
                        <Sparkles size={13} /> Step 1: Merchant Registration
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white">Apply for Brand Storefront</h1>
                    <p className="text-xs text-slate-400">
                        Submit your boutique details. Our Super Admin team will review and approve your merchant portal.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
                    
                    {/* Section 1: Brand Info */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2.5">
                            <Store size={17} className="text-indigo-400" /> 1. Brand Identity & URL
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Brand / Boutique Name *</label>
                                <input
                                    required
                                    placeholder="e.g. Maison de Noir"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Fashion Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className={inputClass}
                                >
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Storefront Subdomain Slug (Live URL)</label>
                                <div className="flex items-center px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 font-mono">
                                    <span className="text-slate-600">https://</span>
                                    <span className="text-indigo-400 font-bold">{slug}</span>
                                    <span className="text-slate-600">.trivora.top</span>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Brand Tagline / Pitch</label>
                                <input
                                    placeholder="e.g. Handcrafted Japanese raw denim & relaxed tailoring"
                                    value={form.tagline}
                                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Owner Contact */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2.5">
                            <User size={17} className="text-pink-400" /> 2. Merchant Owner Information
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Owner Full Name *</label>
                                <input
                                    required
                                    placeholder="e.g. Amina Yusuf"
                                    value={form.ownerName}
                                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Business Email *</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="amina@yourbrand.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Contact Phone / WhatsApp</label>
                                <input
                                    placeholder="+1 (555) 000-0000"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Account Password *</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Select Initial Theme */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                                <Palette size={17} className="text-indigo-400" /> 3. Select Initial Template / Theme
                            </h2>
                            <span className="text-[11px] text-slate-400">You can switch anytime in Theme Studio</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {THEME_CATALOG.map((th) => {
                                const isSel = form.theme === th.id;
                                return (
                                    <div
                                        key={th.id}
                                        onClick={() => setForm({ ...form, theme: th.id })}
                                        className={`cursor-pointer rounded-2xl border p-3.5 transition flex items-center gap-3.5 ${isSel ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/20' : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'}`}
                                    >
                                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-slate-700">
                                            <img src={th.previewImage} alt={th.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-white text-xs">{th.name}</p>
                                                <span className="text-[10px] font-extrabold text-indigo-400">{th.tier}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{th.subtitle}</p>
                                        </div>
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${isSel ? 'border-indigo-500 bg-indigo-600 text-white font-bold' : 'border-slate-700'}`}>
                                            {isSel && '✓'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section 4: Subscription Plan */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2.5">
                            <Sparkles size={17} className="text-pink-400" /> 4. Choose SaaS Tier
                        </h2>

                        <div className="grid grid-cols-3 gap-3">
                            {['Free', 'Growth', 'Pro'].map((p) => {
                                const isSel = form.plan === p;
                                return (
                                    <button
                                        type="button"
                                        key={p}
                                        onClick={() => setForm({ ...form, plan: p })}
                                        className={`p-3.5 rounded-2xl border text-center transition ${isSel ? 'border-indigo-500 bg-indigo-950/40 text-white font-bold ring-2 ring-indigo-500/20' : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:bg-slate-900'}`}
                                    >
                                        <p className="text-xs font-black">{p} Plan</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{p === 'Free' ? '$0/mo' : p === 'Growth' ? '$29/mo' : '$79/mo'}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit CTA */}
                    <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-400">
                            By clicking submit, your application is sent to Super Admin for approval.
                        </p>
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs shadow-xl shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Sparkles size={16} /> Submit Brand Application
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default SignupPage;
