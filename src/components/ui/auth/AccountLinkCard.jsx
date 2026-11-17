'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Mail, Phone, ShieldCheck, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { GoogleButton } from './GoogleButton';

export function AccountLinkCard() {
  const { update } = useSession();
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchLinkStatus = async () => {
    const res = await fetch('/api/auth/link');
    if (res.ok) {
      const data = await res.json();
      setStatus(data);
      setEmail(data.email || '');
      setPhone(data.phone || '');
    }
  };

  useEffect(() => {
    fetchLinkStatus();
  }, []);

  const handleSaveCredentials = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const payload = {};
    if (email && email !== status?.email) payload.email = email;
    if (phone && phone !== status?.phone) payload.phone = phone;
    if (password) payload.password = password;

    const res = await fetch('/api/auth/link', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage({ type: 'success', text: 'Login methods updated successfully.' });
      setPassword('');
      await update({ email: data.user.email, phone: data.user.phone });
      await fetchLinkStatus();
    } else {
      setMessage({ type: 'error', text: data.error || 'Failed to update.' });
    }
    setSaving(false);
  };

  const handleUnlinkGoogle = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    const res = await fetch('/api/auth/link', { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      setMessage({ type: 'success', text: 'Google account unlinked.' });
      await fetchLinkStatus();
    } else {
      setMessage({ type: 'error', text: data.error });
    }
    setSaving(false);
  };

  if (!status) {
    return <div className="h-48 animate-pulse rounded-2xl bg-zinc-100" />;
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xs">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">
            Connected Sign-In Methods
          </h2>
          <p className="text-sm text-zinc-500">
            Link Google, Email, and Phone so you can access your account any way.
          </p>
        </div>
        <ShieldCheck className="h-6 w-6 text-emerald-600" />
      </div>

      {message.text && (
        <div
          className={`mb-4 rounded-lg px-4 py-2.5 text-xs font-medium ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Google Connection Row */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-900">Google Account</span>
            {status.googleLinked ? (
              <Badge variant="success">Connected</Badge>
            ) : (
              <Badge variant="warning">Not Linked</Badge>
            )}
          </div>
          <p className="text-xs text-zinc-500">
            One-click sign-in with your Google profile.
          </p>
        </div>

        {status.googleLinked ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleUnlinkGoogle}
            isLoading={saving}
          >
            <Unlink className="h-3.5 w-3.5" />
            Unlink Google
          </Button>
        ) : (
          <GoogleButton
            label="Link Google"
            callbackUrl="/profile"
            variant="primary"
            className="w-auto"
          />
        )}
      </div>

      {/* Email + Phone + Password Form */}
      <form onSubmit={handleSaveCredentials} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="Add email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Phone Number"
            type="tel"
            icon={Phone}
            placeholder="Add phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <Input
          label={status.hasPassword ? 'Change Password (Optional)' : 'Set Account Password'}
          type="password"
          placeholder={
            status.hasPassword
              ? 'Leave blank to keep current password'
              : 'Required to sign in with Email or Phone'
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end">
          <Button type="submit" isLoading={saving}>
            Save & Link Credentials
          </Button>
        </div>
      </form>
    </div>
  );
}