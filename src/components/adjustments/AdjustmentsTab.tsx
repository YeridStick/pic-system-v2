import React from 'react';
import { Settings, Target, Info } from 'lucide-react';
import { BudgetSummaryCards } from './BudgetSummaryCards';
import { AdjustmentForm } from './AdjustmentForm';

export const AdjustmentsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-lg mr-4">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Ajustes de Presupuesto</h1>
              <p className="text-white/90">
                Modifica y optimiza tu presupuesto con diferentes métodos de ajuste
              </p>
            </div>
          </div>
          
          {/* Decoración */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 gap-2 opacity-20">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-white rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Información importante */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Cómo funcionan los ajustes:</p>
            <ul className="space-y-1 list-disc list-inside text-blue-700">
              <li><strong>Ajuste Proporcional:</strong> Multiplica todos los precios por un factor para alcanzar el presupuesto objetivo</li>
              <li><strong>Margen Fijo:</strong> Aplica el mismo porcentaje de ganancia a todos los productos</li>
              <li><strong>Por Categoría:</strong> Permite configurar márgenes específicos para cada tipo de producto</li>
            </ul>
            <p className="mt-2 text-xs">
              💡 <strong>Tip:</strong> Siempre puedes restaurar los valores originales si no estás satisfecho con los cambios.
            </p>
          </div>
        </div>
      </div>

      {/* Resumen del presupuesto */}
      <section>
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 text-gray-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            Resumen del Presupuesto Actual
          </h2>
        </div>
        <BudgetSummaryCards />
      </section>

      {/* Formulario de ajustes */}
      <section>
        <AdjustmentForm />
      </section>

      {/* Información adicional */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          💡 Consejos para Ajustar el Presupuesto
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">🎯 Ajuste Proporcional</h4>
            <p className="text-sm text-gray-600">
              Ideal cuando necesitas reducir o aumentar el presupuesto total 
              manteniendo las proporciones entre productos.
            </p>
            <p className="text-xs text-gray-500">
              Ejemplo: Reducir todo el presupuesto en un 25%
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">📊 Margen Fijo</h4>
            <p className="text-sm text-gray-600">
              Perfecto cuando quieres estandarizar la ganancia de todos 
              los productos al mismo porcentaje.
            </p>
            <p className="text-xs text-gray-500">
              Ejemplo: Aplicar 20% de margen a todo
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-800">🏷️ Por Categoría</h4>
            <p className="text-sm text-gray-600">
              Óptimo cuando diferentes tipos de productos requieren 
              márgenes específicos según su naturaleza.
            </p>
            <p className="text-xs text-gray-500">
              Ejemplo: Papelería 25%, Alimentos 15%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};