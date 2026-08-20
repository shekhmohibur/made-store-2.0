import { Link, useNavigate } from 'react-router-dom';
import {
    Clock, Shield, CheckCircle2,
    Sparkles
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import DemoRoleBar from '../../components/common/DemoRoleBar';
import ToastContainer from '../../components/common/ToastContainer';

const PendingApprovalPage = () => {
    const navigate = useNavigate();
    const { currentAuthUser, shops, approveShop, showToast } = useStore();

    const userShop = shops.find((s) => s.id === currentAuthUser?.shopId || s.email === currentAuthUser?.email) || shops.find((s) => s.status === 'Pending') || shops[0];

    const handleInstantApprove = () => {
        if (userShop) {
            approveShop(userShop.id);
            showToast(`Approved "${userShop.name}"! Unlocking merchant portal...`, 'success');
            setTimeout(() => {
                navigate('/owner');
            }, 600);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <DemoRoleBar />
            <ToastContainer />

            <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
                <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
                    
                    {/* Status Badge */}
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                        <Clock size={32} className="animate-pulse" />
                    </div>

                    <div className="space-y-2">
                        <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Status: Pending Super Admin Approval
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
                            Application Submitted!
                        </h1>
                        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                            Thank you, <strong className="text-white">{currentAuthUser?.name || 'Merchant'}</strong>. Your application for <strong className="text-indigo-400">{userShop?.name || 'Your Boutique'}</strong> has been registered in the platform queue.
                        </p>
                    </div>

                    {/* Progress Pipeline */}
                    <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-3 text-xs">
                        <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                                ✓
                            </span>
                            <span className="text-slate-300 font-semibold">1. Application Submitted</span>
                            <span className="text-[10px] text-slate-500 ml-auto">Completed</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] animate-pulse">
                                ⏳
                            </span>
                            <span className="text-amber-400 font-semibold">2. Super Admin Authorization & Plan Verification</span>
                            <span className="text-[10px] text-amber-500 ml-auto">In Queue</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-[10px]">
                                3
                            </span>
                            <span>3. Merchant Portal & Theme Studio Unlocked</span>
                            <span className="text-[10px] text-slate-600 ml-auto">Upcoming</span>
                        </div>
                    </div>

                    {/* Demo Instant Approval Helper */}
                    <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-left space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                            <Sparkles size={15} /> Demo Platform Fast-Track
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            For testing and evaluation, you can instantly approve this application directly right now or navigate to the Super Admin control center.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <button
                                onClick={handleInstantApprove}
                                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-1.5"
                            >
                                <CheckCircle2 size={14} /> 1-Click Approve Application
                            </button>
                            <Link
                                to="/panel/approvals"
                                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center border border-slate-700 flex items-center justify-center gap-1.5"
                            >
                                <Shield size={14} className="text-indigo-400" /> Super Admin Queue
                            </Link>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition">
                            ← Return to Platform Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PendingApprovalPage;
