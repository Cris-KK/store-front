import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, ShoppingCart, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useUsers } from '@/hooks/useUsers'; // Import the useUsers hook


const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getAllOrders } = useOrders();
  const { products } = useProducts();
  const { registeredUsers } = useUsers(); // Fetch users using the useUsers hook

  // 检查管理员权限
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('无权限访问');
      navigate('/');
    }
  }, [user, navigate]);

  const orders = getAllOrders();
  
  // 计算真实统计数据
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  
  // 计算总用户数（从localStorage中的所有用户订单推断）
  // const userKeys = Object.keys(localStorage).filter(key => key.startsWith('orders_'));
  // const totalUsers = userKeys.length;
  const totalUsers = registeredUsers.length; // Use the number of users from the useUsers hook

  const pendingOrders = orders.filter(order => order.status === '待支付').length;
  const shippedOrders = orders.filter(order => order.status === '已发货').length;
  const completedOrders = orders.filter(order => order.status === '已完成').length;

  const stats = [
    
    {
      title: '用户数量',
      value: totalUsers.toLocaleString(),
      count: totalUsers,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      icon: '👥'
    },
  ];

  const orderStats = [
    { title: '待支付', value: pendingOrders, color: 'text-yellow-600' },
    { title: '已发货', value: shippedOrders, color: 'text-blue-600' },
    { title: '已完成', value: completedOrders, color: 'text-green-600' },
  ];

  // 最近订单 - 修复 createdAt 错误
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-semibold text-gray-900">管理后台</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">欢迎, {user?.name}</span>
                <Button variant="outline" size="sm"
                  onClick={() => {
                  navigate('/'); // 返回商家首页
               }}
          >
          返回商家
                </Button>
            </div>
          </div>
        </div>
      </header>

   <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* 统计卡片 */}
  <div
    className={`
      grid gap-6 mb-8
      ${stats.length === 1
        ? 'grid-cols-1 place-items-center'
        : 'grid-cols-1 md:grid-cols-2 justify-center'}
    `}
  >
    {stats.map((stat, index) => (
      <Card
        key={index}
        className="min-h-[120px] w-full flex items-center justify-center text-base"
      >
        <CardContent className="p-6 w-full flex flex-col items-center justify-center">
          <div className={`p-3 rounded-lg ${stat.bgColor} mb-2 flex items-center justify-center`}>
            <span className="text-2xl">{stat.icon}</span>
          </div>
          <p className="text-sm font-medium text-gray-600 text-center">{stat.title}</p>
          <p className="text-2xl font-semibold text-gray-900 text-center">{stat.value}</p>
          <p className="text-xs text-gray-500 mt-1 text-center">
            {stat.count === 0 ? '暂无数据' : '实时数据'}
          </p>
        </CardContent>
      </Card>
    ))}
  </div>

       

        {/* 快速操作 */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-1 gap-4">

            <Link to="/admin/users">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <User className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="font-medium">用户管理</h3>
                  <p className="text-sm text-gray-500 mt-1">管理用户账户</p>
                  <p className="text-xs text-purple-600 mt-2">当前: {totalUsers} 个用户</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
