import { supabaseServiceClient, syncConfig, syncTables, type SyncTable } from '../config/supabase.config';
import LogModel from '../../models/log.model';
import { LogAction, LogLevel } from '../../models/log.model';

/**
 * Supabase Sync Repository
 * Handles data synchronization between MongoDB and Supabase
 */
export class SupabaseSyncRepository {
  /**
   * Sync a single record to Supabase
   */
  public async syncRecord(tableName: SyncTable, data: any, action: 'create' | 'update' | 'delete'): Promise<boolean> {
    const maxRetries = syncConfig.retryAttempts;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        if (action === 'delete') {
          const { error } = await supabaseServiceClient
            .from(tableName)
            .delete()
            .eq('id', data.id);

          if (error) throw error;
        } else {
          const { error } = await supabaseServiceClient
            .from(tableName)
            .upsert(data);

          if (error) throw error;
        }

        return true;
      } catch (error) {
        retryCount++;
        
        if (retryCount >= maxRetries) {
          console.error(`❌ Sync failed for ${tableName} after ${maxRetries} attempts:`, error);
          
          // Log sync failure
          await LogModel.create({
            action: LogAction.SYNC_FAILED,
            level: LogLevel.ERROR,
            details: {
              table: tableName,
              action,
              error: (error as Error).message,
              dataId: data.id || data._id,
            },
          });
          
          return false;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, syncConfig.retryDelay));
      }
    }

    return false;
  }

  /**
   * Sync multiple records in batch
   */
  public async syncBatch(tableName: SyncTable, data: any[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const record of data) {
      const result = await this.syncRecord(tableName, record, 'create');
      if (result) {
        success++;
      } else {
        failed++;
      }
    }

    return { success, failed };
  }

  /**
   * Get record from Supabase
   */
  public async getRecord(tableName: SyncTable, id: string): Promise<any | null> {
    try {
      const { data, error } = await supabaseServiceClient
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`❌ Error fetching from ${tableName}:`, error);
      return null;
    }
  }

  /**
   * Get all records from Supabase table
   */
  public async getAllRecords(tableName: SyncTable): Promise<any[]> {
    try {
      const { data, error } = await supabaseServiceClient
        .from(tableName)
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`❌ Error fetching all from ${tableName}:`, error);
      return [];
    }
  }

  /**
   * Check Supabase connection health
   */
  public async checkHealth(): Promise<boolean> {
    try {
      const { error } = await supabaseServiceClient
        .from('users')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('❌ Supabase health check failed:', error);
      return false;
    }
  }
}

export default new SupabaseSyncRepository();
