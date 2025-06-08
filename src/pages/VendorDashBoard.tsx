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

const VendorDashboard = () => {
  const { user,logout } = useAuth();
  const navigate = useNavigate();
  const { getAllOrders } = useOrders();
  const { products } = useProducts();
  const { registeredUsers } = useUsers(); // Fetch users using the useUsers hook

  // 检查管理员权限
  useEffect(() => {
    if (!user || user.role !== 'vendor') {
      toast.error('无权限访问', { duration: 1000 });
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
      title: '总销售额',
      value: `¥${totalRevenue.toLocaleString()}`,
      count: totalRevenue,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: '💰'
    },
    {
      title: '订单数量',
      value: totalOrders.toLocaleString(),
      count: totalOrders,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: '📦'
    },
    {
      title: '商品数量',
      value: totalProducts.toLocaleString(),
      count: totalProducts,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: '🛍️'
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
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-semibold text-gray-900">管理后台</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">欢迎, {user?.name}</span>
              <Button variant="outline" size="sm"
                onClick={() => {
                  navigate('/');
                }}
              >
                返回商家
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="w-full">
              <CardContent className="p-6 flex flex-col items-center justify-center">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 订单状态统计 */}
          <Card>
            <CardHeader>
              <CardTitle>订单状态统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{stat.title}</span>
                    <span className={`text-lg font-semibold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">总计</span>
                    <span className="text-lg font-semibold text-gray-900">{totalOrders}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 最近订单 */}
          <Card>
            <CardHeader>
              <CardTitle>最近订单</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">暂无订单</p>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">#{order.id.slice(-8)}</p>
                        <p className="text-xs text-gray-500">{order.shippingAddress?.name || '未知客户'}</p>
                        <p className="text-xs text-gray-400">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-red-500">¥{order.totalPrice}</p>
                        <Badge variant="secondary" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 快速操作 */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/admin/products">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Package className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-medium">商品管理</h3>
                  <p className="text-sm text-gray-500 mt-1">管理商品信息</p>
                  <p className="text-xs text-blue-600 mt-2">当前: {totalProducts} 个商品</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/orders">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-3 text-green-600" />
                  <h3 className="font-medium">订单管理</h3>
                  <p className="text-sm text-gray-500 mt-1">处理客户订单</p>
                  <p className="text-xs text-green-600 mt-2">当前: {totalOrders} 个订单</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
