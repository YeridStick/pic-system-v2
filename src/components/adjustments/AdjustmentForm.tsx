// src/components/adjustments/AdjustmentForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Settings, 
  Target, 
  Percent, 
  RotateCcw, 
  AlertTriangle,
  Calculator,
  TrendingUp
} from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { Button } from '../common/Button';
import type { AdjustmentMethodType } from '../../types/calculations';
import { calculateBasicBudgetSummary, calculateProportionalFactor } from '../../utils/calculations';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import toast from 'react-hot-toast';

// Schema de validación
const adjustmentSchema = z.object({
  method: z.enum(['proporcional', 'margen_fijo', 'por_categoria']),
  presupuestoObjetivo: z.number().min(1, 'Debe ser mayor a 0').optional(),
  margenFijo: z.number().min(0, 'No puede ser negativo').max(1000, 'Máximo 1000%').optional(),
  margenPapeleria: z.number().min(0).max(1000).optional(),
  margenAlimentos: z.number().min(0).max(1000).optional(),
  margenSemillas: z.number().min(0).max(1000).optional(),
  margenAseo: z.number().min(0).max(1000).optional(),
  margenOtros: z.number().min(0).max(1000).optional(),
});

type AdjustmentFormData = z.infer<typeof adjustmentSchema>;

export const AdjustmentForm: React.FC = () => {
  const { 
    productos, 
    applyAdjustment, 
    restoreOriginals
  } = useProductStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Usar la función que ya tienes
  const currentSummary = calculateBasicBudgetSummary(productos);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue
  } = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      method: 'proporcional',
      presupuestoObjetivo: 3000000,
      margenFijo: 18.6,
      margenPapeleria: 20,
      margenAlimentos: 15,
      margenSemillas: 25,
      margenAseo: 18,
      margenOtros: 20
    }
  });

  const watchedMethod = watch('method');
  const watchedPresupuestoObjetivo = watch('presupuestoObjetivo');

  // Calcular factor de ajuste en tiempo real
  const adjustmentFactor = React.useMemo(() => {
    if (watchedMethod === 'proporcional' && watchedPresupuestoObjetivo && currentSummary.presupuestoActual > 0) {
      return calculateProportionalFactor(watchedPresupuestoObjetivo, currentSummary.presupuestoActual);
    }
    return 1;
  }, [watchedMethod, watchedPresupuestoObjetivo, currentSummary.presupuestoActual]);

  // Manejar cambio de método
  const handleMethodChange = (method: AdjustmentMethodType) => {
    setValue('method', method);
  };

  // Aplicar ajuste
  const onSubmit = async (data: AdjustmentFormData) => {
    if (productos.length === 0) {
      toast.error('No hay productos para ajustar');
      return;
    }

    setIsLoading(true);
    
    try {
      const adjustmentMethod = {
        type: data.method,
        presupuestoObjetivo: data.presupuestoObjetivo,
        margenFijo: data.margenFijo,
        margenesPorCategoria: {
          papeleria: data.margenPapeleria || 20,
          alimentos: data.margenAlimentos || 15,
          semillas: data.margenSemillas || 25,
          aseo: data.margenAseo || 18,
          otros: data.margenOtros || 20
        }
      };

      applyAdjustment(adjustmentMethod);

      // Mensaje específico según el método
      let successMessage = '';
      switch (data.method) {
        case 'proporcional':
          successMessage = `Ajuste proporcional aplicado (factor: ${adjustmentFactor.toFixed(3)})`;
          break;
        case 'margen_fijo':
          successMessage = `Margen fijo del ${data.margenFijo}% aplicado a todos los productos`;
          break;
        case 'por_categoria':
          successMessage = 'Márgenes por categoría aplicados correctamente';
          break;
      }

      toast.success(successMessage);
    } catch (error) {
      toast.error('Error al aplicar ajuste');
      console.error('Error aplicando ajuste:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Restaurar originales
  const handleRestoreOriginals = () => {
    if (productos.length === 0) {
      toast.error('No hay datos originales para restaurar');
      return;
    }

    restoreOriginals();
    toast.success('Datos originales restaurados');
  };

  return (
    <div className="space-y-6">
      {/* Información actual */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center mb-4">
          <Calculator className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-900">
            Estado Actual del Presupuesto
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-blue-600 font-medium">Presupuesto Total</p>
            <p className="text-xl font-bold text-blue-900">
              {formatCurrency(currentSummary.presupuestoActual)}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">Costo Total</p>
            <p className="text-xl font-bold text-blue-900">
              {formatCurrency(currentSummary.costoTotal)}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium">Margen Promedio</p>
            <p className="text-xl font-bold text-blue-900">
              {formatPercentage(currentSummary.margenPromedio)}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario de ajustes */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 shadow-soft border border-gray-100">
        <div className="flex items-center mb-6">
          <Settings className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">
            Configurar Ajuste de Presupuesto
          </h3>
        </div>

        {/* Selección de método */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Método de Ajuste
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'proporcional',
                title: 'Ajuste Proporcional',
                description: 'Reduce/aumenta todos los precios por igual',
                icon: Target
              },
              {
                id: 'margen_fijo',
                title: 'Margen Fijo',
                description: 'Aplica el mismo margen a todos los productos',
                icon: Percent
              },
              {
                id: 'por_categoria',
                title: 'Por Categoría',
                description: 'Margen específico para cada categoría',
                icon: TrendingUp
              }
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = watchedMethod === method.id;
              
              return (
                <div
                  key={method.id}
                  onClick={() => handleMethodChange(method.id as AdjustmentMethodType)}
                  className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-green-500 bg-green-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="flex items-center mb-2">
                    <Icon className={`w-5 h-5 mr-2 ${isSelected ? 'text-green-600' : 'text-gray-500'}`} />
                    <h4 className={`font-medium ${isSelected ? 'text-green-900' : 'text-gray-900'}`}>
                      {method.title}
                    </h4>
                  </div>
                  <p className={`text-sm ${isSelected ? 'text-green-700' : 'text-gray-600'}`}>
                    {method.description}
                  </p>
                  
                  {/* Radio button visual */}
                  <div className={`
                    absolute top-4 right-4 w-4 h-4 rounded-full border-2
                    ${isSelected ? 'border-green-500 bg-green-500' : 'border-gray-300'}
                  `}>
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <input type="hidden" {...register('method')} />
        </div>

        {/* Configuración específica por método */}
        {watchedMethod === 'proporcional' && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center mb-3">
              <Target className="w-4 h-4 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900">Configuración de Ajuste Proporcional</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Presupuesto Objetivo (COP)
                </label>
                <input
                  type="number"
                  {...register('presupuestoObjetivo', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 3000000"
                />
                {errors.presupuestoObjetivo && (
                  <p className="mt-1 text-sm text-red-600">{errors.presupuestoObjetivo.message}</p>
                )}
              </div>
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-700 mb-1">Factor de Ajuste</p>
                <p className="text-lg font-bold text-blue-900">
                  {adjustmentFactor.toFixed(3)}x
                </p>
                <p className="text-xs text-blue-600">
                  {adjustmentFactor > 1 ? 'Aumento' : 'Reducción'} del{' '}
                  {Math.abs((1 - adjustmentFactor) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            {watchedPresupuestoObjetivo && (
              <div className="bg-white p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 mb-2">Vista previa del cambio:</p>
                <div className="flex justify-between text-sm">
                  <span>Actual: {formatCurrency(currentSummary.presupuestoActual)}</span>
                  <span>→</span>
                  <span className="font-semibold">Nuevo: {formatCurrency(watchedPresupuestoObjetivo)}</span>
                </div>
              </div>
            )}
            
          </div>
        )}

        {watchedMethod === 'margen_fijo' && (
          <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center mb-3">
              <Percent className="w-4 h-4 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900">Configuración de Margen Fijo</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-2">
                  Nuevo Margen Fijo (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('margenFijo', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: 18.6"
                />
                {errors.margenFijo && (
                  <p className="mt-1 text-sm text-red-600">{errors.margenFijo.message}</p>
                )}
              </div>
              
              <div className="bg-white p-3 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-700 mb-1">Impacto Estimado</p>
                <p className="text-xs text-green-600">
                  Se aplicará el mismo margen a todos los productos, 
                  manteniendo los costos base originales.
                </p>
              </div>
            </div>
          </div>
        )}

        {watchedMethod === 'por_categoria' && (
          <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center mb-3">
              <TrendingUp className="w-4 h-4 text-purple-600 mr-2" />
              <h4 className="font-medium text-purple-900">Configuración de Márgenes por Categoría</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'margenPapeleria', label: 'Papelería', color: 'blue' },
                { key: 'margenAlimentos', label: 'Alimentos', color: 'green' },
                { key: 'margenSemillas', label: 'Semillas', color: 'yellow' },
                { key: 'margenAseo', label: 'Aseo', color: 'pink' },
                { key: 'margenOtros', label: 'Otros', color: 'gray' }
              ].map((category) => (
                <div key={category.key}>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    {category.label} (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register(category.key as keyof AdjustmentFormData, { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            loading={isLoading}
            disabled={productos.length === 0}
            className="flex-1 md:flex-none bg-indigo-600"
          >
            <Settings className="w-4 h-4 mr-2" />
            Aplicar Ajuste
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleRestoreOriginals}
            disabled={productos.length === 0}
            className="flex-1 md:flex-none"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Restaurar Originales
          </Button>
        </div>

        {/* Advertencias */}
        {productos.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                No hay productos registrados. Agrega algunos productos antes de realizar ajustes.
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};