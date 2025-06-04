import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating?: number;
  sales?: number;
}

interface ProductCardProps {
  product: Product;
  compact?: boolean; // 添加紧凑模式支持
}

const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { createOrder } = useOrders();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    toast.success('已添加到购物车');
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const items = [{
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        selected: true
      }];
      
      const orderId = createOrder(items, '微信支付');
      console.log('首页直接购买创建的订单ID:', orderId);
      
      if (!orderId) {
        throw new Error('订单创建失败');
        throw new Error('订单创建失败');
      }
      
      toast.success('订单创建成功！');
      
      setTimeout(() => {
        navigate(`/checkout/${orderId}`);
      }, 100);
    } catch (error) {
      console.error('创建订单失败:', error);
      toast.error('创建订单失败，请重试');
    }
  };

  if (compact) {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <CardContent className="p-2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-20 object-cover rounded mb-2"
          />
          <h3 className="font-medium text-xs line-clamp-2 mb-1">{product.name}</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-500 font-bold text-xs">¥{product.price}</span>
            {product.rating && (
              <span className="text-xs text-gray-500">★{product.rating}</span>
            )}
          </div>
          {product.sales && (
            <p className="text-xs text-gray-500 mb-2">已售{product.sales}件</p>
          )}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-6 px-1 min-w-0"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs h-6 px-1 min-w-0"
              onClick={handleBuyNow}
            >
              购买
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <CardContent className="p-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 object-cover rounded mb-2"
        />
        <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-red-500 font-bold text-sm">¥{product.price}</span>
          {product.rating && (
            <span className="text-xs text-gray-500">★{product.rating}</span>
          )}
        </div>
        {product.sales && (
          <p className="text-xs text-gray-500 mb-2">已售{product.sales}件</p>
        )}
        <div className="flex gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-1/2 text-xs h-7"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            加购物车
          </Button>
          <Button
            size="sm"
            className="w-1/2 text-xs h-7"
            onClick={handleBuyNow}
          >
            立即购买
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
