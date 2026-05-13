import { api } from './api';
import type { Payment, ApiResponse } from '../types/main';

/**
 * Payment Service
 *
 * Your Node.js backend should implement these endpoints:
 * POST /payments/create-intent - Create Stripe payment intent
 * POST /payments/confirm - Confirm payment
 * GET /payments/:id - Get payment by ID
 * GET /payments/booking/:bookingId - Get payment for booking
 * GET /payments/student/:studentId - Get student's payment history
 * GET /payments/tutor/:tutorId - Get tutor's earnings
 *
 * Note: Your backend should use Stripe API with your secret key
 * Stripe Secret Key should be stored as environment variable on your Node.js backend
 */

export const paymentService = {
  /**
   * Create payment intent for a booking
   * Backend endpoint: POST /payments/create-intent
   * Expected request body: { bookingId: string, amount: number }
   * Expected response: { success: true, data: { clientSecret: string, paymentIntentId: string } }
   *
   * Your backend should call Stripe API:
   * const paymentIntent = await stripe.paymentIntents.create({
   *   amount: amount * 100, // Convert to cents
   *   currency: 'usd',
   *   metadata: { bookingId }
   * });
   */
  createPaymentIntent: async (bookingId: string, amount: number): Promise<{ clientSecret: string; paymentIntentId: string }> => {
    const response = await api.post<ApiResponse<{ clientSecret: string; paymentIntentId: string }>>(
      '/payments/create-intent',
      { bookingId, amount }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to create payment intent');
  },

  /**
   * Confirm payment after Stripe processing
   * Backend endpoint: POST /payments/confirm
   * Expected request body: { paymentIntentId: string, bookingId: string }
   * Expected response: { success: true, data: Payment }
   */
  confirmPayment: async (paymentIntentId: string, bookingId: string): Promise<Payment> => {
    const response = await api.post<ApiResponse<Payment>>(
      '/payments/confirm',
      { paymentIntentId, bookingId }
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to confirm payment');
  },

  /**
   * Get payment by ID
   * Backend endpoint: GET /payments/:id
   * Expected response: { success: true, data: Payment }
   */
  getPaymentById: async (id: string): Promise<Payment> => {
    const response = await api.get<ApiResponse<Payment>>(`/payments/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch payment');
  },

  /**
   * Get payment for a booking
   * Backend endpoint: GET /payments/booking/:bookingId
   * Expected response: { success: true, data: Payment }
   */
  getPaymentForBooking: async (bookingId: string): Promise<Payment> => {
    const response = await api.get<ApiResponse<Payment>>(`/payments/booking/${bookingId}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch payment for booking');
  },

  /**
   * Get student's payment history
   * Backend endpoint: GET /payments/student/:studentId
   * Expected response: { success: true, data: Payment[] }
   */
  getStudentPayments: async (studentId: string): Promise<Payment[]> => {
    const response = await api.get<ApiResponse<Payment[]>>(`/payments/student/${studentId}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch student payments');
  },

  /**
   * Get tutor's earnings
   * Backend endpoint: GET /payments/tutor/:tutorId
   * Expected response: { success: true, data: Payment[] }
   */
  getTutorEarnings: async (tutorId: string): Promise<Payment[]> => {
    const response = await api.get<ApiResponse<Payment[]>>(`/payments/tutor/${tutorId}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch tutor earnings');
  },

  /**
   * Request refund
   * Backend endpoint: POST /payments/:id/refund
   * Expected response: { success: true, data: Payment }
   *
   * Your backend should call Stripe API:
   * const refund = await stripe.refunds.create({
   *   payment_intent: paymentIntentId,
   * });
   */
  requestRefund: async (paymentId: string): Promise<Payment> => {
    const response = await api.post<ApiResponse<Payment>>(`/payments/${paymentId}/refund`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to process refund');
  },
};
