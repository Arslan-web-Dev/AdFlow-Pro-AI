import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

// Role-based route protection - matches new dashboard structure
const roleRoutes: Record<string, string[]> = {
  '/dashboard/client': ['client', 'moderator', 'admin'],
  '/client': ['client', 'moderator', 'admin'],
  '/dashboard/moderator': ['moderator', 'admin'],
  '/moderator': ['moderator', 'admin'],
  '/dashboard/admin': ['admin'],
  '/admin': ['admin'],
};

// Public routes that don't require auth
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/marketplace',
  '/ads',
  '/category',
  '/city',
  '/api/public',
  '/api/auth',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes, static files, and public assets
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.') // Static files with extensions
  ) {
    return NextResponse.next();
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  // Handle authenticated users accessing auth pages
  if (token) {
    const payload = verifyToken(token);
    if (payload && (pathname === '/login' || pathname === '/register')) {
      const dashboardRoutes: Record<string, string> = {
        client: '/dashboard/client',
        moderator: '/dashboard/moderator',
        admin: '/dashboard/admin',
      };
      return NextResponse.redirect(new URL(dashboardRoutes[payload.role] || '/marketplace', request.url));
    }
  }

  // Public routes don't require authentication
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // All other routes require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check role-based access
  const matchedRoute = Object.entries(roleRoutes).find(([route]) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (matchedRoute) {
    const [, allowedRoles] = matchedRoute;
    if (!allowedRoles.includes(payload.role)) {
      // Redirect to their appropriate dashboard
      const dashboardRoutes: Record<string, string> = {
        client: '/dashboard/client',
        moderator: '/dashboard/moderator',
        admin: '/dashboard/admin',
      };
      return NextResponse.redirect(new URL(dashboardRoutes[payload.role] || '/marketplace', request.url));
    }
  }

  // Add user info to request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-role', payload.role);
  requestHeaders.set('x-user-email', payload.email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
