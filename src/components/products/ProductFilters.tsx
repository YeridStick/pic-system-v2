import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { ProductCategory } from '../common/ProductCategory';
import type { ProductCategory as ProductCategoryType } from '../../types';

export const ProductFilters: React.FC = () => {
  const { filtros, setFiltros } = useProductStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiltros({ busqueda: e.target.value });
  };

  const handleCategoryChange = (categoria: ProductCategoryType) => {
    setFiltros({ categoria });
  };

  const handleClearFilters = () => {
    setFiltros({ busqueda: '', categoria: '' });
  };

  return (
    <div className="card-modern p-4 fade-in">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex-1 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={filtros.busqueda}
              onChange={handleSearchChange}
              placeholder="Buscar productos..."
              className="form-input pl-10 w-full h-10 rounded block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
            />
          </div>
        </div>

        <div className="w-full md:w-64">
          <ProductCategory
            value={filtros.categoria as ProductCategoryType}
            onChange={handleCategoryChange}
          />
        </div>

        {(filtros.busqueda || filtros.categoria) && (
          <button
            onClick={handleClearFilters}
            className="btn-modern-secondary whitespace-nowrap"
          >
            <Filter className="w-4 h-4 mr-2" />
            Limpiar Filtros
          </button>
        )}
      </div>
    </div>
  );
};