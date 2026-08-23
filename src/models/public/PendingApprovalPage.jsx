import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, RefreshCw, LogOut, ArrowRight, ShieldAlert } from 'lucide-react';
import { useStore } from '../../store/useStore';
import ToastContainer from '../../components/common/ToastContainer';

const PendingApprovalPage = () => {
    const navigate = useNavigate();
    const { currentAuthUser, shops, syncWithBackend, isSyncing, logout, showToast } = useStore();
    const [isChecking, setIsChecking] = useState(false);

    const userShop = shops.find((s) => s.id === currentAuthUser?.shopId || s.email === currentAuthUser?.email) ||
        shops.find((s) => s.status === 'Pending') ||
        null;

    // Check if store was approved
    useEffect(() => {
        if (userShop?.status === 'Active' || currentAuthUser?.status === 'Active') {
            showToast('Congratulations! Your merchant store has been approved! 🎉', 'success');
            navigate('/owner');
        }
    }, [userShop?.status, currentAuthUser?.status, navigate, showToast]);

    const handleCheckStatus = async () => {
        setIsChecking(true);
        try {
            await syncWithBackend(true);
            const freshShop = shops.find((s) => s.id === currentAuthUser?.shopId || s.email === currentAuthUser?.email);
            if (freshShop?.status === 'Active' || currentAuthUser?.status === 'Active') {
                showToast('Store approved! Redirecting to merchant studio...', 'success');
                navigate('/owner');
            } else {
                showToast('Application is currently being reviewed by system administrators.', 'info');
            }
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
            <ToastContainer />

            {/* Header */}
            <header className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-xs shadow-lg">
                        T
                    </span>
                    <span className="font-extrabold text-white text-base">Trivora Commerce</span>
                </Link>
                <button
                    onClick={() => {
                        logout();
                        navigate('/login');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-bold transition cursor-pointer"
                >
                    <LogOut size={13} /> Sign Out
                </button>
            </header>

            <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
                <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
                    
                    {/* Status Badge */}
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                        <Clock size={32} className="animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Application Status: Under Review
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
                            Boutique Application Submitted
                        </h1>
                        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                            Thank you, <strong className="text-white">{currentAuthUser?.name || 'Merchant'}</strong>. Your application for <strong className="text-indigo-400">{userShop?.name || 'Your Boutique'}</strong> is queued for approval.
                        </p>
                    </div>

                    {/* Progress Pipeline */}
                    <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-3.5 text-xs">
                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                                <CheckCircle2 size={14} />
                            </span>
                            <div>
                                <p className="text-slate-200 font-bold">1. Merchant Application Received</p>
                                <p className="text-[10px] text-slate-500">Domain slug and store parameters recorded</p>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-semibold ml-auto">Done</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold flex items-center justify-center text-[10px] animate-pulse">
                                ⏳
                            </span>
                            <div>
                                <p className="text-amber-300 font-bold">2. Super Admin Review & Subdomain Provisioning</p>
                                <p className="text-[10px] text-slate-400">Verifying tier allocations and platform security</p>
                            </div>
                            <span className="text-[10px] text-amber-400 font-semibold ml-auto">In Progress</span>
                        </div>

                        <div className="flex items-center gap-3 text-slate-500">
                            <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-slate-500 font-bold flex items-center justify-center text-[10px]">
                                3
                            </span>
                            <div>
                                <p className="font-semibold text-slate-400">3. Merchant Portal & Theme Studio Unlocked</p>
                                <p className="text-[10px] text-slate-600">Product inventory, payment setup, and live publishing</p>
                            </div>
                            <span className="text-[10px] text-slate-600 ml-auto">Awaiting Step 2</span>
                        </div>
                    </div>

                    {/* Real-time Status Refresh Card */}
                    <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                        <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1.5">
                                <ShieldAlert size={14} className="text-indigo-400" /> Automated Activation Detector
                            </p>
                            <p className="text-[11px] text-slate-400">Click below to query live approval status immediately.</p>
                        </div>
                        <button
                            onClick={handleCheckStatus}
                            disabled={isChecking || isSyncing}
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            <RefreshCw size={13} className={isChecking || isSyncing ? 'animate-spin' : ''} />
                            {isChecking ? 'Checking...' : 'Check Status'}
                        </button>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-500">
                        <Link to="/" className="hover:text-slate-300 transition flex items-center gap-1">
                            ← Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingApprovalPage;
