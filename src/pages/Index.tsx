import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import PromoBanner from '@/components/PromoBanner';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';



const Index = () => {
  const navigate = useNavigate();
  const { getSortedProductsByCategory } = useProducts();

  // 获取热门商品（前4个上架商品）
  const products = getSortedProductsByCategory('all').slice(0, 12);

  // 更新商品分类
  const categories = [
    { name: '穿搭', icon: '👗', key: '穿搭' },
    { name: '美食', icon: '🍎', key: '美食' },
    { name: '居家', icon: '🏠', key: '居家' },
    { name: '美妆', icon: '💄', key: '美妆' },
    { name: '运动', icon: '⚽', key: '运动' },
    { name: '户外', icon: '🏕️', key: '户外' },
    { name: '数码', icon: '📱', key: '数码' }
  ];

  const handleCategoryClick = (categoryKey: string) => {
    console.log('点击的分类 key:', categoryKey);
    navigate(`/category/${encodeURIComponent(categoryKey)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 w-full">
      <Header />

      <div className="pt-14 w-full">
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 轮播图 */}
          <div className="mt-2 mb-4">
            <PromoBanner />
          </div>

          {/* 商品分类 */}
          <div className="mb-4 bg-white rounded-lg p-3">
            <div className="grid grid-cols-7 md:grid-cols-7 gap-2">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                  onClick={() => handleCategoryClick(category.key)}
                >
                  <div className="text-lg mb-1">{category.icon}</div>
                  <span className="text-xs text-gray-600 text-center leading-tight">{category.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 热门商品 */}
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-3">热门商品</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
