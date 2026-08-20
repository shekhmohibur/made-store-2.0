import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Shield, Store, Lock, Mail, ArrowRight, Clock
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import DemoRoleBar from '../../components/common/DemoRoleBar';
import ToastContainer from '../../components/common/ToastContainer';

const LoginPage = () => {
    const navigate = useNavigate();
    const { users, loginAs, showToast } = useStore();

    const [email, setEmail] = useState('admin@kaizer.com');
    const [password, setPassword] = useState('password123');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (found) {
            loginAs(found);
            if (found.role === 'Super Admin') {
                navigate('/panel');
            } else if (found.status === 'Pending') {
                navigate('/pending-approval');
            } else {
                navigate('/owner');
            }
        } else {
            showToast('User not found. Try one of the demo role presets below.', 'warning');
        }
    };

    const handleQuickLogin = (roleType) => {
        loginAs(roleType);
        if (roleType === 'Super Admin') {
            navigate('/panel');
        } else if (roleType === 'Pending') {
            navigate('/pending-approval');
        } else {
            navigate('/owner');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <DemoRoleBar />
            <ToastContainer />

            {/* Header */}
            <header className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-xs shadow-lg">
                        K
                    </span>
                    <span className="font-extrabold text-white text-base">Kaizer Commerce</span>
                </Link>
                <Link to="/signup" className="text-xs font-bold text-indigo-400 hover:underline">
                    New Brand Signup →
                </Link>
            </header>

            {/* Main Form */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
                    
                    <div className="text-center space-y-1.5">
                        <h1 className="text-2xl font-black text-white">Sign In to Platform</h1>
                        <p className="text-xs text-slate-400">
                            Access Super Admin or your authorized boutique owner portal.
                        </p>
                    </div>

                    {/* 1-Click Fast Login Presets */}
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            1-Click Fast Demo Login:
                        </p>
                        
                        <div className="grid grid-cols-1 gap-2">
                            <button
                                type="button"
                                onClick={() => handleQuickLogin('Super Admin')}
                                className="w-full text-left p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 hover:border-indigo-500 transition flex items-center justify-between text-xs group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                                        <Shield size={16} />
                                    </span>
                                    <div>
                                        <p className="font-bold text-white group-hover:text-indigo-300">Super Admin</p>
                                        <p className="text-[10px] text-slate-400">admin@kaizer.com (Approvals & Full SaaS)</p>
                                    </div>
                                </div>
                                <ArrowRight size={14} className="text-slate-400 group-hover:text-white" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickLogin('Owner')}
                                className="w-full text-left p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-500 transition flex items-center justify-between text-xs group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                                        <Store size={16} />
                                    </span>
                                    <div>
                                        <p className="font-bold text-white group-hover:text-emerald-300">Approved Merchant Owner</p>
                                        <p className="text-[10px] text-slate-400">Amina Yusuf (Theme Studio & Products)</p>
                                    </div>
                                </div>
                                <ArrowRight size={14} className="text-slate-400 group-hover:text-white" />
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickLogin('Pending')}
                                className="w-full text-left p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 hover:border-amber-500 transition flex items-center justify-between text-xs group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
                                        <Clock size={16} />
                                    </span>
                                    <div>
                                        <p className="font-bold text-white group-hover:text-amber-300">Pending Applicant</p>
                                        <p className="text-[10px] text-slate-400">Chloe Dubois (Awaiting Approval View)</p>
                                    </div>
                                </div>
                                <ArrowRight size={14} className="text-slate-400 group-hover:text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center my-4">
                        <div className="w-full border-t border-slate-800" />
                        <span className="bg-slate-900 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">or sign in with email</span>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center gap-2"
                        >
                            Log In to Dashboard <ArrowRight size={14} />
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-500 pt-2">
                        Need a website for your brand?{' '}
                        <Link to="/signup" className="text-indigo-400 font-bold hover:underline">
                            Register now
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
