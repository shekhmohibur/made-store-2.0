import { Save, ShieldCheck } from 'lucide-react';

const Settings = () => {
    const input = 'w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition';
    const label = 'block text-sm font-medium text-gray-700 mb-1.5';

    const toggles = [
        { t: 'Order notifications', d: 'Get notified on new orders', on: true },
        { t: 'New user signups', d: 'Email me when a user registers', on: true },
        { t: 'Low stock alerts', d: 'Alert when inventory runs low', on: false },
        { t: 'Monthly reports', d: 'Receive a monthly summary digest', on: true },
    ];

    return (
        <>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-sm text-gray-500">Manage your account, notifications and security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile + Security */}
                <div className="space-y-6 lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="font-semibold text-gray-800 mb-5">Profile Settings</h2>
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                                SA
                            </div>
                            <div>
                                <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100">Change photo</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={label}>Full name</label>
                                <input className={input} defaultValue="Super Admin" />
                            </div>
                            <div>
                                <label className={label}>Email</label>
                                <input className={input} type="email" defaultValue="admin@kaizer.com" />
                            </div>
                            <div>
                                <label className={label}>Phone</label>
                                <input className={input} placeholder="+1 (555) 000-0000" />
                            </div>
                            <div>
                                <label className={label}>Time zone</label>
                                <select className={input}>
                                    <option>UTC</option><option>GMT+1 (WAT)</option><option>GMT-5 (EST)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <ShieldCheck size={20} />
                            </span>
                            <div>
                                <h2 className="font-semibold text-gray-800">Security</h2>
                                <p className="text-xs text-gray-500">Manage password and 2FA</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={label}>Current password</label>
                                    <input className={input} type="password" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className={label}>New password</label>
                                    <input className={input} type="password" placeholder="New password" />
                                </div>
                            </div>
                            <label className="flex items-center gap-3 text-sm cursor-pointer">
                                <input type="checkbox" className="accent-emerald-600 w-4 h-4" />
                                <span className="text-gray-700">Enable two-factor authentication</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h2 className="font-semibold text-gray-800 mb-5">Notifications</h2>
                        <div className="space-y-1">
                            {toggles.map((n) => (
                                <div key={n.t} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{n.t}</p>
                                        <p className="text-xs text-gray-500">{n.d}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked={n.on}
                                        className="toggle toggle-sm toggle-success"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl text-white p-6 shadow">
                        <h2 className="font-semibold mb-1">Save changes</h2>
                        <p className="text-sm text-white/80 mb-4">Your preferences are saved to your account.</p>
                        <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition">
                            <Save size={18} /> Update Settings
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Settings;