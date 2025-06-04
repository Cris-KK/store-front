
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { validateLogin, registerUser } = useUsers();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const validUser = validateLogin(email, password);
    if (validUser) {
      const userInfo = {
        id: validUser.id,
        email: validUser.email,
        name: validUser.name,
        role: validUser.role
      };
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = registerUser(email, password, name);
    if (success) {
      // 注册成功后自动登录
      const validUser = validateLogin(email, password);
      if (validUser) {
        const userInfo = {
          id: validUser.id,
          email: validUser.email,
          name: validUser.name,
          role: validUser.role
        };
        setUser(userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
      }
    }
    setIsLoading(false);
    return success;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
