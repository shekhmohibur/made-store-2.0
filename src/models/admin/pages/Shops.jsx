import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MoreVertical, Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Copy, PlayCircle, PauseCircle, AlertTriangle, X, ExternalLink } from 'lucide-react';
import { useStore } from '../../../store/useStore';

const PLANS = ['Free', 'Growth', 'Pro'];
const STATUSES = ['Active', 'Pending', 'Suspended'];
const PAGE_SIZE = 8;

const Shops = () => {
    const { shops, updateShop, deleteShop, addShop } = useStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [editShop, setEditShop] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    const inputClass =
        'w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

    const totalPages = Math.ceil(shops.length / PAGE_SIZE) || 1;
    const startIdx = (currentPage - 1) * PAGE_SIZE;
    const pageShops = shops.slice(startIdx, startIdx + PAGE_SIZE);
    const from = shops.length === 0 ? 0 : startIdx + 1;
    const to = Math.min(startIdx + PAGE_SIZE, shops.length);

    const goTo = (p) => {
        if (p >= 1 && p <= totalPages) setCurrentPage(p);
    };

    const saveEdit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const patch = {
            name: fd.get('name') || editShop.name,
            ownerName: fd.get('owner') || editShop.ownerName,
            plan: fd.get('plan'),
            status: fd.get('status'),
        };
        updateShop(editShop.id, patch);
        setEditShop(null);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteShop(deleteTarget.id);
        setDeleteTarget(null);
        const lastPage = Math.max(1, Math.ceil((shops.length - 1) / PAGE_SIZE));
        if (currentPage > lastPage) setCurrentPage(lastPage);
    };

    const toggleStatus = (shop) =>
        updateShop(shop.id, {
            status: shop.status === 'Active' ? 'Suspended' : shop.status === 'Suspended' ? 'Active' : shop.status,
        });

    const duplicateShop = (shop) =>
        addShop({
            name: `${shop.name} (copy)`,
            description: shop.description || '',
            ownerName: shop.ownerName || '',
            email: shop.email || '',
            plan: shop.plan || 'Free',
            accent: shop.accent || '#7c3aed',
        });

    // Page-number window with ellipsis for gaps
    const pageNumbers = [];
    for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) pageNumbers.push(p);
    }
    const displayPages = [];
    let prev = 0;
    for (const p of pageNumbers) {
        if (prev && p - prev > 1) displayPages.push('...');
        displayPages.push(p);
        prev = p;
    }

    const statusBadge = (s) =>
        s === 'Active' ? 'bg-emerald-50 text-emerald-600'
        : s === 'Pending' ? 'bg-amber-50 text-amber-600'
        : 'bg-red-50 text-red-600';

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Clothing Shops</h1>
                    <p className="text-sm text-gray-500">Manage all tenant shops on the platform.</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow hover:opacity-95">
                    <Plus size={18} /> New Shop
                </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Search shops..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                </div>
                <select className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:border-purple-400">
                    <option>All status</option>
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Suspended</option>
                </select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                                <th className="px-5 py-3 font-medium">Shop</th>
                                <th className="px-5 py-3 font-medium">Owner</th>
                                <th className="px-5 py-3 font-medium">Plan</th>
                                <th className="px-5 py-3 font-medium">Products</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Joined</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {pageShops.map((s, i) => (
                                <tr key={s.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i === pageShops.length - 1 ? 'border-b-0' : ''}`}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                                                {s.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-800">{s.name}</p>
                                                <p className="text-xs text-gray-400">{s.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-gray-600">{s.ownerName || s.owner}</td>
                                    <td className="px-5 py-3 text-gray-600">{s.plan}</td>
                                    <td className="px-5 py-3 text-gray-600">{Array.isArray(s.products) ? s.products.length : s.products}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge(s.status)}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-gray-500">{s.joined}</td>
                                    <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link to={`/shop/${s.slug}`} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-purple-600" title="View live store">
                                                    <ExternalLink size={16} />
                                                </Link>
                                                <button onClick={() => setEditShop(s)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-purple-600" title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => setDeleteTarget(s)} className="p-2 rounded-lg text-red-500 hover:bg-red-50" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="relative">
                                                    <button onClick={() => setOpenMenuId(openMenuId === s.id ? null : s.id)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100" title="More actions">
                                                        <MoreVertical size={16} />
                                                    </button>
                                                    {openMenuId === s.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                                            <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black/5 py-1 text-left">
                                                                <button onClick={() => { setEditShop(s); setOpenMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                    <Eye size={15} /> View Details
                                                                </button>
                                                                <button onClick={() => { toggleStatus(s); setOpenMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                    {s.status === 'Active' ? <PauseCircle size={15} /> : <PlayCircle size={15} />}
                                                                    {s.status === 'Active' ? 'Suspend' : 'Activate'}
                                                                </button>
                                                                <button onClick={() => { duplicateShop(s); setOpenMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                    <Copy size={15} /> Duplicate
                                                                </button>
                                                                <div className="my-1 h-px bg-gray-100" />
                                                                <button onClick={() => { setDeleteTarget(s); setOpenMenuId(null); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                                                                    <Trash2 size={15} /> Delete
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 text-sm">
                <p className="text-gray-500">
                    Showing <span className="font-medium text-gray-700">{from}</span>–<span className="font-medium text-gray-700">{to}</span> of{' '}
                    <span className="font-medium text-gray-700">{shops.length}</span> shops
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                        onClick={() => goTo(1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="First page"
                    >
                        <ChevronsLeft size={16} />
                    </button>
                    <button
                        onClick={() => goTo(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={15} /> Prev
                    </button>
                    {displayPages.map((p, i) =>
                        p === '...' ? (
                            <span key={`gap-${i}`} className="px-1.5 text-gray-400">…</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => goTo(p)}
                                aria-current={p === currentPage ? 'page' : undefined}
                                className={`min-w-[2.25rem] px-2 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    p === currentPage
                                        ? 'bg-purple-600 text-white shadow'
                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {p}
                            </button>
                        )
                    )}
                    <button
                        onClick={() => goTo(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next <ChevronRight size={15} />
                    </button>
                    <button
                        onClick={() => goTo(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Last page"
                    >
                        <ChevronsRight size={16} />
                    </button>
                </div>
            </div>
            {/* Edit Shop modal */}
            {editShop && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setEditShop(null)} />
                    <form onSubmit={saveEdit} className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-800">Edit Shop</h3>
                            <button type="button" onClick={() => setEditShop(null)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Shop Name</label>
                                <input name="name" defaultValue={editShop.name} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Owner</label>
                                <input name="owner" defaultValue={editShop.ownerName || editShop.owner} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Plan</label>
                                <select name="plan" defaultValue={editShop.plan} className={inputClass}>
                                    {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Status</label>
                                <select name="status" defaultValue={editShop.status} className={inputClass}>
                                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
                            <button type="button" onClick={() => setEditShop(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100">Cancel</button>
                            <button type="submit" className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700">Save Changes</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Delete confirmation modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
                    <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-11 h-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                                <AlertTriangle size={22} />
                            </span>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Delete shop?</h3>
                                <p className="text-sm text-gray-500">{deleteTarget.name} · {deleteTarget.id}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            This will permanently remove <span className="font-medium text-gray-800">{deleteTarget.name}</span> and all of its data. This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100">Cancel</button>
                            <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Shops;