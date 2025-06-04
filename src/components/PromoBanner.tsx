
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useOrders } from '@/hooks/useOrders';
import { useAddress } from '@/hooks/useAddress';
import { useProducts } from '@/hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const PromoBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { addToCart } = useCart();
  const { createOrder } = useOrders();
  const { getDefaultAddress } = useAddress();
  const { getProductById } = useProducts();
  const navigate = useNavigate();

  // 使用真实商品数据
  const banners = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
      title: '春季新品上市',
      subtitle: '时尚穿搭，限时优惠',
      productId: 1
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=400&fit=crop',
      title: '数码好物',
      subtitle: '智能生活，从这里开始',
      productId: 13
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
      title: '美妆护肤',
      subtitle: '焕发自然美丽',
      productId: 7
    }
  ];

  const handleBannerClick = (banner: any) => {
    const product = getProductById(banner.productId);
    if (product && product.status === 'active') {
      setSelectedProduct(product);
      setShowProductDialog(true);
    } else {
      toast.error('商品暂时不可用');
    }
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      addToCart({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image
      });
      toast.success('已添加到购物车');
      setShowProductDialog(false);
    }
  };

  const handleBuyNow = () => {
    if (!selectedProduct) return;
    
    const defaultAddress = getDefaultAddress();
    if (!defaultAddress) {
      toast.error('请先添加收货地址');
      navigate('/profile');
      setShowProductDialog(false);
      return;
    }

    try {
      const items = [{
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: selectedProduct.image,
        quantity: 1,
        selected: true
      }];
      
      const orderId = createOrder(items, '微信支付', defaultAddress);
      
      if (!orderId) {
        throw new Error('订单创建失败');
      }
      
      toast.success('订单创建成功！');
      setShowProductDialog(false);
      setTimeout(() => {
        navigate(`/checkout/${orderId}`);
      }, 100);
    } catch (error) {
      console.error('创建订单失败:', error);
      toast.error('创建订单失败，请重试');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <>
      <div className="relative w-full h-40 rounded-lg overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div 
              key={index} 
              className="w-full h-full flex-shrink-0 relative cursor-pointer"
              onClick={() => handleBannerClick(banner)}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-center text-white">
                <h3 className="text-lg font-bold mb-1">{banner.title}</h3>
                <p className="text-sm">{banner.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* 导航按钮 */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1 rounded-full"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1 rounded-full"
        >
          ›
        </button>
        
        {/* 指示器 */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full cursor-pointer ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* 商品详情弹窗 */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>商品详情</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="aspect-square">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{selectedProduct.description}</p>
                
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-lg font-bold text-red-500">
                    ¥{selectedProduct.price}
                  </span>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ¥{selectedProduct.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  加入购物车
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleBuyNow}
                >
                  立即购买
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PromoBanner;
