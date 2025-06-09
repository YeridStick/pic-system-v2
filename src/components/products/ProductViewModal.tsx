// src/components/products/ProductViewModal.tsx
import React, { useEffect } from 'react';
import { 
  X, 
  Package, 
  Hash, 
  DollarSign, 
  TrendingUp, 
  Tag, 
  Info,
  Eye,
  Calculator,
  CheckCircle2
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import type { Product, TaxConfig, AdditionalCost } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { ProductCategoryBadge } from '../common/ProductCategoryBadge';
import { Button } from '../common/Button';

export const ProductViewModal: React.FC = () => {
  const { modal, closeModal } = useUIStore();

  // Manejar tecla Escape
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

  if (!modal.isOpen || modal.type !== 'view' || !modal.data) return null;

  const product = modal.data as Product;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Calcular métricas adicionales
  const subtotalCosto = product.valorCosto * product.cantidad;
  const subtotalTotal = product.valorTotal * product.cantidad;
  const gananciaBruta = subtotalTotal - subtotalCosto;

  // Helper para obtener la tasa de impuesto por tipo
  const getTaxRate = (type: TaxConfig['type']) => {
    return product.impuestos?.find(t => t.type === type && t.enabled)?.rate ?? 0;
  };

  // Helper para obtener el total de otros impuestos
  const getOtherTaxes = () => {
    return product.impuestos
      ?.filter(t => t.type !== 'iva' && t.type !== 'consumo' && t.enabled) || [];
  };

  // Helper para obtener los costos adicionales
  const getAdditionalCosts = () => {
    return product.costosAdicionales?.filter(c => c.enabled) || [];
  };

  const hasTaxesOrCosts = (product.impuestos && product.impuestos.some(t => t.enabled)) ||
                          (product.costosAdicionales && product.costosAdicionales.some(c => c.enabled));

  return (
    <>
      {/* Backdrop con blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center p-6 animate-fade-in overflow-auto"
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <div 
          className="relative rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col animate-scale-up transform transition-all duration-300"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          {/* Header con gradiente */}
          <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Detalles del Producto</h2>
                  <p className="text-indigo-100 mt-1">
                    Información completa y análisis financiero
                  </p>
                </div>
              </div>
              
              {/* Botón cerrar mejorado */}
              <button
                onClick={closeModal}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 group"
                title="Cerrar modal (Esc)"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
            
            {/* Información del producto actual */}
            <div className="mt-4 p-4 bg-white/10 rounded-lg">
              <p className="text-sm text-indigo-100 mb-1">Producto:</p>
              <p className="font-semibold truncate">{product.producto}</p>
            </div>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-grow p-6 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Información básica */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Información Básica
                  </h3>
                  
                  <div className="space-y-4">
                    <InfoField
                      icon={<Hash className="w-5 h-5 text-blue-600" />}
                      label="Número de Item"
                      value={`#${product.item}`}
                    />
                    
                    <InfoField
                      icon={<Info className="w-5 h-5 text-green-600" />}
                      label="Presentación"
                      value={product.presentacion}
                    />
                    
                    <InfoField
                      icon={<Package className="w-5 h-5 text-purple-600" />}
                      label="Cantidad"
                      value={`${product.cantidad} unidades`}
                    />
                    
                    {/* Categoría */}
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Tag className="w-5 h-5 text-orange-600 mr-3" />
                          <span className="text-sm font-medium text-orange-700">Categoría</span>
                        </div>
                        <ProductCategoryBadge 
                          category={product.categoria}
                          size="md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información financiera */}
              <div className="space-y-6">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Análisis Financiero
                  </h3>
                  
                  <div className="space-y-4">
                    <InfoField
                      icon={<DollarSign className="w-5 h-5 text-red-600" />}
                      label="Valor Costo (Unitario)"
                      value={formatCurrency(product.valorCosto)}
                    />
                    
                    <InfoField
                      icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
                      label="Margen de Ganancia"
                      value={formatPercentage(product.margen)}
                    />
                    
                    <InfoField
                      icon={<DollarSign className="w-5 h-5 text-green-600" />}
                      label="Valor Total (Unitario)"
                      value={formatCurrency(product.valorTotal)}
                    />
                    
                    <InfoField
                      icon={<Calculator className="w-5 h-5 text-purple-600" />}
                      label="Ganancia por Unidad"
                      value={formatCurrency(product.valorTotal - product.valorCosto)}
                    />
                  </div>
                </div>

                {/* Resumen financiero total */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                    <Calculator className="w-5 h-5 mr-2" />
                    Resumen Total
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 border border-purple-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Costo Total:</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(subtotalCosto)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Presupuesto Total:</span>
                        <span className="font-medium text-blue-600">
                          {formatCurrency(subtotalTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-purple-200 pt-3">
                        <span className="text-sm font-semibold text-gray-700">Ganancia Bruta:</span>
                        <span className="font-bold text-green-600 text-lg">
                          {formatCurrency(gananciaBruta)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Impuestos y Costos Adicionales */}
                {hasTaxesOrCosts && (
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
                      <Tag className="w-5 h-5 mr-2" />
                      Impuestos y Costos Adicionales
                    </h3>
                    <div className="space-y-4">
                      {getTaxRate('iva') > 0 && (
                        <InfoField
                          icon={<CheckCircle2 className="w-5 h-5 text-yellow-600" />}
                          label="IVA"
                          value={formatPercentage(getTaxRate('iva'))}
                        />
                      )}
                      {getTaxRate('consumo') > 0 && (
                        <InfoField
                          icon={<CheckCircle2 className="w-5 h-5 text-yellow-600" />}
                          label="Impuesto al Consumo"
                          value={formatPercentage(getTaxRate('consumo'))}
                        />
                      )}
                      {getOtherTaxes().length > 0 && getOtherTaxes().map((tax, i) => (
                        <InfoField
                          key={i}
                          icon={<CheckCircle2 className="w-5 h-5 text-yellow-600" />}
                          label={`Otro Impuesto (${tax.description})`}
                          value={formatPercentage(tax.rate)}
                        />
                      ))}
                      {getAdditionalCosts().length > 0 && getAdditionalCosts().map((cost: AdditionalCost, i) => (
                        <InfoField
                          key={i}
                          icon={<CheckCircle2 className="w-5 h-5 text-yellow-600" />}
                          label={`Costo Adicional (${cost.description})`}
                          value={formatCurrency(cost.value)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Fórmulas aplicadas */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Fórmulas Aplicadas
                  </h3>
                  
                  <div className="space-y-3">
                    <FormulaCard
                      title="Valor Total Unitario"
                      formula="Valor Costo × (1 + Margen/100)"
                      example={`${formatCurrency(product.valorCosto)} × (1 + ${product.margen}%/100)`}
                      result={formatCurrency(product.valorTotal)}
                    />
                    
                    <FormulaCard
                      title="Presupuesto Total"
                      formula="Valor Total × Cantidad"
                      example={`${formatCurrency(product.valorTotal)} × ${product.cantidad}`}
                      result={formatCurrency(subtotalTotal)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con acciones */}
          <div className="flex-shrink-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-4 rounded-b-2xl mb-4">
            <Button
              variant="secondary"
              onClick={closeModal}
              size="md"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

// Componente para tarjetas de información
interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ icon, label, value }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 transition-all duration-200 hover:shadow-md hover:scale-105">
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-lg font-semibold text-gray-900 truncate">{value}</p>
      </div>
    </div>
  </div>
);

// Componente para fórmulas
interface FormulaCardProps {
  title: string;
  formula: string;
  example: string;
  result: string;
}

const FormulaCard: React.FC<FormulaCardProps> = ({ title, formula, example, result }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200">
    <h6 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h6>
    <div className="space-y-2 text-xs">
      <div>
        <span className="text-gray-600">Fórmula: </span>
        <code className="bg-gray-100 px-2 py-1 rounded text-gray-800 text-xs">{formula}</code>
      </div>
      <div>
        <span className="text-gray-600">Ejemplo: </span>
        <span className="text-gray-800">{example}</span>
      </div>
      <div>
        <span className="text-gray-600">Resultado: </span>
        <span className="font-bold text-green-600">{result}</span>
      </div>
    </div>
  </div>
);