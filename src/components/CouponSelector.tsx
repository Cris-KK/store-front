import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Gift, Sparkles } from 'lucide-react';
import { Coupon } from '@/hooks/useCoupons';

interface CouponCardProps {
  coupon: Coupon;
  isSelected?: boolean;
  onSelect?: (coupon: Coupon) => void;
  onGenerate?: () => void;
  showGenerateButton?: boolean;
  disabled?: boolean;
}

const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  isSelected = false,
  onSelect,
  onGenerate,
  showGenerateButton = false,
  disabled = false
}) => {
  const handleSelect = () => {
    if (!disabled && onSelect) {
      onSelect(coupon);
    }
  };

  if (showGenerateButton) {
    return (
      <Card className="border-dashed border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50">
        <CardContent className="p-4 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">恭喜！获得随机优惠券</h3>
              <p className="text-sm text-gray-600">点击领取 3%-15% 随机折扣</p>
            </div>
            <Button 
              onClick={onGenerate}
              className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white"
              size="sm"
            >
              <Gift className="w-4 h-4 mr-2" />
              领取优惠券
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`transition-all cursor-pointer ${
        isSelected 
          ? 'ring-2 ring-orange-500 bg-orange-50' 
          : disabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-50'
            : 'hover:shadow-md bg-gradient-to-r from-red-50 to-orange-50'
      }`}
      onClick={handleSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onSelect && (
              <Checkbox 
                checked={isSelected} 
                disabled={disabled}
                onChange={handleSelect}
              />
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-orange-400 flex items-center justify-center">
              <Gift className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-gray-800">
                  {coupon.discountPercent}% 折扣券
                </h3>
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  省 ¥{coupon.discountAmount}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                原价 ¥{coupon.originalAmount} • {coupon.createdAt}
              </p>
            </div>
          </div>
          {coupon.isUsed && (
            <Badge variant="outline" className="text-gray-500">
              已使用
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface CouponSelectorProps {
  coupons: Coupon[];
  selectedCoupon?: Coupon;
  onCouponSelect: (coupon: Coupon | undefined) => void;
  onGenerateCoupon: () => void;
  showGenerateOption?: boolean;
  orderAmount: number;
}

const CouponSelector: React.FC<CouponSelectorProps> = ({
  coupons,
  selectedCoupon,
  onCouponSelect,
  onGenerateCoupon,
  showGenerateOption = false,
  orderAmount
}) => {
  const availableCoupons = coupons.filter(coupon => !coupon.isUsed);

  const handleCouponSelect = (coupon: Coupon) => {
    if (selectedCoupon?.id === coupon.id) {
      onCouponSelect(undefined); // 取消选择
    } else {
      onCouponSelect(coupon);
    }
  };

  return (
    <div className="space-y-3">
      {showGenerateOption && (
        <CouponCard
          coupon={{} as Coupon}
          showGenerateButton={true}
          onGenerate={onGenerateCoupon}
        />
      )}
      
      {availableCoupons.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">可用优惠券</h4>
          {availableCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              isSelected={selectedCoupon?.id === coupon.id}
              onSelect={handleCouponSelect}
            />
          ))}
        </div>
      )}

      {availableCoupons.length === 0 && !showGenerateOption && (
        <div className="text-center py-4 text-gray-500">
          <Gift className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">暂无可用优惠券</p>
        </div>
      )}
    </div>
  );
};

export { CouponCard, CouponSelector };
export default CouponSelector;
