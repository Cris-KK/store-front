import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { Package, ShoppingCart, User, Settings, MapPin, CreditCard, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useAddress } from '@/hooks/useAddress';
import { Checkbox } from '@/components/ui/checkbox';

const Profile = () => {
  const { user } = useAuth();
  const { orders } = useOrders();
  const { addresses, addAddress, updateAddress, deleteAddress } = useAddress();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    address: '',
    isDefault: false
  });
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center">请先登录</p>
        </div>
      </div>
    );
  }

  // 从localStorage获取积分
  const userPoints = localStorage.getItem(`points_${user.id}`);
  const totalPoints = userPoints ? parseInt(userPoints) : 0;

  // 计算积分（所有已完成订单的总金额）
  const orderStats = [
    {
      title: '全部订单',
      value: orders.length,
      icon: Package,
      color: 'text-gray-600',
      filter: 'all'
    },
    {
      title: '待付款',
      value: orders.filter(o => o.status === '待支付').length,
      icon: CreditCard,
      color: 'text-yellow-600',
      filter: 'pending'
    },
    {
      title: '待收货',
      value: orders.filter(o => o.status === '已发货').length,
      icon: Package,
      color: 'text-blue-600',
      filter: 'shipping'
    },
    {
      title: '退款/售后',
      value: 0,
      icon: Package,
      color: 'text-red-600',
      filter: 'refund'
    },
  ];

  const handleAddressSubmit = () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.address) {
      toast.error('请填写完整地址信息', { duration: 1000 });
      return;
    }

    if (editingAddress) {
      updateAddress(editingAddress.id, addressForm);
      toast.success('地址更新成功', { duration: 500});
      setEditingAddress(null);
    } else {
      addAddress(addressForm);
      toast.success('地址添加成功', { duration: 500 });
    }

    setShowAddressDialog(false);
    setAddressForm({ name: '', phone: '', address: '', isDefault: false });
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name,
      phone: address.phone,
      address: address.address,
      isDefault: address.isDefault
    });
    setShowAddressDialog(true);
  };

  const handleDeleteAddress = (id: string) => {
    deleteAddress(id);
    toast.success('地址删除成功', { duration: 500 });
  };

  const renderAddressManagement = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">地址管理</CardTitle>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingAddress(null);
                setAddressForm({ name: '', phone: '', address: '', isDefault: false });
                setShowAddressDialog(true);
              }}
            >
              添加地址
            </Button>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('overview')}>
              返回
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {addresses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">暂无收货地址</p>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{address.name}</span>
                      <span className="text-gray-600">{address.phone}</span>
                      {address.isDefault && (
                        <Badge variant="secondary" className="text-xs">默认</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{address.address}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      删除
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderOrders = (filter: string) => {
    let filteredOrders = orders;

    switch (filter) {
      case 'pending':
        filteredOrders = orders.filter(o => o.status === '待支付');
        break;
      case 'shipping':
        filteredOrders = orders.filter(o => o.status === '已发货');
        break;
      case 'refund':
        filteredOrders = [];
        break;
      default:
        filteredOrders = orders;
    }

    return (
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">暂无订单</p>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">订单 #{order.id}</span>
                <Badge variant="secondary">{order.status}</Badge>
              </div>

              <div className="flex items-center space-x-3 mb-2">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <span className="text-sm text-gray-500">等{order.items.length}件商品</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{order.createTime}</span>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-red-500">¥{order.totalPrice}</span>
                  <Link to={`/order/${order.id}`}>
                    <Button variant="outline" size="sm">查看详情</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            {/* 积分卡片 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">我的积分</h3>
                      <p className="text-lg font-bold text-yellow-600">{totalPoints}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">积分明细</Button>
                </div>
              </CardContent>
            </Card>

            {/* 订单状态 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">我的订单</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {orderStats.map((stat, index) => (
                    <div
                      key={index}
                      className="text-center cursor-pointer p-2"
                      onClick={() => setActiveTab(`orders-${stat.filter}`)}
                    >
                      <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
                      <div className="text-lg font-bold">{stat.value}</div>
                      <p className="text-xs text-gray-600">{stat.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 地址管理 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">地址管理</h3>
                      <p className="text-xs text-gray-500">已保存 {addresses.length} 个地址</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('addresses')}
                  >
                    管理地址
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'addresses':
        return renderAddressManagement();
      case 'orders-all':
      case 'orders-pending':
      case 'orders-shipping':
      case 'orders-refund':
        const filter = activeTab.split('-')[1];
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">订单列表</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('overview')}>
                  返回
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {renderOrders(filter)}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />

      <div className="pt-14 max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 py-4">
        {/* 用户信息卡片 */}
        <Card className="mb-4">
          <CardContent className="p-4 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className="text-gray-600 mb-3 text-sm">{user.email}</p>
            <Badge variant={user.role === 'admin' ? 'default' : user.role === 'vendor' ? 'default' : 'secondary'}>
              {user.role === 'admin' ? '管理员' : user.role === 'vendor' ? '商家' : '普通用户'}
            </Badge>
          </CardContent>
        </Card>

        {/* 动态内容 */}
        {renderContent()}
      </div>

      {/* 地址管理弹窗 */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-w-sm md:max-w-md lg:max-w-lg mx-auto">
          <DialogHeader>
            <DialogTitle>{editingAddress ? '编辑地址' : '添加收货地址'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">收货人姓名</Label>
              <Input
                id="name"
                value={addressForm.name}
                onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                placeholder="请输入收货人姓名"
              />
            </div>
            <div>
              <Label htmlFor="phone">手机号码</Label>
              <Input
                id="phone"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                placeholder="请输入手机号码"
              />
            </div>
            <div>
              <Label htmlFor="address">详细地址</Label>
              <Input
                id="address"
                value={addressForm.address}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                placeholder="请输入详细地址"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={addressForm.isDefault}
                onCheckedChange={(checked) => setAddressForm({ ...addressForm, isDefault: !!checked })}
              />
              <Label htmlFor="isDefault">设为默认地址</Label>
            </div>
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAddressDialog(false)}
              >
                取消
              </Button>
              <Button
                className="flex-1"
                onClick={handleAddressSubmit}
              >
                {editingAddress ? '更新' : '保存'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
