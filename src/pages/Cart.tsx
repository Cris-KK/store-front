
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useAddress } from '@/hooks/useAddress';

const Cart = () => {
  const { cartItems, updateQuantity, toggleSelect, removeItem, selectedItems, totalPrice } = useCart();
  const { createOrder } = useOrders();
  const { getDefaultAddress } = useAddress();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error('请选择要结算的商品');
      return;
    }

    const defaultAddress = getDefaultAddress();
    if (!defaultAddress) {
      toast.error('请先在个人中心添加收货地址');
      navigate('/profile');
      return;
    }

    try {
      const orderId = createOrder(selectedItems, '微信支付', defaultAddress);
      console.log('购物车结算创建的订单ID:', orderId);
      
      if (!orderId) {
        throw new Error('订单创建失败');
      }
      
      toast.success('订单创建成功！');
      navigate(`/checkout/${orderId}`);
    } catch (error) {
      console.error('创建订单失败:', error);
      toast.error('创建订单失败，请重试');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        <Header />
        <div className="pt-14 max-w-md mx-auto px-4 py-8 text-center">
          <p>请先登录</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="pt-14 max-w-md mx-auto px-4 py-4">
        <h1 className="text-xl font-bold mb-6">购物车</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">购物车是空的</p>
            <Button onClick={() => navigate('/')}>去购物</Button>
          </div>
        ) : (
          <>
            {/* 商品列表 */}
            <div className="space-y-4 mb-20">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={item.selected}
                        onCheckedChange={() => toggleSelect(item.id)}
                      />
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                        <p className="text-red-500 font-bold text-sm mt-1">¥{item.price}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 底部结算栏 */}
            <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4">
              <div className="max-w-md mx-auto flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">
                    已选 {selectedItems.length} 件商品
                  </span>
                  <div className="text-lg font-bold text-red-500">
                    总计: ¥{totalPrice}
                  </div>
                </div>
                <Button 
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className="px-8"
                >
                  结算
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Cart;
