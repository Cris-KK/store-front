
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AddressSelector from '@/components/AddressSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useOrders } from '@/hooks/useOrders';
import { useAddress, Address } from '@/hooks/useAddress';
import { toast } from 'sonner';

const Checkout = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrders();
  const { getDefaultAddress } = useAddress();
  
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>();
  const [paymentMethod, setPaymentMethod] = useState('微信支付');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      const orderData = getOrderById(orderId);
      if (orderData) {
        setOrder(orderData);
        // 设置默认地址
        const defaultAddr = orderData.shippingAddress || getDefaultAddress();
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        }
      } else {
        toast.error('订单不存在');
        navigate('/');
      }
    }
  }, [orderId]);

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
  };

  const handlePay = () => {
    if (!selectedAddress) {
      toast.error('请选择收货地址');
      return;
    }

    if (!order) {
      toast.error('订单信息不存在');
      return;
    }

    // 模拟支付成功
    updateOrderStatus(order.id, '待发货');
    toast.success('支付成功！订单已提交');
    
    setTimeout(() => {
      navigate('/profile');
    }, 1500);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 flex items-center justify-center">
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 max-w-md mx-auto px-4 py-6">
        <h1 className="text-xl font-bold mb-6">确认订单</h1>
        
        {/* 收货地址 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">收货地址</CardTitle>
          </CardHeader>
          <CardContent>
            <AddressSelector
              selectedAddress={selectedAddress}
              onAddressSelect={handleAddressSelect}
              showAddButton={true}
            />
          </CardContent>
        </Card>

        {/* 商品信息 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">商品信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-gray-600 text-sm">¥{item.price} × {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">¥{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 支付方式 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">支付方式</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="微信支付" id="wechat" />
                <Label htmlFor="wechat" className="flex items-center space-x-2">
                  <span>💚</span>
                  <span>微信支付</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="支付宝" id="alipay" />
                <Label htmlFor="alipay" className="flex items-center space-x-2">
                  <span>🔵</span>
                  <span>支付宝</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* 订单总计 */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>商品总价</span>
                <span>¥{order.totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>运费</span>
                <span>免费</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>实付金额</span>
                <span className="text-red-500">¥{order.totalPrice}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 提交订单按钮 */}
        <Button 
          className="w-full"
          onClick={handlePay}
          disabled={!selectedAddress}
        >
          立即支付 ¥{order.totalPrice}
        </Button>
      </div>
    </div>
  );
};

export default Checkout;
