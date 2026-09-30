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
    pathname.startsWith('/subscriptions') ||
    pathname.startsWith('/referrals') ||
    pathname.startsWith('/cms-foods') ||
    pathname.startsWith('/medicines') ||
    pathname.startsWith('/settings');

  // If trying to access protected route without cookie, redirect to /login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and visiting /login, redirect to /dashboard
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/users/:path*',
    '/health-analytics/:path*',
    '/subscriptions/:path*',
    '/referrals/:path*',
    '/cms-foods/:path*',
    '/medicines/:path*',
    '/settings/:path*',
  ],
};
