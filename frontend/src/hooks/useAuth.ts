import { useState, useCallback, useEffect } from 'react';
import { authStorage } from '../utils/storage';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Demo credentials (in production, this would verify against backend)
const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export const useAuth = (): UseAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const token = authStorage.getToken();
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Demo authentication (replace with actual API call)
      if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
        // Generate a demo token
        const token = btoa(`${username}:${Date.now()}`);
        authStorage.setToken(token);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authStorage.clearToken();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};

export default useAuth;
