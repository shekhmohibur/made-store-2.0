import { useState } from 'react';
import {
    X, User, Lock, Mail, Phone, MapPin, ArrowRight,
    AlertCircle, Sparkles, Eye, EyeOff
} from 'lucide-react';
import { useStore } from '../../store/useStore';

/**
 * CustomerAuthModal:
 * Customer Storefront Authentication Modal (Sign In & Register).
 */
const CustomerAuthModal = ({ isOpen, onClose, shop }) => {
    const { customerLogin, customerRegister } = useStore();
    const [tab, setTab] = useState('login'); // 'login' | 'register'
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Login Form State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // Register Form State
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [regAddress, setRegAddress] = useState('');
    const [regCity, setRegCity] = useState('');
    const [regState, setRegState] = useState('');
    const [regZip, setRegZip] = useState('');

    if (!isOpen) return null;

    const accent = shop?.accent || '#18181b';

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            const res = await customerLogin(loginEmail, loginPassword);
            if (res.success) {
                onClose();
            } else {
                setErrorMessage(res.message || 'Invalid email or password');
            }
        } catch {
            setErrorMessage('Authentication service error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            const res = await customerRegister({
                name: regName,
                email: regEmail,
                phone: regPhone,
                password: regPassword,
                address: regAddress,
                city: regCity,
                state: regState,
                zip: regZip,
                shopId: shop?.id || 'ALL',
            });

            if (res.success) {
                onClose();
            } else {
                setErrorMessage(res.message || 'Registration failed');
            }
        } catch {
            setErrorMessage('Registration service error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in font-sans">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95">
                
                {/* Header with Close */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-sm"
                            style={{ backgroundColor: accent }}
                        >
                            <User size={15} />
                        </div>
                        <div>
                            <h3 className="font-serif text-lg font-bold text-slate-900 leading-tight">
                                {shop?.name || 'Boutique'} Customer Portal
                            </h3>
                            <p className="text-[10px] text-slate-400 font-sans tracking-wide">
                                SIGN IN TO TRACK ORDERS & CHECKOUT FASTER
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 m-5 rounded-2xl">
                    <button
                        type="button"
                        onClick={() => { setTab('login'); setErrorMessage(''); }}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                            tab === 'login'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        Customer Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setTab('register'); setErrorMessage(''); }}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition ${
                            tab === 'register'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        Create Account
                    </button>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                    <div className="mx-6 mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                        <AlertCircle size={15} className="shrink-0 text-rose-500" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* Form Content */}
                <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto">
                    {tab === 'login' ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition"
                                        placeholder="jessica@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showLoginPassword ? 'text' : 'password'}
                                        required
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition"
                                        placeholder="••••••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                                        title={showLoginPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showLoginPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 rounded-xl text-white font-bold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                style={{ backgroundColor: accent }}
                            >
                                {isLoading ? 'Signing In...' : 'Sign In to Account'}
                                <ArrowRight size={14} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={regName}
                                        onChange={(e) => setRegName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition"
                                        placeholder="Jessica Miller"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition"
                                        placeholder="jessica@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="tel"
                                            value={regPhone}
                                            onChange={(e) => setRegPhone(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition"
                                            placeholder="+1 (555)..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type={showRegPassword ? 'text' : 'password'}
                                            required
                                            value={regPassword}
                                            onChange={(e) => setRegPassword(e.target.value)}
                                            className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowRegPassword(!showRegPassword)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
                                            title={showRegPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showRegPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Shipping Address (Optional)
                                </label>
                                <div className="relative">
                                    <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={regAddress}
                                        onChange={(e) => setRegAddress(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition"
                                        placeholder="Street & Apartment Number"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <input
                                    type="text"
                                    value={regCity}
                                    onChange={(e) => setRegCity(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition"
                                    placeholder="City"
                                />
                                <input
                                    type="text"
                                    value={regState}
                                    onChange={(e) => setRegState(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition"
                                    placeholder="State"
                                />
                                <input
                                    type="text"
                                    value={regZip}
                                    onChange={(e) => setRegZip(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition"
                                    placeholder="ZIP"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 rounded-xl text-white font-bold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
                                style={{ backgroundColor: accent }}
                            >
                                {isLoading ? 'Registering...' : 'Create VIP Customer Account'}
                                <Sparkles size={14} />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerAuthModal;
