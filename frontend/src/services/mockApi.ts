import type {
  User,
  LoginFormData,
  RegisterFormData,
  AuthTokens,
  ApiResponse,
  StudentStats,
  TutorStats,
  AdminStats,
} from '../types/main';
import { MOCK_USERS, MOCK_REQUESTS, MOCK_STUDENT_STATS, MOCK_TUTOR_STATS, MOCK_ADMIN_STATS, QUICK_LOGIN_USERS as QUICK_LOGIN_USERS_IMPORT, TUTOR_DATA, STUDENT_DATA } from './mockRequestData';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock tokens
const generateMockTokens = (): AuthTokens => ({
  accessToken: `mock_access_token_${Date.now()}`,
  refreshToken: `mock_refresh_token_${Date.now()}`,
});

export const mockApi = {
  post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    await delay();

    if (endpoint === '/auth/login') {
      const credentials = data as LoginFormData;
      const user = MOCK_USERS.find(u => u.email === credentials.email);

      if (user) {
        return {
          success: true,
          data: {
            user,
            tokens: generateMockTokens(),
          },
        } as T;
      }

      throw new Error('Invalid credentials');
    }

    if (endpoint === '/auth/register') {
      const userData = data as RegisterFormData;
      const newUser: User = {
        id: `${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'student', // Always create students
        phoneNumber: userData.phoneNumber,
        institution: userData.institution,
        level: userData.level,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: {
          user: newUser,
          tokens: generateMockTokens(),
        },
      } as T;
    }

    if (endpoint === '/auth/logout') {
      return { success: true } as T;
    }

    if (endpoint === '/auth/refresh') {
      return {
        success: true,
        data: { accessToken: generateMockTokens().accessToken },
      } as T;
    }

    // Create tutor
    if (endpoint === '/users/tutors') {
      const tutorData = data as any;
      const newTutor = {
        id: `tutor-${Date.now()}`,
        email: tutorData.email,
        firstName: tutorData.firstName,
        lastName: tutorData.lastName,
        role: 'tutor',
        phoneNumber: tutorData.phoneNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_USERS.push(newTutor);
      return {
        success: true,
        data: newTutor,
      } as T;
    }

    // Create request
    if (endpoint === '/requests') {
      const requestData = data as any;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const newRequest = {
        id: `req-${Date.now()}`,
        studentId: user.id,
        studentName: `${user.firstName} ${user.lastName}`,
        serviceType: requestData.serviceType,
        module: requestData.module,
        title: requestData.title,
        description: requestData.description,
        attachments: requestData.attachments || [],
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MOCK_REQUESTS.push(newRequest);
      return {
        success: true,
        data: newRequest,
      } as T;
    }

    throw new Error('Endpoint not found');
  },

  get: async <T>(endpoint: string): Promise<T> => {
    await delay();

    if (endpoint === '/auth/me') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          success: true,
          data: user,
        } as T;
      }
      throw new Error('Not authenticated');
    }

    // User stats endpoints
    if (endpoint.startsWith('/users/stats/student/')) {
      return {
        success: true,
        data: MOCK_STUDENT_STATS,
      } as T;
    }

    if (endpoint.startsWith('/users/stats/tutor/')) {
      return {
        success: true,
        data: MOCK_TUTOR_STATS,
      } as T;
    }

    if (endpoint === '/users/stats/admin') {
      return {
        success: true,
        data: MOCK_ADMIN_STATS,
      } as T;
    }

    // Get all students
    if (endpoint === '/users/students') {
      const students = MOCK_USERS.filter(u => u.role === 'student');
      return {
        success: true,
        data: students,
      } as T;
    }

    // Get all tutors
    if (endpoint === '/users/tutors') {
      const tutors = MOCK_USERS.filter(u => u.role === 'tutor').map(u => {
        return TUTOR_DATA[u.id] || u;
      });
      return {
        success: true,
        data: tutors,
      } as T;
    }

    // Get requests for student
    if (endpoint.startsWith('/requests/student/')) {
      const studentId = endpoint.split('/')[3];
      const requests = MOCK_REQUESTS.filter(r => r.studentId === studentId);
      return {
        success: true,
        data: requests,
      } as T;
    }

    // Get requests for tutor
    if (endpoint.startsWith('/requests/tutor/')) {
      const tutorId = endpoint.split('/')[3];
      const requests = MOCK_REQUESTS.filter(r => r.tutorId === tutorId);
      return {
        success: true,
        data: requests,
      } as T;
    }

    // Get all requests (admin)
    if (endpoint === '/requests') {
      return {
        success: true,
        data: MOCK_REQUESTS,
      } as T;
    }

    throw new Error('Endpoint not found');
  },

  put: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    await delay();
    
    // Update request
    if (endpoint.startsWith('/requests/')) {
      const requestId = endpoint.split('/')[2];
      const requestIndex = MOCK_REQUESTS.findIndex(r => r.id === requestId);
      
      if (requestIndex !== -1) {
        MOCK_REQUESTS[requestIndex] = {
          ...MOCK_REQUESTS[requestIndex],
          ...(data as any),
          updatedAt: new Date().toISOString(),
        };
        return {
          success: true,
          data: MOCK_REQUESTS[requestIndex],
        } as T;
      }
    }

    throw new Error('Not implemented');
  },

  patch: async <T>(endpoint: string, data?: unknown): Promise<T> => {
    await delay();

    // Assign tutor to request
    if (endpoint.includes('/requests/') && endpoint.endsWith('/assign')) {
      const requestId = endpoint.split('/')[2];
      const requestIndex = MOCK_REQUESTS.findIndex(r => r.id === requestId);
      
      if (requestIndex !== -1) {
        const { tutorId } = data as any;
        const tutor = MOCK_USERS.find(u => u.id === tutorId);
        
        MOCK_REQUESTS[requestIndex] = {
          ...MOCK_REQUESTS[requestIndex],
          status: 'assigned',
          tutorId,
          tutorName: tutor ? `${tutor.firstName} ${tutor.lastName}` : undefined,
          assignedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return {
          success: true,
          data: MOCK_REQUESTS[requestIndex],
        } as T;
      }
    }

    // Update request status
    if (endpoint.includes('/requests/') && endpoint.endsWith('/status')) {
      const requestId = endpoint.split('/')[2];
      const requestIndex = MOCK_REQUESTS.findIndex(r => r.id === requestId);
      
      if (requestIndex !== -1) {
        const { status } = data as any;
        MOCK_REQUESTS[requestIndex] = {
          ...MOCK_REQUESTS[requestIndex],
          status,
          updatedAt: new Date().toISOString(),
          ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {}),
        };
        
        return {
          success: true,
          data: MOCK_REQUESTS[requestIndex],
        } as T;
      }
    }

    throw new Error('Not implemented');
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    await delay();
    
    // Delete user
    if (endpoint.startsWith('/users/')) {
      const userId = endpoint.split('/')[2];
      const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
      
      if (userIndex !== -1) {
        MOCK_USERS.splice(userIndex, 1);
        return {
          success: true,
        } as T;
      }
    }
    
    throw new Error('Not implemented');
  },
};

// Export mock users for quick login
export const QUICK_LOGIN_USERS = QUICK_LOGIN_USERS_IMPORT;