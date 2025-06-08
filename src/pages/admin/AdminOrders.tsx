
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, ArrowLeft, Package, Eye } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { toast } from 'sonner';

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const { getAllOrders, updateOrderStatusGlobally } = useOrders();
  
  // 加载所有订单
  useEffect(() => {
    const loadAllOrders = () => {
      const orders = getAllOrders();
      console.log('管理员加载所有订单:', orders);
      setAllOrders(orders);
    };
    
    loadAllOrders();
    
    // 定期刷新订单数据
    const interval = setInterval(loadAllOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      '待支付': 'bg-yellow-500',
      '待发货': 'bg-blue-500', 
      '已发货': 'bg-green-500',
      '已完成': 'bg-gray-500'
    };
    
    return (
      <Badge className={statusColors[status] || 'bg-gray-500'}>
        {status}
      </Badge>
    );
  };

  const handleShip = async (orderId: string) => {
    try {
      console.log('管理员点击发货，订单ID:', orderId);
      
      // 使用全局更新方法
      updateOrderStatusGlobally(orderId, '已发货');
      
      toast.success('订单已发货！', { duration: 1000 });
      
      // 立即刷新订单列表
      setTimeout(() => {
        const orders = getAllOrders();
        setAllOrders(orders);
      }, 100);
      
    } catch (error) {
      console.error('发货失败:', error);
      toast.error('发货失败，请重试', { duration: 1000 });
    }
  };

  const filteredOrders = allOrders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">订单管理</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索订单号或商品名称..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>订单列表 (共 {filteredOrders.length} 个订单)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>订单号</TableHead>
                  <TableHead>用户ID</TableHead>
                  <TableHead>商品</TableHead>
                  <TableHead>金额</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>下单时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      #{order.id.slice(-8)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {order.userId || 'guest'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {order.items.slice(0, 2).map((item: any, index: number) => (
                          <div key={index} className="flex items-center space-x-1">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="text-sm truncate max-w-20">{item.name}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-xs text-gray-500">
                            等{order.items.length}件
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">¥{order.totalPrice}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {order.createTime}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Link to={`/order/${order.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {order.status === '待发货' && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleShip(order.id)}
                          >
                            <Package className="w-4 h-4 mr-1" />
                            发货
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrders;
