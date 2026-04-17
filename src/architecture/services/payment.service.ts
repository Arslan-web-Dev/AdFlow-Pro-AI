import paymentRepository from '../repositories/payment.repository';
import logRepository from '../repositories/log.repository';
import { PaymentStatus, PaymentMethod } from '../../models/payment.model';
import { LogAction, LogLevel } from '../../models/log.model';

/**
 * Payment Service
 * Handles payment-related business logic
 */
export class PaymentService {
  /**
   * Submit payment proof (User)
   */
  public async submitPayment(userId: string, adId: string, data: {
    amount: number;
    method: PaymentMethod;
    transactionRef: string;
    proofUrl?: string;
    senderName: string;
  }) {
    try {
      // Check if payment with same transaction ref exists
      const existingPayment = await paymentRepository.findByTransactionRef(data.transactionRef);
      if (existingPayment) {
        return { success: false, error: 'Transaction reference already exists' };
      }

      const payment = await paymentRepository.createPayment({
        adId: adId as any,
        userId: userId as any,
        amount: data.amount,
        method: data.method,
        status: PaymentStatus.PENDING,
        transactionRef: data.transactionRef,
        proofUrl: data.proofUrl,
      });

      // Log payment submission
      await logRepository.createLog({
        userId: userId as any,
        action: LogAction.PAYMENT_SUBMITTED,
        level: LogLevel.INFO,
        details: { paymentId: payment._id, amount: data.amount, method: data.method },
      });

      return { success: true, payment };
    } catch (error) {
      console.error('Submit payment error:', error);
      return { success: false, error: 'Failed to submit payment' };
    }
  }

  /**
   * Get user's payments
   */
  public async getUserPayments(userId: string) {
    try {
      const payments = await paymentRepository.findByUserId(userId);
      return { success: true, payments };
    } catch (error) {
      console.error('Get user payments error:', error);
      return { success: false, error: 'Failed to fetch payments' };
    }
  }

  /**
   * Get payment by ID
   */
  public async getPaymentById(paymentId: string) {
    try {
      const payment = await paymentRepository.findById(paymentId);
      if (!payment) {
        return { success: false, error: 'Payment not found' };
      }
      return { success: true, payment };
    } catch (error) {
      console.error('Get payment by ID error:', error);
      return { success: false, error: 'Failed to fetch payment' };
    }
  }

  /**
   * Get pending payments (Admin)
   */
  public async getPendingPayments() {
    try {
      const payments = await paymentRepository.findPendingPayments();
      return { success: true, payments };
    } catch (error) {
      console.error('Get pending payments error:', error);
      return { success: false, error: 'Failed to fetch payments' };
    }
  }

  /**
   * Verify payment (Admin)
   */
  public async verifyPayment(adminId: string, paymentId: string) {
    try {
      const payment = await paymentRepository.findById(paymentId);
      if (!payment) {
        return { success: false, error: 'Payment not found' };
      }

      // Check if payment is pending
      if (payment.status !== PaymentStatus.PENDING) {
        return { success: false, error: 'Payment is not pending' };
      }

      const updatedPayment = await paymentRepository.updateStatus(
        paymentId,
        PaymentStatus.VERIFIED,
        adminId
      );

      // Log payment verification
      await logRepository.createLog({
        userId: adminId as any,
        action: LogAction.PAYMENT_VERIFIED,
        level: LogLevel.INFO,
        details: { paymentId },
      });

      return { success: true, payment: updatedPayment };
    } catch (error) {
      console.error('Verify payment error:', error);
      return { success: false, error: 'Failed to verify payment' };
    }
  }

  /**
   * Reject payment (Admin)
   */
  public async rejectPayment(adminId: string, paymentId: string, reason: string) {
    try {
      const payment = await paymentRepository.findById(paymentId);
      if (!payment) {
        return { success: false, error: 'Payment not found' };
      }

      // Check if payment is pending
      if (payment.status !== PaymentStatus.PENDING) {
        return { success: false, error: 'Payment is not pending' };
      }

      const updatedPayment = await paymentRepository.updateStatus(
        paymentId,
        PaymentStatus.REJECTED,
        adminId,
        reason
      );

      // Log payment rejection
      await logRepository.createLog({
        userId: adminId as any,
        action: LogAction.PAYMENT_REJECTED,
        level: LogLevel.INFO,
        details: { paymentId, reason },
      });

      return { success: true, payment: updatedPayment };
    } catch (error) {
      console.error('Reject payment error:', error);
      return { success: false, error: 'Failed to reject payment' };
    }
  }

  /**
   * Get all transactions (Admin)
   */
  public async getAllTransactions() {
    try {
      const payments = await paymentRepository.find({});
      return { success: true, payments };
    } catch (error) {
      console.error('Get all transactions error:', error);
      return { success: false, error: 'Failed to fetch transactions' };
    }
  }
}

export default new PaymentService();
