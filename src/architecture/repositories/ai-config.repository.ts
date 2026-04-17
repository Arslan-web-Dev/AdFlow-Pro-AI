import BaseRepository from './base.repository';
import AIConfigModel, { IAIConfig } from '../../models/ai-config.model';
import supabaseSync from './supabase-sync.repository';

/**
 * AI Config Repository
 * Handles all AI configuration-related database operations
 */
export class AIConfigRepository extends BaseRepository<IAIConfig> {
  constructor() {
    super(AIConfigModel);
  }

  /**
   * Find active AI config
   */
  public async findActive(): Promise<IAIConfig[]> {
    return this.find({ isActive: true });
  }

  /**
   * Find AI config by name
   */
  public async findByName(name: string): Promise<IAIConfig | null> {
    return this.findOne({ name });
  }

  /**
   * Create AI config with sync
   */
  public async createConfig(data: Partial<IAIConfig>): Promise<IAIConfig> {
    const config = await this.create(data);
    
    // Sync to Supabase
    await supabaseSync.syncRecord('ai_configs', config.toJSON(), 'create');
    
    return config;
  }

  /**
   * Update AI config with sync
   */
  public async updateConfig(configId: string, data: Partial<IAIConfig>): Promise<IAIConfig | null> {
    const config = await this.updateById(configId, data);
    
    if (config) {
      // Sync to Supabase
      await supabaseSync.syncRecord('ai_configs', config.toJSON(), 'update');
    }
    
    return config;
  }

  /**
   * Toggle AI config active status
   */
  public async toggleActive(configId: string): Promise<IAIConfig | null> {
    const config = await this.findById(configId);
    if (!config) return null;

    const updated = await this.updateById(configId, { isActive: !config.isActive });
    
    if (updated) {
      await supabaseSync.syncRecord('ai_configs', updated.toJSON(), 'update');
    }
    
    return updated;
  }
}

export default new AIConfigRepository();
