import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

const ICONS = {
    success: <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />,
    error: <AlertCircle size={18} className="text-red-500 shrink-0" />,
    warning: <AlertTriangle size={18} className="text-amber-500 shrink-0" />,
    info: <Info size={18} className="text-indigo-500 shrink-0" />,
};

const BORDER_COLORS = {
    success: 'border-emerald-200 bg-white/95 text-slate-800 shadow-emerald-500/10',
    error: 'border-red-200 bg-white/95 text-slate-800 shadow-red-500/10',
    warning: 'border-amber-200 bg-white/95 text-slate-800 shadow-amber-500/10',
    info: 'border-indigo-200 bg-white/95 text-slate-800 shadow-indigo-500/10',
};

const ToastContainer = () => {
    const { toasts, dismissToast } = useStore();

    return (
        <aside aria-label="Notifications" className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                        className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md ${BORDER_COLORS[toast.type] || BORDER_COLORS.info}`}
                    >
                        <span className="mt-0.5">{ICONS[toast.type] || ICONS.info}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold leading-snug">{toast.message}</p>
                            {toast.subtitle && (
                                <p className="text-xs text-slate-500 mt-0.5">{toast.subtitle}</p>
                            )}
                        </div>
                        <button
                            onClick={() => dismissToast(toast.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            title="Dismiss"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </aside>
    );
};

export default ToastContainer;
