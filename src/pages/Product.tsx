
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { createOrder } = useOrders();
  const { getProductById } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { user } = useAuth();

  // 获取实际商品数据
  const product = getProductById(parseInt(id || '1'));

  // 如果商品不存在，显示错误页面
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16 w-full max-w-md mx-auto">
        <Header />
        <div className="pt-14 px-4 py-8 text-center">
          <h1 className="text-xl font-bold mb-4">商品不存在</h1>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // 为商品创建多个图片（如果只有一个图片，则复制几次用于展示）
  const productImages = product.image ? [
    product.image,
    product.image,
    product.image
  ] : [];

  const handleAddToCart = () => {
    if (!user) {
      toast.error('请先登录', { duration: 1000 });
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
    toast.success(`已添加 ${quantity} 件商品到购物车`, { duration: 1000 });
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('请先登录', { duration: 1000 });
      return;
    }
    try {
      const items = [{
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        selected: true
      }];

      const orderId = createOrder(items, '微信支付');
      console.log('直接购买创建的订单ID:', orderId);
      navigate(`/checkout/${orderId}`);
    } catch (error) {
      console.error('创建订单失败:', error);
      toast.error('创建订单失败，请重试', { duration: 1000 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 w-full max-w-md mx-auto">
      <Header />

      <div className="pt-14 px-4 py-4">
        {/* Product Images */}
        <div className="mb-4">
          <div className="mb-3">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {productImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <Badge className="mb-2">热门商品</Badge>
            <h1 className="text-xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{product.rating || 4.5}</span>
              </div>
              <span className="ml-2 text-sm text-gray-500">({product.sales || 100} 评价)</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-baseline space-x-3 mb-2">
              <span className="text-2xl font-bold text-red-500">¥{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">¥{product.originalPrice}</span>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-sm">商品描述</h3>
            <p className="text-sm text-gray-600 mb-3">
              {product.description || '这是一款优质商品，品质保证，值得信赖。'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-sm font-medium">数量:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center text-sm">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleAddToCart} variant="outline" className="flex-1">
                <ShoppingCart className="w-4 h-4 mr-2" />
                加入购物车
              </Button>
              <Button onClick={handleBuyNow} className="flex-1">
                立即购买
              </Button>
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold mb-4">用户评价</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((review) => (
                <div key={review} className="border-b pb-3 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">用户{review}</span>
                    <span className="ml-auto text-xs text-gray-500">2024-01-{10 + review}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    产品质量很好，发货速度也很快。外观精美，功能强大，值得推荐！
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Product;