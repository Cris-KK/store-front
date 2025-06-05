
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/cart', icon: ShoppingCart, label: '购物车', badge: cartCount },
    { path: '/profile', icon: User, label: '我的' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
      <div className="flex items-center justify-around py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center py-1 px-3 relative min-w-0 flex-1">
              <div className="relative">
                <Icon className={cn(
                  "w-6 h-6 mb-1",
                  isActive ? "text-blue-600" : "text-gray-500"
                )} />
                { item.badge > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className={cn(
                "text-xs",
                isActive ? "text-blue-600" : "text-gray-500"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
