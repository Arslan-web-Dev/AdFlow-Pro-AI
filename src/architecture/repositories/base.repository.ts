import { Model, Document, UpdateQuery, Types } from 'mongoose';

/**
 * Base Repository
 * Provides common CRUD operations for all repositories
 */
export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Find one document by filter
   */
  public async findOne(filter: any): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  /**
   * Find one document by ID
   */
  public async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  /**
   * Find multiple documents by filter
   */
  public async find(filter: any = {}, options?: {
    sort?: any;
    limit?: number;
    skip?: number;
    populate?: string | string[] | any;
  }): Promise<T[]> {
    const query = this.model.find(filter);

    if (options?.sort) query.sort(options.sort);
    if (options?.limit) query.limit(options.limit);
    if (options?.skip) query.skip(options.skip);
    if (options?.populate) query.populate(options.populate);

    return query.exec();
  }

  /**
   * Create a new document
   */
  public async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  /**
   * Update one document by filter
   */
  public async updateOne(filter: any, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, data, { new: true }).exec();
  }

  /**
   * Update one document by ID
   */
  public async updateById(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  /**
   * Delete one document by filter
   */
  public async deleteOne(filter: any): Promise<boolean> {
    const result = await this.model.deleteOne(filter).exec();
    return result.deletedCount > 0;
  }

  /**
   * Delete one document by ID
   */
  public async deleteById(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id).exec();
    return result !== null;
  }

  /**
   * Count documents by filter
   */
  public async count(filter: any = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  /**
   * Check if document exists
   */
  public async exists(filter: any): Promise<boolean> {
    const count = await this.model.countDocuments(filter).limit(1).exec();
    return count > 0;
  }
}

export default BaseRepository;
