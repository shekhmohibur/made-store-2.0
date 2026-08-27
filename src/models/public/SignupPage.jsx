import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    Sparkles, Store, Palette, User, Mail, Loader2,
    CheckCircle2, X, RefreshCw
} from 'lucide-react';
import { THEME_CATALOG } from '../../themes/themeCatalog';
import { ApiService } from '../../services/api';
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

    // 6-Digit OTP Verification State
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [isSendingOtp, setIsSendingOtp] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const timerRef = useRef(null);

    useEffect(() => {
        if (resendCooldown > 0) {
            timerRef.current = setTimeout(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearTimeout(timerRef.current);
    }, [resendCooldown]);

    const slug = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'your-brand';

    // Step 1: Validate inputs and trigger 6-digit OTP email
    const handleSubmit = async (e) => {
        e.preventDefault();
        const cleanEmail = form.email.trim().toLowerCase();

        if (!form.name.trim() || !form.ownerName.trim() || !cleanEmail) {
            showToast('Please fill in all required brand fields', 'warning');
            return;
        }

        if (!cleanEmail.includes('@')) {
            showToast('Please enter a valid email address', 'warning');
            return;
        }

        if (!form.password || form.password.length < 6) {
            showToast('Password must be at least 6 characters long', 'warning');
            return;
        }

        setIsSendingOtp(true);
        try {
            const res = await ApiService.sendSignupOtp(cleanEmail);
            if (res && res.status === 'success') {
                showToast(res.message || '6-digit verification code sent to ' + cleanEmail, 'success');
                setIsOtpModalOpen(true);
                setResendCooldown(60);
                if (res.dev_hint) {
                    setOtpCode(res.dev_hint);
                }
            } else {
                showToast(res?.message || 'An error occurred while sending verification email', 'error');
            }
        } catch (err) {
            showToast(err?.message || 'Failed to dispatch verification code', 'error');
        } finally {
            setIsSendingOtp(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (resendCooldown > 0 || isSendingOtp) return;
        setIsSendingOtp(true);
        try {
            const res = await ApiService.sendSignupOtp(form.email.trim().toLowerCase());
            if (res && res.status === 'success') {
                showToast('New 6-digit verification code sent!', 'success');
                setResendCooldown(60);
                if (res.dev_hint) {
                    setOtpCode(res.dev_hint);
                }
            } else {
                showToast(res?.message || 'Failed to resend code', 'error');
            }
        } catch (err) {
            showToast(err?.message || 'Failed to resend verification code', 'error');
        } finally {
            setIsSendingOtp(false);
        }
    };

    // Step 2: Verify 6-digit OTP and complete merchant registration
    const handleVerifyOtpAndSignup = async (e) => {
        e.preventDefault();
        const cleanEmail = form.email.trim().toLowerCase();
        const cleanCode = otpCode.trim();

        if (!cleanCode || cleanCode.length < 6) {
            showToast('Please enter the full 6-digit verification code', 'warning');
            return;
        }

        setIsVerifyingOtp(true);
        try {
            const verifyRes = await ApiService.verifySignupOtp(cleanEmail, cleanCode);
            if (verifyRes && verifyRes.status === 'success') {
                const selectedThemeObj = THEME_CATALOG.find((t) => t.id === form.theme) || THEME_CATALOG[0];

                registerMerchantSignup({
                    ...form,
                    email: cleanEmail,
                    slug,
                    accent: selectedThemeObj.accent,
                });

                showToast('Email verified! Boutique registration submitted.', 'success');
                setIsOtpModalOpen(false);
                navigate('/pending-approval');
            } else {
                showToast(verifyRes?.message || 'Invalid or expired 6-digit code', 'error');
            }
        } catch (err) {
            showToast(err?.message || 'Verification failed. Please check the code.', 'error');
        } finally {
            setIsVerifyingOtp(false);
        }
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
                        Submit your boutique details. You will receive a 6-digit verification code to confirm your email.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8">
                    {/* Section 1: Brand Info */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-2.5">
                            <Store size={17} className="text-indigo-400" /> 1. Boutique Brand Identity
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Brand Store Name *</label>
                                <input
                                    required
                                    placeholder="e.g. Urban Silk Studio"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Fashion Specialty / Niche *</label>
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

                    {/* Section 2: Owner Contact & Credentials */}
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
                                <label className={labelClass}>Business Email * (OTP will be sent here)</label>
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
                                    placeholder="At least 6 characters"
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
                            You will verify your email with a 6-digit code before submission.
                        </p>
                        <button
                            type="submit"
                            disabled={isSendingOtp}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-black text-xs shadow-xl shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                        >
                            {isSendingOtp ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Sending 6-Digit Code...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={16} /> Continue to Verification
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>

            {/* 6-Digit Email Verification Modal */}
            {isOtpModalOpen && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsOtpModalOpen(false)}
                            className="absolute top-6 right-6 text-slate-500 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition"
                        >
                            <X size={18} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-3">
                                <Mail size={24} />
                            </div>
                            <h2 className="text-xl font-black text-white">Verify Your Email</h2>
                            <p className="text-xs text-slate-400 mt-1">
                                We sent a 6-digit verification code to <span className="text-white font-bold">{form.email}</span>
                            </p>
                        </div>

                        <form onSubmit={handleVerifyOtpAndSignup} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2">
                                    Enter 6-Digit Code
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="000000"
                                    required
                                    autoFocus
                                    className="w-full bg-slate-950 border border-indigo-500/50 focus:border-indigo-500 rounded-2xl text-center py-3.5 text-2xl font-mono tracking-[0.4em] text-indigo-300 placeholder:text-slate-700 focus:outline-none transition shadow-inner"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isVerifyingOtp}
                                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                            >
                                {isVerifyingOtp ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Verifying Code...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} /> Verify & Complete Registration
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setIsOtpModalOpen(false)}
                                    className="hover:text-white transition"
                                >
                                    Edit Email
                                </button>
                                <button
                                    type="button"
                                    disabled={resendCooldown > 0 || isSendingOtp}
                                    onClick={handleResendOtp}
                                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition disabled:opacity-50"
                                >
                                    <RefreshCw size={12} className={isSendingOtp ? 'animate-spin' : ''} />
                                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SignupPage;
