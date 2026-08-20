import { useState } from 'react';
import { Database, RefreshCw, CheckCircle2, AlertTriangle, Globe, X, Server } from 'lucide-react';
import { useStore } from '../../store/useStore';

const BackendSyncModal = ({ isOpen, onClose }) => {
    const {
        backendStatus,
        isSyncing,
        lastSyncedAt,
        apiBaseUrl,
        setApiBaseUrl,
        syncWithBackend,
        shops,
        orders,
        users,
        showToast,
    } = useStore();

    const [inputUrl, setInputUrl] = useState(apiBaseUrl);
    const [isTesting, setIsTesting] = useState(false);

    if (!isOpen) return null;

    const handleSaveAndSync = async (e) => {
        e.preventDefault();
        setIsTesting(true);
        try {
            setApiBaseUrl(inputUrl);
            await syncWithBackend(false);
        } catch {
            showToast('Failed to reach backend at specified endpoint', 'error');
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 z-10 space-y-5 animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                            <Database size={20} />
                        </span>
                        <div>
                            <h3 className="font-extrabold text-base text-slate-900">Backend & MySQL Sync Hub</h3>
                            <p className="text-xs text-slate-400">cPanel PHP REST API & Database Connection</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Status Card */}
                <div
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition ${
                        backendStatus === 'connected'
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                            : 'bg-amber-50/70 border-amber-200 text-amber-950'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <span
                            className={`w-3 h-3 rounded-full shrink-0 ${
                                backendStatus === 'connected'
                                    ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                                    : 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                            }`}
                        />
                        <div>
                            <p className="text-xs font-bold">
                                {backendStatus === 'connected'
                                    ? '🟢 MySQL Backend Connected & Synced'
                                    : '🟡 Operating on Local Storage Cache'}
                            </p>
                            <p className="text-[11px] opacity-80 mt-0.5">
                                {lastSyncedAt
                                    ? `Last sync: ${new Date(lastSyncedAt).toLocaleTimeString()}`
                                    : 'Connect to your cPanel host below for live MySQL persistence.'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => syncWithBackend(false)}
                        disabled={isSyncing || isTesting}
                        className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 transition flex items-center gap-1.5 shrink-0"
                    >
                        <RefreshCw size={13} className={isSyncing ? 'animate-spin text-indigo-600' : ''} />
                        {isSyncing ? 'Syncing...' : 'Sync Now'}
                    </button>
                </div>

                {/* API URL Config Form */}
                <form onSubmit={handleSaveAndSync} className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                            <span>cPanel / Remote REST API URL</span>
                            <span className="text-[10px] text-indigo-600 font-semibold lowercase">/api or full https:// URL</span>
                        </label>
                        <div className="relative">
                            <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={inputUrl}
                                onChange={(e) => setInputUrl(e.target.value)}
                                placeholder="http://localhost/backend/api or https://yourdomain.com/api"
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:bg-white focus:border-indigo-500 transition"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setInputUrl('http://localhost/backend/api')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-bold text-slate-600 transition"
                        >
                            Localhost Preset
                        </button>
                        <button
                            type="button"
                            onClick={() => setInputUrl('/api')}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-bold text-slate-600 transition"
                        >
                            Direct /api
                        </button>
                        <button
                            type="submit"
                            disabled={isTesting || isSyncing}
                            className="ml-auto px-4 py-1.5 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                        >
                            {isTesting ? 'Connecting...' : 'Save & Connect'}
                        </button>
                    </div>
                </form>

                {/* Live Storage Summary */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold flex items-center gap-1.5">
                            <Server size={14} className="text-slate-400" /> Active Boutiques Synced:
                        </span>
                        <span className="font-bold font-mono text-slate-900">{shops.length} Stores</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-slate-400" /> Customer Orders Synced:
                        </span>
                        <span className="font-bold font-mono text-slate-900">{orders.length} Orders</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold flex items-center gap-1.5">
                            <AlertTriangle size={14} className="text-slate-400" /> Users & Owners Synced:
                        </span>
                        <span className="font-bold font-mono text-slate-900">{users.length} Accounts</span>
                    </div>
                </div>

                {/* Footer Guide Link */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Backend files located in: <code className="font-mono text-slate-600">E:\kkl\backend</code></span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 text-xs transition"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BackendSyncModal;
