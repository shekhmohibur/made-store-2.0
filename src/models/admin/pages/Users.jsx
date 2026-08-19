import { Search, Plus, MoreVertical, Trash2 } from 'lucide-react';

const Users = () => {
    const users = [
        { name: 'Amina Yusuf', email: 'amina@urbanthreads.com', role: 'Owner', shops: 'Urban Threads', status: 'Active', joined: 'Mar 12, 2025' },
        { name: 'Daniel Okafor', email: 'daniel@streetvogue.com', role: 'Owner', shops: 'Street Vogue', status: 'Active', joined: 'Jul 03, 2025' },
        { name: 'Grace Mensah', email: 'grace@linenco.com', role: 'Owner', shops: 'Linen & Co', status: 'Suspended', joined: 'Feb 28, 2025' },
        { name: 'Tunde Bakare', email: 'tunde@heritagewear.com', role: 'Staff', shops: 'Heritage Wear', status: 'Active', joined: 'Jan 15, 2025' },
        { name: 'Blessing Ade', email: 'blessing@boldknots.com', role: 'Owner', shops: 'Bold Knots', status: 'Pending', joined: 'Apr 22, 2025' },
    ];

    const initials = (n) => n.split(' ').map(w => w[0]).slice(0, 2).join('');

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Users / Owners</h1>
                    <p className="text-sm text-gray-500">Manage users and shop owners across the platform.</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow hover:opacity-95">
                    <Plus size={18} /> Invite User
                </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <div className="relative flex-1 sm:max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Search users..."
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                </div>
                <div className="flex gap-2">
                    <select className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:border-purple-400">
                        <option>All roles</option><option>Owner</option><option>Staff</option>
                    </select>
                    <select className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:border-purple-400">
                        <option>All status</option><option>Active</option><option>Pending</option><option>Suspended</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 border-b border-gray-100 bg-gray-50/50">
                                <th className="px-5 py-3 font-medium">User</th>
                                <th className="px-5 py-3 font-medium">Role</th>
                                <th className="px-5 py-3 font-medium">Shop</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                                <th className="px-5 py-3 font-medium">Joined</th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <tr key={u.email} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i === users.length - 1 ? 'border-b-0' : ''}`}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                {initials(u.name)}
                                            </span>
                                            <div>
                                                <p className="font-medium text-gray-800">{u.name}</p>
                                                <p className="text-xs text-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-gray-600">{u.shops}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium
                                            ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600'
                                            : u.status === 'Pending' ? 'bg-amber-50 text-amber-600'
                                            : 'bg-red-50 text-red-600'}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-gray-500">{u.joined}</td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 rounded-lg text-red-500 hover:bg-red-50" title="Delete"><Trash2 size={16} /></button>
                                            <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100" title="More"><MoreVertical size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm">
                <p className="text-gray-500">Showing 1–5 of 1,024 users</p>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 disabled:opacity-50" disabled>Prev</button>
                    <button className="px-3 py-1.5 rounded-lg bg-purple-600 text-white">1</button>
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600">2</button>
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600">3</button>
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600">Next</button>
                </div>
            </div>
        </>
    );
};

export default Users;