import React from 'react';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import type { ProductCategory as ProductCategoryType } from '../../types';

interface ProductCategoryBadgeProps {
  category: ProductCategoryType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outlined';
  className?: string;
}

export const ProductCategoryBadge: React.FC<ProductCategoryBadgeProps> = ({
  category,
  size = 'md',
  variant = 'filled',
  className = ''
}) => {
  const categoryInfo = PRODUCT_CATEGORIES.find(c => c.value === category);
  
  if (!categoryInfo) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const variantClasses = {
    filled: 'bg-primary-100 text-primary-800',
    outlined: 'border border-primary-200 text-primary-700 bg-white'
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full font-medium
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {categoryInfo.label}
    </span>
  );
};