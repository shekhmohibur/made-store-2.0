import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, Search, Bell, ChevronDown, LogOut, Settings,
    PanelLeftClose, PanelLeftOpen, Store, ShoppingBag, RotateCcw,
    CheckCheck
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const Navbar = ({ onToggleMobile, isMobileOpen, isCollapsed, onToggleCollapse }) => {
    const { setIsGlobalSearchOpen, activities, shops, resetDemoData, showToast } = useStore();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [readNotifs, setReadNotifs] = useState(new Set());
    const profileRef = useRef(null);
    const notifRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const unreadCount = activities.filter((a) => !readNotifs.has(a.id)).length;

    const markAllRead = () => {
        const allIds = new Set(activities.map((a) => a.id));
        setReadNotifs(allIds);
        showToast('All notifications marked as read', 'info');
    };

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="sticky top-10 z-30 h-16 w-full bg-slate-900 text-white shadow-md border-b border-slate-800"
        >
            <div className="h-full w-full flex items-center justify-between gap-3 px-4 sm:px-6">
                
                {/* Left section: Mobile toggle, Collapse, Title */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onToggleMobile}
                        className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
                        title={isMobileOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {/* Desktop sidebar collapse toggle */}
                    <button
                        onClick={onToggleCollapse}
                        className="hidden lg:inline-flex p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition active:scale-95 border border-white/10"
                        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                    </button>

                    <div className="hidden sm:block leading-tight">
                        <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-2">
                            Super Admin Console
                            <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                                Cloud
                            </span>
                        </span>
                    </div>
                </div>

                {/* Center search button (triggers Global Command Search) */}
                <div className="hidden md:flex flex-1 max-w-md mx-4">
                    <button
                        type="button"
                        onClick={() => setIsGlobalSearchOpen(true)}
                        className="w-full flex items-center justify-between px-3.5 py-2 text-xs bg-white/10 hover:bg-white/15 border border-white/15 rounded-xl text-slate-300 transition group shadow-inner"
                    >
                        <div className="flex items-center gap-2.5">
                            <Search size={14} className="text-indigo-300 group-hover:text-white transition" />
                            <span className="text-slate-300 group-hover:text-white">Search boutiques, products, users...</span>
                        </div>
                        <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-semibold bg-white/15 text-slate-200 rounded border border-white/20 font-mono">
                            ⌘K
                        </kbd>
                    </button>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    
                    {/* Quick Store switcher shortcut */}
                    <div className="hidden xl:flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-2.5 py-1">
                        <Store size={14} className="text-indigo-400" />
                        <span className="text-xs text-slate-300 font-medium">Store:</span>
                        <select
                            onChange={(e) => { if (e.target.value) navigate(`/shop/${e.target.value}`); }}
                            defaultValue=""
                            className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-2"
                        >
                            <option value="" disabled className="text-slate-900">Select live store...</option>
                            {shops.map((s) => (
                                <option key={s.id} value={s.slug} className="text-slate-900">{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search icon for mobile */}
                    <button
                        onClick={() => setIsGlobalSearchOpen(true)}
                        className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                        title="Search"
                    >
                        <Search size={18} />
                    </button>

                    {/* Notifications dropdown */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setNotifOpen(!notifOpen)}
                            className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
                            title="Notifications"
                        >
                            <Bell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {notifOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-84 sm:w-96 origin-top-right rounded-2xl bg-white text-slate-800 shadow-2xl ring-1 ring-black/10 z-[100] overflow-hidden"
                                >
                                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-slate-800 text-sm">Platform Feed</p>
                                            <span className="text-[11px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                                                {activities.length} total
                                            </span>
                                        </div>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={markAllRead}
                                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                            >
                                                <CheckCheck size={14} /> Mark all read
                                            </button>
                                        )}
                                    </div>

                                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                                        {activities.length === 0 ? (
                                            <div className="p-8 text-center text-slate-400 text-sm">
                                                No new notifications
                                            </div>
                                        ) : (
                                            activities.map((act) => (
                                                <div
                                                    key={act.id}
                                                    className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${!readNotifs.has(act.id) ? 'bg-indigo-50/40' : ''}`}
                                                >
                                                    <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!readNotifs.has(act.id) ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-300'}`} />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-medium text-slate-800 leading-snug">{act.text}</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">{act.time}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
                                        <Link
                                            to="/panel"
                                            onClick={() => setNotifOpen(false)}
                                            className="text-xs font-semibold text-indigo-600 hover:underline"
                                        >
                                            View full analytics dashboard →
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Super Admin profile dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10 active:scale-95"
                        >
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow">
                                SA
                            </div>
                            <span className="hidden sm:inline text-xs font-semibold text-slate-200">Super Admin</span>
                            <ChevronDown size={14} className="text-slate-400" />
                        </button>

                        <AnimatePresence>
                            {profileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl bg-white text-slate-800 shadow-2xl ring-1 ring-black/10 z-[100] overflow-hidden"
                                >
                                    <div className="p-4 bg-gradient-to-br from-indigo-50 to-slate-50 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow">
                                                SA
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-800 text-sm truncate">Super Admin</p>
                                                <p className="text-xs text-slate-500 truncate">admin@kaizer.com</p>
                                                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                    System Administrator
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2 space-y-1">
                                        <Link
                                            to="/panel/owner"
                                            onClick={() => setProfileOpen(false)}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                                        >
                                            <ShoppingBag size={15} className="text-indigo-600" />
                                            Switch to Owner Panel
                                        </Link>
                                        <Link
                                            to="/dress-shop"
                                            onClick={() => setProfileOpen(false)}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                                        >
                                            <Store size={15} className="text-pink-600" />
                                            Visit Viral Dress Shop
                                        </Link>
                                        <Link
                                            to="/panel/settings"
                                            onClick={() => setProfileOpen(false)}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                                        >
                                            <Settings size={15} className="text-slate-500" />
                                            Platform Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                resetDemoData();
                                                setProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-700 hover:bg-amber-50 transition text-left"
                                        >
                                            <RotateCcw size={15} />
                                            Reset Demo Store Data
                                        </button>
                                    </div>

                                    <div className="border-t border-slate-100 p-2">
                                        <button
                                            onClick={() => {
                                                showToast('Logged out successfully', 'info');
                                                setProfileOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                                        >
                                            <LogOut size={15} />
                                            Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Navbar;