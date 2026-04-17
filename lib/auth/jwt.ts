import jwt from 'jsonwebtoken';

const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.warn('JWT_SECRET environment variable is not defined. Using fallback for development.');
    return 'fallback-secret-for-development-do-not-use-in-production';
  }
  return secret;
};

const JWT_SECRET = getJWTSecret();

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
