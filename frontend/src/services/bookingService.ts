import { mockApi } from './mockApi';
import type {
  Booking,
  BookingFormData,
  ApiResponse,
  PaginatedResponse,
  RecurringBooking,
} from '../types/main';

// Use mock API instead of real API for now
const api = mockApi;

/**
 * Booking Service
 *
 * Your Node.js backend should implement these endpoints:
 * POST /bookings - Create new booking
 * GET /bookings - Get all bookings (with filters)
 * GET /bookings/:id - Get booking by ID
 * PATCH /bookings/:id - Update booking
 * DELETE /bookings/:id - Cancel booking
 * GET /bookings/student/:studentId - Get bookings for student
 * GET /bookings/tutor/:tutorId - Get bookings for tutor
 */

export const bookingService = {
  /**
   * Create new booking
   * Backend endpoint: POST /bookings
   * Expected request body: BookingFormData
   * Expected response: { success: true, data: Booking }
   */
  createBooking: async (bookingData: BookingFormData): Promise<Booking> => {
    const response = await api.post<ApiResponse<Booking>>('/bookings', bookingData);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to create booking');
  },

  /**
   * Get all bookings with optional filters
   * Backend endpoint: GET /bookings?page=1&pageSize=10&status=confirmed&studentId=xxx
   * Expected response: { success: true, data: PaginatedResponse<Booking> }
   */
  getBookings: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    studentId?: string;
    tutorId?: string;
  }): Promise<PaginatedResponse<Booking>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
      `/bookings?${queryParams.toString()}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch bookings');
  },

  /**
   * Get booking by ID
   * Backend endpoint: GET /bookings/:id
   * Expected response: { success: true, data: Booking }
   */
  getBookingById: async (id: string): Promise<Booking> => {
    const response = await api.get<ApiResponse<Booking>>(`/bookings/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch booking');
  },

  /**
   * Get bookings for a student
   * Backend endpoint: GET /bookings/student/:studentId
   * Expected response: { success: true, data: Booking[] }
   */
  getStudentBookings: async (studentId: string): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>(`/bookings/student/${studentId}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch student bookings');
  },

  /**
   * Get bookings for a tutor
   * Backend endpoint: GET /bookings/tutor/:tutorId
   * Expected response: { success: true, data: Booking[] }
   */
  getTutorBookings: async (tutorId: string): Promise<Booking[]> => {
    const response = await api.get<ApiResponse<Booking[]>>(`/bookings/tutor/${tutorId}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch tutor bookings');
  },

  /**
   * Update booking
   * Backend endpoint: PATCH /bookings/:id
   * Expected request body: Partial<Booking>
   * Expected response: { success: true, data: Booking }
   */
  updateBooking: async (id: string, updates: Partial<Booking>): Promise<Booking> => {
    const response = await api.patch<ApiResponse<Booking>>(`/bookings/${id}`, updates);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to update booking');
  },

  /**
   * Cancel booking
   * Backend endpoint: DELETE /bookings/:id
   * Expected response: { success: true }
   */
  cancelBooking: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/bookings/${id}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to cancel booking');
    }
  },

  /**
   * Confirm booking
   * Backend endpoint: PATCH /bookings/:id/confirm
   * Expected response: { success: true, data: Booking }
   */
  confirmBooking: async (id: string): Promise<Booking> => {
    const response = await api.patch<ApiResponse<Booking>>(`/bookings/${id}/confirm`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to confirm booking');
  },
};
