import { useState } from 'react';
import {
    Save, ShieldCheck, Bell, RefreshCw, Key,
    Sparkles, Database
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const Settings = () => {
    const { settings, updateSettings, resetDemoData, showToast } = useStore();
    const [form, setForm] = useState({ ...settings });
    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

    const handleSaveGeneral = (e) => {
        e.preventDefault();
        updateSettings(form);
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (!passwords.next || passwords.next !== passwords.confirm) {
            showToast('New passwords do not match', 'error');
            return;
        }
        showToast('Super Admin password successfully changed', 'success');
        setPasswords({ current: '', next: '', confirm: '' });
    };

    const inputClass =
        'w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition';
    const labelClass = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5';

    return (
        <div className="space-y-6">
            
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Platform Configuration</h1>
                <p className="text-sm text-slate-500 mt-0.5">Manage global multi-tenant parameters, commission rates, and administrative security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Settings Form (2 Columns) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* General Platform Config */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                            <Sparkles className="text-indigo-600" size={20} />
                            <div>
                                <h2 className="font-bold text-slate-900 text-base">Global SaaS Platform Rules</h2>
                                <p className="text-xs text-slate-400">Settings that apply across all tenant boutiques.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Platform Name</label>
                                <input
                                    value={form.platformName || ''}
                                    onChange={(e) => setForm({ ...form, platformName: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Support Desk Email</label>
                                <input
                                    value={form.supportEmail || ''}
                                    onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Platform Commission (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={form.commissionRate || 2.5}
                                        onChange={(e) => setForm({ ...form, commissionRate: Number(e.target.value) })}
                                        className={inputClass}
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Primary Currency</label>
                                <select
                                    value={form.currency || 'USD'}
                                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="USD">USD ($ - US Dollar)</option>
                                    <option value="EUR">EUR (€ - Euro)</option>
                                    <option value="GBP">GBP (£ - British Pound)</option>
                                    <option value="NGN">NGN (₦ - Nigerian Naira)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Super Admin Profile */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                            <ShieldCheck className="text-indigo-600" size={20} />
                            <div>
                                <h2 className="font-bold text-slate-900 text-base">Super Admin Profile</h2>
                                <p className="text-xs text-slate-400">Master account credentials and regional settings.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                                SA
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">Master Administrator</p>
                                <p className="text-xs text-slate-500">Root level access across all tenant databases</p>
                                <span className="inline-block mt-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                    Verified Super Admin
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Admin Display Name</label>
                                <input defaultValue="Super Admin" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Master Email Address</label>
                                <input defaultValue="admin@kaizer.com" type="email" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Timezone</label>
                                <select defaultValue="UTC-5" className={inputClass}>
                                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                                    <option value="UTC-5">EST (Eastern Standard Time)</option>
                                    <option value="UTC+1">WAT (West Africa Time)</option>
                                    <option value="UTC+8">SGT (Singapore Time)</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Payout Schedule</label>
                                <select defaultValue="Weekly" className={inputClass}>
                                    <option>Daily Automated</option>
                                    <option>Weekly (Mondays)</option>
                                    <option>Monthly (1st of month)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Security & Password */}
                    <form onSubmit={handlePasswordUpdate} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                            <Key className="text-indigo-600" size={20} />
                            <div>
                                <h2 className="font-bold text-slate-900 text-base">Security & Authentication</h2>
                                <p className="text-xs text-slate-400">Update master administrative password.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className={labelClass}>Current Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>New Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwords.next}
                                    onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                            >
                                Update Security Password
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Sidebar: Notifications, Save Action, Reset Demo Data */}
                <div className="space-y-6">
                    
                    {/* Save Changes Card */}
                    <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 text-white shadow-xl">
                        <h3 className="font-bold text-base">Commit Configuration</h3>
                        <p className="text-xs text-indigo-200 mt-1 mb-4 leading-relaxed">
                            Changes will take effect instantly across all tenant nodes and storefronts.
                        </p>
                        <button
                            type="button"
                            onClick={handleSaveGeneral}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-indigo-950 font-extrabold text-sm shadow-lg hover:bg-indigo-50 active:scale-95 transition"
                        >
                            <Save size={17} /> Save Platform Changes
                        </button>
                    </div>

                    {/* System Automated Alerts */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                            <Bell size={18} className="text-indigo-600" />
                            <h3 className="font-bold text-slate-900 text-sm">Automated Alerts</h3>
                        </div>

                        <div className="space-y-3 divide-y divide-slate-100">
                            {[
                                { key: 'orderAlerts', title: 'New Customer Orders', desc: 'Email digest on completed checkouts' },
                                { key: 'signupAlerts', title: 'Merchant Signups', desc: 'Alert when a new shop registers' },
                                { key: 'lowStockAlerts', title: 'Low Inventory Warnings', desc: 'Notify when style stock < 10' },
                                { key: 'monthlyReports', title: 'Monthly SaaS Reports', desc: 'Automated platform revenue summary' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between pt-3 first:pt-0">
                                    <div className="pr-3">
                                        <p className="text-xs font-bold text-slate-800">{item.title}</p>
                                        <p className="text-[11px] text-slate-400">{item.desc}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={form[item.key] ?? true}
                                        onChange={(e) => setForm({ ...form, [item.key]: e.target.checked })}
                                        className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Demo State Recovery */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 text-slate-900">
                            <Database size={18} className="text-amber-500" />
                            <h3 className="font-bold text-sm">Database & Demo Reset</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Restore all tenant shops, products, orders, and coupons to original demo baseline.
                        </p>
                        <button
                            type="button"
                            onClick={() => resetDemoData()}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition"
                        >
                            <RefreshCw size={14} /> Reset Demo Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;