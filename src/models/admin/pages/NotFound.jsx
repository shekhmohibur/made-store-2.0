import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/10 mb-6">
                <Compass size={44} />
            </div>
            <h1 className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight">404</h1>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-slate-800">Page Not Found</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
                The boutique route or administrative page you are looking for does not exist or has been relocated.
            </p>
            <div className="mt-8 flex items-center gap-3">
                <Link
                    to="/panel"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95"
                >
                    <Home size={18} /> Admin Dashboard
                </Link>
                <Link
                    to="/dress-shop"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold shadow-sm transition"
                >
                    Browse Live Boutique
                </Link>
            </div>
        </div>
    );
};

export default NotFound;