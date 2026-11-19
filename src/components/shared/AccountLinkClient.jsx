'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Phone, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function AccountLinkClient({ user }) {
  const router = useRouter();
  const isEmailLocked = Boolean(user?.email);

  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side password validation
    const wantsPasswordChange = Boolean(oldPassword || newPassword || confirmPassword);
    if (wantsPasswordChange) {
      if (user?.hasPassword && !oldPassword) {
        setError('Please enter your current (old) password.');
        return;
      }
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New password and re-entered password do not match.');
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: isEmailLocked ? undefined : email,
          phone,
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update credentials.');
      } else {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('Account credentials updated successfully.');
        router.refresh();
      }
    } catch {
      setError('Network error while saving changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Connected Sign-In Methods</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            Link Google, Email, and Phone so you can access your account any way.
          </p>
        </div>
        <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
      </div>

      {/* Google OAuth Linking Box */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-900">Google Account</span>
            <Badge variant={user?.googleLinked ? 'success' : 'warning'}>
              {user?.googleLinked ? 'Linked' : 'Not Linked'}
            </Badge>
          </div>
          <p className="text-xs text-zinc-500">
            One-click sign-in with your Google profile.
          </p>
        </div>

        {!user?.googleLinked && (
          <Button
            type="button"
            size="sm"
            onClick={() => signIn('google', { callbackUrl: '/profile' })}
          >
            Link Google
          </Button>
        )}
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-5">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Email (Locked if already set) & Phone */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700">
                Email Address
              </label>
              {isEmailLocked && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                  <Lock className="h-3 w-3" /> Cannot be changed
                </span>
              )}
            </div>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                value={email}
                disabled={isEmailLocked}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`h-11 w-full rounded-lg border pl-10 pr-4 text-sm ${
                  isEmailLocked
                    ? 'cursor-not-allowed border-zinc-200 bg-zinc-100 text-zinc-500'
                    : 'border-zinc-300 bg-white text-zinc-900 focus:border-zinc-900 focus:outline-none'
                }`}
              />
            </div>
          </div>

          <Input
            label="Phone Number"
            type="tel"
            icon={Phone}
            placeholder="01XXXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Password Change Section (Old -> New -> Confirm) */}
        <div className="space-y-3 border-t border-zinc-100 pt-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700">
              {user?.hasPassword ? 'Change Password (Optional)' : 'Set Account Password (Optional)'}
            </h3>
            <p className="text-xs text-zinc-400">
              Leave all password fields blank to keep your current password.
            </p>
          </div>

          <div className={`grid gap-4 ${user?.hasPassword ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
            {user?.hasPassword && (
              <Input
                label="Old Password"
                type="password"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            )}
            <Input
              label="New Password"
              type="password"
              placeholder="Min. 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Re-enter New Password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={saving}>
            Save &amp; Link Credentials
          </Button>
        </div>
      </form>
    </div>
  );
}