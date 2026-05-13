import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, AuthState, LoginFormData, RegisterFormData, AuthTokens } from '../types/main';

interface AuthContextType extends AuthState {
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = authService.getStoredUser();
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (storedUser && accessToken && refreshToken) {
        setState({
          user: storedUser,
          tokens: { accessToken, refreshToken },
          isAuthenticated: true,
          isLoading: false,
        });

        // Optionally verify token with backend
        try {
          const user = await authService.getCurrentUser();
          setState(prev => ({ ...prev, user }));
        } catch (error) {
          // Token might be expired, clear auth state
          console.error('Failed to verify user:', error);
          await logout();
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginFormData) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { user, tokens } = await authService.login(credentials);
      setState({
        user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (userData: RegisterFormData) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const { user, tokens } = await authService.register(userData);
      setState({
        user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setState({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const refreshUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setState(prev => ({ ...prev, user }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
