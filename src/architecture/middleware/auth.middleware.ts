import { NextRequest, NextResponse } from 'next/server';
import { JWTService, JWTPayload } from '../config/jwt.config';
import { UserRole } from '../../models/user.model';

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
export const authorize = (user: JWTPayload | null, allowedRoles: UserRole[]): boolean => {
  if (!user) {
    return false;
  }

  return allowedRoles.includes(user.role as UserRole);
};

/**
 * Check if user is the owner of a resource
 */
export const isOwner = (user: JWTPayload | null, resourceUserId: string): boolean => {
  if (!user) {
    return false;
  }

  return user.userId === resourceUserId || user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
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

