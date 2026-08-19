import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Compass size={64} className="text-purple-500 mb-4" />
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="mt-2 text-lg text-gray-500">Page not found</p>
            <Link
                to="/panel"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold"
            >
                <Home size={18} /> Back to Dashboard
            </Link>
        </div>
    );
};

export default NotFound;