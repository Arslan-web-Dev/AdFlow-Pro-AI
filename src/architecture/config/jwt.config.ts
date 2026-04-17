import jwt from 'jsonwebtoken';

/**
 * JWT Configuration
 * Handles JWT token generation and verification
 */

const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'USER' | 'MANAGER' | 'ADMIN' | 'SUPER_ADMIN';
}

export class JWTService {
  /**
   * Generate JWT token
   */
  public static generateToken(payload: JWTPayload): string {
    // @ts-ignore - jsonwebtoken type definitions issue
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  /**
   * Verify JWT token
   */
  public static verifyToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('JWT verification error:', error);
      return null;
    }
  }

  /**
   * Decode JWT token without verification (for debugging)
   */
  public static decodeToken(token: string): JWTPayload | null {
    try {
      const decoded = jwt.decode(token) as JWTPayload;
      return decoded;
    } catch (error) {
      console.error('JWT decode error:', error);
      return null;
    }
  }
}

export default JWTService;
