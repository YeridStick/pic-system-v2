import React from 'react';
import { ProductForm } from './ProductForm';
import { ProductFilters } from './ProductFilters';
import { ProductTable } from './ProductTable';
import { ProductModal } from './ProductModal';
import { ProductViewModal } from './ProductViewModal';
import { ProductImportModal } from './ProductImportModal';
import { useUIStore } from '../../stores/uiStore';

export const ProductsTab: React.FC = () => {
  const { modal } = useUIStore();

  return (
    <div>
      <ProductForm />
      <ProductFilters />
      <ProductTable />
      {modal.isOpen && modal.type === 'edit' && <ProductModal />}
      {modal.isOpen && modal.type === 'view' && <ProductViewModal />}
      {modal.isOpen && modal.type === 'import' && <ProductImportModal />}
    </div>
  );
};