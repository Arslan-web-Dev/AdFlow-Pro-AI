import BaseRepository from './base.repository';
import PaymentModel, { IPayment, PaymentStatus, PaymentMethod } from '../../models/payment.model';
import supabaseSync from './supabase-sync.repository';
import { syncTables } from '../config/supabase.config';

/**
 * Payment Repository
 * Handles all payment-related database operations
 */
export class PaymentRepository extends BaseRepository<IPayment> {
  constructor() {
    super(PaymentModel);
  }

  /**
   * Find payments by user ID
   */
  public async findByUserId(userId: string): Promise<IPayment[]> {
    return this.find({ userId });
  }

  /**
   * Find payments by ad ID
   */
  public async findByAdId(adId: string): Promise<IPayment[]> {
    return this.find({ adId });
  }

  /**
   * Find payments by status
   */
  public async findByStatus(status: PaymentStatus): Promise<IPayment[]> {
    return this.find({ status });
  }

  /**
   * Find pending payments
   */
  public async findPendingPayments(): Promise<IPayment[]> {
    return this.find({ status: PaymentStatus.PENDING });
  }

  /**
   * Find verified payments
   */
  public async findVerifiedPayments(): Promise<IPayment[]> {
    return this.find({ status: PaymentStatus.VERIFIED });
  }

  /**
   * Find payment by transaction reference
   */
  public async findByTransactionRef(transactionRef: string): Promise<IPayment | null> {
    return this.findOne({ transactionRef });
  }

  /**
   * Update payment status
   */
  public async updateStatus(
    paymentId: string,
    status: PaymentStatus,
    verifiedBy?: string,
    rejectionReason?: string
  ): Promise<IPayment | null> {
    const updateData: any = { status };
    if (verifiedBy) updateData.verifiedBy = verifiedBy;
    if (verifiedBy) updateData.verifiedAt = new Date();
    if (rejectionReason) updateData.rejectionReason = rejectionReason;

    const payment = await this.updateById(paymentId, updateData);
    
    if (payment) {
      // Sync to Supabase
      await supabaseSync.syncRecord(syncTables[2], payment.toJSON(), 'update');
    }
    
    return payment;
  }

  /**
   * Create payment with sync
   */
  public async createPayment(data: Partial<IPayment>): Promise<IPayment> {
    const payment = await this.create(data);
    
    // Sync to Supabase
    await supabaseSync.syncRecord(syncTables[2], payment.toJSON(), 'create');
    
    return payment;
  }

  /**
   * Delete payment with sync
   */
  public async deletePayment(paymentId: string): Promise<boolean> {
    const payment = await this.findById(paymentId);
    if (!payment) return false;

    const result = await this.deleteById(paymentId);
    
    if (result) {
      // Sync deletion to Supabase
      await supabaseSync.syncRecord(syncTables[2], { id: payment._id.toString() }, 'delete');
    }
    
    return result;
  }
}

export default new PaymentRepository();
