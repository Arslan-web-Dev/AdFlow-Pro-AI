import BaseRepository from './base.repository';
import UserModel, { IUser, UserRole } from '../../models/user.model';
import supabaseSync from './supabase-sync.repository';
import { syncTables } from '../config/supabase.config';

/**
 * User Repository
 * Handles all user-related database operations
 */
export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  /**
   * Find user by email
   */
  public async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  /**
   * Find users by role
   */
  public async findByRole(role: UserRole): Promise<IUser[]> {
    return this.find({ role });
  }

  /**
   * Find active users
   */
  public async findActiveUsers(): Promise<IUser[]> {
    return this.find({ isActive: true });
  }

  /**
   * Find verified users
   */
  public async findVerifiedUsers(): Promise<IUser[]> {
    return this.find({ isVerified: true });
  }

  /**
   * Update user role
   */
  public async updateRole(userId: string, role: UserRole): Promise<IUser | null> {
    const user = await this.updateById(userId, { role });
    
    if (user) {
      // Sync to Supabase
      await supabaseSync.syncRecord(syncTables[0], user.toJSON(), 'update');
    }
    
    return user;
  }

  /**
   * Ban user
   */
  public async banUser(userId: string): Promise<IUser | null> {
    const user = await this.updateById(userId, { isActive: false });
    
    if (user) {
      // Sync to Supabase
      await supabaseSync.syncRecord(syncTables[0], user.toJSON(), 'update');
    }
    
    return user;
  }

  /**
   * Activate user
   */
  public async activateUser(userId: string): Promise<IUser | null> {
    const user = await this.updateById(userId, { isActive: true });
    
    if (user) {
      // Sync to Supabase
      await supabaseSync.syncRecord(syncTables[0], user.toJSON(), 'update');
    }
    
    return user;
  }

  /**
   * Update last login
   */
  public async updateLastLogin(userId: string): Promise<void> {
    await this.updateById(userId, { lastLoginAt: new Date() });
  }

  /**
   * Create user with sync
   */
  public async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = await this.create(data);
    
    // Sync to Supabase
    await supabaseSync.syncRecord(syncTables[0], user.toJSON(), 'create');
    
    return user;
  }

  /**
   * Delete user with sync
   */
  public async deleteUser(userId: string): Promise<boolean> {
    const user = await this.findById(userId);
    if (!user) return false;

    const result = await this.deleteById(userId);
    
    if (result) {
      // Sync deletion to Supabase
      await supabaseSync.syncRecord(syncTables[0], { id: user._id.toString() }, 'delete');
    }
    
    return result;
  }
}

export default new UserRepository();
