import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth?.user);
  const isAdmin = req.auth?.user?.role === 'ADMIN';

  // Redirect already-logged-in users away from auth pages
  if (isLoggedIn && (pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    const destination = isAdmin ? '/admin' : '/profile';
    return NextResponse.redirect(new URL(destination, req.url));
  }

  // Protect private routes
  if (!isLoggedIn && (pathname.startsWith('/profile') || pathname.startsWith('/checkout'))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL(isLoggedIn ? '/' : '/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/login', '/register', '/profile/:path*', '/checkout/:path*', '/admin/:path*'],
};