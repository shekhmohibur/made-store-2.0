import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Camera, User, Mail, Lock, ShieldCheck, Check,
    Eye, EyeOff, Save, Sparkles, UploadCloud
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { compressImage } from '../../utils/imageCompressor';

const ProfileEditModal = ({ isOpen, onClose }) => {
    const { currentAuthUser, updateUserProfile, showToast } = useStore();

    const [name, setName] = useState(currentAuthUser?.name || '');
    const [email, setEmail] = useState(currentAuthUser?.email || '');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [avatar, setAvatar] = useState(currentAuthUser?.avatar || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    if (!isOpen || !currentAuthUser) return null;

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file (JPG, PNG, WebP)', 'warning');
            return;
        }

        setIsUploading(true);
        try {
            const compressed = await compressImage(file, 400, 400, 0.75);
            setAvatar(compressed.dataUrl);
            showToast('Avatar image loaded and compressed!', 'success');
        } catch {
            showToast('Failed to process image file', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            showToast('Please provide your name', 'warning');
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                name: name.trim(),
                email: email.trim() || currentAuthUser.email,
                avatar: avatar || name.substring(0, 2).toUpperCase(),
            };

            if (password && password.trim().length >= 4) {
                payload.password = password.trim();
            }

            await updateUserProfile(payload);
            onClose();
        } catch (err) {
            showToast(err?.message || 'Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const isImageAvatar = avatar && (avatar.startsWith('data:image') || avatar.startsWith('http'));

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden font-sans z-10"
                >
                    {/* Header */}
                    <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between border-b border-indigo-800/40">
                        <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center font-bold">
                                <Sparkles size={16} />
                            </span>
                            <div>
                                <h3 className="font-extrabold text-white text-base">Edit Administrator Profile</h3>
                                <p className="text-[11px] text-indigo-300">Update your avatar, name, and security</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
                        
                        {/* Avatar Upload Area */}
                        <div className="flex flex-col items-center justify-center space-y-3 pb-2">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl border-4 border-indigo-100 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black">
                                    {isImageAvatar ? (
                                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{avatar || (name ? name.substring(0, 2).toUpperCase() : 'SA')}</span>
                                    )}
                                </div>

                                <label
                                    htmlFor="avatar-file-input"
                                    className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg cursor-pointer transition transform active:scale-95 group-hover:scale-105"
                                    title="Upload Profile Picture"
                                >
                                    <Camera size={16} />
                                </label>
                                <input
                                    id="avatar-file-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>

                            <div className="text-center">
                                <label
                                    htmlFor="avatar-file-input"
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer flex items-center justify-center gap-1.5"
                                >
                                    <UploadCloud size={14} />
                                    {isUploading ? 'Compressing...' : 'Upload Profile Picture'}
                                </label>
                                <p className="text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG, WebP (Auto-Compressed)</p>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Full Name *
                            </label>
                            <div className="relative">
                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Shekh Mohibur Rahman"
                                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your-email@trivora.top"
                                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                                />
                            </div>
                        </div>

                        {/* Role / Access (Read-Only) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                                System Role & Authority
                            </label>
                            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                                <ShieldCheck size={16} className="text-emerald-600" />
                                <span className="font-bold text-slate-800">{currentAuthUser.role || 'Super Admin'}</span>
                                <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                    Verified Master
                                </span>
                            </div>
                        </div>

                        {/* Password (Optional) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                                <span>Change Password</span>
                                <span className="text-[10px] text-slate-400 font-normal">Leave blank to keep unchanged</span>
                            </label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password (min 6 chars)"
                                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:bg-white transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-2/3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                            >
                                {isSaving ? <Check size={15} className="animate-spin" /> : <Save size={15} />}
                                {isSaving ? 'Saving...' : 'Save Profile & Avatar'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProfileEditModal;
