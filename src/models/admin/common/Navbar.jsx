import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Search, Bell, ChevronDown, UserCog, ScrollText, LogOut, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const Navbar = ({ onToggleMobile, isMobileOpen, isCollapsed, onToggleCollapse }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
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

    return (
        <motion.header
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#2d296b] text-white shadow-lg"
        >
            <div className="h-full w-full flex items-center gap-3 px-4 sm:px-6">

                <button
                    onClick={onToggleMobile}
                    className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    title={isMobileOpen ? 'Close menu' : 'Open menu'}
                >
                    {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shrink-0">
                        KS
                    </span>
                    <span className="hidden sm:block font-bold text-lg tracking-wide leading-tight">
                        Kaizer <span className="text-white/60 text-xs uppercase font-normal align-baseline">Admin</span>
                    </span>
                </div>

                {/* Desktop sidebar collapse toggle */}
                <button
                    onClick={onToggleCollapse}
                    className="hidden lg:inline-flex p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
                </button>

                <div className="hidden md:flex flex-1 items-center mx-auto max-w-md relative">
                    <Search size={16} className="absolute left-3 text-white/50" />
                    <input
                        type="search"
                        placeholder="Search shops, owners, settings..."
                        className="w-full pl-9 pr-4 py-2 text-sm bg-white/10 border border-white/15 rounded-lg focus:outline-none focus:border-white/50 focus:bg-white/15 placeholder-white/50"
                    />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setNotifOpen(!notifOpen)}
                            className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                            title="Notifications"
                        >
                            <Bell size={19} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#2d296b]" />
                        </button>
                        {notifOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white text-base-content shadow-xl ring-1 ring-black/5 z-[100]"
                            >
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="font-semibold text-gray-800">Notifications</p>
                                </div>
                                <div className="p-2 space-y-1">
                                    {[
                                        { t: 'New shop approved', s: '2 min ago' },
                                        { t: 'Payment received', s: '1 hour ago' },
                                        { t: 'User signup', s: '3 hours ago' },
                                    ].map((n, i) => (
                                        <div key={i} className="px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <p className="text-sm text-gray-800">{n.t}</p>
                                            <p className="text-xs text-gray-400">{n.s}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white/10 hover:bg-white/20"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white/20">
                                SA
                            </div>
                            <ChevronDown size={16} className="hidden sm:block text-white/70" />
                        </button>
                        {profileOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white text-base-content shadow-xl ring-1 ring-black/5 z-[100]"
                            >
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="font-semibold text-gray-800 text-sm">Super Admin</p>
                                    <p className="text-xs text-gray-400">admin@kaizer.com</p>
                                </div>
                                <div className="p-1.5">
                                    {[
                                        { icon: <UserCog size={16} />, label: 'Profile Settings' },
                                        { icon: <ScrollText size={16} />, label: 'System Logs' },
                                        { icon: <Settings size={16} />, label: 'Preferences' },
                                    ].map((item, i) => (
                                        <button
                                            key={i}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {item.icon}
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 p-1.5">
                                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Navbar;