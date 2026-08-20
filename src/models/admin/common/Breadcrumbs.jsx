import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight, Shield } from 'lucide-react';
import { findPageByPath } from '../../../router/routes';

const Breadcrumbs = () => {
    const location = useLocation();
    const current = findPageByPath(location.pathname);

    return (
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Link
                to="/panel"
                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors"
            >
                <Home size={14} /> Control Center
            </Link>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="inline-flex items-center gap-1 text-slate-400">
                <Shield size={13} /> Admin
            </span>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="font-extrabold text-slate-900">
                {current ? current.label : 'Overview'}
            </span>
        </nav>
    );
};

export default Breadcrumbs;