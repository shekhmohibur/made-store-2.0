import { NavLink } from 'react-router-dom';
import { Home, Store, SquarePlus, Users, Settings, LogOut, X, UserCog, ShoppingBag } from 'lucide-react';

const Sidebar = ({ isCollapsed, isMobileOpen, setIsMobileOpen }) => {

    const navGroups = [
        { section: 'Overview', items: [
            { name: 'Dashboard', icon: <Home size={20} />, path: '/panel', end: true },
        ] },
        { section: 'Management', items: [
            { name: 'Clothing Shops', icon: <Store size={20} />, path: '/panel/shops' },
            { name: 'Create New Shop', icon: <SquarePlus size={20} />, path: '/panel/create-shop' },
            { name: 'Users / Owners', icon: <Users size={20} />, path: '/panel/users' },
        ] },
        { section: 'System', items: [
            { name: 'Settings', icon: <Settings size={20} />, path: '/panel/settings' },
        ] },
        { section: 'Live Site', items: [
            { name: 'Owner Panel', icon: <UserCog size={20} />, path: '/panel/owner' },
            { name: 'Dress Shop Page', icon: <ShoppingBag size={20} />, path: '/dress-shop' },
        ] },
    ];

    const closeMobile = () => {
        if (window.innerWidth < 1024) setIsMobileOpen(false);
    };

    return (
        <aside
            className={`
                fixed left-0 top-16 bottom-0 z-40 flex flex-col
                w-80 max-w-[90vw] lg:max-w-none
                bg-gradient-to-b from-[#241f5c] to-[#2d296b] text-white
                shadow-2xl transition-all duration-300 ease-in-out
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                ${isCollapsed ? 'lg:w-[4.5rem]' : 'lg:w-72'}
            `}
        >
            <div className="flex items-center justify-between h-14 px-4 border-b border-white/10 lg:hidden shrink-0">
                <span className="font-semibold tracking-wide">Navigation</span>
                <button onClick={closeMobile} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80" title="Close menu">
                    <X size={18} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                {navGroups.map((group) => (
                    <div key={group.section}>
                        {!isCollapsed ? (
                            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">{group.section}</p>
                        ) : (
                            <div className="mx-3 mb-2 h-px bg-white/10" />
                        )}
                        <ul className="space-y-1">
                            {group.items.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.path}
                                        end={item.end}
                                        onClick={closeMobile}
                                        title={isCollapsed ? item.name : ''}
                                        className={({ isActive }) => `
                                            relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                                            text-sm font-medium transition-colors duration-150
                                            ${isCollapsed ? 'lg:justify-center' : 'lg:justify-start'}
                                            ${isActive
                                                ? 'bg-gradient-to-r from-purple-500/30 to-indigo-500/20 text-white'
                                                : 'text-white/60 hover:bg-white/5 hover:text-white'}
                                        `}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {isActive && (
                                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-purple-400" />
                                                )}
                                                <span className="shrink-0">{item.icon}</span>
                                                {!isCollapsed && <span className="truncate">{item.name}</span>}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            <div className="border-t border-white/10 p-3 space-y-2 shrink-0">
                <div className={`
                    flex items-center gap-3 px-2 py-1 overflow-hidden
                    ${isCollapsed ? 'lg:justify-center' : 'lg:justify-start'}
                `}>
                    <div className="w-9 h-9 rounded-full bg-white/10 ring-2 ring-white/20 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        SA
                    </div>
                    <div className="leading-tight min-w-0 ${isCollapsed ? 'lg:hidden' : 'block'}">
                        <p className="text-sm font-semibold text-white truncate">Super Admin</p>
                        <p className="text-xs text-white/50 truncate">admin@kaizer.com</p>
                    </div>
                </div>
                <button
                    title="Logout"
                    className={`
                        flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-white/70
                        ${isCollapsed ? 'lg:justify-center' : 'lg:justify-start'}
                        hover:bg-red-500/10 hover:text-red-400
                    `}
                >
                    <LogOut size={20} className="shrink-0" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;