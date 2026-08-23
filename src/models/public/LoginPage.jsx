import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ToastContainer from '../../components/common/ToastContainer';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, currentAuthUser, showToast } = useStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fromRedirect = location.state?.from?.pathname;

    // If already authenticated, immediately route to the respective portal
    useEffect(() => {
        if (currentAuthUser) {
            if (currentAuthUser.role === 'Super Admin') {
                navigate('/panel', { replace: true });
            } else if (currentAuthUser.status === 'Pending') {
                navigate('/pending-approval', { replace: true });
            } else {
                navigate('/owner', { replace: true });
            }
        }
    }, [currentAuthUser, navigate]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPassword = password.trim();

        if (!cleanEmail) {
            showToast('Please enter your email address', 'warning');
            return;
        }
        if (!cleanPassword) {
            showToast('Please enter your password', 'warning');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await login(cleanEmail, cleanPassword);
            if (res && res.success && res.user) {
                const user = res.user;
                if (user.role === 'Super Admin') {
                    if (fromRedirect && fromRedirect.startsWith('/panel')) {
                        navigate(fromRedirect, { replace: true });
                    } else {
                        navigate('/panel', { replace: true });
                    }
                } else if (user.status === 'Pending') {
                    navigate('/pending-approval', { replace: true });
                } else {
                    if (fromRedirect && fromRedirect.startsWith('/owner')) {
                        navigate(fromRedirect, { replace: true });
                    } else {
                        navigate('/owner', { replace: true });
                    }
                }
            } else {
                showToast(res?.message || 'Invalid credentials or account does not exist.', 'error');
            }
        } catch (err) {
            showToast(err?.message || 'An error occurred during authentication.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
            <ToastContainer />

            {/* Public Header */}
            <header className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-600/30">
                        T
                    </span>
                    <div>
                        <span className="font-extrabold text-white text-base tracking-tight">Trivora Commerce</span>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest hidden sm:block">Multi-Tenant Fashion Cloud</p>
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-xs text-slate-400 hover:text-white transition">
                        Home
                    </Link>
                    <Link to="/signup" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition">
                        Create Boutique →
                    </Link>
                </div>
            </header>

            {/* Main Form */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
                    
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center shadow-inner">
                            <Shield size={22} />
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight">Sign In to Platform</h1>
                        <p className="text-xs text-slate-400">
                            Enter your credentials to access Super Admin or your boutique merchant portal.
                        </p>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
                                    placeholder="admin@trivora.top or merchant@yourbrand.com"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                    Password
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition"
                                    placeholder="Enter your account password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                                />
                                Keep me signed in
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" /> Authenticating...
                                </>
                            ) : (
                                <>
                                    Sign In to Portal <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="border-t border-slate-800/80 pt-4 text-center">
                        <p className="text-xs text-slate-500">
                            Looking to launch a fashion boutique?{' '}
                            <Link to="/signup" className="text-indigo-400 font-bold hover:underline">
                                Apply for merchant portal
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
