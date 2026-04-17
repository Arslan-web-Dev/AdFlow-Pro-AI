import userRepository from '../repositories/user.repository';
import logRepository from '../repositories/log.repository';
import { UserRole } from '../../models/user.model';
import { LogAction, LogLevel } from '../../models/log.model';

/**
 * User Service
 * Handles user-related business logic
 */
export class UserService {
  /**
   * Get all users (Admin only)
   */
  public async getAllUsers() {
    try {
      const users = await userRepository.find();
      return { success: true, users };
    } catch (error) {
      console.error('Get all users error:', error);
      return { success: false, error: 'Failed to fetch users' };
    }
  }

  /**
   * Get user by ID
   */
  public async getUserById(userId: string) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      return { success: true, user };
    } catch (error) {
      console.error('Get user by ID error:', error);
      return { success: false, error: 'Failed to fetch user' };
    }
  }

  /**
   * Create user (Admin only)
   */
  public async createUser(data: {
    email: string;
    password: string;
    name: string;
    role: UserRole;
  }) {
    try {
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }

      const user = await userRepository.createUser({
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      });

      // Log user creation
      await logRepository.createLog({
        userId: user._id,
        action: LogAction.USER_CREATED,
        level: LogLevel.INFO,
        details: { email: user.email, role: user.role },
      });

      return { success: true, user };
    } catch (error) {
      console.error('Create user error:', error);
      return { success: false, error: 'Failed to create user' };
    }
  }

  /**
   * Update user role (Admin only)
   */
  public async updateUserRole(userId: string, role: UserRole) {
    try {
      const user = await userRepository.updateRole(userId, role);

      // Log role update
      await logRepository.createLog({
        userId: userId as any,
        action: LogAction.USER_UPDATED,
        level: LogLevel.INFO,
        details: { newRole: role },
      });

      return { success: true, user };
    } catch (error) {
      console.error('Update user role error:', error);
      return { success: false, error: 'Failed to update user role' };
    }
  }

  /**
   * Ban user (Admin only)
   */
  public async banUser(userId: string) {
    try {
      const user = await userRepository.banUser(userId);

      // Log user ban
      await logRepository.createLog({
        userId: userId as any,
        action: LogAction.USER_BANNED,
        level: LogLevel.WARNING,
        details: {},
      });

      return { success: true, user };
    } catch (error) {
      console.error('Ban user error:', error);
      return { success: false, error: 'Failed to ban user' };
    }
  }

  /**
   * Activate user (Admin only)
   */
  public async activateUser(userId: string) {
    try {
      const user = await userRepository.activateUser(userId);

      // Log user activation
      await logRepository.createLog({
        userId: userId as any,
        action: LogAction.USER_UPDATED,
        level: LogLevel.INFO,
        details: { action: 'activated' },
      });

      return { success: true, user };
    } catch (error) {
      console.error('Activate user error:', error);
      return { success: false, error: 'Failed to activate user' };
    }
  }

  /**
   * Delete user (Admin only)
   */
  public async deleteUser(userId: string) {
    try {
      const result = await userRepository.deleteUser(userId);

      if (result) {
        // Log user deletion
        await logRepository.createLog({
          userId: userId as any,
          action: LogAction.USER_DELETED,
          level: LogLevel.INFO,
          details: {},
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Delete user error:', error);
      return { success: false, error: 'Failed to delete user' };
    }
  }
}

export default new UserService();
