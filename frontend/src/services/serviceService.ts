import { api } from './api';
import type { Service, Subject, ApiResponse } from '../types/main';

/**
 * Service & Subject Service
 *
 * Your Node.js backend should implement these endpoints:
 * GET /services - Get all services
 * GET /services/:id - Get service by ID
 * POST /services - Create service (tutor/admin)
 * PATCH /services/:id - Update service
 * DELETE /services/:id - Delete service
 * GET /subjects - Get all subjects
 */

export const serviceService = {
  /**
   * Get all services
   * Backend endpoint: GET /services?category=economics&tutorId=xxx
   * Expected response: { success: true, data: Service[] }
   */
  getAllServices: async (params?: {
    category?: string;
    tutorId?: string;
  }): Promise<Service[]> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await api.get<ApiResponse<Service[]>>(
      `/services?${queryParams.toString()}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch services');
  },

  /**
   * Get service by ID
   * Backend endpoint: GET /services/:id
   * Expected response: { success: true, data: Service }
   */
  getServiceById: async (id: string): Promise<Service> => {
    const response = await api.get<ApiResponse<Service>>(`/services/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch service');
  },

  /**
   * Create service
   * Backend endpoint: POST /services
   * Expected request body: Omit<Service, 'id'>
   * Expected response: { success: true, data: Service }
   */
  createService: async (serviceData: Omit<Service, 'id'>): Promise<Service> => {
    const response = await api.post<ApiResponse<Service>>('/services', serviceData);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to create service');
  },

  /**
   * Update service
   * Backend endpoint: PATCH /services/:id
   * Expected request body: Partial<Service>
   * Expected response: { success: true, data: Service }
   */
  updateService: async (id: string, updates: Partial<Service>): Promise<Service> => {
    const response = await api.patch<ApiResponse<Service>>(`/services/${id}`, updates);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to update service');
  },

  /**
   * Delete service
   * Backend endpoint: DELETE /services/:id
   * Expected response: { success: true }
   */
  deleteService: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/services/${id}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete service');
    }
  },

  /**
   * Get all subjects
   * Backend endpoint: GET /subjects
   * Expected response: { success: true, data: Subject[] }
   */
  getAllSubjects: async (): Promise<Subject[]> => {
    const response = await api.get<ApiResponse<Subject[]>>('/subjects');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch subjects');
  },
};
