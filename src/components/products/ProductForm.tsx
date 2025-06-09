// src/components/products/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Package, 
  Calculator, 
  Plus, 
  RefreshCw, 
  Upload,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  Hash
} from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { useUIStore } from '../../stores/uiStore';
import { ProductCategory } from '../../utils/product/ProductCategory';
import { calculateTotalValue } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';
import type { Product, ProductCategory as ProductCategoryType } from '../../types';

// Schema de validación con Zod
const productSchema = z.object({
  producto: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  cantidad: z.number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .max(10000, 'La cantidad es demasiado alta'),
  presentacion: z.string()
    .min(2, 'La presentación debe tener al menos 2 caracteres')
    .max(50, 'La presentación no puede exceder 50 caracteres'),
  categoria: z.enum(['papeleria', 'alimentos', 'semillas', 'aseo', 'otros']),
  valorCosto: z.number()
    .min(0.01, 'El valor debe ser mayor a 0')
    .max(999999999, 'El valor es demasiado alto'),
  margen: z.number()
    .min(0, 'El margen no puede ser negativo')
    .max(1000, 'El margen no puede exceder 1000%')
});

type ProductFormData = z.infer<typeof productSchema>;

export const ProductForm: React.FC = () => {
  const { addProduct, contadorItems, loadTestData } = useProductStore();
  const { openModal } = useUIStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isDirty }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      producto: '',
      cantidad: 1,
      presentacion: '',
      categoria: 'papeleria',
      valorCosto: 0,
      margen: 25
    },
    mode: 'onChange'
  });

  const watchedCosto = watch('valorCosto');
  const watchedMargen = watch('margen');

  // Calcular valor total en tiempo real
  useEffect(() => {
    if (watchedCosto > 0 && watchedMargen >= 0) {
      const total = calculateTotalValue(watchedCosto, watchedMargen);
      setCalculatedTotal(total);
    } else {
      setCalculatedTotal(0);
    }
  }, [watchedCosto, watchedMargen]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    
    try {
      const valorTotal = calculateTotalValue(data.valorCosto, data.margen);
      
      const newProduct: Product = {
        id: Date.now().toString(),
        item: contadorItems,
        producto: data.producto.trim(),
        cantidad: data.cantidad,
        presentacion: data.presentacion.trim(),
        categoria: data.categoria,
        valorCosto: data.valorCosto,
        margen: data.margen,
        valorTotal
      };
      
      addProduct(newProduct);
      
      // Reset form
      reset({
        producto: '',
        cantidad: 1,
        presentacion: '',
        categoria: 'papeleria',
        valorCosto: 0,
        margen: 25
      });
      
      toast.success('✅ Producto agregado correctamente', {
        duration: 3000,
        icon: '🎉'
      });
    } catch (error) {
      toast.error('❌ Error al agregar el producto');
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadTestData = () => {
    loadTestData();
    toast.success('📋 Datos de prueba cargados', {
      duration: 2000,
      icon: '🚀'
    });
  };

  const handleClearForm = () => {
    reset();
    toast.success('🔄 Formulario limpiado');
  };

  return (
    <div className="space-y-6">
      {/* Header del formulario */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-lg mr-4">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Agregar Producto</h2>
              <p className="text-white/90">
                Complete la información del nuevo producto
              </p>
            </div>
          </div>
          
          {/* Indicador de ítem actual */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm text-white/80">Próximo ítem</p>
              <p className="text-xl font-bold">#{contadorItems}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario principal */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Producto */}
            <div className="lg:col-span-2">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  Nombre del Producto *
                </label>
                <input
                  {...register('producto')}
                  type="text"
                  className={`
                    w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
                    focus:ring-2 focus:ring-green-500/20 focus:border-green-500
                    ${errors.producto ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                  `}
                  placeholder="Ej: BANDAS ELASTICAS SILICONADAS DE CAUCHO"
                />
                {errors.producto && (
                  <div className="mt-2 flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.producto.message}
                  </div>
                )}
              </div>
            </div>

            {/* Cantidad */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                Cantidad *
              </label>
              <input
                {...register('cantidad', { valueAsNumber: true })}
                type="number"
                min="1"
                className={`
                  w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  ${errors.cantidad ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                `}
                placeholder="1"
              />
              {errors.cantidad && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.cantidad.message}
                </div>
              )}
            </div>

            {/* Presentación */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Presentación *
              </label>
              <input
                {...register('presentacion')}
                type="text"
                className={`
                  w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
                  focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500
                  ${errors.presentacion ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                `}
                placeholder="Ej: BOLSA MEDIANA, UNIDAD, CAJA"
              />
              {errors.presentacion && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.presentacion.message}
                </div>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría *
              </label>
              <ProductCategory
                value={watch('categoria')}
                onChange={(value: ProductCategoryType) => setValue('categoria', value, { shouldValidate: true })}
                error={errors.categoria?.message}
              />
            </div>

            {/* Valor Costo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                Valor Costo (COP) *
              </label>
              <input
                {...register('valorCosto', { valueAsNumber: true })}
                type="number"
                min="0.01"
                step="0.01"
                className={`
                  w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
                  focus:ring-2 focus:ring-green-500/20 focus:border-green-500
                  ${errors.valorCosto ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                `}
                placeholder="0.00"
              />
              {errors.valorCosto && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.valorCosto.message}
                </div>
              )}
            </div>

            {/* Margen */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Margen (%) *
              </label>
              <input
                {...register('margen', { valueAsNumber: true })}
                type="number"
                min="0"
                max="1000"
                step="0.1"
                className={`
                  w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
                  focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500
                  ${errors.margen ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                `}
                placeholder="25.0"
              />
              {errors.margen && (
                <div className="mt-2 flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.margen.message}
                </div>
              )}
            </div>
          </div>

          {/* Valor Total Calculado */}
          {(watchedCosto > 0 || watchedMargen > 0) && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calculator className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-semibold text-blue-900">Valor Total Calculado:</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(calculatedTotal)}
                  </p>
                  <p className="text-xs text-blue-600">
                    Costo: {formatCurrency(watchedCosto || 0)} + Margen: {(watchedMargen || 0).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-6 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Acciones secundarias */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleClearForm}
                disabled={!isDirty}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Limpiar Formulario
              </Button>

              <Button
                type="button"
                variant="warning"
                size="md"
                onClick={handleLoadTestData}
              >
                <Upload className="w-4 h-4 mr-2" />
                Cargar Datos de Prueba
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => openModal('import')}
              >
                <Package className="w-4 h-4 mr-2" />
                Importar Productos
              </Button>
            </div>

            {/* Estado del formulario y botón principal */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Indicador de estado */}
              <div className="flex items-center space-x-4">
                {isValid && isDirty && (
                  <div className="flex items-center text-green-600 text-sm bg-green-50 px-3 py-2 rounded-full border border-green-200">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span className="font-medium">Formulario válido</span>
                  </div>
                )}
                
                {!isValid && isDirty && (
                  <div className="flex items-center text-orange-600 text-sm bg-orange-50 px-3 py-2 rounded-full border border-orange-200">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium">Verificar campos</span>
                  </div>
                )}
              </div>

              {/* Botón principal destacado */}
              <div className="relative">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  size="lg"
                  className="relative overflow-hidden group min-w-[180px] bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  <span className="font-semibold">
                    {isSubmitting ? 'Agregando...' : 'Agregar Producto'}
                  </span>
                  
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </Button>
                
                {/* Indicator pulsante cuando está listo */}
                {isValid && isDirty && !isSubmitting && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
          
          {/* Barra de progreso del formulario */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progreso del formulario</span>
              <span>{Math.round((Object.keys(watch()).filter(key => watch(key as keyof ProductFormData)).length / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.round((Object.keys(watch()).filter(key => watch(key as keyof ProductFormData)).length / 6) * 100)}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </form>

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start">
          <div className="bg-blue-100 rounded-lg p-2 mr-3">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              💡 Consejos para agregar productos:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Nombre descriptivo:</strong> Incluye marca y características principales</li>
              <li>• <strong>Presentación clara:</strong> Especifica unidad, peso o volumen</li>
              <li>• <strong>Margen recomendado:</strong> Entre 15% - 30% para productos generales</li>
              <li>• <strong>Categorías:</strong> Ayudan a organizar y generar reportes específicos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};