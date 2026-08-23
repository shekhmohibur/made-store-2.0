import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft, KeyRound, RefreshCw } from 'lucide-react';
import { ApiService } from '../../services/api';
import { useStore } from '../../store/useStore';
import ToastContainer from '../../components/common/ToastContainer';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const { showToast } = useStore();

    // Steps: 1 = Email Entry, 2 = Enter OTP & New Password, 3 = Success
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    const timerRef = useRef(null);

    // Handle countdown timer for resend
    useEffect(() => {
        if (resendCooldown > 0) {
            timerRef.current = setTimeout(() => {
                setResendCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearTimeout(timerRef.current);
    }, [resendCooldown]);

    // Step 1: Send OTP to Email
    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        const cleanEmail = email.trim().toLowerCase();

        if (!cleanEmail || !cleanEmail.includes('@')) {
            showToast('Please enter a valid email address', 'warning');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await ApiService.sendForgotPasswordOtp(cleanEmail);
            if (res && res.status === 'success') {
                showToast(res.message || '6-digit verification code sent to your email', 'success');
                setStep(2);
                setResendCooldown(60);
                if (res.dev_hint) {
                    setOtpCode(res.dev_hint);
                }
            } else {
                showToast(res?.message || 'No account found with this email address', 'error');
            }
        } catch (err) {
            showToast(err?.message || 'Failed to send verification code. Please check your email.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Step 2: Reset Password with OTP
    const handleResetPassword = async (e) => {
        e.preventDefault();
        const cleanEmail = email.trim().toLowerCase();
        const cleanCode = otpCode.trim();
        const cleanPass = newPassword.trim();

        if (!cleanCode || cleanCode.length < 6) {
            showToast('Please enter the full 6-digit verification code', 'warning');
            return;
        }
        if (!cleanPass || cleanPass.length < 6) {
            showToast('Password must be at least 6 characters long', 'warning');
            return;
        }
        if (cleanPass !== confirmPassword.trim()) {
            showToast('Passwords do not match. Please re-enter.', 'warning');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await ApiService.resetPassword(cleanEmail, cleanCode, cleanPass);
            if (res && res.status === 'success') {
                setStep(3);
                showToast('Password reset successfully!', 'success');
                setTimeout(() => {
                    navigate('/login');
                }, 2500);
            } else {
                showToast(res?.message || 'Invalid or expired verification code', 'error');
            }
        } catch (err) {
            showToast(err?.message || 'An error occurred while resetting password', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
            <ToastContainer />

            {/* Top Navigation */}
            <header className="h-20 border-b border-slate-800/80 px-6 sm:px-12 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Shield className="text-white" size={22} />
                    </div>
                    <div>
                        <span className="font-serif font-black text-lg tracking-wider text-white">TRIVORA</span>
                        <span className="text-[10px] block tracking-widest text-slate-400 font-sans uppercase -mt-1">Commerce Engine</span>
                    </div>
                </Link>

                <Link
                    to="/login"
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition px-4 py-2 rounded-xl hover:bg-slate-900 border border-slate-800/60"
                >
                    <ArrowLeft size={14} />
                    Back to Sign In
                </Link>
            </header>

            {/* Main Form Center */}
            <main className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

                <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
                            {step === 3 ? <CheckCircle2 size={28} className="text-emerald-400" /> : <KeyRound size={28} />}
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight">
                            {step === 1 && "Forgot Password?"}
                            {step === 2 && "Enter 6-Digit Code"}
                            {step === 3 && "Password Reset Complete!"}
                        </h1>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            {step === 1 && "Enter your registered email address and we'll send a 6-digit security verification code."}
                            {step === 2 && `We've sent a 6-digit OTP code to ${email}. Enter the code and set your new password.`}
                            {step === 3 && "Your credentials have been securely updated. Redirecting to login..."}
                        </p>
                    </div>

                    {/* Step 1: Email Form */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                    Account Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@clothing.trivora.top"
                                        required
                                        className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        Send 6-Digit Code
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* Step 2: OTP Verification & New Password */}
                    {step === 2 && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                    6-Digit Verification Code
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="123456"
                                    required
                                    className="w-full bg-slate-950/70 border border-indigo-500/50 focus:border-indigo-500 rounded-2xl text-center py-3.5 text-2xl font-mono tracking-[0.4em] text-indigo-300 placeholder:text-slate-700 focus:outline-none transition shadow-inner"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        required
                                        className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat new password"
                                        required
                                        className="w-full bg-slate-950/70 border border-slate-800 focus:border-indigo-500 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        Updating Password...
                                    </>
                                ) : (
                                    <>
                                        Save Password & Sign In
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>

                            {/* Resend Code Option */}
                            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="hover:text-white transition"
                                >
                                    Change Email
                                </button>
                                <button
                                    type="button"
                                    disabled={resendCooldown > 0 || isSubmitting}
                                    onClick={handleSendOtp}
                                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition disabled:opacity-50"
                                >
                                    <RefreshCw size={12} className={isSubmitting ? 'animate-spin' : ''} />
                                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Success Screen */}
                    {step === 3 && (
                        <div className="text-center py-4 space-y-4">
                            <div className="inline-block p-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 size={40} />
                            </div>
                            <p className="text-sm text-slate-300">
                                Your password has been successfully updated with full bcrypt encryption.
                            </p>
                            <Link
                                to="/login"
                                className="block w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/30"
                            >
                                Proceed to Sign In Now
                            </Link>
                        </div>
                    )}

                    {/* Back link */}
                    <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
                        <Link to="/login" className="text-xs font-semibold text-slate-400 hover:text-indigo-400 transition">
                            Remember your credentials? <span className="text-white font-bold">Sign In</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotPasswordPage;
