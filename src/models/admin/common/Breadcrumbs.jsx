import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight, CreditCard } from 'lucide-react';
import { findPageByPath } from '../../../router/routes';

const Breadcrumbs = () => {
    const location = useLocation();
    const current = findPageByPath(location.pathname);

    return (
        <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm text-gray-500">
            <Link
                to="/panel"
                className="inline-flex items-center gap-1.5 font-medium text-gray-500 hover:text-purple-600 transition-colors"
            >
                <Home size={15} /> Home
            </Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="inline-flex items-center gap-1.5 text-gray-300" aria-hidden="true">
                <CreditCard size={14} /> Admin
            </span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="font-semibold text-gray-800">
                {current ? current.label : 'Page'}
            </span>
        </nav>
    );
};

export default Breadcrumbs;