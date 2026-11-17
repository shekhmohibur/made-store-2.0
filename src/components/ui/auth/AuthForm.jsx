'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Phone, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GoogleButton } from './GoogleButton';

export function AuthForm({ mode = 'login' }) {
  const router = useRouter();
  const isRegister = mode === 'register';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    identifier: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Registration failed.');
          setLoading(false);
          return;
        }
      }

      // Sign in using email (after register) or email/phone identifier (on login)
      const loginIdentifier = isRegister
        ? formData.email || formData.phone
        : formData.identifier;

      const result = await signIn('credentials', {
        identifier: loginIdentifier,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please check your details and try again.');
        setLoading(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-xs">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          {isRegister ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          {isRegister
            ? 'Sign up with Google or fill in your details below'
            : 'Sign in with Google or your email / phone number'}
        </p>
      </div>

      {/* Google OAuth */}
      <GoogleButton
        label={isRegister ? 'Sign up with Google' : 'Sign in with Google'}
      />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" />
        <span className="text-xs font-medium uppercase text-zinc-400">or</span>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister ? (
          <>
            <Input
              label="Full Name"
              name="name"
              placeholder="Shekh Mohibur Rahman"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+8801XXXXXXXXX"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </>
        ) : (
          <>
            <Input
              label="Email or Phone Number"
              name="identifier"
              type="text"
              placeholder="you@example.com or +8801XXXXXXXXX"
              icon={Mail}
              value={formData.identifier}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </>
        )}

        <Button type="submit" isLoading={loading} className="w-full">
          {isRegister ? 'Create Account' : 'Sign In'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600">
        {isRegister ? 'Already have an account? ' : "Don't have an account? "}
        <Link
          href={isRegister ? '/login' : '/register'}
          className="font-semibold text-zinc-900 underline underline-offset-4"
        >
          {isRegister ? 'Sign in' : 'Sign up'}
        </Link>
      </p>
    </div>
  );
}