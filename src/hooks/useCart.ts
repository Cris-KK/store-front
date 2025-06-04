
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selected: boolean;
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // 获取用户特定的购物车key
  const getCartKey = () => {
    return user ? `cart_${user.id}` : 'cart_guest';
  };

  // 从 localStorage 加载购物车数据
  useEffect(() => {
    try {
      const cartKey = getCartKey();
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('从localStorage加载购物车数据:', parsedCart);
        setCartItems(parsedCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('加载购物车数据失败:', error);
      const cartKey = getCartKey();
      localStorage.removeItem(cartKey);
      setCartItems([]);
    }
  }, [user]); // 当用户变化时重新加载购物车

  // 保存到 localStorage
  const saveToStorage = (items: CartItem[]) => {
    try {
      const cartKey = getCartKey();
      console.log('保存购物车数据到localStorage:', items, 'key:', cartKey);
      localStorage.setItem(cartKey, JSON.stringify(items));
      setCartItems(items);
    } catch (error) {
      console.error('保存购物车数据失败:', error);
    }
  };

  const addToCart = (product: Omit<CartItem, 'quantity' | 'selected'>) => {
    console.log('添加商品到购物车:', product);
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      const updatedItems = cartItems.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveToStorage(updatedItems);
    } else {
      const newItem: CartItem = { ...product, quantity: 1, selected: true };
      saveToStorage([...cartItems, newItem]);
    }
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveToStorage(updatedItems);
  };

  const toggleSelect = (id: number) => {
    console.log('切换商品选中状态:', id);
    const updatedItems = cartItems.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    saveToStorage(updatedItems);
  };

  const removeItem = (id: number) => {
    console.log('删除商品:', id);
    const updatedItems = cartItems.filter(item => item.id !== id);
    saveToStorage(updatedItems);
  };

  const clearSelectedItems = () => {
    console.log('清除选中的商品');
    const updatedItems = cartItems.filter(item => !item.selected);
    saveToStorage(updatedItems);
  };

  const clearCart = () => {
    console.log('清空购物车');
    const cartKey = getCartKey();
    localStorage.removeItem(cartKey);
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  console.log('当前购物车状态:', {
    user: user?.id,
    cartItems: cartItems.length,
    selectedItems: selectedItems.length,
    totalPrice
  });

  return {
    cartItems,
    addToCart,
    updateQuantity,
    toggleSelect,
    removeItem,
    clearSelectedItems,
    clearCart,
    getCartCount,
    selectedItems,
    totalPrice
  };
};
