import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from './lib/auth/jwt';

// Role-based route protection
const roleRoutes = {
  '/client': ['client', 'moderator', 'admin', 'super_admin'],
  '/moderator': ['moderator', 'admin', 'super_admin'],
  '/admin': ['admin', 'super_admin'],
  '/super-admin': ['super_admin'],
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  const publicRoutes = ['/', '/login', '/register', '/marketplace'];
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for token in cookies or Authorization header
  const token = request.cookies.get('token')?.value || 
               extractTokenFromHeader(request.headers.get('authorization'));

  if (!token) {
    // Redirect to login if no token
    if (pathname.startsWith('/client') || 
        pathname.startsWith('/moderator') || 
        pathname.startsWith('/admin') || 
        pathname.startsWith('/super-admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Verify token
  const payload = verifyToken(token);
  if (!payload) {
    // Invalid token - redirect to login
    if (pathname.startsWith('/client') || 
        pathname.startsWith('/moderator') || 
        pathname.startsWith('/admin') || 
        pathname.startsWith('/super-admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Role-based access control
  for (const [route, allowedRoles] of Object.entries(roleRoutes)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(payload.role)) {
        // User doesn't have permission - redirect to their dashboard
        const userDashboard = `/${payload.role}`;
        return NextResponse.redirect(new URL(userDashboard, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
