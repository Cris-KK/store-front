import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Order = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrders();
  const { user } = useAuth();
  
  const order = orderId ? getOrderById(orderId) : null;

  useEffect(() => {
    if (!order) {
      toast.error('订单不存在', { duration: 1000 });
      navigate('/profile');
    }
  }, [order, navigate]);

  const handleConfirmReceipt = () => {
    if (!order || !user) return;
    
    updateOrderStatus(order.id, '已完成');
    
    // 增加积分
    const currentPoints = localStorage.getItem(`points_${user.id}`);
    const points = currentPoints ? parseInt(currentPoints) : 0;
    const newPoints = points + order.totalPrice;
    localStorage.setItem(`points_${user.id}`, newPoints.toString());
    
    toast.success(`订单已确认收货，获得 ${order.totalPrice} 积分！`, { duration: 1000 });
  };

  if (!order) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case '待支付': return 'bg-yellow-500';
      case '待发货': return 'bg-blue-500';
      case '已发货': return 'bg-green-500';
      case '已完成': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">订单详情</h1>
          <Button variant="outline" onClick={() => navigate('/profile')} className="w-full sm:w-auto">
            返回个人中心
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle className="mb-2 text-base sm:text-lg">订单 #{order.id}</CardTitle>
                <p className="text-gray-600 text-xs sm:text-sm">下单时间：{order.createTime}</p>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
                {order.status === '已发货' && (
                  <Button size="sm" onClick={handleConfirmReceipt}>
                    确认收货
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 收货地址信息 */}
              {order.shippingAddress && (
                <div>
                  <h3 className="font-medium mb-2 text-sm">收货信息</h3>
                  <div className="p-3 border rounded-lg text-xs sm:text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                      <span className="font-medium">{order.shippingAddress.name}</span>
                      <span className="text-gray-600">{order.shippingAddress.phone}</span>
                    </div>
                    <p className="text-gray-600">{order.shippingAddress.address}</p>
                  </div>
                </div>
              )}

              {/* 商品列表 */}
              <div>
                <h3 className="font-medium mb-2 text-sm">商品信息</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-center sm:items-stretch space-y-2 sm:space-y-0 sm:space-x-4 p-3 border rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded mb-2 sm:mb-0"
                      />
                      <div className="flex-1 w-full">
                        <h4 className="font-medium text-xs sm:text-sm">{item.name}</h4>
                        <p className="text-gray-600 text-xs sm:text-sm">单价：¥{item.price}</p>
                        <p className="text-gray-600 text-xs sm:text-sm">数量：{item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-base sm:text-lg">¥{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 费用明细 */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2 text-sm">费用明细</h3>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span>商品总价</span>
                    <span>¥{order.originalPrice || order.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>运费</span>
                    <span>免费</span>
                  </div>
                  {order.couponDiscount && (
                    <div className="flex justify-between text-orange-600">
                      <span>优惠券折扣</span>
                      <span>-¥{order.couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold border-t pt-2">
                    <span>实付金额</span>
                    <span className="text-red-500">¥{order.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* 支付信息 */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2 text-sm">支付信息</h3>
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span>支付方式</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>订单状态</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Order;
