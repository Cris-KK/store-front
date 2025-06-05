import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('请输入邮箱和密码');
      return;
    }

    const success = await login(email, password);
if (success) {
  // 登录成功后提取用户信息
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    user = null;
  }

  if (user && user.role === 'vendor') {
    toast.success('登录成功！');
    navigate('/vendor');
  } else if (user && user.role === 'admin') {
    toast.success('登录成功！');
    navigate('/admin');
  } else {
    toast.error('仅限管理员或商家账号登录');
  }
} else {
  toast.error('登录失败，请检查邮箱和密码或先注册账号');
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-2xl mx-auto flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden bg-white">
        <div className="hidden md:flex flex-col justify-center items-center bg-indigo-100 w-1/2 p-10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">欢迎回来！</h2>
        </div>
        <div className="w-full md:w-1/2 p-8">
          <Card className="w-full shadow-none border-none">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">登录</CardTitle>
              <CardDescription>
                请输入您的账号信息
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入邮箱"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? '登录中...' : '登录'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;