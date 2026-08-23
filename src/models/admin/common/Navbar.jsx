import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, Search, Bell, ChevronDown, LogOut, Settings,
    PanelLeftClose, PanelLeftOpen, Store, ShoppingBag,
    CheckCheck, Camera
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import ProfileEditModal from '../../../components/common/ProfileEditModal';

const Navbar = ({ onToggleMobile, isMobileOpen, isCollapsed, onToggleCollapse }) => {
    const { setIsGlobalSearchOpen, activities, logout, currentAuthUser, shops, showToast } = useStore();
    const [profileOpen, setProfileOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [readNotifs, setReadNotifs] = useState(new Set());
    const profileRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        const handleClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const unreadCount = activities.filter((a) => !readNotifs.has(a.id)).length;

    const handleMarkAllRead = () => {
        setReadNotifs(new Set(activities.map((a) => a.id)));
        showToast('All notifications marked as read', 'info');
    };

    const isImageAvatar = currentAuthUser?.avatar && (currentAuthUser.avatar.startsWith('data:image') || currentAuthUser.avatar.startsWith('http'));
    const userInitials = currentAuthUser?.name ? currentAuthUser.name.substring(0, 2).toUpperCase() : 'SA';

    return (
        <>
            <ProfileEditModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white"
            >
                <div className="flex items-center justify-between px-4 sm:px-6 h-16">
                    {/* Left Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onToggleMobile}
                            className="lg:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition"
                            aria-label="Toggle mobile navigation"
                        >
                            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <button
                            onClick={onToggleCollapse}
                            className="hidden lg:flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                        </button>

                        <button
                            onClick={() => setIsGlobalSearchOpen(true)}
                            className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-400 text-xs transition group"
                        >
                            <Search size={14} className="group-hover:text-indigo-400 transition-colors" />
                            <span>Quick search shops, users, orders...</span>
                            <kbd className="hidden lg:inline-block px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 font-mono">
                                ⌘K
                            </kbd>
                        </button>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsGlobalSearchOpen(true)}
                            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-800"
                        >
                            <Search size={18} />
                        </button>

                        {/* Notifications Dropdown */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => setNotifOpen(!notifOpen)}
                                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-900 animate-pulse" />
                                )}
                            </button>

                            <AnimatePresence>
                                {notifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-80 sm:w-96 origin-top-right rounded-2xl bg-white text-slate-800 shadow-2xl ring-1 ring-black/10 z-[100] overflow-hidden"
                                    >
                                        <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-sm">Platform Audit Feed</h3>
                                                <p className="text-xs text-indigo-300">{unreadCount} recent platform events</p>
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={handleMarkAllRead}
                                                    className="text-[11px] font-semibold text-indigo-300 hover:text-white flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg"
                                                >
                                                    <CheckCheck size={12} /> Mark read
                                                </button>
                                            )}
                                        </div>

                                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                                            {activities.slice(0, 8).map((act) => (
                                                <div
                                                    key={act.id}
                                                    className={`p-3 text-xs flex items-start gap-3 hover:bg-slate-50 transition ${
                                                        readNotifs.has(act.id) ? 'opacity-60' : 'bg-indigo-50/20 font-medium'
                                                    }`}
                                                >
                                                    <span className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-slate-800 leading-snug">{act.text}</p>
                                                        <p className="text-[10px] text-slate-400 mt-0.5">{act.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
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
                                className="flex items-center gap-2 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition border border-white/10 active:scale-95 cursor-pointer"
                            >
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden flex items-center justify-center text-white text-xs font-bold shadow">
                                    {isImageAvatar ? (
                                        <img src={currentAuthUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        userInitials
                                    )}
                                </div>
                                <span className="hidden sm:inline text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                                    {currentAuthUser?.name || 'Super Admin'}
                                </span>
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
                                                <div className="w-10 h-10 rounded-xl bg-indigo-600 overflow-hidden text-white font-bold flex items-center justify-center shadow shrink-0">
                                                    {isImageAvatar ? (
                                                        <img src={currentAuthUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : (
                                                        userInitials
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-800 text-sm truncate">{currentAuthUser?.name || 'Administrator'}</p>
                                                    <p className="text-xs text-slate-500 truncate">{currentAuthUser?.email || 'admin@trivora.top'}</p>
                                                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                        {currentAuthUser?.role || 'Super Admin'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2 space-y-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    setIsProfileModalOpen(true);
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50/60 hover:bg-indigo-100 transition text-left cursor-pointer"
                                            >
                                                <Camera size={15} className="text-indigo-600" />
                                                Edit Profile & Avatar
                                            </button>

                                            <Link
                                                to="/owner"
                                                onClick={() => setProfileOpen(false)}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                                            >
                                                <ShoppingBag size={15} className="text-indigo-600" />
                                                Switch to Owner Panel
                                            </Link>
                                            <Link
                                                to={shops.length > 0 ? `/shop/${shops[0].slug}` : '/'}
                                                onClick={() => setProfileOpen(false)}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                                            >
                                                <Store size={15} className="text-pink-600" />
                                                Visit {shops.length > 0 ? shops[0].name : 'Storefront'}
                                            </Link>
                                            <Link
                                                to="/panel/settings"
                                                onClick={() => setProfileOpen(false)}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
                                            >
                                                <Settings size={15} className="text-slate-500" />
                                                Platform Settings
                                            </Link>
                                        </div>

                                        <div className="border-t border-slate-100 p-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    logout();
                                                }}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
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
        </>
    );
};

export default Navbar;