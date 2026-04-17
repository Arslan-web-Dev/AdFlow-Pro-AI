import bcrypt from 'bcryptjs';
import { JWTService, JWTPayload } from '../config/jwt.config';
import userRepository from '../repositories/user.repository';
import logRepository from '../repositories/log.repository';
import { UserRole } from '../../models/user.model';
import { LogAction, LogLevel } from '../../models/log.model';

/**
 * Authentication Service
 * Handles authentication business logic
 */
export class AuthService {
  /**
   * Register a new user
   */
  public async register(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<{ success: boolean; user?: any; token?: string; error?: string }> {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Create user
      const user = await userRepository.createUser({
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: UserRole.USER,
        isActive: true,
        isVerified: false,
      });

      // Generate token
      const payload: JWTPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role as UserRole,
      };
      const token = JWTService.generateToken(payload);

      // Log registration
      await logRepository.createLog({
        userId: user._id,
        action: LogAction.REGISTER,
        level: LogLevel.INFO,
        details: { email: user.email },
      });

      return {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  /**
   * Login user
   */
  public async login(data: {
    email: string;
    password: string;
  }): Promise<{ success: boolean; user?: any; token?: string; error?: string }> {
    try {
      // Find user by email
      const user = await userRepository.findByEmail(data.email);
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Check if user is active
      if (!user.isActive) {
        return { success: false, error: 'Account is deactivated' };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Update last login
      await userRepository.updateLastLogin(user._id.toString());

      // Generate token
      const payload: JWTPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role as UserRole,
      };
      const token = JWTService.generateToken(payload);

      // Log login
      await logRepository.createLog({
        userId: user._id,
        action: LogAction.LOGIN,
        level: LogLevel.INFO,
        details: { email: user.email },
      });

      return {
        success: true,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  /**
   * Logout user
   */
  public async logout(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Log logout
      await logRepository.createLog({
        userId: userId as any,
        action: LogAction.LOGOUT,
        level: LogLevel.INFO,
        details: {},
      });

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Logout failed' };
    }
  }

  /**
   * Verify token
   */
  public verifyToken(token: string): JWTPayload | null {
    return JWTService.verifyToken(token);
  }
}

export default new AuthService();
