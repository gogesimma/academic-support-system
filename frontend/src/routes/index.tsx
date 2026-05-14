import { createBrowserRouter, Navigate } from 'react-router-dom'; // Changed from 'react-router' to 'react-router-dom'
import { LandingPage } from '../pages/common/LandingPage';
import { LoginPage } from '../pages/common/LoginPage';
import { RegisterPage } from '../pages/common/RegisterPage'; // Fixed path: was './pages/RegisterPage'
import { StudentDashboard } from '../pages/student/StudentDashboard'; // Changed from NewStudentDashboard
import { TutorDashboard } from '../pages/tutor/TutorDashboard';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { UnauthorizedPage } from '../pages/common/UnauthorizedPage';
import { ProtectedRoute } from '../components/common/protectedRoute'; // Fixed: capital P in ProtectedRoute
import { authService } from '../services/authService';

// Student pages
import { SubmitRequestPage } from '../pages/student/SubmitRequestPage';
import { MyRequestsPage } from '../pages/student/MyRequestsPage';
import { ProfilePage } from '../pages/common/ProfilePage';

// Tutor pages
import { AssignedRequestsPage } from '../pages/tutor/AssignedRequestsPage';
import { UploadWorkPage } from '../pages/tutor/UploadWorkPage';

// Admin pages
import { ManageStudentsPage } from '../pages/admin/ManageStudentsPage';
import { ManageTutorsPage } from '../pages/admin/ManageTutorsPage';
import { CreateTutorPage } from '../pages/admin/CreateTutorPage';
import { ViewAllRequestsPage } from '../pages/admin/ViewAllRequestsPage';
import { AssignTutorPage } from '../pages/admin/AssignTutorPage';
import { StudentProfilePage } from '../pages/admin/StudentProfilePage'; // Fixed: should be from admin, not student
import { TutorProfilePage } from '../pages/admin/TutorProfilePage'; // Fixed: should be from admin, not tutor

// Shared pages
import { ChangePasswordPage } from '../pages/common/ChangePasswordPage';

/**
 * Dashboard Route Component
 * Routes to appropriate dashboard based on user role
 */
const DashboardRoute = () => {
  const user = authService.getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'student':
      return <StudentDashboard />; // Changed from NewStudentDashboard
    case 'tutor':
      return <TutorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

/**
 * React Router Configuration
 * Using Data Router pattern with loaders
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardRoute />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/submit-request',
    element: (
      <ProtectedRoute allowedRoles={['student']}>
        <SubmitRequestPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/my-requests',
    element: (
      <ProtectedRoute allowedRoles={['student']}>
        <MyRequestsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/change-password',
    element: (
      <ProtectedRoute>
        <ChangePasswordPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/assigned-requests',
    element: (
      <ProtectedRoute allowedRoles={['tutor']}>
        <AssignedRequestsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/upload-work',
    element: (
      <ProtectedRoute allowedRoles={['tutor']}>
        <UploadWorkPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/manage-students',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <ManageStudentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/manage-tutors',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <ManageTutorsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/create-tutor',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <CreateTutorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/view-requests',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <ViewAllRequestsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/assign-tutor',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AssignTutorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/students/:id',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <StudentProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/tutors/:id',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <TutorProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
          <a href="/dashboard" className="text-blue-600 hover:underline">
            Go to Dashboard
          </a>
        </div>
      </div>
    ),
  },
]);