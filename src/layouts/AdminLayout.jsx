import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../models/admin/common/Navbar';
import Sidebar from '../models/admin/common/Sidebar';
import Breadcrumbs from '../models/admin/common/Breadcrumbs';
import ToastContainer from '../components/common/ToastContainer';
import GlobalSearchModal from '../components/common/GlobalSearchModal';
import { findPageByPath } from '../router/routes';

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    // Update document title
    useEffect(() => {
        const page = findPageByPath(location.pathname);
        document.title = `${page ? page.label : 'Super Admin'} · Trivora Commerce`;
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            <GlobalSearchModal />
            <ToastContainer />

            {/* Left Fixed Sidebar Pillar */}
            <Sidebar
                isCollapsed={isCollapsed}
                isMobileOpen={isMobileOpen}
                onCloseMobile={() => setIsMobileOpen(false)}
            />

            {/* Right Main Content Container (offset by sidebar width) */}
            <div className={`transition-all duration-300 flex flex-col min-h-screen ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                
                {/* Sticky Navbar at top of main content */}
                <Navbar
                    onToggleMobile={() => setIsMobileOpen((v) => !v)}
                    isMobileOpen={isMobileOpen}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={() => setIsCollapsed((v) => !v)}
                />

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <Breadcrumbs />

                    {/* Route transition */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;