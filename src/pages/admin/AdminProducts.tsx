
import React, { useState, useEffect, useRef } from 'react';
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
import { Search, Plus, Edit, Trash2, ArrowLeft, Upload } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    originalPrice: 0,
    category: '',
    stock: 0,
    image: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 定义商品分类选项
  const categories = ['穿搭', '美食', '居家', '美妆', '运动', '户外', '数码'];

  // 检查管理员权限
  useEffect(() => {
    if (user === null) return; // 等 user 恢复后再判断
    if (!user || user.role !== 'vendor') {
      alert(user.role)
      toast.error('无权限访问', { duration: 1000 });
      navigate('/');
    }
  }, [user, navigate]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setProductForm({ ...productForm, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: 0,
      originalPrice: 0,
      category: '',
      stock: 0,
      image: '',
      description: ''
    });
    setImageFile(null);
    setImagePreview('');
    setShowProductDialog(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      category: product.category,
      stock: product.stock,
      image: product.image,
      description: product.description || ''
    });
    setImagePreview(product.image);
    setImageFile(null);
    setShowProductDialog(true);
  };

  const handleSubmitProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast.error('请填写完整信息', { duration: 1000 });
      return;
    }

    if (!productForm.image) {
      toast.error('请上传商品图片', { duration: 1000 });
      return;
    }

    const productData = {
      ...productForm,
      status: 'active' as const,
      rating: 4.5,
      sales: 0
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('商品更新成功', { duration: 500 });
    } else {
      addProduct(productData);
      toast.success('商品添加成功', { duration: 500 });
    }

    setShowProductDialog(false);
    
    // 强制刷新页面以显示最新商品
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleToggleStatus = (product: any) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    updateProduct(product.id, { status: newStatus });
    toast.success(`商品已${newStatus === 'active' ? '上架' : '下架'}`, { duration: 1000 });

    // 延迟刷新以确保数据同步
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('确定要删除这个商品吗？')) {
      deleteProduct(id);
      toast.success('商品删除成功', { duration: 500 });
      
      // 延迟刷新以确保数据同步
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/vendor" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">商品管理</h1>
            </div>
            
            <Button onClick={handleAddProduct}>
              <Plus className="w-4 h-4 mr-2" />
              添加商品
            </Button>
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
                placeholder="搜索商品..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>商品列表 (共 {filteredProducts.length} 个商品)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商品</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>价格</TableHead>
                  <TableHead>库存</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="font-medium">¥{product.price}</TableCell>
                    <TableCell>
                      <span className={product.stock === 0 ? 'text-red-500' : ''}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status === 'active' ? '上架' : '下架'}
                        </Badge>
                        <Switch
                          checked={product.status === 'active'}
                          onCheckedChange={() => handleToggleStatus(product)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* 商品编辑/添加弹窗 */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? '编辑商品' : '添加商品'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="name">商品名称</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                placeholder="请输入商品名称"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">售价</Label>
                <Input
                  id="price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: Number(e.target.value)})}
                  placeholder="售价"
                />
              </div>
              <div>
                <Label htmlFor="originalPrice">原价</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={productForm.originalPrice}
                  onChange={(e) => setProductForm({...productForm, originalPrice: Number(e.target.value)})}
                  placeholder="原价（可选）"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">分类</Label>
                <Select
                  value={productForm.category}
                  onValueChange={(value) => setProductForm({...productForm, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stock">库存</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({...productForm, stock: Number(e.target.value)})}
                  placeholder="库存数量"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="image">商品图片</Label>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  上传图片
                </Button>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="预览"
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="description">商品描述</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                placeholder="商品描述（可选）"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowProductDialog(false)}
              >
                取消
              </Button>
              <Button 
                className="flex-1"
                onClick={handleSubmitProduct}
              >
                {editingProduct ? '更新' : '添加'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
