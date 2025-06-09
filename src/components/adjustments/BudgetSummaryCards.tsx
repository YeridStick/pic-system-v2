// src/components/adjustments/BudgetSummaryCards.tsx
import React from 'react';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Calculator,
  Target,
  PieChart
} from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateBudgetStatistics } from '../../utils/calculations';

export const BudgetSummaryCards: React.FC = () => {
  const { productos } = useProductStore();
  const stats = calculateBudgetStatistics(productos);

  const cards = [
    {
      title: 'Total Items',
      value: stats.totalItems.toString(),
      icon: Package,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      description: 'Productos registrados'
    },
    {
      title: 'Presupuesto Actual',
      value: formatCurrency(stats.presupuestoActual),
      icon: DollarSign,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      description: 'Valor total del presupuesto'
    },
    {
      title: 'Costo Total',
      value: formatCurrency(stats.costoTotal),
      icon: Calculator,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      description: 'Suma de todos los costos'
    },
    {
      title: 'Margen Promedio',
      value: formatPercentage(stats.margenPromedio),
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      description: 'Ganancia promedio'
    }
  ];

  // Información adicional
  const additionalInfo = [
    {
      title: 'Producto Más Caro',
      value: stats.productoMasCaro && stats.productoMasCaro.nombre
        ? `${stats.productoMasCaro.nombre.substring(0, 20)}...`
        : 'N/A',
      subtitle: stats.productoMasCaro && stats.productoMasCaro.valor
        ? formatCurrency(stats.productoMasCaro.valor)
        : '',
      icon: Target,
      color: 'bg-gradient-to-br from-red-500 to-pink-500'
    },
    {
      title: 'Categoría Principal',
      value: (() => {
        if (!stats.distribucionCategorias || Object.keys(stats.distribucionCategorias).length === 0) {
          return 'N/A';
        }
        
        const categorias = Object.entries(stats.distribucionCategorias);
        const principal = categorias.reduce((max, [cat, data]) => 
          data.presupuestoTotal > (max[1]?.presupuestoTotal || 0) ? [cat, data] : max
        );
        return principal[0] ? principal[0].toUpperCase() : 'N/A';
      })(),
      subtitle: (() => {
        if (!stats.distribucionCategorias || Object.keys(stats.distribucionCategorias).length === 0) {
          return '';
        }
        
        const categorias = Object.entries(stats.distribucionCategorias);
        const principal = categorias.reduce((max, [cat, data]) => 
          data.presupuestoTotal > (max[1]?.presupuestoTotal || 0) ? [cat, data] : max
        );
        return principal[1] ? formatPercentage(principal[1].porcentajeDelTotal) : '';
      })(),
      icon: PieChart,
      color: 'bg-gradient-to-br from-indigo-500 to-blue-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl bg-white p-6 shadow-soft border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              {/* Fondo con gradiente */}
              <div className={`absolute top-0 right-0 w-20 h-20 ${card.color} rounded-full transform translate-x-8 -translate-y-8 opacity-10`} />
              
              {/* Icono */}
              <div className={`inline-flex items-center justify-center w-12 h-12 ${card.color} rounded-lg mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Contenido */}
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {additionalInfo.map((info, index) => {
          const Icon = info.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-xl bg-white p-6 shadow-soft border border-gray-100"
            >
              {/* Fondo decorativo */}
              <div className={`absolute top-0 right-0 w-16 h-16 ${info.color} rounded-full transform translate-x-6 -translate-y-6 opacity-15`} />
              
              <div className="flex items-center space-x-4">
                {/* Icono */}
                <div className={`flex-shrink-0 w-10 h-10 ${info.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {info.title}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 truncate">
                    {info.value}
                  </p>
                  {info.subtitle && (
                    <p className="text-sm text-gray-500">
                      {info.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Distribución por categorías */}
      {productos.length > 0 && stats.distribucionCategorias && (
        <div className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
            Distribución por Categorías
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(stats.distribucionCategorias)
              .filter(([, data]) => data.presupuestoTotal > 0)
              .map(([categoria, data]) => (
                <div key={categoria} className="text-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(data.porcentajeDelTotal, 100)}%` }}
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {categoria}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatPercentage(data.porcentajeDelTotal)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatCurrency(data.presupuestoTotal)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {productos.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-300">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay productos registrados
          </h3>
          <p className="text-gray-600">
            Agrega algunos productos para ver las estadísticas del presupuesto
          </p>
        </div>
      )}
    </div>
  );
};