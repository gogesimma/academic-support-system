
import { mockApi } from './mockApi';
import type {
  User,
  Tutor,
  Student,
  Admin,
  ApiResponse,
  PaginatedResponse,
  StudentStats,
  TutorStats,
  AdminStats,
} from '../types/main';

// Use mock API instead of real API for now
const api = mockApi;

/**
 * User Service
 *
 * Your Node.js backend should implement these endpoints:
 * GET /users - Get all users (admin only)
 * GET /users/:id - Get user by ID
 * PATCH /users/:id - Update user
 * DELETE /users/:id - Delete user
 * GET /users/tutors - Get all tutors
 * GET /users/students - Get all students
 * GET /users/stats/:id - Get user stats
 * PATCH /users/tutors/:id/approve - Approve tutor (admin only)
 */

export const userService = {
  /**
   * Get all users
   * Backend endpoint: GET /users?page=1&pageSize=10&role=student
   * Expected response: { success: true, data: PaginatedResponse<User> }
   */
  getAllUsers: async (params?: {
    page?: number;
    pageSize?: number;
    role?: string;
  }): Promise<PaginatedResponse<User>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const response = await api.get<ApiResponse<PaginatedResponse<User>>>(
      `/users?${queryParams.toString()}`
    );

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch users');
  },

  /**
   * Get user by ID
   * Backend endpoint: GET /users/:id
   * Expected response: { success: true, data: User }
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch user');
  },

  /**
   * Update user
   * Backend endpoint: PATCH /users/:id
   * Expected request body: Partial<User>
   * Expected response: { success: true, data: User }
   */
  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    const response = await api.patch<ApiResponse<User>>(`/users/${id}`, updates);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to update user');
  },

  /**
   * Delete user
   * Backend endpoint: DELETE /users/:id
   * Expected response: { success: true }
   */
  deleteUser: async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<void>>(`/users/${id}`);

    if (!response.success) {
      throw new Error(response.error || 'Failed to delete user');
    }
  },

  /**
   * Get all tutors
   * Backend endpoint: GET /users/tutors?approved=true
   * Expected response: { success: true, data: Tutor[] }
   */
  getTutors: async (approvedOnly: boolean = false): Promise<Tutor[]> => {
    const queryParams = approvedOnly ? '?approved=true' : '';
    const response = await api.get<ApiResponse<Tutor[]>>(`/users/tutors${queryParams}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch tutors');
  },

  /**
   * Get all students
   * Backend endpoint: GET /users/students
   * Expected response: { success: true, data: Student[] }
   */
  getStudents: async (): Promise<Student[]> => {
    const response = await api.get<ApiResponse<Student[]>>('/users/students');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch students');
  },

  /**
   * Get student stats
   * Backend endpoint: GET /users/stats/student/:id
   * Expected response: { success: true, data: StudentStats }
   */
  getStudentStats: async (id: string): Promise<StudentStats> => {
    const response = await api.get<ApiResponse<StudentStats>>(`/users/stats/student/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch student stats');
  },

  /**
   * Get tutor stats
   * Backend endpoint: GET /users/stats/tutor/:id
   * Expected response: { success: true, data: TutorStats }
   */
  getTutorStats: async (id: string): Promise<TutorStats> => {
    const response = await api.get<ApiResponse<TutorStats>>(`/users/stats/tutor/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch tutor stats');
  },

  /**
   * Get admin stats
   * Backend endpoint: GET /users/stats/admin
   * Expected response: { success: true, data: AdminStats }
   */
  getAdminStats: async (): Promise<AdminStats> => {
    const response = await api.get<ApiResponse<AdminStats>>('/users/stats/admin');

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to fetch admin stats');
  },

  /**
   * Approve tutor (admin only)
   * Backend endpoint: PATCH /users/tutors/:id/approve
   * Expected response: { success: true, data: Tutor }
   */
  approveTutor: async (id: string): Promise<Tutor> => {
    const response = await api.patch<ApiResponse<Tutor>>(`/users/tutors/${id}/approve`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to approve tutor');
  },

  /**
   * Reject tutor (admin only)
   * Backend endpoint: PATCH /users/tutors/:id/reject
   * Expected response: { success: true, data: Tutor }
   */
  rejectTutor: async (id: string): Promise<Tutor> => {
    const response = await api.patch<ApiResponse<Tutor>>(`/users/tutors/${id}/reject`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to reject tutor');
  },
};
