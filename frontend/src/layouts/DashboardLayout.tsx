import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import {
  Settings,
  LogOut,
  Users,
  UserCheck,
  LayoutDashboard,
  Sparkles,
  Menu,
  X,
  FileText,
  Upload,
  UserPlus,
  ClipboardList,
  User as UserIcon,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ];

    if (user?.role === 'student') {
      return [
        ...baseItems,
        { name: 'Submit Request', href: '/dashboard/submit-request', icon: FileText },
        { name: 'My Requests', href: '/dashboard/my-requests', icon: ClipboardList },
        { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
      ];
    }

    if (user?.role === 'tutor') {
      return [
        ...baseItems,
        { name: 'Assigned Requests', href: '/dashboard/assigned-requests', icon: FileText },
        { name: 'Upload Work', href: '/dashboard/upload-work', icon: Upload },
        { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { name: 'All Requests', href: '/dashboard/view-requests', icon: FileText },
        { name: 'Assign Tutor', href: '/dashboard/assign-tutor', icon: UserCheck },
        { name: 'Manage Students', href: '/dashboard/manage-students', icon: Users },
        { name: 'Manage Tutors', href: '/dashboard/manage-tutors', icon: Users },
        { name: 'Create Tutor', href: '/dashboard/create-tutor', icon: UserPlus },
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-purple-100 z-20 shadow-xl transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">TutorHub</h1>
              <p className="text-xs text-gray-500">Learning Platform</p>
            </div>
          </div>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-300'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-100 bg-white/50 backdrop-blur-sm">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 border-purple-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 bg-white rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Main Content */}
      <div className={`transition-all ${isSidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-purple-100 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Welcome back, {user?.firstName}!
              </h2>
              <p className="text-gray-600 mt-1 capitalize flex items-center gap-2">
                <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
                  {user?.role}
                </span>
                Dashboard
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <span className="font-semibold">{user?.firstName?.[0]}{user?.lastName?.[0]}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};