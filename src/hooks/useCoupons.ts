import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Coupon {
  id: string;
  userId: string;
  discountPercent: number; // 折扣百分比 (3-15)
  discountAmount: number; // 实际折扣金额
  originalAmount: number; // 原始金额
  isUsed: boolean;
  createdAt: string;
  orderId?: string; // 关联的订单ID
}

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const { user } = useAuth();

  const getCouponsKey = () => {
    return user ? `coupons_${user.id}` : 'coupons_guest';
  };

  useEffect(() => {
    try {
      const couponsKey = getCouponsKey();
      const savedCoupons = localStorage.getItem(couponsKey);
      if (savedCoupons) {
        const parsedCoupons = JSON.parse(savedCoupons);
        setCoupons(parsedCoupons);
      } else {
        setCoupons([]);
      }
    } catch (error) {
      console.error('加载优惠券数据失败:', error);
      setCoupons([]);
    }
  }, [user]);

  const saveToStorage = (couponList: Coupon[]) => {
    try {
      const couponsKey = getCouponsKey();
      localStorage.setItem(couponsKey, JSON.stringify(couponList));
      setCoupons(couponList);
    } catch (error) {
      console.error('保存优惠券数据失败:', error);
    }
  };

  // 生成随机优惠券
  const generateRandomCoupon = (orderAmount: number): Coupon => {
    const discountPercent = Math.floor(Math.random() * 13) + 3; // 3-15%
    const discountAmount = Math.floor(orderAmount * discountPercent / 100);
    
    const coupon: Coupon = {
      id: `coupon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user?.id || 'guest',
      discountPercent,
      discountAmount,
      originalAmount: orderAmount,
      isUsed: false,
      createdAt: new Date().toLocaleString()
    };

    const updatedCoupons = [coupon, ...coupons];
    saveToStorage(updatedCoupons);

    return coupon;
  };

  // 使用优惠券
  const useCoupon = (couponId: string, orderId: string) => {
    const updatedCoupons = coupons.map(coupon =>
      coupon.id === couponId ? { ...coupon, isUsed: true, orderId } : coupon
    );
    saveToStorage(updatedCoupons);
    
    return updatedCoupons.find(c => c.id === couponId);
  };

  // 获取可用的优惠券
  const getAvailableCoupons = () => {
    return coupons.filter(coupon => !coupon.isUsed);
  };

  // 获取已使用的优惠券
  const getUsedCoupons = () => {
    return coupons.filter(coupon => coupon.isUsed);
  };

  return {
    coupons,
    generateRandomCoupon,
    useCoupon,
    getAvailableCoupons,
    getUsedCoupons
  };
};
