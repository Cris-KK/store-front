
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from './useCart';
import { Address } from './useAddress';

export interface Order {
  id: string;
  userId: string; // 添加用户ID字段
  items: CartItem[];
  totalPrice: number;
  originalPrice?: number; // 原始价格
  couponDiscount?: number; // 优惠券折扣金额
  couponId?: string; // 使用的优惠券ID
  status: '待支付' | '待发货' | '已发货' | '已完成';
  createTime: string;
  paymentMethod?: string;
  shippingAddress?: Address;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  const getOrdersKey = () => {
    return user ? `orders_${user.id}` : 'orders_guest';
  };

  // 获取所有订单的新方法
  const getAllOrdersFromStorage = (): Order[] => {
    try {
      const allOrders: Order[] = [];
      const keys = Object.keys(localStorage).filter(key => key.startsWith('orders_'));

      keys.forEach(key => {
        const orderData = localStorage.getItem(key);
        if (orderData) {
          const userOrders = JSON.parse(orderData);
          allOrders.push(...userOrders);
        }
      });

      return allOrders.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    } catch (error) {
      console.error('获取所有订单失败:', error);
      return [];
    }
  };

  useEffect(() => {
    try {
      const ordersKey = getOrdersKey();
      const savedOrders = localStorage.getItem(ordersKey);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        console.log('从localStorage加载订单数据:', parsedOrders);
        setOrders(parsedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('加载订单数据失败:', error);
      const ordersKey = getOrdersKey();
      localStorage.removeItem(ordersKey);
      setOrders([]);
    }
  }, [user]);

  const saveToStorage = (orderList: Order[]) => {
    try {
      const ordersKey = getOrdersKey();
      console.log('保存订单数据到localStorage:', orderList, 'key:', ordersKey);
      localStorage.setItem(ordersKey, JSON.stringify(orderList));
      setOrders(orderList);
    } catch (error) {
      console.error('保存订单数据失败:', error);
    }
  };

  const createOrder = (items: CartItem[], paymentMethod: string = '微信支付', shippingAddress?: Address): string => {
    const orderId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 更新商品 sales
    try {
      const productsStr = localStorage.getItem('products');
      if (productsStr) {
        const products = JSON.parse(productsStr);
        items.forEach(item => {
          const prod = products.find((p: any) => p.id === item.id);
          if (prod) {
            prod.sales = (prod.sales || 0) + (item.quantity || 1);
          }
        });
        localStorage.setItem('products', JSON.stringify(products));
      }
    } catch (error) {
      console.error('更新商品销量失败:', error);
    }

    const newOrder: Order = {
      id: orderId,
      userId: user?.id || 'guest',
      items: items.map(item => ({ ...item, selected: true })),
      totalPrice,
      status: '待支付',
      createTime: new Date().toLocaleString(),
      paymentMethod,
      shippingAddress
    };

    const updatedOrders = [newOrder, ...orders];
    saveToStorage(updatedOrders);

    return orderId;
  };

  // 全局更新订单状态的方法
  const updateOrderStatusGlobally = (orderId: string, status: Order['status']) => {
    console.log('全局更新订单状态:', orderId, status);

    // 获取所有订单数据
    const keys = Object.keys(localStorage).filter(key => key.startsWith('orders_'));

    keys.forEach(key => {
      try {
        const orderData = localStorage.getItem(key);
        if (orderData) {
          const userOrders = JSON.parse(orderData);
          const updatedOrders = userOrders.map((order: Order) =>
            order.id === orderId ? { ...order, status } : order
          );

          // 检查是否有更新
          const hasUpdates = userOrders.some((order: Order, index: number) =>
            order.id === orderId && updatedOrders[index].status !== order.status
          );

          if (hasUpdates) {
            localStorage.setItem(key, JSON.stringify(updatedOrders));
            console.log('订单状态更新成功:', key, orderId, status);
          }
        }
      } catch (error) {
        console.error('更新订单状态失败:', key, error);
      }
    });

    // 更新当前用户的订单状态
    const updatedOrders = orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    );
    setOrders(updatedOrders);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatusGlobally(orderId, status);
  };

  const getOrderById = (orderId: string): Order | undefined => {
    // 首先从当前用户订单中查找
    let order = orders.find(order => order.id === orderId);

    // 如果没有找到，从所有用户订单中查找
    if (!order) {
      const allOrders = getAllOrdersFromStorage();
      order = allOrders.find(o => o.id === orderId);

      if (order) {
        console.log('从全局订单中找到:', orderId);
      }
    }

    console.log('查找订单:', orderId, order ? '找到' : '未找到');
    return order;
  };

  const getAllOrders = (): Order[] => {
    return getAllOrdersFromStorage();
  };

  return {
    orders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getAllOrders,
    updateOrderStatusGlobally
  };
};
