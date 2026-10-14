import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminCookie = request.cookies.get('admin_session')?.value;
  const isAuthenticated = Boolean(adminCookie);

  // Protected admin routes
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/users') ||
    pathname.startsWith('/health-analytics') ||
    pathname.startsWith('/master-data') ||
    pathname.startsWith('/referrals') ||
    pathname.startsWith('/settings');

  // If trying to access protected route without cookie, redirect to /mc-portal/auth
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/mc-portal/auth', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and visiting /mc-portal/auth, redirect to /dashboard
  if (pathname === '/mc-portal/auth' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If someone visits /login, redirect to /mc-portal/auth
  if (pathname === '/login') {
    return NextResponse.redirect(new URL('/mc-portal/auth', request.url));
  }

  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: [
    '/login',
    '/mc-portal/auth',
    '/dashboard',
    '/dashboard/:path*',
    '/users',
    '/users/:path*',
    '/health-analytics',
    '/health-analytics/:path*',
    '/master-data',
    '/master-data/:path*',
    '/referrals',
    '/referrals/:path*',
    '/settings',
    '/settings/:path*',
  ],
};
