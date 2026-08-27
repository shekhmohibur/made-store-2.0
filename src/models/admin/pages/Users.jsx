import { useState, useEffect } from 'react';
import {
    Search, MoreVertical, Trash2, Edit, UserPlus,
    Filter, Download, X, AlertTriangle,
    PauseCircle, PlayCircle, Eye, EyeOff, RefreshCw, Shield
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const ROLES = ['Super Admin', 'Owner', 'Merchant Admin', 'Merchant', 'Staff'];
const STATUSES = ['Active', 'Pending', 'Suspended'];

const Users = () => {
    const { users = [], shops = [], addUser, updateUser, deleteUser, showToast, isSyncing, syncWithBackend } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    // Always fetch live MySQL users from database on component mount
    useEffect(() => {
        if (typeof syncWithBackend === 'function') {
            syncWithBackend(true);
        }
    }, [syncWithBackend]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showAddPassword, setShowAddPassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);

    // Filter users safely
    const safeUsers = Array.isArray(users) ? users : [];
    const filteredUsers = safeUsers.filter((u) => {
        if (!u) return false;
        const nameStr = String(u.name || '');
        const emailStr = String(u.email || '');
        const shopStr = String(u.shopName || u.shop_name || '');
        const roleStr = String(u.role || 'Owner');
        const statusStr = String(u.status || 'Active');

        const matchesSearch =
            nameStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emailStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shopStr.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesRole = roleFilter === 'All';
        if (roleFilter === 'Owner') {
            matchesRole = roleStr === 'Owner' || roleStr === 'Merchant Admin' || roleStr === 'Merchant';
        } else if (roleFilter !== 'All') {
            matchesRole = roleStr.toLowerCase() === roleFilter.toLowerCase();
        }

        const matchesStatus = statusFilter === 'All' || statusStr.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleCreateUser = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        addUser({
            name: fd.get('name'),
            email: fd.get('email'),
            password: fd.get('password') || 'password123',
            role: fd.get('role'),
            shopName: fd.get('shopName'),
            status: fd.get('status'),
        });
        setIsAddModalOpen(false);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const updatePayload = {
            name: fd.get('name'),
            email: fd.get('email'),
            role: fd.get('role'),
            shopName: fd.get('shopName'),
            status: fd.get('status'),
        };
        const pass = fd.get('password');
        if (pass) updatePayload.password = pass;

        updateUser(editUser.id, updatePayload);
        setEditUser(null);
    };

    const toggleStatus = (user) => {
        const next = user.status === 'Active' ? 'Suspended' : 'Active';
        updateUser(user.id, { status: next });
    };

    const exportCSV = () => {
        const headers = ['ID,Name,Email,Role,Shop Assignment,Status,Joined\n'];
        const rows = safeUsers.map(
            (u) => `"${u.id}","${u.name || ''}","${u.email || ''}","${u.role || 'Owner'}","${u.shopName || u.shop_name || 'All'}","${u.status || 'Active'}","${u.joined || u.created_at || ''}"\n`
        );
        const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `trivora-users-${new Date().toISOString().slice(0, 10)}.csv`);
        link.click();
        showToast('Exported platform users to CSV', 'success');
    };

    const inputClass =
        'w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition';
    const labelClass = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5';

    return (
        <div className="space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Users & Shop Owners</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Manage permissions, boutique owner roles, and administrative staff.</p>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap">
                    <button
                        onClick={() => syncWithBackend(false)}
                        disabled={isSyncing}
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
                        title="Sync Users from MySQL Database"
                    >
                        <RefreshCw size={15} className={isSyncing ? 'animate-spin text-indigo-600' : ''} />
                        {isSyncing ? 'Syncing...' : 'Sync DB'}
                    </button>
                    <button
                        onClick={exportCSV}
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-sm transition"
                    >
                        <Download size={16} /> Export CSV
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95 cursor-pointer"
                    >
                        <UserPlus size={18} /> Invite New User
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">Total Users</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{safeUsers.length}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">Shop Owners</p>
                    <p className="text-2xl font-extrabold text-indigo-600 mt-1">
                        {safeUsers.filter((u) => u.role === 'Owner' || u.role === 'Merchant Admin' || u.role === 'Merchant').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">Active Accounts</p>
                    <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                        {safeUsers.filter((u) => u.status === 'Active').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">Pending Invites</p>
                    <p className="text-2xl font-extrabold text-amber-600 mt-1">
                        {safeUsers.filter((u) => u.status === 'Pending').length}
                    </p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search by name, email, or boutique..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    />
                </div>

                <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                        <Filter size={14} /> Role:
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-none focus:border-indigo-500"
                    >
                        <option value="All">All Roles</option>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold ml-2">
                        Status:
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 cursor-pointer focus:outline-none focus:border-indigo-500"
                    >
                        <option value="All">All Status</option>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/70">
                                <th className="px-6 py-4">User Profile</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Assigned Boutique</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Registered Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        <p className="font-semibold text-slate-700 text-base">No users found</p>
                                        <p className="text-xs text-slate-400 mt-1">Try refining your search filter or click "Sync DB" to refresh.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id || u.email} className="hover:bg-slate-50/80 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                                                    {u.avatar || (u.name ? u.name.slice(0, 2).toUpperCase() : 'US')}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 leading-tight">{u.name || 'Merchant User'}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                u.role === 'Super Admin'
                                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                    : u.role === 'Owner' || u.role === 'Merchant Admin' || u.role === 'Merchant'
                                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {u.role || 'Owner'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 font-medium text-xs">
                                            {u.shopName || u.shop_name || 'All Boutiques (Global)'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                u.status === 'Active'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : u.status === 'Pending'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                            }`}>
                                                {u.status || 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">
                                            {u.joined || (u.created_at ? u.created_at.slice(0, 10) : '2026-01-01')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 relative">
                                                <button
                                                    onClick={() => setEditUser(u)}
                                                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                                    title="Edit User"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(u)}
                                                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                
                                                <div className="relative">
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                                                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                                                    >
                                                        <MoreVertical size={16} />
                                                    </button>
                                                    {openMenuId === u.id && (
                                                        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100 text-left">
                                                            <button
                                                                onClick={() => {
                                                                    toggleStatus(u);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="w-full px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                            >
                                                                {u.status === 'Active' ? (
                                                                    <>
                                                                        <PauseCircle size={14} className="text-amber-500" /> Suspend Access
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <PlayCircle size={14} className="text-emerald-500" /> Activate Account
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Add User */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Invite Platform User</h3>
                                <p className="text-xs text-slate-400">Assign role and boutique permissions.</p>
                            </div>
                            <button
                                onClick={() => setIsAddModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4 pt-4">
                            <div>
                                <label className={labelClass}>Full Name *</label>
                                <input
                                    name="name"
                                    required
                                    placeholder="e.g. Rachel Green"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Email Address *</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="rachel@bengalsilk.com"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Initial Password *</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showAddPassword ? 'text' : 'password'}
                                        required
                                        defaultValue="password123"
                                        placeholder="••••••••••••"
                                        className={inputClass}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowAddPassword(!showAddPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showAddPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Role *</label>
                                    <select name="role" defaultValue="Owner" className={inputClass}>
                                        <option value="Owner">Owner (Boutique Admin)</option>
                                        <option value="Super Admin">Super Admin</option>
                                        <option value="Staff">Staff (Operations)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Status *</label>
                                    <select name="status" defaultValue="Active" className={inputClass}>
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending Invite</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Assign to Boutique</label>
                                <select name="shopName" defaultValue={shops[0]?.name || 'Bengal Silk House'} className={inputClass}>
                                    <option value="All Boutiques (Global)">All Boutiques (Global Super Admin)</option>
                                    {shops.map((s) => (
                                        <option key={s.id} value={s.name}>
                                            {s.name} ({s.slug})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
                                >
                                    Create User Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit User */}
            {editUser && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-150">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Edit User Details</h3>
                                <p className="text-xs text-slate-400">Update account credentials and assignment.</p>
                            </div>
                            <button
                                onClick={() => setEditUser(null)}
                                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="space-y-4 pt-4">
                            <div>
                                <label className={labelClass}>Full Name</label>
                                <input
                                    name="name"
                                    required
                                    defaultValue={editUser.name}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    defaultValue={editUser.email}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Change Password (leave blank to keep current)</label>
                                <div className="relative">
                                    <input
                                        name="password"
                                        type={showEditPassword ? 'text' : 'password'}
                                        placeholder="New password (optional)"
                                        className={inputClass}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowEditPassword(!showEditPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showEditPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Role</label>
                                    <select name="role" defaultValue={editUser.role} className={inputClass}>
                                        <option value="Owner">Owner</option>
                                        <option value="Super Admin">Super Admin</option>
                                        <option value="Staff">Staff</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select name="status" defaultValue={editUser.status} className={inputClass}>
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Assign to Boutique</label>
                                <select name="shopName" defaultValue={editUser.shopName || editUser.shop_name || 'All Boutiques (Global)'} className={inputClass}>
                                    <option value="All Boutiques (Global)">All Boutiques (Global Super Admin)</option>
                                    {shops.map((s) => (
                                        <option key={s.id} value={s.name}>
                                            {s.name} ({s.slug})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditUser(null)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Delete Confirmation */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-150 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Delete User Account</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Are you sure you want to permanently delete <span className="font-bold text-slate-900">{deleteTarget.name}</span>?
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-2.5 pt-2">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteUser(deleteTarget.id);
                                    setDeleteTarget(null);
                                }}
                                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
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

export default Users;