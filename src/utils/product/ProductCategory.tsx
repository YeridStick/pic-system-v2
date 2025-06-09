import React from 'react';
import type { ProductCategory as ProductCategoryType } from '../../types';

interface ProductCategoryProps {
  value?: ProductCategoryType;
  onChange: (value: ProductCategoryType) => void;
  required?: boolean;
  error?: string;
}

export const ProductCategory: React.FC<ProductCategoryProps> = ({
  value,
  onChange,
  required,
  error,
}) => {
  const categories: ProductCategoryType[] = ['papeleria', 'alimentos', 'semillas', 'aseo', 'otros'];

  return (
    <div className="w-full">
      <div className="relative">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value as ProductCategoryType)}
          className={`w-full appearance-none bg-white border ${error ? 'border-red-400' : 'border-gray-200'} rounded-lg px-4 py-2 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm shadow-sm ${error ? 'bg-red-50' : 'hover:border-blue-300'} `}
          required={required}
        >
          <option value="" disabled>Seleccione una categoría</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        {/* Icono de flecha */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
    </div>
  );
}; 