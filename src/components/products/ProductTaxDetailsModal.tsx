import React, { useEffect } from 'react';
import { X, DollarSign, Tag, ListChecks } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import type { Product, TaxConfig, AdditionalCost } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Button } from '../common/Button';

export const ProductTaxDetailsModal: React.FC = () => {
  const { modal, closeModal } = useUIStore();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (modal.isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modal.isOpen, closeModal]);

  if (!modal.isOpen || modal.type !== 'viewTaxDetails' || !modal.data) return null;

  const product = modal.data as Product;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const renderTaxItem = (tax: TaxConfig) => (
    <div key={tax.type} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
      <span className="font-medium text-gray-800">{tax.description}</span>
      <span className="text-green-600 font-semibold">{formatPercentage(tax.rate)}</span>
    </div>
  );

  const renderCostItem = (cost: AdditionalCost) => (
    <div key={cost.type} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
      <span className="font-medium text-gray-800">{cost.description}</span>
      <span className="text-blue-600 font-semibold">{formatCurrency(cost.value)}</span>
    </div>
  );

  const totalImpuestosRate = product.impuestos?.filter(t => t.enabled).reduce((sum, t) => sum + t.rate, 0) || 0;
  const totalCostosAdicionalesValue = product.costosAdicionales?.filter(c => c.enabled).reduce((sum, c) => sum + c.value, 0) || 0;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col transform scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center">
            <ListChecks className="w-7 h-7 mr-3" />
            <h2 className="text-xl font-bold">Detalles de Impuestos y Costos</h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={closeModal}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-grow p-6 bg-gray-50 overflow-y-auto space-y-6">
          {/* Sección de Impuestos */}
          <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
            <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-purple-600" />
              Impuestos Aplicados
            </h3>
            {product.impuestos && product.impuestos.filter(t => t.enabled).length > 0 ? (
              <div className="space-y-3">
                {product.impuestos.filter(t => t.enabled).map(renderTaxItem)}
              </div>
            ) : (
              <p className="text-gray-600 italic">No se han aplicado impuestos a este producto.</p>
            )}
            {product.impuestos && product.impuestos.filter(t => t.enabled).length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center font-bold text-gray-900">
                <span>Tasa Total de Impuestos:</span>
                <span className="text-xl text-purple-700">{formatPercentage(totalImpuestosRate)}</span>
              </div>
            )}
          </div>

          {/* Sección de Costos Adicionales */}
          <div className="bg-white rounded-lg p-4 border border-indigo-200 shadow-sm">
            <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-indigo-600" />
              Costos Adicionales
            </h3>
            {product.costosAdicionales && product.costosAdicionales.filter(c => c.enabled).length > 0 ? (
              <div className="space-y-3">
                {product.costosAdicionales.filter(c => c.enabled).map(renderCostItem)}
              </div>
            ) : (
              <p className="text-gray-600 italic">No se han aplicado costos adicionales a este producto.</p>
            )}
            {product.costosAdicionales && product.costosAdicionales.filter(c => c.enabled).length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center font-bold text-gray-900">
                <span>Total Costos Adicionales:</span>
                <span className="text-xl text-indigo-700">{formatCurrency(totalCostosAdicionalesValue)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end">
          <Button onClick={closeModal} variant="secondary">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
} 