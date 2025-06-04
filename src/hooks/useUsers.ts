
import { useState, useEffect } from 'react';

export interface RegisteredUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
  registerDate: string;
  isActive: boolean;
}

export const useUsers = () => {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem('registered_users');
      if (savedUsers) {
        setRegisteredUsers(JSON.parse(savedUsers));
      } else {
        // 初始化管理员账户
        const adminUser: RegisteredUser = {
          id: 'admin_1',
          email: 'admin@mall.com',
          name: '管理员',
          password: 'admin123',
          role: 'admin',
          registerDate: new Date().toLocaleDateString(),
          isActive: true
        };
        const initialUsers = [adminUser];
        localStorage.setItem('registered_users', JSON.stringify(initialUsers));
        setRegisteredUsers(initialUsers);
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
      setRegisteredUsers([]);
    }
  }, []);

  const saveToStorage = (users: RegisteredUser[]) => {
    try {
      localStorage.setItem('registered_users', JSON.stringify(users));
      setRegisteredUsers(users);
    } catch (error) {
      console.error('保存用户数据失败:', error);
    }
  };

  const registerUser = (email: string, password: string, name: string): boolean => {
    // 检查邮箱是否已存在
    const existingUser = registeredUsers.find(user => user.email === email);
    if (existingUser) {
      return false;
    }

    const newUser: RegisteredUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      password,
      role: 'user',
      registerDate: new Date().toLocaleDateString(),
      isActive: true
    };

    saveToStorage([...registeredUsers, newUser]);
    return true;
  };

  const validateLogin = (email: string, password: string): RegisteredUser | null => {
    const user = registeredUsers.find(u => u.email === email && u.password === password && u.isActive);
    return user || null;
  };

  const updateUserRole = (userId: string, role: 'user' | 'admin') => {
    const updatedUsers = registeredUsers.map(user =>
      user.id === userId ? { ...user, role } : user
    );
    saveToStorage(updatedUsers);
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = registeredUsers.map(user =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    saveToStorage(updatedUsers);
  };

  const getUserOrderCount = (userId: string): number => {
    try {
      const orders = localStorage.getItem(`orders_${userId}`);
      return orders ? JSON.parse(orders).length : 0;
    } catch {
      return 0;
    }
  };

  return {
    registeredUsers,
    registerUser,
    validateLogin,
    updateUserRole,
    toggleUserStatus,
    getUserOrderCount
  };
};
