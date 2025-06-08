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
    name: 'lamer护肤套装',
    price: 149,
    originalPrice: 199,
    image: 'https://imgservice.suning.cn/uimg1/b2c/image/5yTesIS1mYEkNY4YqsOkyQ.jpg',
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
    image: "https://cbu01.alicdn.com/img/ibank/O1CN01g0xuHp1j8sbjDvlMq_!!3586514504-0-cib.jpg",
    category: '美妆',
    stock: 90,
    status: 'active',
    rating: 4.7,
    sales: 0
  },
  // 运动类
  {
    id: 9,
    name: 'nike专业跑步鞋',
    price: 399,
    originalPrice: 499,
    image: "https://pic4.zhimg.com/v2-51e8b7d397d8fc55bb0b262e2dcad682_r.jpg",
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
    image: "https://img.alicdn.com/bao/uploaded/TB1ZVALc5cKOu4jSZKbSuw19XXa.jpg",
    category: '运动',
    stock: 120,
    status: 'active',
    rating: 4.5,
    sales: 0
  },
  // 户外类
  {
    id: 11,
    name: '攀山鼠户外登山包',
    price: 329,
    originalPrice: 429,
    image: 'https://th.bing.com/th/id/OIP.WpoukquHmo4gM9Bm9vsAbQHaHa?rs=1&pid=ImgDetMain',
    category: '户外',
    stock: 40,
    status: 'active',
    rating: 4.7,
    sales: 0,
    description: '这款攀山鼠户外登山包采用高强度防水面料，拥有多层收纳空间和人体工学背负系统，适合长途徒步、露营、旅行等多种户外场景，轻便耐用，容量充足，是户外爱好者的理想选择。'
  },
  {
    id: 12,
    name: '户外帐篷',
    price: 589,
    originalPrice: 699,
    image: 'https://cbu01.alicdn.com/img/ibank/2018/147/869/9223968741_2090806006.jpg',
    category: '户外',
    stock: 25,
    status: 'active',
    rating: 4.8,
    sales: 0,
    description: '户外双层防雨帐篷，采用高密度防水面料和加固支架设计，抗风防雨，通风透气，搭建便捷，适合三至四人家庭或朋友露营使用，带来舒适的户外居住体验。'
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
    description: '高品质音效，长续航，智能降噪，让您享受极致的音乐体验。这款无线蓝牙耳机支持多设备连接，佩戴舒适，适合运动、通勤、学习等多种场景，带来沉浸式音乐享受。',
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
    sales: 0,
    description: '这款智能手表集成心率监测、运动追踪、睡眠分析、消息提醒等多种功能，支持防水和蓝牙通话，搭配高清触控屏幕和多种表盘选择，是健康生活与时尚穿搭的完美结合。'
  },
  {
    id: 15,
    name: '超清便携投影仪家庭影院无线投屏',
    price: 1299,
    originalPrice: 1699,
    image: 'https://th.bing.com/th/id/R.905d3dbc33d0d9145c6b2f026e705ffc?rik=dMhZBEn%2br%2fC1rg&riu=http%3a%2f%2fwww.happybate.com%2fupload%2froom%2f1497004673.jpg&ehk=LgKDl1p2HVp0vV28Ur%2bKjjS1cfmGeRsR7jdqhf6wccM%3d&risl=&pid=ImgRaw&r=0',
    category: '数码',
    stock: 30,
    status: 'active',
    description: '这款超清便携投影仪支持无线投屏，高清画质，内置音响，适合家庭影院、会议演示和户外露营，操作简单，携带方便。',
    rating: 4.9,
    sales: 0
  },
  {
    id: 16,
    name: '多功能电动牙刷智能清洁',
    price: 199,
    originalPrice: 299,
    image: 'https://th.bing.com/th/id/OIP.DkNE1Or5bmOjLeuKV4sBmQHaE0?rs=1&pid=ImgDetMain',
    category: '数码',
    stock: 80,
    status: 'active',
    description: '智能定时提醒，强力清洁，长续航，IPX7级全身防水，呵护口腔健康，适合全家使用。',
    rating: 4.7,
    sales: 0
  },
  {
    id: 17,
    name: '全自动扫地机器人智能规划吸尘拖地一体',
    price: 899,
    originalPrice: 1299,
    image: 'https://x0.ifengimg.com/cmpp/fck/2019_36/bc6ed7eeb9fcb2b_w2198_h1466.jpg',
    category: '居家',
    stock: 40,
    status: 'active',
    description: '全自动智能扫地机器人，支持多种清扫模式，自动回充，强力吸尘，湿拖一体，解放双手，居家必备。',
    rating: 4.8,
    sales: 0
  },
  {
    id: 18,
    name: '北欧风格落地灯简约现代客厅卧室灯具',
    price: 299,
    originalPrice: 399,
    image: 'https://th.bing.com/th/id/OIP.IuwszYg88v0ncy1CVS7-4AHaKt?rs=1&pid=ImgDetMain',
    category: '居家',
    stock: 60,
    status: 'active',
    description: '北欧极简风格，柔和光线，适合客厅、卧室、书房等多种场景，提升家居格调。',
    rating: 4.5,
    sales: 0
  },
  {
    id: 19,
    name: '补水保湿面膜贴深层滋养修护肌肤',
    price: 59,
    originalPrice: 99,
    image: 'https://th.bing.com/th/id/R.9a29658d059b7d2925468baa3fa68d5d?rik=8ufMO7k3hp%2bFIg&riu=http%3a%2f%2f5b0988e595225.cdn.sohucs.com%2fimages%2f20170903%2f9d91254695964b0db4875fe400068f6f.jpeg&ehk=HVhnpYsJ5OhVPgpf5%2bGa6glEJdIOnPq7L5PMVeU5FyU%3d&risl=&pid=ImgRaw&r=0',
    category: '美妆',
    stock: 200,
    status: 'active',
    description: '深层补水，持久保湿，修护肌肤屏障，适合各种肤质，令肌肤水润透亮。',
    rating: 4.9,
    sales: 0
  },
  {
    id: 20,
    name: '多色眼影盘哑光珠光防水不晕染',
    price: 129,
    originalPrice: 169,
    image: 'https://img.alicdn.com/i3/2208626100237/O1CN01pq8X9I1DcaXRufix9_!!2208626100237.jpg',
    category: '美妆',
    stock: 120,
    status: 'active',
    description: '多色可选，粉质细腻，易晕染，持久不脱妆，适合各种妆容需求。',
    rating: 4.8,
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
