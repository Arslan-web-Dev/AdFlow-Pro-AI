import BaseRepository from './base.repository';
import LogModel, { ILog, LogAction, LogLevel } from '../../models/log.model';
import supabaseSync from './supabase-sync.repository';
import { syncTables } from '../config/supabase.config';

/**
 * Log Repository
 * Handles all logging-related database operations
 */
export class LogRepository extends BaseRepository<ILog> {
  constructor() {
    super(LogModel);
  }

  /**
   * Find logs by user ID
   */
  public async findByUserId(userId: string, limit: number = 100): Promise<ILog[]> {
    return this.find({ userId }, { sort: { createdAt: -1 }, limit });
  }

  /**
   * Find logs by action
   */
  public async findByAction(action: LogAction, limit: number = 100): Promise<ILog[]> {
    return this.find({ action }, { sort: { createdAt: -1 }, limit });
  }

  /**
   * Find logs by level
   */
  public async findByLevel(level: LogLevel, limit: number = 100): Promise<ILog[]> {
    return this.find({ level }, { sort: { createdAt: -1 }, limit });
  }

  /**
   * Find error logs
   */
  public async findErrors(limit: number = 100): Promise<ILog[]> {
    return this.find({ level: LogLevel.ERROR }, { sort: { createdAt: -1 }, limit });
  }

  /**
   * Create log with sync
   */
  public async createLog(data: Partial<ILog>): Promise<ILog> {
    const log = await this.create(data);
    
    // Sync to Supabase
    await supabaseSync.syncRecord(syncTables[4], log.toJSON(), 'create');
    
    return log;
  }

  /**
   * Get recent logs
   */
  public async getRecentLogs(limit: number = 50): Promise<ILog[]> {
    return this.find({}, { sort: { createdAt: -1 }, limit });
  }
}

export default new LogRepository();
