import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { QUICK_LOGIN_USERS } from '../../services/mockApi';
import type { LoginFormData } from '../../types/main';
import { GraduationCap, BookOpen, Shield, Mail, Lock } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleQuickLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student':
        return <GraduationCap className="w-5 h-5" />;
      case 'tutor':
        return <BookOpen className="w-5 h-5" />;
      case 'admin':
        return <Shield className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'from-cyan-600 to-blue-600';
      case 'tutor':
        return 'from-blue-600 to-indigo-600';
      case 'admin':
        return 'from-teal-600 to-cyan-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center md:text-left space-y-6">
          <div className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              AcademicHub
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
            Welcome Back!
          </h1>
          <p className="text-xl text-slate-600">
            Sign in to access your academic support dashboard
          </p>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-cyan-200">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900">
                Sign In
              </h2>
              <p className="text-slate-600 mt-2">Access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-semibold">Quick Login (Demo)</span>
              </div>
            </div>

            <div className="space-y-3">
              {QUICK_LOGIN_USERS.map((user) => (
                <button
                  key={user.email}
                  onClick={() => handleQuickLogin(user.email, user.password)}
                  disabled={isLoading}
                  className={`w-full p-4 rounded-xl border-2 border-slate-200 hover:border-transparent bg-gradient-to-r ${getRoleColor(
                    user.role
                  )} hover:opacity-90 text-white font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-between group`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">{getRoleIcon(user.role)}</div>
                    <div className="text-left">
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs opacity-90">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</div>
                    </div>
                  </div>
                  <div className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">Login →</div>
                </button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-cyan-600 hover:text-blue-600 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
            <div className="mt-3 text-center">
              <Link to="/" className="text-sm text-slate-500 hover:text-cyan-600 transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};