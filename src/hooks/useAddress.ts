
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export const useAddress = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const { user } = useAuth();

  const getAddressKey = () => {
    return user ? `addresses_${user.id}` : 'addresses_guest';
  };

  useEffect(() => {
    try {
      const addressKey = getAddressKey();
      const savedAddresses = localStorage.getItem(addressKey);
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    } catch (error) {
      console.error('加载地址数据失败:', error);
      setAddresses([]);
    }
  }, [user]);

  const saveToStorage = (addressList: Address[]) => {
    try {
      const addressKey = getAddressKey();
      localStorage.setItem(addressKey, JSON.stringify(addressList));
      setAddresses(addressList);
    } catch (error) {
      console.error('保存地址数据失败:', error);
    }
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // 如果设置为默认地址，取消其他地址的默认状态
    let updatedAddresses = [...addresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
    }

    saveToStorage([...updatedAddresses, newAddress]);
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    let updatedAddresses = addresses.map(addr =>
      addr.id === id ? { ...addr, ...updates } : addr
    );

    // 如果设置为默认地址，取消其他地址的默认状态
    if (updates.isDefault) {
      updatedAddresses = updatedAddresses.map(addr =>
        addr.id === id ? addr : { ...addr, isDefault: false }
      );
    }

    saveToStorage(updatedAddresses);
  };

  const deleteAddress = (id: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    saveToStorage(updatedAddresses);
  };

  const getDefaultAddress = () => {
    return addresses.find(addr => addr.isDefault) || addresses[0];
  };

  return {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getDefaultAddress
  };
};
