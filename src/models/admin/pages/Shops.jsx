import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight,
    ChevronsLeft, ChevronsRight, Eye,
    AlertTriangle, X, ExternalLink, Download,
    ArrowUpDown, Palette, CheckCircle2
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { THEME_CATALOG } from '../../../themes/themeCatalog';

const PLANS = ['Free', 'Growth', 'Pro'];
const STATUSES = ['Active', 'Pending', 'Suspended'];
const PAGE_SIZE = 6;

const Shops = () => {
    const { shops, updateShop, deleteShop, setShopActiveTheme, updateShopPermissions, showToast } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [planFilter, setPlanFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);

    // Modals
    const [activeDetailShop, setActiveDetailShop] = useState(null);
    const [editingShop, setEditingShop] = useState(null);
    const [deleteTargetShop, setDeleteTargetShop] = useState(null);
    const [permissionsShop, setPermissionsShop] = useState(null); // Permission & Theme Modal

    // Filter & sort
    const filteredShops = shops
        .filter((s) => {
            const matchesSearch =
                s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.tagline || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPlan = planFilter === 'All' || s.plan === planFilter;
            const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
            return matchesSearch && matchesPlan && matchesStatus;
        })
        .sort((a, b) => {
            let valA = a[sortBy] || '';
            let valB = b[sortBy] || '';
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

    const totalPages = Math.max(1, Math.ceil(filteredShops.length / PAGE_SIZE));
    const paginatedShops = filteredShops.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDir('asc');
        }
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const patch = {
            name: fd.get('name'),
            ownerName: fd.get('ownerName'),
            email: fd.get('email'),
            plan: fd.get('plan'),
            status: fd.get('status'),
            tagline: fd.get('tagline'),
        };
        updateShop(editingShop.id, patch);
        setEditingShop(null);
    };

    const exportCSV = () => {
        const headers = ['ID', 'Name', 'Slug', 'Owner', 'Email', 'Plan', 'Status', 'Theme', 'Products Count'];
        const rows = filteredShops.map((s) => [
            s.id,
            `"${s.name}"`,
            s.slug,
            `"${s.ownerName}"`,
            s.email,
            s.plan,
            s.status,
            s.activeTheme || 'theme-streetwear',
            s.products?.length || 0,
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'kaizer_shops_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Boutique catalog exported to CSV', 'success');
    };

    const inputClass =
        'w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition';
    const labelClass = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5';

    return (
        <div className="space-y-6">
            
            {/* Top Action Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Boutique Tenants</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Manage multi-tenant clothing brands, assigned themes, permissions, and status.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                        onClick={exportCSV}
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition active:scale-95"
                    >
                        <Download size={15} /> Export CSV
                    </button>
                    <Link
                        to="/panel/create-shop"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition active:scale-95"
                    >
                        <Plus size={16} /> Provision New Shop
                    </Link>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search boutiques, owners, emails..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
                    <select
                        value={planFilter}
                        onChange={(e) => {
                            setPlanFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-none"
                    >
                        <option value="All">All Plans</option>
                        {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-none"
                    >
                        <option value="All">All Statuses</option>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <span className="text-xs text-slate-400 font-semibold pl-2 hidden sm:inline">
                        Showing {filteredShops.length} of {shops.length}
                    </span>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/70">
                                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => toggleSort('name')}>
                                    <div className="flex items-center gap-1.5 hover:text-slate-900">
                                        <span>Boutique & Brand</span>
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-6 py-4 cursor-pointer select-none" onClick={() => toggleSort('ownerName')}>
                                    <div className="flex items-center gap-1.5 hover:text-slate-900">
                                        <span>Founder & Contact</span>
                                        <ArrowUpDown size={12} />
                                    </div>
                                </th>
                                <th className="px-6 py-4">Active Theme</th>
                                <th className="px-6 py-4">Plan Tier</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Styles</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedShops.map((s) => {
                                const isPending = s.status === 'Pending';
                                const isSuspended = s.status === 'Suspended';
                                return (
                                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                                        
                                        {/* Boutique & Logo */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shrink-0 transition-transform group-hover:scale-105"
                                                    style={{ backgroundColor: s.accent || '#6366f1' }}
                                                >
                                                    {s.logo || 'ST'}
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-slate-900 text-sm">{s.name}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 font-mono truncate">
                                                        /{s.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Founder */}
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-slate-900 text-xs">{s.ownerName}</p>
                                            <p className="text-[11px] text-slate-400">{s.email}</p>
                                        </td>

                                        {/* Theme */}
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setPermissionsShop(s)}
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 transition"
                                                title="Change theme or permissions"
                                            >
                                                <Palette size={13} className="text-indigo-500" />
                                                <span>{s.activeTheme || 'theme-streetwear'}</span>
                                            </button>
                                        </td>

                                        {/* Plan */}
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                {s.plan}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                isPending
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : isSuspended
                                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-amber-500 animate-pulse' : isSuspended ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                                                {s.status}
                                            </span>
                                        </td>

                                        {/* Products Count */}
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-extrabold text-slate-700 text-xs bg-slate-100 px-2.5 py-1 rounded-lg">
                                                {s.products?.length || 0}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    to={`/shop/${s.slug}`}
                                                    target="_blank"
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                                    title="View Live Storefront"
                                                >
                                                    <ExternalLink size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => setPermissionsShop(s)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                                    title="Manage Themes & Permissions"
                                                >
                                                    <Palette size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setActiveDetailShop(s)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                                    title="Shop Overview"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setEditingShop(s)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                                    title="Edit Metadata"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTargetShop(s)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                                    title="Delete Shop"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <p>
                        Showing page <strong className="text-slate-800">{currentPage}</strong> of <strong className="text-slate-800">{totalPages}</strong>
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(1)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronsLeft size={15} />
                        </button>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={15} />
                        </button>
                        <span className="px-3 py-1 font-bold text-slate-800">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={15} />
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <ChevronsRight size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Permissions & Theme Manager Modal */}
            {permissionsShop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPermissionsShop(null)} />
                    <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in-95 space-y-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <Palette size={20} className="text-indigo-600" />
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-base">Theme & Permissions: {permissionsShop.name}</h3>
                                    <p className="text-xs text-slate-500">Super Admin template authorization controls</p>
                                </div>
                            </div>
                            <button onClick={() => setPermissionsShop(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Active Theme Selector */}
                        <div>
                            <label className={labelClass}>Active Live Theme Template</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {THEME_CATALOG.map((th) => {
                                    const isSel = (permissionsShop.activeTheme || 'theme-streetwear') === th.id;
                                    return (
                                        <div
                                            key={th.id}
                                            onClick={() => {
                                                setShopActiveTheme(permissionsShop.id, th.id);
                                                setPermissionsShop({ ...permissionsShop, activeTheme: th.id });
                                            }}
                                            className={`p-3 rounded-2xl border cursor-pointer flex items-center gap-3 transition ${isSel ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:bg-slate-50'}`}
                                        >
                                            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: th.accent }} />
                                            <div className="min-w-0 flex-1 text-xs">
                                                <p className="font-bold text-slate-900">{th.name}</p>
                                                <p className="text-[10px] text-slate-400">{th.tier} Tier</p>
                                            </div>
                                            {isSel && <CheckCircle2 size={16} className="text-indigo-600 shrink-0" />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Allowed Themes checklist */}
                        <div>
                            <label className={labelClass}>Theme Permissions Granted to Owner</label>
                            <div className="space-y-2">
                                {THEME_CATALOG.map((th) => {
                                    const allowed = permissionsShop.permissions?.allowedThemes || [];
                                    const isAllowed = allowed.includes(th.id);
                                    return (
                                        <div
                                            key={th.id}
                                            onClick={() => {
                                                const next = isAllowed ? allowed.filter((x) => x !== th.id) : [...allowed, th.id];
                                                updateShopPermissions(permissionsShop.id, { allowedThemes: next });
                                                setPermissionsShop({
                                                    ...permissionsShop,
                                                    permissions: { ...permissionsShop.permissions, allowedThemes: next },
                                                });
                                            }}
                                            className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${isAllowed ? 'border-emerald-200 bg-emerald-50 text-emerald-900 font-semibold' : 'border-slate-200 bg-slate-50 text-slate-400'}`}
                                        >
                                            <span>{th.name} ({th.category})</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isAllowed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                                {isAllowed ? 'Allowed' : 'Locked'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-end pt-3 border-t border-slate-100">
                            <button
                                onClick={() => setPermissionsShop(null)}
                                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Shop Details Modal */}
            {activeDetailShop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveDetailShop(null)} />
                    <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 animate-in fade-in zoom-in-95 space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm shadow" style={{ backgroundColor: activeDetailShop.accent }}>
                                    {activeDetailShop.logo}
                                </span>
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-base">{activeDetailShop.name}</h3>
                                    <p className="text-xs text-slate-400">/{activeDetailShop.slug}</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveDetailShop(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                                <span className="text-slate-400 font-bold">Owner / Founder:</span>
                                <span className="font-semibold text-slate-800">{activeDetailShop.ownerName}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                                <span className="text-slate-400 font-bold">Email:</span>
                                <span className="font-semibold text-slate-800">{activeDetailShop.email}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                                <span className="text-slate-400 font-bold">Active Theme:</span>
                                <span className="font-semibold text-indigo-600">{activeDetailShop.activeTheme}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                                <span className="text-slate-400 font-bold">SaaS Plan Tier:</span>
                                <span className="font-semibold text-slate-800">{activeDetailShop.plan}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-slate-100">
                                <span className="text-slate-400 font-bold">Apparel Styles in Catalog:</span>
                                <span className="font-semibold text-slate-800">{activeDetailShop.products?.length || 0} styles</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Link
                                to={`/shop/${activeDetailShop.slug}`}
                                target="_blank"
                                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow flex items-center gap-1"
                            >
                                <ExternalLink size={13} /> View Live Storefront
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Shop Modal */}
            {editingShop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingShop(null)} />
                    <form onSubmit={handleSaveEdit} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="font-extrabold text-slate-900 text-base">Edit Boutique: {editingShop.name}</h3>
                            <button type="button" onClick={() => setEditingShop(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <div>
                            <label className={labelClass}>Boutique Name</label>
                            <input name="name" defaultValue={editingShop.name} className={inputClass} required />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>Founder Name</label>
                                <input name="ownerName" defaultValue={editingShop.ownerName} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Email</label>
                                <input name="email" defaultValue={editingShop.email} className={inputClass} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>SaaS Plan</label>
                                <select name="plan" defaultValue={editingShop.plan} className={inputClass}>
                                    {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Account Status</label>
                                <select name="status" defaultValue={editingShop.status} className={inputClass}>
                                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setEditingShop(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold">
                                Cancel
                            </button>
                            <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Delete Modal */}
            {deleteTargetShop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteTargetShop(null)} />
                    <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                                <AlertTriangle size={22} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-slate-900 text-base">Delete Boutique?</h3>
                                <p className="text-xs text-slate-500">{deleteTargetShop.name}</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            This will permanently delete this store, its product catalog, and storefront URL.
                        </p>
                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => setDeleteTargetShop(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold">
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteShop(deleteTargetShop.id);
                                    setDeleteTargetShop(null);
                                }}
                                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Shops;