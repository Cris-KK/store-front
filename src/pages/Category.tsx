
// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Header from '@/components/Header';
// import BottomNavigation from '@/components/BottomNavigation';
// import ProductCard from '@/components/ProductCard';
// import { Input } from '@/components/ui/input';
// import { Search } from 'lucide-react';
// import { useProducts } from '@/hooks/useProducts';

// const Category = () => {
//   const { category } = useParams<{ category: string }>();
//   const [searchTerm, setSearchTerm] = useState('');
//   const { getProductsByCategory } = useProducts();

//   // 解码 URL 编码的分类名称
//   const decodedCategory = category ? decodeURIComponent(category) : 'all';
//   console.log('当前分类:', decodedCategory);
  
//   const products = getProductsByCategory(decodedCategory);
//   console.log('分类商品数量:', products.length);
  
//   const filteredProducts = products.filter(product =>
//     product.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getCategoryName = (categoryKey: string) => {
//     const categoryMap: { [key: string]: string } = {
//       'all': '全部商品',
//       '穿搭': '穿搭',
//       '美食': '美食',
//       '居家': '居家',
//       '美妆': '美妆',
//       '运动': '运动',
//       '户外': '户外',
//       '数码': '数码'
//     };
//     return categoryMap[categoryKey] || '商品分类';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20 w-full max-w-md mx-auto">
//       <Header />
      
//       <div className="pt-14 px-4">
//         <div className="py-4">
//           <h1 className="text-xl font-bold mb-4">{getCategoryName(decodedCategory)}</h1>
          
//           {/* 搜索框 */}
//           <div className="relative mb-4">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//             <Input
//               placeholder="搜索商品..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
          
//           {/* 商品列表 - 使用紧凑模式 */}
//           <div className="grid grid-cols-3 gap-2">
//             {filteredProducts.map((product) => (
//               <ProductCard key={product.id} product={product} compact={true} />
//             ))}
//           </div>
          
//           {filteredProducts.length === 0 && (
//             <div className="text-center py-8">
//               <p className="text-gray-500">没有找到相关商品</p>
//             </div>
//           )}
//         </div>
//       </div>

//       <BottomNavigation />
//     </div>
//   );
// };

// export default Category;
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const { getProductsByCategory, products } = useProducts();

  // 解码 URL 编码的分类名称
  const decodedCategory = category ? decodeURIComponent(category) : 'all';
  
  // 获取搜索参数
  const searchQuery = searchParams.get('search') || '';
  
  console.log('当前分类:', decodedCategory);
  console.log('搜索词:', searchQuery);
  
  // 获取分类商品
  let filteredProducts = getProductsByCategory(decodedCategory);
  
  // 如果有搜索词，则进一步过滤
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  console.log('过滤后商品数量:', filteredProducts.length);

  const getCategoryName = (categoryKey: string) => {
    const categoryMap: { [key: string]: string } = {
      'all': '全部商品',
      '穿搭': '穿搭',
      '美食': '美食',
      '居家': '居家',
      '美妆': '美妆',
      '运动': '运动',
      '户外': '户外',
      '数码': '数码'
    };
    return categoryMap[categoryKey] || '商品分类';
  };

  // 显示标题：如果有搜索词，显示搜索结果，否则显示分类名称
  const getDisplayTitle = () => {
    if (searchQuery) {
      return `搜索结果: ${searchQuery}`;
    }
    return getCategoryName(decodedCategory);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 w-full max-w-md mx-auto">
      <Header />
      
      <div className="pt-14 px-4">
        <div className="py-4">
          <h1 className="text-xl font-bold mb-4">{getDisplayTitle()}</h1>
          
          {/* 商品列表 - 使用紧凑模式 */}
          <div className="grid grid-cols-3 gap-2">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} compact={true} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchQuery ? `没有找到包含"${searchQuery}"的商品` : '没有找到相关商品'}
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Category;