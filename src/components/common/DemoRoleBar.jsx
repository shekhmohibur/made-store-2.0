import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Shield, Store, Globe, Sparkles, UserCheck, Clock,
    ChevronDown, RotateCcw, Palette
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const DemoRoleBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentAuthUser, loginAs, shops, resetDemoData } = useStore();
    const [openUserDropdown, setOpenUserDropdown] = useState(false);

    const pendingShops = shops.filter((s) => s.status === 'Pending');

    const handleSwitchRole = (roleType) => {
        loginAs(roleType);
        setOpenUserDropdown(false);
        if (roleType === 'Super Admin') {
            navigate('/panel');
        } else if (roleType === 'Pending') {
            navigate('/pending-approval');
        } else {
            navigate('/owner');
        }
    };

    return (
        <aside aria-label="Demo Role & Fast Navigation" className="sticky top-0 z-50 h-10 bg-slate-950 text-white text-xs border-b border-slate-800 shadow-md px-4 flex items-center justify-between gap-3 overflow-x-auto whitespace-nowrap">
            {/* Left: Platform Label & Fast Portal Links */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                <div className="flex items-center gap-1.5 font-black text-indigo-400">
                    <span className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                        K
                    </span>
                    <span className="hidden sm:inline tracking-tight font-extrabold text-white">Kaizer Platform</span>
                </div>

                <div className="h-4 w-px bg-slate-800 hidden sm:block" />

                {/* Direct Jump Links */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    <Link
                        to="/"
                        className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${location.pathname === '/' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
                    >
                        <Globe size={13} /> Landing
                    </Link>

                    <Link
                        to="/signup"
                        className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${location.pathname === '/signup' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
                    >
                        <Sparkles size={13} /> Signup
                    </Link>

                    <Link
                        to="/panel"
                        className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition relative ${location.pathname.startsWith('/panel') && !location.pathname.startsWith('/panel/owner') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
                    >
                        <Shield size={13} /> Super Admin
                        {pendingShops.length > 0 && (
                            <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center animate-pulse">
                                {pendingShops.length}
                            </span>
                        )}
                    </Link>

                    <Link
                        to="/owner"
                        className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${location.pathname.startsWith('/owner') || location.pathname.startsWith('/panel/owner') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
                    >
                        <Store size={13} /> Merchant Panel
                    </Link>

                    <Link
                        to="/owner/themes"
                        className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition text-pink-400 hover:bg-slate-900 ${location.pathname === '/owner/themes' ? 'bg-pink-600 text-white' : ''}`}
                    >
                        <Palette size={13} /> Themes
                    </Link>
                </div>
            </div>

            {/* Right: Active Role Switcher Pill & Reset Button */}
            <div className="flex items-center gap-2.5 ml-auto">
                
                {/* Active Session Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setOpenUserDropdown(!openUserDropdown)}
                        className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 transition font-bold"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Role: <strong className="text-white">{currentAuthUser?.role || 'Guest'}</strong></span>
                        <span className="text-slate-400 text-[11px]">({currentAuthUser?.name?.split(' ')[0]})</span>
                        <ChevronDown size={13} className="text-slate-400" />
                    </button>

                    {openUserDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                                Switch Demo User Persona:
                            </p>
                            
                            {/* Super Admin */}
                            <button
                                onClick={() => handleSwitchRole('Super Admin')}
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center justify-between text-xs transition"
                            >
                                <div>
                                    <p className="font-bold text-white flex items-center gap-1.5">
                                        <Shield size={13} className="text-indigo-400" /> Super Admin
                                    </p>
                                    <p className="text-[10px] text-slate-400">admin@kaizer.com · Approves shops</p>
                                </div>
                                {currentAuthUser?.role === 'Super Admin' && <span className="text-indigo-400 font-bold">✓</span>}
                            </button>

                            {/* Approved Owner */}
                            <button
                                onClick={() => handleSwitchRole('Owner')}
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center justify-between text-xs transition"
                            >
                                <div>
                                    <p className="font-bold text-white flex items-center gap-1.5">
                                        <UserCheck size={13} className="text-emerald-400" /> Approved Merchant
                                    </p>
                                    <p className="text-[10px] text-slate-400">Amina Yusuf · Full owner access</p>
                                </div>
                                {currentAuthUser?.role === 'Owner' && currentAuthUser?.status === 'Active' && <span className="text-emerald-400 font-bold">✓</span>}
                            </button>

                            {/* Pending Applicant */}
                            <button
                                onClick={() => handleSwitchRole('Pending')}
                                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center justify-between text-xs transition"
                            >
                                <div>
                                    <p className="font-bold text-white flex items-center gap-1.5">
                                        <Clock size={13} className="text-amber-400" /> Pending Applicant
                                    </p>
                                    <p className="text-[10px] text-slate-400">Chloe Dubois · Awaiting approval</p>
                                </div>
                                {currentAuthUser?.status === 'Pending' && <span className="text-amber-400 font-bold">✓</span>}
                            </button>
                        </div>
                    )}
                </div>

                {/* Reset Demo Data Button */}
                <button
                    onClick={resetDemoData}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    title="Reset Platform to Demo Baseline"
                >
                    <RotateCcw size={14} />
                </button>
            </div>
        </aside>
    );
};

export default DemoRoleBar;
