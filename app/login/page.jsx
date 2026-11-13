"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, UserCheck } from "lucide-react";
import { signInAction, signUpAction } from "@/app/actions/authActions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function AuthPage() {
  const [mode, setMode] = useState("SIGNIN"); // "SIGNIN" | "SIGNUP"
  const [accountType, setAccountType] = useState("CUSTOMER"); // "CUSTOMER" | "ADMIN"

  const [signInState, signInDispatch, isSigningIn] = useActionState(signInAction, null);
  const [signUpState, signUpDispatch, isSigningUp] = useActionState(signUpAction, null);

  const error = mode === "SIGNIN" ? signInState?.error : signUpState?.error;
  const isPending = mode === "SIGNIN" ? isSigningIn : isSigningUp;

  return (
    <div className="min-h-screen bg-[#FAF9F6] grid grid-cols-1 lg:grid-cols-12">
      {/* Left Editorial Lookbook Panel */}
      <div className="hidden lg:flex lg:col-span-6 relative bg-stone-900 text-white flex-col justify-between p-12 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400"
          alt="Editorial Fashion"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="relative z-10">
          <Link href="/" className="font-serif font-bold tracking-[0.2em] text-xl">
            ATELIER THREADS
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <p className="text-[11px] uppercase tracking-[0.25em] text-stone-300 mb-3">
            Member & Studio Access
          </p>
          <h2 className="font-serif text-4xl font-semibold leading-tight mb-4">
            Timeless silhouettes, tailored for everyday longevity.
          </h2>
          <p className="text-sm text-stone-200 leading-relaxed">
            Sign in to track your orders, manage saved sizing preferences, or access the Studio Management Panel.
          </p>
        </div>
      </div>

      {/* Right Authentication Form Panel */}
      <div className="lg:col-span-6 flex flex-col justify-center px-6 py-12 sm:px-16">
        <div className="max-w-md w-full mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 mb-8 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </Link>

          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 mb-2">
            {mode === "SIGNIN" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-xs text-stone-500 mb-8">
            {mode === "SIGNIN"
              ? "Enter your credentials to access your account or studio dashboard."
              : "Register as a customer or verify with your Studio Passcode for admin access."}
          </p>

          {/* Mode Toggle Pills */}
          <div className="grid grid-cols-2 bg-stone-200/60 p-1 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setMode("SIGNIN")}
              className={`py-2 text-xs font-semibold rounded-md transition ${
                mode === "SIGNIN"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("SIGNUP")}
              className={`py-2 text-xs font-semibold rounded-md transition ${
                mode === "SIGNUP"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {mode === "SIGNIN" ? (
            <form action={signInDispatch} className="space-y-4">
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                required
              />
              <Input
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                required
              />
              <Button type="submit" size="lg" disabled={isPending} className="w-full mt-2">
                {isPending ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          ) : (
            <form action={signUpDispatch} className="space-y-4">
              {/* Role Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Account Role
                </label>
                <input type="hidden" name="accountType" value={accountType} />
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAccountType("CUSTOMER")}
                    className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 ${
                      accountType === "CUSTOMER"
                        ? "border-stone-900 bg-white ring-1 ring-stone-900"
                        : "border-stone-200 bg-white/60 text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    <UserCheck className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900">Customer</p>
                      <p className="text-[10px] text-stone-500">Shop & track orders</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType("ADMIN")}
                    className={`p-3 rounded-lg border text-left transition flex items-center gap-2.5 ${
                      accountType === "ADMIN"
                        ? "border-stone-900 bg-white ring-1 ring-stone-900"
                        : "border-stone-200 bg-white/60 text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    <Shield className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900">Studio Admin</p>
                      <p className="text-[10px] text-stone-500">Manage full site</p>
                    </div>
                  </button>
                </div>
              </div>

              <Input name="name" label="Full Name" placeholder="Shekh Mohibur Rahman" required />
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                required
              />
              <Input
                name="password"
                type="password"
                label="Password (min 6 chars)"
                placeholder="••••••••"
                required
              />

              {accountType === "ADMIN" && (
                <Input
                  name="adminCode"
                  type="password"
                  label="Studio Admin Passcode"
                  placeholder="Enter ADMIN_SECRET from .env"
                  required
                />
              )}

              <Button type="submit" size="lg" disabled={isPending} className="w-full mt-2">
                {isPending
                  ? "Creating Account..."
                  : accountType === "ADMIN"
                  ? "Register Studio Admin"
                  : "Create Customer Account"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}