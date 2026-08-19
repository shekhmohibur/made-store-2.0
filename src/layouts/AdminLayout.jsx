import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../models/admin/common/Navbar';
import Sidebar from '../models/admin/common/Sidebar';
import Breadcrumbs from '../models/admin/common/Breadcrumbs';
import { findPageByPath } from '../router/routes';

const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    // Update the document title to reflect the active route.
    useEffect(() => {
        const page = findPageByPath(location.pathname);
        document.title = `${page ? page.label : 'Admin'} · Kaizer Admin`;
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                onToggleMobile={() => setIsMobileOpen((v) => !v)}
                isMobileOpen={isMobileOpen}
                isCollapsed={isCollapsed}
                onToggleCollapse={() => setIsCollapsed((v) => !v)}
            />

            <Sidebar
                isCollapsed={isCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* Scroll lock + backdrop when mobile drawer is open */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-30 lg:hidden"
                />
            )}

            {/* Main content — offset under navbar and beside sidebar */}
            <main
                className={`
                    min-h-screen pt-16 transition-[padding] duration-300 ease-in-out
                    ${isCollapsed ? 'lg:pl-18' : 'lg:pl-72'}
                `}
            >
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                    <Breadcrumbs />

                    {/* Route-keyed transition so each page reflects its own view */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;