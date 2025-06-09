import React from 'react';
import { Package, DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { ExportButton } from './ExportButton';

export const ProductSummary: React.FC = () => {
  const { getBudgetSummary, productos } = useProductStore();
  const summary = getBudgetSummary();

  if (productos.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-soft overflow-hidden">
      {/* Header con título y botón de exportación */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">📊 Resumen del Presupuesto</h3>
          <ExportButton />
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Items */}
          <div className="summary-card border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="summary-card-title text-blue-600">Total Items</h4>
                <div className="summary-card-value text-blue-600">
                  {summary.totalItems}
                </div>
              </div>
              <Package className="w-8 h-8 text-blue-500 opacity-80" />
            </div>
          </div>

          {/* Presupuesto Actual */}
          <div className="summary-card border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="summary-card-title text-green-600">Presupuesto Actual</h4>
                <div className="summary-card-value text-green-600 text-lg">
                  {formatCurrency(summary.presupuestoActual)}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500 opacity-80" />
            </div>
          </div>

          {/* Costo Total */}
          <div className="summary-card border-l-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="summary-card-title text-orange-600">Costo Total</h4>
                <div className="summary-card-value text-orange-600 text-lg">
                  {formatCurrency(summary.costoTotal)}
                </div>
              </div>
              <Calculator className="w-8 h-8 text-orange-500 opacity-80" />
            </div>
          </div>

          {/* Margen Promedio */}
          <div className="summary-card border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="summary-card-title text-purple-600">Margen Promedio</h4>
                <div className="summary-card-value text-purple-600">
                  {formatPercentage(summary.margenPromedio)}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <span className="text-gray-600">Ganancia Estimada:</span>
              <div className="font-bold text-green-600 text-lg">
                {formatCurrency(summary.presupuestoActual - summary.costoTotal)}
              </div>
            </div>
            <div className="text-center">
              <span className="text-gray-600">Precio Promedio por Item:</span>
              <div className="font-bold text-blue-600 text-lg">
                {formatCurrency(summary.totalItems > 0 ? summary.presupuestoActual / summary.totalItems : 0)}
              </div>
            </div>
            <div className="text-center">
              <span className="text-gray-600">Costo Promedio por Item:</span>
              <div className="font-bold text-orange-600 text-lg">
                {formatCurrency(summary.totalItems > 0 ? summary.costoTotal / summary.totalItems : 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};