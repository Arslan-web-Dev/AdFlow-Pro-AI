import { NextRequest, NextResponse } from 'next/server';
import { JWTService, JWTPayload } from '../config/jwt.config';

/**
 * Authentication Middleware for Next.js API Routes
 * Verifies JWT token and returns user payload
 */
export const authenticate = (req: NextRequest): JWTPayload | null => {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    const payload = JWTService.verifyToken(token);
    return payload;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

/**
 * Role-based Access Control
 * Checks if user has required role
 */
export const authorize = (user: JWTPayload | null, allowedRoles: string[]): boolean => {
  if (!user) {
    return false;
  }

  return allowedRoles.includes(user.role);
};

/**
 * Check if user is the owner of a resource
 */
export const isOwner = (user: JWTPayload | null, resourceUserId: string): boolean => {
  if (!user) {
    return false;
  }

  return user.userId === resourceUserId || user.role === 'admin' || user.role === 'super_admin';
};

/**
 * Create unauthorized response
 */
export const unauthorizedResponse = (message: string = 'Not authenticated') => {
  return NextResponse.json({ error: message }, { status: 401 });
};

/**
 * Create forbidden response
 */
export const forbiddenResponse = (message: string = 'Insufficient permissions') => {
  return NextResponse.json({ error: message }, { status: 403 });
};

