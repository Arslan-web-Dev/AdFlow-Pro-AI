import aiConfigRepository from '../repositories/ai-config.repository';
import logRepository from '../repositories/log.repository';
import { LogAction, LogLevel } from '../../models/log.model';

/**
 * AI Service
 * Handles AI-related business logic for ad copy generation and optimization
 */
export class AIService {
  /**
   * Generate ad copy using AI
   */
  public async generateAdCopy(userId: string, prompt: string, configId?: string) {
    try {
      // Get AI config
      let config;
      if (configId) {
        config = await aiConfigRepository.findById(configId);
      } else {
        const activeConfigs = await aiConfigRepository.findActive();
        config = activeConfigs[0];
      }

      if (!config) {
        return { success: false, error: 'No AI configuration found' };
      }

      // In a real implementation, this would call an AI API (OpenAI, etc.)
      // For now, we'll simulate the response
      const generatedCopy = this.simulateAIGeneration(prompt, config);

      // Log AI usage
      await logRepository.createLog({
        userId: userId as any,
        action: LogAction.AD_CREATED, // Using existing action for AI generation
        level: LogLevel.INFO,
        details: {
          action: 'ai_generation',
          configId: config._id,
          promptLength: prompt.length,
        },
      });

      return {
        success: true,
        copy: generatedCopy,
        configUsed: config.name,
      };
    } catch (error) {
      console.error('Generate ad copy error:', error);
      return { success: false, error: 'Failed to generate ad copy' };
    }
  }

  /**
   * Optimize ad copy
   */
  public async optimizeAdCopy(userId: string, currentCopy: string, configId?: string) {
    try {
      // Get AI config
      let config;
      if (configId) {
        config = await aiConfigRepository.findById(configId);
      } else {
        const activeConfigs = await aiConfigRepository.findActive();
        config = activeConfigs[0];
      }

      if (!config) {
        return { success: false, error: 'No AI configuration found' };
      }

      // Simulate optimization
      const optimizedCopy = this.simulateOptimization(currentCopy, config);

      // Log optimization
      await logRepository.createLog({
        userId: userId as any,
        action: LogAction.AD_UPDATED,
        level: LogLevel.INFO,
        details: {
          action: 'ai_optimization',
          configId: config._id,
        },
      });

      return {
        success: true,
        optimizedCopy,
        configUsed: config.name,
      };
    } catch (error) {
      console.error('Optimize ad copy error:', error);
      return { success: false, error: 'Failed to optimize ad copy' };
    }
  }

  /**
   * Create AI configuration (Admin only)
   */
  public async createConfig(adminId: string, data: {
    name: string;
    promptTemplate: string;
    maxTokens: number;
    temperature: number;
    costLimit: number;
  }) {
    try {
      const config = await aiConfigRepository.createConfig(data);

      // Log config creation
      await logRepository.createLog({
        userId: adminId as any,
        action: LogAction.USER_CREATED,
        level: LogLevel.INFO,
        details: { action: 'ai_config_created', configId: config._id },
      });

      return { success: true, config };
    } catch (error) {
      console.error('Create AI config error:', error);
      return { success: false, error: 'Failed to create AI configuration' };
    }
  }

  /**
   * Update AI configuration (Admin only)
   */
  public async updateConfig(adminId: string, configId: string, data: {
    promptTemplate?: string;
    maxTokens?: number;
    temperature?: number;
    costLimit?: number;
    isActive?: boolean;
  }) {
    try {
      const config = await aiConfigRepository.updateConfig(configId, data);

      // Log config update
      await logRepository.createLog({
        userId: adminId as any,
        action: LogAction.USER_UPDATED,
        level: LogLevel.INFO,
        details: { action: 'ai_config_updated', configId },
      });

      return { success: true, config };
    } catch (error) {
      console.error('Update AI config error:', error);
      return { success: false, error: 'Failed to update AI configuration' };
    }
  }

  /**
   * Get all AI configurations (Admin only)
   */
  public async getAllConfigs() {
    try {
      const configs = await aiConfigRepository.find({});
      return { success: true, configs };
    } catch (error) {
      console.error('Get AI configs error:', error);
      return { success: false, error: 'Failed to fetch AI configurations' };
    }
  }

  /**
   * Toggle AI config active status (Admin only)
   */
  public async toggleConfig(adminId: string, configId: string) {
    try {
      const config = await aiConfigRepository.toggleActive(configId);

      // Log config toggle
      await logRepository.createLog({
        userId: adminId as any,
        action: LogAction.USER_UPDATED,
        level: LogLevel.INFO,
        details: { action: 'ai_config_toggled', configId, isActive: config?.isActive },
      });

      return { success: true, config };
    } catch (error) {
      console.error('Toggle AI config error:', error);
      return { success: false, error: 'Failed to toggle AI configuration' };
    }
  }

  /**
   * Simulate AI generation (placeholder for real AI API)
   */
  private simulateAIGeneration(prompt: string, config: any): {
    title: string;
    description: string;
  } {
    // In production, this would call OpenAI or similar API
    const keywords = prompt.split(' ').slice(0, 3).join(' ');
    return {
      title: `Premium ${keywords} - Best Deals Available`,
      description: `Discover the best ${prompt} offers with unbeatable prices. Limited time only. Don't miss out on these amazing deals!`,
    };
  }

  /**
   * Simulate optimization (placeholder for real AI API)
   */
  private simulateOptimization(currentCopy: string, config: any): string {
    // In production, this would call OpenAI or similar API
    return currentCopy
      .replace(/\bvery\b/g, 'extremely')
      .replace(/\bgood\b/g, 'exceptional')
      .replace(/\bbad\b/g, 'suboptimal')
      + ' - Optimized for better engagement.';
  }
}

export default new AIService();
