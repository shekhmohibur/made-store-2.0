'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';

const navLinks = [
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Women', href: '/shop?category=women' },
  { label: 'Outerwear', href: '/shop?category=outerwear' },
];

export function Navbar() {
  const { data: session } = useSession();
  const { totalItems, setIsOpen } = useCart();
  const router = useRouter();
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const storeName = settings?.storeName || 'ATELIER.';
  const logoUrl = settings?.logoUrl;

  // Close mobile menu on Escape or desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* Mobile Menu Button & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="rounded-lg p-2 text-zinc-700 transition-colors hover:bg-zinc-100 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {/* Brand Logo + Name */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 text-xl font-black tracking-tighter text-zinc-900"
            >
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={storeName}
                  className="h-8 w-auto max-w-[130px] object-contain"
                />
              )}
              <span>{storeName}</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search + Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search clothing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-56 rounded-full border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none"
              />
            </form>

            {session?.user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="hidden items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 sm:inline-flex"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Admin
              </Link>
            )}

            {session?.user ? (
              <div className="flex items-center gap-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {session.user.name?.split(' ')[0] || 'Account'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                Sign In
              </Link>
            )}

            {/* Cart Trigger */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative rounded-lg p-2 text-zinc-800 hover:bg-zinc-100"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-900 px-1 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Floating Overlay Mobile Menu (Zero Layout Shift) */}
        <div
          className={`absolute left-0 right-0 top-full border-b border-zinc-200 bg-white/95 shadow-xl backdrop-blur-md transition-all duration-300 ease-out lg:hidden ${
            mobileMenuOpen
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search clothing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white focus:outline-none"
              />
            </form>

            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                >
                  {link.label}
                </Link>
              ))}

              {session?.user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 flex items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-sm font-semibold text-white"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Subtle Backdrop Dimmer Behind Floating Mobile Menu */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 z-30 bg-black/25 backdrop-blur-2xs transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
      />
    </>
  );
}