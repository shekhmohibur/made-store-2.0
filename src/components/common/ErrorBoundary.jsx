import { useRouteError, Link } from 'react-router-dom';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import DemoRoleBar from './DemoRoleBar';

const ErrorBoundary = () => {
    const error = useRouteError();
    console.error('Captured Route Error:', error);

    const errorMessage = error?.statusText || error?.message || 'An unexpected rendering error occurred.';

    const handleHardReset = () => {
        try {
            localStorage.clear();
            window.location.href = '/';
        } catch {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
            <DemoRoleBar />
            
            <main className="flex-1 flex items-center justify-center p-6 text-center">
                <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full space-y-6 animate-in fade-in zoom-in-95">
                    <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center shadow-inner border border-rose-100">
                        <AlertTriangle size={32} />
                    </div>

                    <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Platform Diagnostics
                        </span>
                        <h1 className="text-2xl font-serif text-slate-950 uppercase font-bold">
                            Something Went Wrong
                        </h1>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                            {errorMessage}
                        </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-left font-mono text-[11px] text-slate-700 max-h-28 overflow-y-auto">
                        <code>{error?.stack || error?.message || 'Error occurred during React view execution.'}</code>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 py-3 px-4 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition shadow flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={14} /> Reload View
                        </button>
                        <Link
                            to="/"
                            className="flex-1 py-3 px-4 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition flex items-center justify-center gap-2"
                        >
                            <Home size={14} /> Return Home
                        </Link>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                        <button
                            onClick={handleHardReset}
                            className="text-[11px] font-bold text-amber-700 hover:text-amber-900 hover:underline"
                        >
                            Reset Platform Cache & Store State
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ErrorBoundary;
