
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, MapPin } from 'lucide-react';
import { useAddress, Address } from '@/hooks/useAddress';
import { toast } from 'sonner';

interface AddressSelectorProps {
  selectedAddress?: Address;
  onAddressSelect: (address: Address) => void;
  showAddButton?: boolean;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  selectedAddress,
  onAddressSelect,
  showAddButton = true
}) => {
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    isDefault: false
  });

  const { addresses, addAddress } = useAddress();

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      toast.error('请填写完整的地址信息');
      return;
    }

    addAddress(newAddress);
    toast.success('地址添加成功');
    setShowAddDialog(false);
    setNewAddress({
      name: '',
      phone: '',
      address: '',
      isDefault: false
    });
  };

  const handleSelectAddress = (address: Address) => {
    onAddressSelect(address);
    setShowAddressDialog(false);
    toast.success('地址选择成功');
  };

  return (
    <>
      <div className="space-y-3">
        {selectedAddress ? (
          <Card className="cursor-pointer" onClick={() => setShowAddressDialog(true)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{selectedAddress.name}</span>
                    <span className="text-gray-600">{selectedAddress.phone}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{selectedAddress.address}</p>
                </div>
                <Button variant="outline" size="sm">
                  更换
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="cursor-pointer border-dashed" onClick={() => setShowAddressDialog(true)}>
            <CardContent className="p-4 text-center">
              <p className="text-gray-500">请选择收货地址</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 地址选择对话框 */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>选择收货地址</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {addresses.map((address) => (
              <Card 
                key={address.id} 
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedAddress?.id === address.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleSelectAddress(address)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{address.name}</span>
                      <span className="text-gray-600 text-sm">{address.phone}</span>
                    </div>
                    {address.isDefault && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        默认
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{address.address}</p>
                </CardContent>
              </Card>
            ))}
            
            {showAddButton && (
              <Card 
                className="cursor-pointer border-dashed hover:bg-gray-50" 
                onClick={() => setShowAddDialog(true)}
              >
                <CardContent className="p-3 text-center">
                  <div className="flex items-center justify-center space-x-2 text-gray-500">
                    <Plus className="w-4 h-4" />
                    <span>添加新地址</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 添加地址对话框 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>添加收货地址</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">收货人</Label>
                <Input
                  id="name"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                  placeholder="请输入收货人姓名"
                />
              </div>
              <div>
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                  placeholder="请输入手机号"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">详细地址</Label>
              <Input
                id="address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                placeholder="请输入详细地址"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isDefault"
                checked={newAddress.isDefault}
                onCheckedChange={(checked) => setNewAddress({...newAddress, isDefault: checked})}
              />
              <Label htmlFor="isDefault">设为默认地址</Label>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowAddDialog(false)}
              >
                取消
              </Button>
              <Button 
                className="flex-1"
                onClick={handleAddAddress}
              >
                保存地址
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddressSelector;
