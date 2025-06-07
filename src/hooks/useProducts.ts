import { useState, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  description?: string;
  rating?: number;
  sales?: number;
}

const defaultProducts: Product[] = [
  // 穿搭类
  {
    id: 1,
    name: '时尚休闲外套',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400&h=400&fit=crop',
    category: '穿搭',
    stock: 50,
    status: 'active',
    description: '时尚潮流，舒适休闲，适合各种场合穿搭的经典外套',
    rating: 4.6,
    sales: 0
  },
  {
    id: 2,
    name: '经典牛仔裤',
    price: 189,
    originalPrice: 229,
    image: 'https://images.pexels.com/photos/6764708/pexels-photo-6764708.jpeg?w=400&h=400&fit=crop',
    category: '穿搭',
    stock: 80,
    status: 'active',
    rating: 4.5,
    sales: 0
  },
  // 美食类
  {
    id: 3,
    name: '精选坚果礼盒',
    price: 128,
    originalPrice: 168,
    image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.ZBzEmqr90Au1zfiVvoR4mAHaHa?r=0&rs=1&pid=ImgDetMain',
    category: '美食',
    stock: 100,
    status: 'active',
    rating: 4.8,
    sales: 0
  },
  {
    id: 4,
    name: '有机蜂蜜',
    price: 89,
    originalPrice: 119,
    image: 'https://th.bing.com/th/id/R.55d70b5b73645555418e74a93cebfafd?rik=Cppq7jPW2CTX0g&riu=http%3a%2f%2fimg.11665.com%2fimg04_p%2fi4%2fT1MDlbXcFCXXcPUlk2_044815.jpg&ehk=aHbN094MC%2bO1HqSMnyP6BNQsyNoKdnhyAC9PxEzLz3g%3d&risl=&pid=ImgRaw&r=0?w=400&h=400&fit=crop',
    category: '美食',
    stock: 60,
    status: 'active',
    rating: 4.7,
    sales: 0
  },
  // 居家类
  {
    id: 5,
    name: '北欧风桌椅',
    price: 79,
    originalPrice: 99,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    category: '居家',
    stock: 120,
    status: 'active',
    rating: 4.4,
    sales: 0
  },
  {
    id: 6,
    name: '智能台灯',
    price: 199,
    originalPrice: 259,
    image: 'https://cbu01.alicdn.com/img/ibank/2018/434/179/9167971434_44817320.jpg',
    category: '居家',
    stock: 45,
    status: 'active',
    rating: 4.6,
    sales: 0
  },
  // 美妆类
  {
    id: 7,
    name: '彩妆套装',
    price: 149,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    category: '美妆',
    stock: 80,
    status: 'active',
    description: '滋养肌肤，让您拥有水润光泽的完美肌肤',
    rating: 4.8,
    sales: 0
  },
  {
    id: 8,
    name: '丝绒口红套装',
    price: 219,
    originalPrice: 279,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    category: '美妆',
    stock: 90,
    status: 'active',
    rating: 4.7,
    sales: 0
  },
  // 运动类
  {
    id: 9,
    name: '专业跑步鞋',
    price: 399,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    category: '运动',
    stock: 70,
    status: 'active',
    rating: 4.6,
    sales: 0
  },
  {
    id: 10,
    name: '瑜伽垫套装',
    price: 89,
    originalPrice: 129,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
    category: '运动',
    stock: 120,
    status: 'active',
    rating: 4.5,
    sales: 0
  },
  // 户外类
  {
    id: 11,
    name: '登山背包',
    price: 329,
    originalPrice: 429,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: '户外',
    stock: 40,
    status: 'active',
    rating: 4.7,
    sales: 0
  },
  {
    id: 12,
    name: '户外帐篷',
    price: 589,
    originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400&h=400&fit=crop',
    category: '户外',
    stock: 25,
    status: 'active',
    rating: 4.8,
    sales: 0
  },
  // 数码类
  {
    id: 13,
    name: '无线蓝牙耳机',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop',
    category: '数码',
    stock: 100,
    status: 'active',
    description: '高品质音效，长续航，智能降噪，让您享受极致的音乐体验',
    rating: 4.6,
    sales: 0
  },
  {
    id: 14,
    name: '智能手表',
    price: 899,
    originalPrice: 1199,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    category: '数码',
    stock: 60,
    status: 'active',
    rating: 4.7,
    sales: 0
  }
];

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        setProducts(defaultProducts);
        localStorage.setItem('products', JSON.stringify(defaultProducts));
      }
    } catch (error) {
      console.error('加载商品数据失败:', error);
      setProducts(defaultProducts);
    }
  }, []);

  const saveToStorage = (productList: Product[]) => {
    try {
      localStorage.setItem('products', JSON.stringify(productList));
      setProducts(productList);
    } catch (error) {
      console.error('保存商品数据失败:', error);
    }
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct: Product = { ...product, id: newId };
    saveToStorage([...products, newProduct]);
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    const updatedProducts = products.map(product =>
      product.id === id ? { ...product, ...updates } : product
    );
    saveToStorage(updatedProducts);
  };

  const deleteProduct = (id: number) => {
    const updatedProducts = products.filter(product => product.id !== id);
    saveToStorage(updatedProducts);
  };

  const getProductById = (id: number): Product | undefined => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string): Product[] => {
    if (category === 'all') return products.filter(p => p.status === 'active');
    return products.filter(p => p.category === category && p.status === 'active');
  };

  const getSortedProductsByCategory = (category: string): Product[] => {
    let filtered = category === 'all'
      ? products.filter(p => p.status === 'active')
      : products.filter(p => p.category === category && p.status === 'active');
    // 按 sales 降序排序，未定义 sales 视为 0
    return filtered.sort((a, b) => (b.sales || 0) - (a.sales || 0));
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    getSortedProductsByCategory
  };
};
