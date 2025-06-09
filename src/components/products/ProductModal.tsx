// src/components/products/ProductModal.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  X, 
  Save, 
  Edit, 
  Calculator,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { useUIStore } from '../../stores/uiStore';
import { ProductCategory } from '../common/ProductCategory';
import { calculateTotalValue } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';
import type { Product, ProductFormData, ProductCategory as ProductCategoryType } from '../../types';

const editSchema = z.object({
  producto: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  cantidad: z.number()
    .min(1, 'La cantidad debe ser mayor a 0')
    .max(10000, 'La cantidad es demasiado alta'),
  presentacion: z.string()
    .min(2, 'La presentación debe tener al menos 2 caracteres')
    .max(50, 'La presentación no puede exceder 50 caracteres'),
  categoria: z.enum(['papeleria', 'alimentos', 'semillas', 'aseo', 'otros'], {
    errorMap: () => ({ message: 'Debe seleccionar una categoría válida' }),
  }),
  valorCosto: z.number()
    .min(0.01, 'El valor costo debe ser mayor a 0')
    .max(999999999, 'El valor es demasiado alto'),
  margen: z.number()
    .min(0, 'El margen no puede ser negativo')
    .max(1000, 'El margen no puede exceder 1000%'),
});

export const ProductModal: React.FC = () => {
  const { updateProduct } = useProductStore();
  const { modal, closeModal } = useUIStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProductFormData>({
    resolver: zodResolver(editSchema),
    mode: 'onChange'
  });

  const valorCosto = watch('valorCosto');
  const margen = watch('margen');

  // Calcular valor total en tiempo real
  useEffect(() => {
    if (valorCosto > 0 && margen >= 0) {
      const total = calculateTotalValue(valorCosto, margen);
      setCalculatedTotal(total);
    } else {
      setCalculatedTotal(0);
    }
  }, [valorCosto, margen]);

  // Cargar datos del producto cuando se abre el modal
  useEffect(() => {
    if (modal.isOpen && modal.type === 'edit' && modal.data) {
      const product = modal.data as Product;
      reset({
        producto: product.producto,
        cantidad: product.cantidad,
        presentacion: product.presentacion,
        categoria: product.categoria,
        valorCosto: product.valorCosto,
        margen: product.margen,
      });
    }
  }, [modal, reset]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (modal.isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevenir scroll del fondo
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modal.isOpen, closeModal]);

  const onSubmit = async (data: ProductFormData) => {
    if (!modal.data) return;

    setIsSubmitting(true);
    
    try {
      const updatedData = {
        ...data,
        valorTotal: calculateTotalValue(data.valorCosto, data.margen)
      };
      
      updateProduct(modal.data.id, updatedData);
      
      toast.success('✅ Producto actualizado correctamente', {
        duration: 3000,
        icon: '🎉'
      });
      
      closeModal();
    } catch (error) {
      toast.error('❌ Error al actualizar producto');
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  if (!modal.isOpen || modal.type !== 'edit') return null;

  const product = modal.data as Product;

  return (
    <>
      {/* Backdrop con blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center p-6 animate-fade-in h-screen overflow-auto"
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <div 
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col animate-scale-up transform transition-all duration-300"
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
          {/* Header con gradiente */}
          <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Edit className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Editar Producto</h2>
                  <p className="text-blue-100 mt-1">
                    Modificar la información del producto seleccionado
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
              <p className="text-sm text-blue-100 mb-1">Producto actual:</p>
              <p className="font-semibold truncate">{product.producto}</p>
            </div>
          </div>

          {/* Contenido del formulario (scrollable) */}
          <div className="flex-grow p-6 h-full bg-white">
            <form id="edit-product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Información básica */}
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2" />
                      Información Básica
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Producto */}
                      <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-2">
                          Nombre del Producto *
                        </label>
                        <input
                          {...register('producto')}
                          type="text"
                          className={`
                            w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
                            focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                            ${errors.producto ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                          `}
                          placeholder="Nombre descriptivo del producto"
                        />
                        {errors.producto && (
                          <div className="mt-2 flex items-center text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.producto.message}
                          </div>
                        )}
                      </div>

                      {/* Cantidad y Presentación */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-blue-700 mb-2">
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
                            placeholder="Cantidad del producto"
                          />
                          {errors.cantidad && (
                            <div className="mt-2 flex items-center text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.cantidad.message}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-blue-700 mb-2">
                            Presentación *
                          </label>
                          <input
                            {...register('presentacion')}
                            type="text"
                            className={`
                              w-full px-4 py-3 border-2 rounded-lg transition-all duration-200
                              focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                              ${errors.presentacion ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                            `}
                            placeholder="Ej: BOLSA, UNIDAD, CAJA"
                          />
                          {errors.presentacion && (
                            <div className="mt-2 flex items-center text-red-600 text-sm">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.presentacion.message}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Categoría */}
                      <div>
                        <label className="block text-sm font-semibold text-blue-700 mb-2">
                          Categoría *
                        </label>
                        <ProductCategory
                          value={watch('categoria')}
                          onChange={(value: ProductCategoryType) => setValue('categoria', value, { shouldValidate: true })}
                          error={errors.categoria?.message}
                        />
                        {errors.categoria && (
                          <div className="mt-2 flex items-center text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.categoria.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información financiera y resumen */}
                <div className="space-y-6">
                  {/* Información financiera */}
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Información Financiera
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-green-700 mb-2">
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
                          placeholder="Costo unitario del producto"
                        />
                        {errors.valorCosto && (
                          <div className="mt-2 flex items-center text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.valorCosto.message}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-green-700 mb-2">
                          <TrendingUp className="w-4 h-4 inline mr-1" />
                          Margen de Ganancia (%) *
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
                          placeholder="Margen de ganancia deseado"
                        />
                        {errors.margen && (
                          <div className="mt-2 flex items-center text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.margen.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Valor Total Calculado */}
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Valor Total Calculado
                    </h3>
                    <div className="bg-white p-3 rounded-lg border border-purple-200">
                      <p className="text-xs font-medium text-purple-700 mb-1">Valor Unitario:</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {formatCurrency(calculatedTotal)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Costo: {formatCurrency(valorCosto || 0)} + Margen: {(margen || 0).toFixed(1)}%
                      </p>
                      <small className="text-gray-500 text-xs mt-2 block">
                        Fórmula: Valor Costo × (1 + Margen/100)
                      </small>
                    </div>
                  </div>

                  {/* Comparación de valores */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Comparación
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Valor Original:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(product.valorTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Valor Nuevo:</span>
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(calculatedTotal)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-gray-700">Diferencia:</span>
                        <span className={`${calculatedTotal - product.valorTotal > 0 ? 'text-green-600' : calculatedTotal - product.valorTotal < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                          {formatCurrency(calculatedTotal - product.valorTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer de acciones */}
          <div className="flex-shrink-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-4 rounded-b-2xl mb-4">
            <button
              type="button"
              onClick={closeModal}
              className='bg-red-600 rounded text-white p-2 px-3'
            >
              Cancelar
            </button>

            <Button
              type="submit"
              form="edit-product-form" 
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
              className="bg-blue-600 rounded text-white p-2 px-3"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};