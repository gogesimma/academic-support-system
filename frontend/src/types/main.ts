// User Types
export type UserRole = 'student' | 'tutor' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber?: string;
  profileImage?: string;
  institution?: string;
  level?: 'first-year' | 'second-year' | 'third-year' | 'fourth-year' | 'postgraduate';
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  role: 'student';
  institution: string;
  level: 'first-year' | 'second-year' | 'third-year' | 'fourth-year' | 'postgraduate';
  totalRequests: number;
  completedRequests: number;
}

export interface Tutor extends User {
  role: 'tutor';
  subjects: string[];
  bio: string;
  rating: number;
  totalEarnings: number;
  assignedRequests: number;
  completedRequests: number;
  createdByAdmin: boolean;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Request Types
export type RequestStatus = 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';

export type ServiceType =
  | 'Research Proposal & Dissertation'
  | 'Assignments & Project Assistance'
  | 'Literature Review'
  | 'Proof Reading & Editing'
  | 'One-on-One Consultation';

export type Module =
  | 'Economics'
  | 'Supply Chain Management'
  | 'Operations Management'
  | 'Procurement'
  | 'Purchasing'
  | 'Logistics Management'
  | 'Finance'
  | 'Accounting'
  | 'Other';

export interface Request {
  id: string;
  studentId: string;
  studentName: string;
  serviceType: ServiceType;
  module: Module;
  title: string;
  description: string;
  attachments: string[]; // file URLs
  status: RequestStatus;
  tutorId?: string;
  tutorName?: string;
  assignedAt?: string;
  completedAt?: string;
  workAttachments?: string[]; // tutor's submitted work
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats Types
export interface StudentStats {
  totalRequests: number;
  pendingRequests: number;
  assignedRequests: number;
  completedRequests: number;
}

export interface TutorStats {
  assignedRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  totalEarnings: number;
  averageRating: number;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  institution: string;
  level: 'first-year' | 'second-year' | 'third-year' | 'fourth-year' | 'postgraduate';
}

export interface RequestFormData {
  serviceType: ServiceType;
  module: Module;
  title: string;
  description: string;
  attachments: File[];
}

export interface CreateTutorFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  subjects: string[];
  bio: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}