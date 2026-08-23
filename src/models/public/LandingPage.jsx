import { Link } from 'react-router-dom';
import {
    Sparkles, ArrowRight, Shield, ExternalLink, CheckCircle2, LogOut, LayoutDashboard
} from 'lucide-react';
import { THEME_CATALOG } from '../../themes/themeCatalog';
import ToastContainer from '../../components/common/ToastContainer';
import { useStore } from '../../store/useStore';

const PLANS = [
    {
        name: 'Starter',
        price: '$0',
        period: 'forever free',
        desc: 'Ideal for emerging streetwear drops and independent boutique creators.',
        features: ['1 Live Brand Storefront', 'Up to 50 Apparel Styles', 'Standard Streetwear Theme', '5% Platform Commission', 'Community Support'],
        cta: 'Start Free Signup',
        tier: 'Free',
        popular: false,
    },
    {
        name: 'Growth Boutique',
        price: '$29',
        period: 'per month',
        desc: 'For scaling apparel labels needing viral flash sales and multiple themes.',
        features: ['Access to All 4 Luxury Themes', 'Up to 500 Apparel Styles', 'Discount & Promo Engine', '2.5% Platform Commission', 'Priority Email Support', 'Custom Subdomains'],
        cta: 'Launch Growth Store',
        tier: 'Growth',
        popular: true,
    },
    {
        name: 'Haute Pro',
        price: '$79',
        period: 'per month',
        desc: 'Full enterprise capabilities for premier fashion houses and multi-location labels.',
        features: ['VIP Atelier & Custom Themes', 'Unlimited Inventory Catalog', '1.2% Platform Commission', 'Custom Domain SSL Included', '24/7 Dedicated Concierge', 'Multi-staff Access'],
        cta: 'Get Haute Pro',
        tier: 'Pro',
        popular: false,
    },
];

const LandingPage = () => {
    const { currentAuthUser, logout } = useStore();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
            <ToastContainer />

            {/* Public Header */}
            <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
                    <Link to="/" className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-500/25">
                            T
                        </span>
                        <div>
                            <span className="font-black text-xl tracking-tight text-white">Trivora Commerce</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Multi-Tenant Fashion Cloud</p>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
                        <a href="#themes" className="hover:text-white transition">Themes & Templates</a>
                        <a href="#how-it-works" className="hover:text-white transition">Platform Workflow</a>
                        <a href="#pricing" className="hover:text-white transition">Pricing Plans</a>
                        {currentAuthUser?.role === 'Super Admin' && (
                            <Link to="/panel" className="hover:text-indigo-400 transition flex items-center gap-1">
                                <Shield size={14} /> Super Admin
                            </Link>
                        )}
                    </nav>

                    <div className="flex items-center gap-3">
                        {currentAuthUser ? (
                            <>
                                <Link
                                    to={currentAuthUser.role === 'Super Admin' ? '/panel' : currentAuthUser.status === 'Pending' ? '/pending-approval' : '/owner'}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/25 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition"
                                >
                                    <LayoutDashboard size={14} />
                                    <span>{currentAuthUser.role === 'Super Admin' ? 'Admin Panel' : 'Merchant Portal'}</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => logout()}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold transition cursor-pointer"
                                    title="Sign Out Session"
                                >
                                    <LogOut size={13} />
                                    <span className="hidden sm:inline">Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 rounded-xl text-slate-300 hover:text-white text-xs font-bold transition"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95"
                                >
                                    <Sparkles size={14} /> Create Brand Store
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-16 sm:pt-24 pb-20 px-4 sm:px-6 overflow-hidden">
                {/* Glow orbs */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-pink-600/20 to-purple-600/10 blur-[120px] pointer-events-none rounded-full" />

                <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-bold shadow-inner">
                        <Sparkles size={14} className="text-pink-400 animate-spin" />
                        <span>The Next-Gen SaaS Engine for High-Fashion Clothing Brands</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.1]">
                        Launch Your Luxury <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400">
                            Clothing Storefront
                        </span> in Minutes.
                    </h1>

                    <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Sign up your clothing brand, get authorized by Super Admin, choose from stunning designer templates, list products, and start selling worldwide with high-converting checkouts.
                    </p>

                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-indigo-600/30 transition active:scale-95"
                        >
                            <Sparkles size={18} /> Apply for Brand Storefront <ArrowRight size={16} />
                        </Link>
                        <Link
                            to={currentAuthUser ? (currentAuthUser.role === 'Super Admin' ? '/panel' : currentAuthUser.status === 'Pending' ? '/pending-approval' : '/owner') : '/login'}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-sm transition"
                        >
                            <Shield size={18} className="text-indigo-400" />
                            <span>
                                {currentAuthUser
                                    ? currentAuthUser.role === 'Super Admin'
                                        ? 'Enter Super Admin Panel'
                                        : 'Open Merchant Portal'
                                    : 'Merchant & Admin Sign In'}
                            </span>
                        </Link>
                    </div>

                    {/* Stats strip */}
                    <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
                        <div>
                            <p className="text-3xl font-black text-white">4</p>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">Luxury Theme Engines</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-indigo-400">100%</p>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">Approval-Gated Access</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-pink-400">&lt; 1 min</p>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">Template Switch Speed</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-emerald-400">$0</p>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">Free Starter Tier</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works (The exact requested lifecycle) */}
            <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-slate-900/50 border-y border-slate-800">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Platform Lifecycle</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white">How Trivora Multi-Tenant Works</h2>
                        <p className="text-sm text-slate-400">
                            A secure, approval-first platform connecting clothing founders with high-performance eCommerce tools.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Step 1 */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative">
                            <span className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-black text-sm mb-4">
                                01
                            </span>
                            <h3 className="font-extrabold text-white text-base">Brand Registration</h3>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                Prospective fashion brand enters their brand name, slug, owner email, and selects an initial theme.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative">
                            <span className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm mb-4">
                                02
                            </span>
                            <h3 className="font-extrabold text-white text-base">Super Admin Review</h3>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                Super Admin receives the pending signup in the Approvals Queue, verifies brand criteria, and unlocks access with 1 click.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative">
                            <span className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-500/30 text-pink-400 flex items-center justify-center font-black text-sm mb-4">
                                03
                            </span>
                            <h3 className="font-extrabold text-white text-base">Theme Studio & Inventory</h3>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                Approved owner logs in to their Merchant Portal, switches themes in Theme Studio, adds apparel styles, and creates discount coupons.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative">
                            <span className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black text-sm mb-4">
                                04
                            </span>
                            <h3 className="font-extrabold text-white text-base">Live Customer Store</h3>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                Customers browse the live boutique, add to bag, apply coupons, and checkout with instant printable order receipts.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Themes & Templates Showcase */}
            <section id="themes" className="py-20 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-pink-400">Template Catalog</span>
                            <h2 className="text-3xl sm:text-4xl font-black text-white mt-1">4 Designer Fashion Themes</h2>
                            <p className="text-sm text-slate-400 mt-1">
                                Every theme is engineered specifically for fashion & clothing retail with high-converting features.
                            </p>
                        </div>
                        <Link
                            to="/owner/themes"
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                        >
                            Open Theme Studio in Merchant Portal →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {THEME_CATALOG.map((th) => (
                            <div
                                key={th.id}
                                className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition flex flex-col group"
                            >
                                <div className="relative aspect-[16/9] bg-slate-950 overflow-hidden">
                                    <img
                                        src={th.previewImage}
                                        alt={th.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-slate-950/80 text-white backdrop-blur border border-white/10">
                                            {th.tier} Tier
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span
                                            className="w-6 h-6 rounded-full border-2 border-white shadow"
                                            style={{ backgroundColor: th.accent }}
                                        />
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold mb-1">
                                            <span>{th.category}</span>
                                        </div>
                                        <h3 className="text-xl font-extrabold text-white">{th.name}</h3>
                                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{th.description}</p>

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {th.features.map((f, i) => (
                                                <span key={i} className="text-[11px] font-semibold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                                                    ✓ {f}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                                        <Link
                                            to={th.id === 'theme-viral' ? '/shop/fb-dress-store' : th.id === 'theme-resort' ? '/shop/linen-and-co' : '/shop/urban-threads'}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-indigo-400"
                                        >
                                            <ExternalLink size={13} /> Explore Live Storefront
                                        </Link>
                                        <Link
                                            to={`/signup?theme=${th.id}`}
                                            className="px-4 py-2 rounded-xl text-xs font-extrabold text-white shadow transition active:scale-95"
                                            style={{ backgroundColor: th.accent }}
                                        >
                                            Use This Theme
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-4 sm:px-6 bg-slate-900/40 border-t border-slate-800">
                <div className="max-w-7xl mx-auto space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Simple Transparent Pricing</span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white">SaaS Plans for Every Stage</h2>
                        <p className="text-sm text-slate-400">
                            Start for free and upgrade as your fashion catalog and revenue grow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.name}
                                className={`rounded-3xl p-8 flex flex-col justify-between relative transition ${plan.popular ? 'bg-gradient-to-b from-slate-900 to-indigo-950/40 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'bg-slate-900 border border-slate-800'}`}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg">
                                        Most Popular
                                    </span>
                                )}

                                <div>
                                    <h3 className="text-xl font-extrabold text-white">{plan.name}</h3>
                                    <p className="text-xs text-slate-400 mt-1 min-h-[32px]">{plan.desc}</p>
                                    <div className="flex items-baseline gap-1 mt-4 mb-6">
                                        <span className="text-4xl font-black text-white">{plan.price}</span>
                                        <span className="text-xs text-slate-400 font-semibold">/{plan.period}</span>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                                        {plan.features.map((feat, i) => (
                                            <div key={i} className="flex items-center gap-2.5 text-slate-300">
                                                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <Link
                                        to={`/signup?plan=${plan.tier}`}
                                        className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${plan.popular ? 'bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                                    >
                                        {plan.cta}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-slate-800 py-12 px-4 sm:px-6 text-xs text-slate-500">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow">
                            T
                        </span>
                        <span className="font-bold text-slate-300">Trivora Commerce 2.0</span>
                        <span>· Super Admin & Multi-Tenant Clothing SaaS</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/signup" className="hover:text-white transition">Merchant Signup</Link>
                        <Link to="/login" className="hover:text-white transition">Log In</Link>
                        <Link to="/panel" className="hover:text-white transition">Super Admin</Link>
                        <Link to="/owner" className="hover:text-white transition">Owner Portal</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
