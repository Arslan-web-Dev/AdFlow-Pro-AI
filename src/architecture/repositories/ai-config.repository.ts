import BaseRepository from './base.repository';
import AIConfigModel, { IAIConfig } from '../../models/ai-config.model';

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
   * Create AI config
   */
  public async createConfig(data: Partial<IAIConfig>): Promise<IAIConfig> {
    const config = await this.create(data);
    return config;
  }

  /**
   * Update AI config
   */
  public async updateConfig(configId: string, data: Partial<IAIConfig>): Promise<IAIConfig | null> {
    const config = await this.updateById(configId, data);
    return config;
  }

  /**
   * Toggle AI config active status
   */
  public async toggleActive(configId: string): Promise<IAIConfig | null> {
    const config = await this.findById(configId);
    if (!config) return null;

    const updated = await this.updateById(configId, { isActive: !config.isActive });
    return updated;
  }
}

export default new AIConfigRepository();
