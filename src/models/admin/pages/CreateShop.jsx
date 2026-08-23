import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Store, Check, User } from 'lucide-react';
import { useStore } from '../../../store/useStore';
import ImageUploadInput from '../../../components/common/ImageUploadInput';

const COLOR_PRESETS = [
    { name: 'Indigo Aura', hex: '#6366f1' },
    { name: 'Velvet Pink', hex: '#ec4899' },
    { name: 'Cyan Breeze', hex: '#0284c7' },
    { name: 'Emerald Luxe', hex: '#059669' },
    { name: 'Amber Gold', hex: '#d97706' },
    { name: 'Royal Violet', hex: '#8b5cf6' },
];

const PLAN_FEATURES = {
    Free: { price: '$0/mo', fee: '5% commission', products: '50 styles', storage: '5 GB', support: 'Community' },
    Growth: { price: '$29/mo', fee: '2.5% commission', products: '500 styles', storage: '50 GB', support: 'Priority Email' },
    Pro: { price: '$79/mo', fee: '1.2% commission', products: 'Unlimited', storage: '500 GB', support: '24/7 Dedicated' },
};

const CreateShop = () => {
    const navigate = useNavigate();
    const { addShop, showToast } = useStore();

    const [form, setForm] = useState({
        name: '',
        tagline: '',
        description: '',
        category: "Women's Fashion",
        plan: 'Growth',
        accent: '#6366f1',
        ownerName: '',
        email: '',
        phone: '',
        populateStarterItems: true,
    });

    const slug = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'your-shop-slug';
    const logoInitials = (form.name || 'NB').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.ownerName.trim() || !form.email.trim()) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }

        addShop({
            name: form.name,
            tagline: form.tagline,
            description: form.description,
            category: form.category,
            plan: form.plan,
            accent: form.accent,
            ownerName: form.ownerName,
            email: form.email,
            phone: form.phone,
        });

        navigate('/panel/shops');
    };

    const inputClass =
        'w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition';
    const labelClass = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5';

    return (
        <div className="space-y-6">
            
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition shadow-sm"
                    title="Go Back"
                >
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Provision New Boutique</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Deploy a new high-conversion multi-tenant fashion storefront.</p>
                </div>
            </div>

            <form className="grid grid-cols-1 lg:grid-cols-3 gap-6" onSubmit={handleSubmit}>
                
                {/* Left Form (2 Columns) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Basic Info */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                            <Store className="text-indigo-600" size={20} />
                            <div>
                                <h2 className="font-bold text-slate-900 text-base">Storefront Identity</h2>
                                <p className="text-xs text-slate-400">Public branding details visible to customers.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Boutique Name *</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. Velvet & Silk Atelier"
                                    required
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Generated Live URL Slug</label>
                                <div className="flex items-center px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-600">
                                    <span>https://</span>
                                    <span className="font-bold text-indigo-600">{slug}</span>
                                    <span>.trivora.top</span>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Tagline / Subheading</label>
                                <input
                                    value={form.tagline}
                                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. Contemporary Occasion Wear & Bespoke Silhouettes"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Boutique Description</label>
                                <textarea
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className={inputClass}
                                    placeholder="Brief narrative about the brand, aesthetic, and curated catalog..."
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Fashion Category</label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className={inputClass}
                                >
                                    <option>Women's Fashion</option>
                                    <option>Men's Streetwear</option>
                                    <option>Occasion & Dresses</option>
                                    <option>Linen & Resort Wear</option>
                                    <option>Unisex Casuals</option>
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Brand Accent Color</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={form.accent}
                                        onChange={(e) => setForm({ ...form, accent: e.target.value })}
                                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5 shrink-0"
                                    />
                                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                                        {COLOR_PRESETS.map((c) => (
                                            <button
                                                type="button"
                                                key={c.hex}
                                                onClick={() => setForm({ ...form, accent: c.hex })}
                                                className={`w-6 h-6 rounded-full border-2 transition ${form.accent === c.hex ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                                                style={{ backgroundColor: c.hex }}
                                                title={c.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-2 pt-2">
                                <ImageUploadInput
                                    value={form.banner || ''}
                                    onChange={(compressedDataUrl) => setForm({ ...form, banner: compressedDataUrl })}
                                    label="Boutique Hero Storefront Banner (Optional)"
                                    maxWidth={1200}
                                    maxHeight={600}
                                    quality={0.65}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Owner Setup */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                            <User className="text-indigo-600" size={20} />
                            <div>
                                <h2 className="font-bold text-slate-900 text-base">Merchant Owner Account</h2>
                                <p className="text-xs text-slate-400">Primary administrator login credentials.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Owner Full Name *</label>
                                <input
                                    value={form.ownerName}
                                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. Chloe Dubois"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Owner Email Address *</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className={inputClass}
                                    placeholder="owner@brand.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Direct Phone Contact</label>
                                <input
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className={inputClass}
                                    placeholder="+1 (555) 309-8812"
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Temporary Master Password</label>
                                <input
                                    type="password"
                                    defaultValue="Boutique2025!"
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Live Preview Card & Plan Selector */}
                <div className="space-y-6">
                    
                    {/* Live Preview Card */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Preview Card</h3>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full">
                                Realtime
                            </span>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 overflow-hidden shadow-inner">
                            <div className="flex items-center gap-3.5">
                                <span
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md transition-colors"
                                    style={{ backgroundColor: form.accent }}
                                >
                                    {logoInitials}
                                </span>
                                <div className="min-w-0">
                                    <p className="font-extrabold text-slate-900 text-sm truncate">{form.name || 'Your Boutique Name'}</p>
                                    <p className="text-xs text-slate-500 truncate">{form.tagline || 'Tagline will display here'}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                                <span>Tier: <strong className="text-indigo-600">{form.plan}</strong></span>
                                <span className="font-mono text-[11px] text-slate-400">/{slug}</span>
                            </div>
                        </div>
                    </div>

                    {/* SaaS Plan Selector */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select SaaS Subscription Tier</h3>
                        
                        <div className="space-y-2.5">
                            {['Free', 'Growth', 'Pro'].map((p) => {
                                const details = PLAN_FEATURES[p];
                                const isSel = form.plan === p;
                                return (
                                    <div
                                        key={p}
                                        onClick={() => setForm({ ...form, plan: p })}
                                        className={`p-3.5 rounded-2xl border cursor-pointer transition ${isSel ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSel ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                                                    {isSel && <Check size={10} />}
                                                </div>
                                                <span className="font-bold text-sm text-slate-800">{p}</span>
                                            </div>
                                            <span className="text-xs font-bold text-indigo-700">{details.price}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mt-1 pl-6">
                                            {details.fee} · {details.products} · {details.support}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit Card */}
                    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
                        <h3 className="font-bold text-base">Ready to Deploy?</h3>
                        <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
                            Upon provisioning, the storefront routes, inventory node, and owner management portal are immediately activated.
                        </p>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/40 active:scale-95 transition"
                        >
                            <Save size={17} /> Provision Boutique Now
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateShop;