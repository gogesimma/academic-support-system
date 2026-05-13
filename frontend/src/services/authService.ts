import { mockApi } from '../services/mockApi';
import type {
  User,
  LoginFormData,
  RegisterFormData,
  ApiResponse,
  AuthTokens,
} from '../types/main';

// Use mock API instead of real API for now
const api = mockApi;

/**
 * Authentication Service
 *
 * Your Node.js backend should implement these endpoints:
 * POST /auth/login - Login user
 * POST /auth/register - Register new user
 * POST /auth/logout - Logout user
 * POST /auth/refresh - Refresh access token
 * GET /auth/me - Get current user
 */

export const authService = {
  /**
   * Login user
   * Backend endpoint: POST /auth/login
   * Expected request body: { email: string, password: string }
   * Expected response: { success: true, data: { user: User, tokens: { accessToken, refreshToken } } }
   */
  login: async (credentials: LoginFormData): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/login',
      credentials
    );

    if (response.success && response.data) {
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    }

    throw new Error(response.error || 'Login failed');
  },

  /**
   * Register new user
   * Backend endpoint: POST /auth/register
   * Expected request body: RegisterFormData
   * Expected response: { success: true, data: { user: User, tokens: { accessToken, refreshToken } } }
   */
  register: async (userData: RegisterFormData): Promise<{ user: User; tokens: AuthTokens }> => {
    const response = await api.post<ApiResponse<{ user: User; tokens: AuthTokens }>>(
      '/auth/register',
      userData
    );

    if (response.success && response.data) {
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    }

    throw new Error(response.error || 'Registration failed');
  },

  /**
   * Logout user
   * Backend endpoint: POST /auth/logout
   * Expected response: { success: true }
   */
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current user from backend
   * Backend endpoint: GET /auth/me
   * Expected response: { success: true, data: User }
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');

    if (response.success && response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }

    throw new Error(response.error || 'Failed to get current user');
  },

  /**
   * Refresh access token
   * Backend endpoint: POST /auth/refresh
   * Expected request body: { refreshToken: string }
   * Expected response: { success: true, data: { accessToken: string } }
   */
  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh',
      { refreshToken }
    );

    if (response.success && response.data) {
      localStorage.setItem('accessToken', response.data.accessToken);
      return response.data.accessToken;
    }

    throw new Error(response.error || 'Failed to refresh token');
  },

  /**
   * Get stored user from localStorage
   */
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },
};
