import { useState, useMemo } from 'react';
import {
    ShieldCheck, Search, Filter, Download,
    Store, ShoppingCart, UserCheck, AlertTriangle,
    Sliders, Clock, X, Lock, CheckCircle2
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const CATEGORY_ICONS = {
    shop: <Store size={15} className="text-indigo-600" />,
    order: <ShoppingCart size={15} className="text-emerald-600" />,
    user: <UserCheck size={15} className="text-blue-600" />,
    warning: <AlertTriangle size={15} className="text-rose-600" />,
    product: <Sliders size={15} className="text-purple-600" />,
    general: <Clock size={15} className="text-slate-600" />,
};

const AdminAuditLogs = () => {
    const { activities, showToast } = useStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('ALL');

    // Synthetic audit events combined with live state activities
    const fullAuditTrail = useMemo(() => {
        const base = Array.isArray(activities) ? activities : [];
        return base.filter((a) => {
            const matchesType = selectedType === 'ALL' || a.type === selectedType;
            const matchesSearch = (a.text || '').toLowerCase().includes(searchTerm.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [activities, selectedType, searchTerm]);

    const exportToCSV = () => {
        if (fullAuditTrail.length === 0) {
            showToast('No audit logs to export', 'warning');
            return;
        }

        const headers = ['Event ID', 'Category', 'Activity Description', 'Timestamp', 'Actor Role'];
        const rows = fullAuditTrail.map((a, idx) => [
            `EVT-${idx + 1001}`,
            a.type || 'general',
            `"${(a.text || '').replace(/"/g, '""')}"`,
            a.time || 'Today',
            'Super Admin / System',
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Trivora_Security_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Audit log records exported to CSV', 'success');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <ShieldCheck size={28} className="text-indigo-600" />
                        Security & Audit Logs
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Comprehensive immutable event log of all administrative actions, boutique approvals, and role updates.
                    </p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition shadow-xs cursor-pointer"
                >
                    <Download size={15} /> Export Audit Log
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search audit trail for boutique, user email, or actions..."
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={15} className="text-slate-400" />
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                    >
                        <option value="ALL">All Event Categories</option>
                        <option value="shop">Boutique Lifecycle</option>
                        <option value="order">Order & Payments</option>
                        <option value="user">User & Roles</option>
                        <option value="product">Catalog & Products</option>
                        <option value="warning">Alerts & Warnings</option>
                    </select>
                </div>
            </div>

            {/* Audit Trail Timeline */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {fullAuditTrail.length} Security & System Events Recorded
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={13} /> Active Audit Stream
                    </span>
                </div>

                <div className="space-y-3">
                    {fullAuditTrail.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 space-y-2">
                            <Lock size={32} className="mx-auto text-slate-300" />
                            <p className="font-bold text-sm text-slate-600">No audit events match your filter</p>
                        </div>
                    ) : (
                        fullAuditTrail.map((item, idx) => (
                            <div
                                key={item.id || idx}
                                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/60 flex items-start justify-between gap-4 hover:bg-slate-100/70 transition"
                            >
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                                        {CATEGORY_ICONS[item.type] || CATEGORY_ICONS.general}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-900 leading-relaxed">
                                            {item.text}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                                            <span className="font-mono bg-slate-200 px-1.5 py-0.2 rounded text-slate-700 font-bold uppercase">
                                                {item.type || 'System'}
                                            </span>
                                            <span>·</span>
                                            <span>Actor: Super Administrator</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="shrink-0 text-right">
                                    <span className="text-[11px] font-mono font-semibold text-slate-400">
                                        {item.time || 'Just now'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAuditLogs;
