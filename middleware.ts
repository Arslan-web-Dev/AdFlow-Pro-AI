import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';

// Role-based route configurations
const PUBLIC_ROUTES = [
  '/',
  '/marketplace',
  '/ads',
  '/category',
  '/city',
  '/login',
  '/register',
  '/api/public',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/verify',
];

const PROTECTED_ROUTES = {
  client: [
    '/dashboard/client',
    '/client',
    '/api/client',
    '/api/ads/create',
    '/api/ads/update',
    '/api/ads/delete',
    '/api/payments',
  ],
  moderator: [
    '/dashboard/moderator',
    '/moderator',
    '/api/moderator',
    '/api/ads/approve',
    '/api/ads/reject',
  ],
  admin: [
    '/dashboard/admin',
    '/admin',
    '/api/admin',
  ],
};

const ROLE_REDIRECTS = {
  client: '/dashboard/client',
  moderator: '/dashboard/moderator',
  admin: '/dashboard/admin',
};

// Check if route matches patterns
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => 
    pathname === route || 
    pathname.startsWith(`${route}/`) ||
    pathname.startsWith(route.replace('/api', '/api/'))
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public API routes and static files
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/api/public/') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }

  // Check if route is public
  const isPublicRoute = matchesRoute(pathname, PUBLIC_ROUTES);
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  let user = null;
  
  if (token) {
    try {
      const decoded = verifyToken(token);
      user = decoded;
    } catch {
      // Invalid token, will be handled below
    }
  }

  // Handle authenticated users accessing auth pages
  if (user && (pathname === '/login' || pathname === '/register')) {
    const redirectUrl = ROLE_REDIRECTS[user.role as keyof typeof ROLE_REDIRECTS] || '/marketplace';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Public routes don't require authentication
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // All other routes require authentication
  if (!user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check role-based access
  const requiredRole = Object.entries(PROTECTED_ROUTES).find(([role, routes]) =>
    matchesRoute(pathname, routes)
  )?.[0];

  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    // Admins can access everything, others must match their role
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Redirect to their appropriate dashboard
    const redirectUrl = ROLE_REDIRECTS[user.role as keyof typeof ROLE_REDIRECTS] || '/marketplace';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Add user info to request headers for downstream use
  const requestHeaders = new Headers(request.headers);
  if (user) {
    requestHeaders.set('x-user-id', user.userId);
    requestHeaders.set('x-user-role', user.role);
    requestHeaders.set('x-user-email', user.email);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configure matcher for all routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
