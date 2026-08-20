import { useState } from 'react';
import {
    Search, MoreVertical, Trash2, Edit, UserPlus,
    Filter, Download, X, AlertTriangle,
    PauseCircle, PlayCircle
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const ROLES = ['Super Admin', 'Owner', 'Staff'];
const STATUSES = ['Active', 'Pending', 'Suspended'];

const Users = () => {
    const { users, shops, addUser, updateUser, deleteUser, showToast } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    // Filter users
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (u.shopName || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || u.role === roleFilter;
        const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleCreateUser = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        addUser({
            name: fd.get('name'),
            email: fd.get('email'),
            role: fd.get('role'),
            shopName: fd.get('shopName'),
            status: fd.get('status'),
        });
        setIsAddModalOpen(false);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        updateUser(editUser.id, {
            name: fd.get('name'),
            email: fd.get('email'),
            role: fd.get('role'),
            shopName: fd.get('shopName'),
            status: fd.get('status'),
        });
        setEditUser(null);
    };

    const toggleStatus = (user) => {
        const next = user.status === 'Active' ? 'Suspended' : 'Active';
        updateUser(user.id, { status: next });
    };

    const exportCSV = () => {
        const headers = ['ID,Name,Email,Role,Shop Assignment,Status,Joined\n'];
        const rows = users.map(
            (u) => `"${u.id}","${u.name}","${u.email}","${u.role}","${u.shopName || 'All'}","${u.status}","${u.joined}"\n`
        );
        const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `kaizer-users-${new Date().toISOString().slice(0, 10)}.csv`);
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
                <div className="flex items-center gap-2.5">
                    <button
                        onClick={exportCSV}
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold shadow-sm transition"
                    >
                        <Download size={16} /> Export Users
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition active:scale-95"
                    >
                        <UserPlus size={18} /> Invite New User
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">Total Users</p>
                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{users.length}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">Shop Owners</p>
                    <p className="text-2xl font-extrabold text-indigo-600 mt-1">
                        {users.filter((u) => u.role === 'Owner').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">Active Accounts</p>
                    <p className="text-2xl font-extrabold text-emerald-600 mt-1">
                        {users.filter((u) => u.status === 'Active').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-semibold text-slate-500">Pending Invites</p>
                    <p className="text-2xl font-extrabold text-amber-600 mt-1">
                        {users.filter((u) => u.status === 'Pending').length}
                    </p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                <div className="relative w-full md:w-80">
                    <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="search"
                        placeholder="Search by name, email, or shop..."
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
                                        <p className="text-xs text-slate-400 mt-1">Try refining your search filter.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id || u.email} className="hover:bg-slate-50/80 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
                                                    {u.avatar || u.name.slice(0, 2).toUpperCase()}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-900 leading-tight">{u.name}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                u.role === 'Super Admin'
                                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                                    : u.role === 'Owner'
                                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 font-medium text-xs">
                                            {u.shopName || 'Global Platform'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                u.status === 'Active'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : u.status === 'Pending'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                            }`}>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500">{u.joined}</td>
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
                                                        <>
                                                            <div className="fixed inset-0 z-20" onClick={() => setOpenMenuId(null)} />
                                                            <div className="absolute right-0 top-10 z-30 w-44 rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 py-1 text-left animate-in fade-in zoom-in-95">
                                                                <button
                                                                    onClick={() => { toggleStatus(u); setOpenMenuId(null); }}
                                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                                                                >
                                                                    {u.status === 'Active' ? <PauseCircle size={15} className="text-amber-500" /> : <PlayCircle size={15} className="text-emerald-500" />}
                                                                    {u.status === 'Active' ? 'Suspend Access' : 'Activate Access'}
                                                                </button>
                                                            </div>
                                                        </>
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

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
                    <form onSubmit={handleCreateUser} className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Invite New User</h3>
                                <p className="text-xs text-slate-500">Grant administrative or merchant owner permissions.</p>
                            </div>
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-200">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className={labelClass}>Full Name *</label>
                                <input name="name" className={inputClass} placeholder="e.g. Marcus Vance" required />
                            </div>
                            <div>
                                <label className={labelClass}>Email Address *</label>
                                <input name="email" type="email" className={inputClass} placeholder="marcus@example.com" required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Role</label>
                                    <select name="role" defaultValue="Owner" className={inputClass}>
                                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select name="status" defaultValue="Active" className={inputClass}>
                                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Assigned Boutique Shop</label>
                                <select name="shopName" className={inputClass}>
                                    <option value="All Shops">All Shops (Super Admin)</option>
                                    {shops.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
                            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100">
                                Cancel
                            </button>
                            <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700">
                                Send Invite & Add User
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit User Modal */}
            {editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditUser(null)} />
                    <form onSubmit={handleSaveEdit} className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Edit User Account</h3>
                                <p className="text-xs text-slate-500">{editUser.name} · {editUser.id}</p>
                            </div>
                            <button type="button" onClick={() => setEditUser(null)} className="p-2 rounded-xl text-slate-400 hover:bg-slate-200">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className={labelClass}>Full Name *</label>
                                <input name="name" defaultValue={editUser.name} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>Email Address *</label>
                                <input name="email" type="email" defaultValue={editUser.email} className={inputClass} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Role</label>
                                    <select name="role" defaultValue={editUser.role} className={inputClass}>
                                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select name="status" defaultValue={editUser.status} className={inputClass}>
                                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Assigned Boutique Shop</label>
                                <select name="shopName" defaultValue={editUser.shopName || 'All Shops'} className={inputClass}>
                                    <option value="All Shops">All Shops (Super Admin)</option>
                                    {shops.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
                            <button type="button" onClick={() => setEditUser(null)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100">
                                Cancel
                            </button>
                            <button type="submit" className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-700">
                                Save Profile Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Delete Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
                    <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl p-6 border border-slate-200 animate-in fade-in zoom-in-95">
                        <div className="flex items-center gap-3.5 mb-4">
                            <span className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                                <AlertTriangle size={24} />
                            </span>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Delete User Account?</h3>
                                <p className="text-xs text-slate-500">{deleteTarget.name} ({deleteTarget.email})</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            This user will immediately lose access to their tenant dashboards and platform permissions.
                        </p>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteUser(deleteTarget.id);
                                    setDeleteTarget(null);
                                }}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold shadow-lg shadow-rose-600/30 hover:bg-rose-700"
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