import { useState } from 'react';
import {
    Save, ShieldCheck, Bell, Key,
    Sparkles, Camera, UploadCloud
} from 'lucide-react';
import { useStore } from '../../../store/useStore';
import { compressImage } from '../../../utils/imageCompressor';

const Settings = () => {
    const { settings, updateSettings, currentAuthUser, updateUserProfile, showToast } = useStore();
    const [form, setForm] = useState({ ...settings });
    const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

    const [adminName, setAdminName] = useState(currentAuthUser?.name || 'Super Administrator');
    const [adminEmail, setAdminEmail] = useState(currentAuthUser?.email || 'admin@trivora.top');
    const [adminAvatar, setAdminAvatar] = useState(currentAuthUser?.avatar || '');
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const handleSaveGeneral = (e) => {
        e.preventDefault();
        updateSettings(form);
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file', 'warning');
            return;
        }

        setIsUploadingAvatar(true);
        try {
            const compressed = await compressImage(file, 400, 400, 0.75);
            setAdminAvatar(compressed.dataUrl);
            showToast('Profile image uploaded and compressed!', 'success');
        } catch {
            showToast('Failed to process image file', 'error');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            await updateUserProfile({
                name: adminName.trim(),
                email: adminEmail.trim(),
                avatar: adminAvatar || (adminName ? adminName.substring(0, 2).toUpperCase() : 'SA'),
            });
        } catch (err) {
            showToast(err?.message || 'Failed to update profile', 'error');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!passwords.next || passwords.next !== passwords.confirm) {
            showToast('New passwords do not match', 'error');
            return;
        }
        if (passwords.next.length < 4) {
            showToast('Password must be at least 4 characters', 'warning');
            return;
        }

        try {
            await updateUserProfile({ password: passwords.next });
            setPasswords({ current: '', next: '', confirm: '' });
        } catch {
            showToast('Failed to update password', 'error');
        }
    };

    const inputClass =
        'w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition';
    const labelClass = 'block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5';

    const isImageAvatar = adminAvatar && (adminAvatar.startsWith('data:image') || adminAvatar.startsWith('http'));

    return (
        <div className="space-y-6 font-sans">
            
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
                                    value={form.currency || 'BDT'}
                                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="BDT">BDT (৳ - Bangladeshi Taka)</option>
                                    <option value="USD">USD ($ - US Dollar)</option>
                                    <option value="EUR">EUR (€ - Euro)</option>
                                    <option value="GBP">GBP (£ - British Pound)</option>
                                    <option value="CAD">CAD (CA$ - Canadian Dollar)</option>
                                    <option value="AED">AED (AED - UAE Dirham)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Super Admin Profile */}
                    <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                            <ShieldCheck className="text-indigo-600" size={20} />
                            <div>
                                <h2 className="font-bold text-slate-900 text-base">Super Admin Profile & Avatar</h2>
                                <p className="text-xs text-slate-400">Master account credentials and custom avatar image.</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-5">
                            <div className="relative group">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-black text-2xl flex items-center justify-center shadow-lg border-2 border-indigo-100">
                                    {isImageAvatar ? (
                                        <img src={adminAvatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{adminAvatar || (adminName ? adminName.substring(0, 2).toUpperCase() : 'SA')}</span>
                                    )}
                                </div>
                                <label
                                    htmlFor="settings-avatar-input"
                                    className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md cursor-pointer transition"
                                    title="Upload Avatar"
                                >
                                    <Camera size={14} />
                                </label>
                                <input
                                    id="settings-avatar-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                            </div>

                            <div className="text-center sm:text-left space-y-1">
                                <p className="font-bold text-slate-900 text-sm">{adminName || 'Super Administrator'}</p>
                                <p className="text-xs text-slate-500">{adminEmail || 'admin@trivora.top'}</p>
                                <label
                                    htmlFor="settings-avatar-input"
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer inline-flex items-center gap-1"
                                >
                                    <UploadCloud size={13} /> {isUploadingAvatar ? 'Processing...' : 'Upload Profile Picture'}
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Admin Display Name</label>
                                <input
                                    value={adminName}
                                    onChange={(e) => setAdminName(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Master Email Address</label>
                                <input
                                    value={adminEmail}
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    type="email"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="pt-2 text-right">
                            <button
                                type="submit"
                                disabled={isSavingProfile}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 inline-flex items-center gap-1.5"
                            >
                                <Save size={14} /> {isSavingProfile ? 'Saving...' : 'Save Profile Details'}
                            </button>
                        </div>
                    </form>

                    {/* Security & Password */}
                    <form onSubmit={handlePasswordUpdate} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                            <Key className="text-indigo-600" size={20} />
                            <div>
                                <h2 className="font-bold text-slate-900 text-base">Security & Authentication</h2>
                                <p className="text-xs text-slate-400">Update master administrative password.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <label className={labelClass}>Confirm New Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="pt-2 text-right">
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition shadow cursor-pointer"
                            >
                                Update Security Password
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Sidebar: Notifications & Save Action */}
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
                </div>
            </div>
        </div>
    );
};

export default Settings;