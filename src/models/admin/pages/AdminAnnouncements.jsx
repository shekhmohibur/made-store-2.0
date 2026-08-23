import { useState } from 'react';
import {
    Megaphone, Plus, Trash2, Edit3,
    CheckCircle2, Sparkles, Eye, Send
} from 'lucide-react';
import { useStore } from '../../../store/useStore';

const BANNER_THEMES = [
    { id: 'crimson', name: 'Festive Crimson & Gold', bg: 'bg-rose-900 text-rose-100 border-rose-800', accent: '#e11d48' },
    { id: 'indigo', name: 'Modern Indigo Cloud', bg: 'bg-indigo-900 text-indigo-100 border-indigo-800', accent: '#4f46e5' },
    { id: 'emerald', name: 'Emerald Seasonal Drop', bg: 'bg-emerald-900 text-emerald-100 border-emerald-800', accent: '#059669' },
    { id: 'amber', name: 'Amber Flash Alert', bg: 'bg-amber-900 text-amber-100 border-amber-800', accent: '#d97706' },
    { id: 'obsidian', name: 'Obsidian Haute Couture', bg: 'bg-slate-950 text-slate-100 border-slate-800', accent: '#020617' },
];

const AdminAnnouncements = () => {
    const { showToast, logActivity } = useStore();

    const [announcements, setAnnouncements] = useState([
        {
            id: 'ANN-1',
            title: '✨ Nationwide Eid & Festive Collection Launches Live across All Boutiques',
            target: 'All Storefronts & Client Portals',
            theme: 'crimson',
            active: true,
            created: 'Today',
            link: '/shop',
        },
        {
            id: 'ANN-2',
            title: '⚡ Instant bKash & Nagad Custom Payment Channels now active for all merchant stores',
            target: 'Merchant Owners Only',
            theme: 'indigo',
            active: true,
            created: 'Yesterday',
            link: '/owner/settings',
        }
    ]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        title: '',
        target: 'All Storefronts & Client Portals',
        theme: 'indigo',
        link: '',
        active: true,
    });

    const handleOpenCreate = (existing = null) => {
        if (existing) {
            setEditingId(existing.id);
            setForm({ ...existing });
        } else {
            setEditingId(null);
            setForm({
                title: '',
                target: 'All Storefronts & Client Portals',
                theme: 'indigo',
                link: '',
                active: true,
            });
        }
        setIsCreateModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            showToast('Please provide an announcement headline', 'warning');
            return;
        }

        if (editingId) {
            setAnnouncements((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)));
            showToast('Announcement broadcast updated', 'success');
        } else {
            const newAnn = {
                id: `ANN-${Date.now().toString().slice(-4)}`,
                ...form,
                created: 'Just now',
            };
            setAnnouncements((prev) => [newAnn, ...prev]);
            logActivity(`Broadcasted platform announcement: "${form.title}"`, 'general');
            showToast('New platform broadcast published successfully!', 'success');
        }

        setIsCreateModalOpen(false);
    };

    const handleDelete = (id) => {
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        showToast('Announcement removed', 'info');
    };

    const handleToggleActive = (id) => {
        setAnnouncements((prev) =>
            prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
        );
        showToast('Broadcast visibility status toggled', 'success');
    };

    const activeThemeObj = BANNER_THEMES.find((t) => t.id === form.theme) || BANNER_THEMES[1];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Megaphone size={28} className="text-indigo-600" />
                        System Broadcasts & Announcements
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Publish platform-wide promotional ribbons, seasonal sale banners, and maintenance alerts across all boutiques.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenCreate()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-2xl transition shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                    <Plus size={16} /> Create Broadcast Notice
                </button>
            </div>

            {/* Active Broadcasts Grid */}
            <div className="space-y-4">
                {announcements.map((ann) => {
                    const themeObj = BANNER_THEMES.find((t) => t.id === ann.theme) || BANNER_THEMES[1];
                    return (
                        <div
                            key={ann.id}
                            className={`p-5 rounded-3xl border shadow-xs transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                ann.active ? 'bg-white border-slate-200' : 'bg-slate-50/70 border-slate-200/60 opacity-60'
                            }`}
                        >
                            <div className="space-y-2 min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        ann.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                        {ann.active ? '● LIVE BROADCAST' : 'PAUSED'}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-400">Target: <strong className="text-slate-700">{ann.target}</strong></span>
                                    <span className="text-[11px] text-slate-400">· {ann.created}</span>
                                </div>

                                {/* Banner Visual Preview Strip */}
                                <div className={`px-4 py-2.5 rounded-2xl text-xs font-bold border flex items-center justify-between gap-3 ${themeObj.bg}`}>
                                    <div className="flex items-center gap-2 truncate">
                                        <Sparkles size={14} className="shrink-0 text-amber-400" />
                                        <span className="truncate">{ann.title}</span>
                                    </div>
                                    {ann.link && (
                                        <span className="text-[10px] underline underline-offset-2 shrink-0 font-normal">
                                            Link: {ann.link}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                                <button
                                    onClick={() => handleToggleActive(ann.id)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                                        ann.active
                                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                    }`}
                                >
                                    {ann.active ? 'Pause' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => handleOpenCreate(ann)}
                                    className="p-2 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                                    title="Edit Notice"
                                >
                                    <Edit3 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(ann.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                                    title="Delete Notice"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create / Edit Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
                    <form
                        onSubmit={handleSave}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-5 animate-in zoom-in-95"
                    >
                        <h3 className="font-extrabold text-xl text-slate-900">
                            {editingId ? 'Edit Broadcast Announcement' : 'Publish New System Notice'}
                        </h3>

                        {/* Title input */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Notice Text / Headline *</label>
                            <textarea
                                required
                                rows={2}
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. ✨ Free Nationwide Delivery on orders over ৳2,000 · Festive Collection Live"
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                            />
                        </div>

                        {/* Target Audience */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Target Audience</label>
                            <select
                                value={form.target}
                                onChange={(e) => setForm({ ...form, target: e.target.value })}
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                            >
                                <option value="All Storefronts & Client Portals">All Storefronts & Client Portals (Universal)</option>
                                <option value="Boutique Storefronts Only">Boutique Storefronts Only (Shoppers)</option>
                                <option value="Merchant Owners Only">Merchant Owners Only (Admin Notice)</option>
                            </select>
                        </div>

                        {/* Theme Strip Selector */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Visual Banner Theme</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {BANNER_THEMES.map((th) => (
                                    <div
                                        key={th.id}
                                        onClick={() => setForm({ ...form, theme: th.id })}
                                        className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer flex items-center justify-between transition ${
                                            form.theme === th.id ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20' : 'border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.accent }} />
                                            <span className="truncate">{th.name}</span>
                                        </div>
                                        {form.theme === th.id && <CheckCircle2 size={14} className="text-indigo-600 shrink-0" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Link (Optional) */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Call-to-Action Link (Optional)</label>
                            <input
                                type="text"
                                value={form.link}
                                onChange={(e) => setForm({ ...form, link: e.target.value })}
                                placeholder="e.g. /shop/lookbook or /owner/settings"
                                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                            />
                        </div>

                        {/* Live Preview Strip */}
                        <div className="space-y-1 pt-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                <Eye size={12} /> Live Preview
                            </p>
                            <div className={`px-4 py-2.5 rounded-2xl text-xs font-bold border flex items-center justify-between gap-3 ${activeThemeObj.bg}`}>
                                <div className="flex items-center gap-2 truncate">
                                    <Sparkles size={14} className="shrink-0 text-amber-400" />
                                    <span className="truncate">{form.title || 'Announcement headline will appear here'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                            >
                                <Send size={14} /> Publish Broadcast
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AdminAnnouncements;
