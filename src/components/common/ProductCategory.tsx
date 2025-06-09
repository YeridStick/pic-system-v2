// src/components/common/ProductCategory.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Tag, AlertCircle } from 'lucide-react';
import type { ProductCategory as ProductCategoryType } from '../../types/product';

interface ProductCategoryOption {
  value: ProductCategoryType;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}

const CATEGORY_OPTIONS: ProductCategoryOption[] = [
  {
    value: 'papeleria',
    label: 'Papelería',
    icon: '📝',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    description: 'Artículos de oficina y escritura'
  },
  {
    value: 'alimentos',
    label: 'Alimentos',
    icon: '🍎',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
    description: 'Productos alimenticios'
  },
  {
    value: 'semillas',
    label: 'Semillas',
    icon: '🌱',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
    description: 'Semillas y productos agrícolas'
  },
  {
    value: 'aseo',
    label: 'Aseo y Limpieza',
    icon: '🧽',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50 border-pink-200',
    description: 'Productos de limpieza e higiene'
  },
  {
    value: 'otros',
    label: 'Otros',
    icon: '📦',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50 border-gray-200',
    description: 'Otros productos diversos'
  }
];

interface ProductCategoryProps {
  value: ProductCategoryType;
  onChange: (category: ProductCategoryType) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
}

export const ProductCategory: React.FC<ProductCategoryProps> = ({
  value,
  onChange,
  error,
  disabled = false,
  placeholder = 'Seleccionar categoría...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = CATEGORY_OPTIONS.find(option => option.value === value);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar navegación por teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleSelect(CATEGORY_OPTIONS[highlightedIndex].value);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            prev < CATEGORY_OPTIONS.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : CATEGORY_OPTIONS.length - 1
          );
        }
        break;
    }
  };

  const handleSelect = (categoryValue: ProductCategoryType) => {
    onChange(categoryValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const toggleOpen = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div ref={selectRef} className="relative">
      {/* Select Button */}
      <button
        type="button"
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`
          relative w-full px-4 py-3 text-left border-2 rounded-lg transition-all duration-200
          focus:ring-2 focus:ring-purple-500/20 focus:outline-none
          ${error 
            ? 'border-red-300 bg-red-50' 
            : isOpen 
              ? 'border-purple-500 bg-white shadow-lg' 
              : 'border-gray-200 bg-white hover:border-gray-300'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="category-label"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedOption ? (
              <>
                <span className="text-lg">{selectedOption.icon}</span>
                <div>
                  <span className="block text-sm font-medium text-gray-900">
                    {selectedOption.label}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {selectedOption.description}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Tag className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500">{placeholder}</span>
              </>
            )}
          </div>
          
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-2 flex items-center text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
          <ul
            ref={listRef}
            role="listbox"
            className="py-2 max-h-60 overflow-y-auto"
          >
            {CATEGORY_OPTIONS.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                onClick={() => handleSelect(option.value)}
                className={`
                  px-4 py-3 cursor-pointer transition-all duration-150
                  ${highlightedIndex === index 
                    ? 'bg-purple-50 border-l-4 border-purple-500' 
                    : 'hover:bg-gray-50'
                  }
                  ${value === option.value ? 'bg-purple-100' : ''}
                `}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{option.icon}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {option.label}
                        </span>
                        {value === option.value && (
                          <Check className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {option.description}
                      </span>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className={`
                    px-2 py-1 rounded-full text-xs font-medium border
                    ${option.bgColor} ${option.color}
                  `}>
                    {option.label}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};