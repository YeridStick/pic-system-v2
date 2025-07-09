// src/components/products/ProductTable.tsx
import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Package, 
  Eye,
  MoreVertical,
  TrendingUp,
  ArrowUpDown,
  Download,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useProductStore } from '../../stores/productStore';
import { useUIStore } from '../../stores/uiStore';
import toast from 'react-hot-toast';
import type { Product } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { ProductCategoryBadge } from '../common/ProductCategoryBadge';
import { Button } from '../common/Button';

type SortField = 'item' | 'producto' | 'valorCosto' | 'margen' | 'valorTotal' | 'cantidad';
type SortDirection = 'asc' | 'desc';

// Define column configurations
// const COLUMNS = [
//   { key: 'item', label: 'Item', sortable: true },
//   { key: 'producto', label: 'Producto', sortable: true },
//   { key: 'cantidad', label: 'Cant.', sortable: true },
//   { key: 'presentacion', label: 'Presentación', sortable: false },
//   { key: 'categoria', label: 'Categoría', sortable: false },
//   { key: 'valorCosto', label: 'Valor Costo', sortable: true },
//   { key: 'margen', label: 'Margen %', sortable: true },
//   { key: 'iva', label: 'IVA %', sortable: false },
//   { key: 'impConsumo', label: 'Imp. Consumo %', sortable: false },
//   { key: 'otrosImp', label: 'Otros Imp. %', sortable: false },
//   { key: 'costosAdic', label: 'Costos Adic.', sortable: false },
//   { key: 'valorTotal', label: 'Valor Total', sortable: true },
//   { key: 'subtotal', label: 'Subtotal', sortable: false },
//   { key: 'acciones', label: 'Acciones', sortable: false }
// ];

export const ProductTable: React.FC = () => {
  const { getFilteredProducts, deleteProduct, clearAllProducts } = useProductStore();
  const { openModal } = useUIStore();
  
  const [sortField, setSortField] = useState<SortField>('item');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showActions, setShowActions] = useState<string | null>(null);

  const productos = getFilteredProducts();

  // Ordenar productos
  const sortedProducts = [...productos].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    const numA = Number(aValue);
    const numB = Number(bValue);
    return sortDirection === 'asc' ? numA - numB : numB - numA;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = (product: Product) => {
    openModal('edit', product);
    setShowActions(null);
  };

  const handleView = (product: Product) => {
    openModal('view', product);
    setShowActions(null);
  };

  const handleDelete = (product: Product) => {
    setShowActions(null);
    
    const confirmDelete = () => {
      deleteProduct(product.id);
      toast.success('🗑️ Producto eliminado correctamente', {
        duration: 3000,
      });
    };

    // Toast personalizado para confirmación
    toast((t) => (
      <div className="flex items-center space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <div className="flex-1">
          <p className="font-medium text-gray-900">¿Eliminar producto?</p>
          <p className="text-sm text-gray-600 truncate max-w-[200px]">
            "{product.producto}"
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              confirmDelete();
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: {
        maxWidth: '400px',
      }
    });
  };

  const toggleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAllProducts = () => {
    if (selectedProducts.size === productos.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(productos.map(p => p.id)));
    }
  };

  // Calcular totales
  const totales = productos.reduce((acc, p) => ({
    costo: acc.costo + (p.valorCosto * p.cantidad),
    presupuesto: acc.presupuesto + (p.valorTotal * p.cantidad),
    items: acc.items + 1
  }), { costo: 0, presupuesto: 0, items: 0 });

  const margenPromedio = totales.costo > 0 
    ? ((totales.presupuesto - totales.costo) / totales.costo) * 100 
    : 0;

  const handleExport = () => {
    const dataStr = JSON.stringify(productos, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to get tax rate
  // const getTaxRate = (product: Product, type: TaxConfig['type']) => {
  //   return product.impuestos?.find(t => t.type === type && t.enabled)?.rate ?? 0;
  // };

  // Helper to get total other taxes
  // const getOtherTaxesTotal = (product: Product) => {
  //   return product.impuestos
  //     ?.filter(t => t.type !== 'iva' && t.type !== 'consumo' && t.enabled)
  //     .reduce((sum, t) => sum + t.rate, 0) ?? 0;
  // };

  // Helper to get total additional costs
  // const getAdditionalCostsTotal = (product: Product) => {
  //   if (!product.costosAdicionales || !Array.isArray(product.costosAdicionales)) {
  //     return 0;
  //   }
  //   return product.costosAdicionales
  //     .filter(c => c.enabled)
  //     .reduce((sum, c) => sum + c.value, 0);
  // };

  if (productos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No hay productos registrados
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza agregando tu primer producto usando el formulario de arriba o carga algunos datos de prueba.
          </p>
          <div className="flex gap-3 justify-center">
            <Button 
              variant="secondary" 
              onClick={() => openModal('import')}
            >
              <Package className="w-4 h-4 mr-2" />
              Importar Datos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header de la tabla con estadísticas rápidas */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              📋 Lista de Productos
            </h3>
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center">
                <Package className="w-4 h-4 text-blue-600 mr-1" />
                <span className="text-gray-600">Total: </span>
                <span className="font-semibold text-blue-900">{totales.items} productos</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-gray-600">Margen: </span>
                <span className="font-semibold text-green-900">{formatPercentage(margenPromedio)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600">Presupuesto: </span>
                <span className="font-semibold text-purple-900">{formatCurrency(totales.presupuesto)}</span>
              </div>
            </div>
          </div>
          
          {/* Acciones rápidas */}
          <div className="flex gap-2">
            {selectedProducts.size > 0 && (
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => {
                  // Confirmación antes de eliminar
                  const confirmDelete = () => {
                    if (selectedProducts.size === productos.length) {
                      clearAllProducts();
                      toast.success('Todos los productos eliminados');
                    } else {
                      Array.from(selectedProducts).forEach(id => deleteProduct(id));
                      toast.success(`${selectedProducts.size} productos eliminados`);
                    }
                    setSelectedProducts(new Set());
                  };
                  toast((t) => (
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">¿Eliminar productos seleccionados?</p>
                        <p className="text-sm text-gray-600 truncate max-w-[200px]">
                          Se eliminarán {selectedProducts.size} productos.
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            confirmDelete();
                            toast.dismiss(t.id);
                          }}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => toast.dismiss(t.id)}
                          className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ), {
                    duration: 5000,
                    style: { maxWidth: '400px' }
                  });
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar ({selectedProducts.size})
              </Button>
            )}
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-1" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla moderna */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th className="px-4 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === productos.length && productos.length > 0}
                    onChange={selectAllProducts}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                
                {[ // This array is correctly defined
                  { key: 'item', label: 'Item', sortable: true },
                  { key: 'producto', label: 'Producto', sortable: true },
                  { key: 'cantidad', label: 'Cant.', sortable: true },
                  { key: 'presentacion', label: 'Presentación', sortable: false },
                  { key: 'categoria', label: 'Categoría', sortable: false },
                  { key: 'valorCosto', label: 'Valor Costo', sortable: true },
                  { key: 'margen', label: 'Margen %', sortable: true },
                  { key: 'valorTotal', label: 'Valor Total', sortable: true },
                  { key: 'subtotal', label: 'Subtotal', sortable: false },
                  { key: 'acciones', label: 'Acciones', sortable: false }
                ].map(column => (
                  <th 
                    key={column.key}
                    className={`px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                      column.sortable ? 'cursor-pointer hover:text-gray-900 select-none' : ''
                    }`}
                    onClick={() => column.sortable && handleSort(column.key as SortField)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <ArrowUpDown className={`w-3 h-3 ${
                          sortField === column.key ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {sortedProducts.map((producto, index) => (
                <tr
                  key={producto.id}
                  className={`
                    transition-all duration-200 hover:bg-blue-50 group
                    ${selectedProducts.has(producto.id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                    ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}
                  `}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.has(producto.id)}
                      onChange={() => toggleSelectProduct(producto.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>

                  {/* Item */}
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {producto.item}
                    </div>
                  </td>

                  {/* Producto */}
                  <td className="px-4 py-4">
                    <div className="max-w-xs">
                      <p className="font-medium text-gray-900 truncate" title={producto.producto}>
                        {producto.producto}
                      </p>
                      <p className="text-sm text-gray-500">
                        {producto.presentacion}
                      </p>
                    </div>
                  </td>

                  {/* Cantidad */}
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {producto.cantidad}
                    </span>
                  </td>

                  {/* Presentación */}
                  <td className="px-4 py-4 text-center text-sm text-gray-600">
                    {producto.presentacion}
                  </td>

                  {/* Categoría */}
                  <td className="px-4 py-4 text-center">
                    <ProductCategoryBadge 
                      category={producto.categoria}
                      size="sm"
                    />
                  </td>

                  {/* Valor Costo */}
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(producto.valorCosto)}
                    </span>
                  </td>

                  {/* Margen */}
                  <td className="px-4 py-4 text-center">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium
                      ${producto.margen >= 25 
                        ? 'bg-green-100 text-green-800' 
                        : producto.margen >= 15 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }
                    `}>
                      {formatPercentage(producto.margen)}
                    </span>
                  </td>

                  {/* Valor Total */}
                  <td className="px-4 py-4 text-right">
                    <span className="text-lg font-semibold text-blue-600">
                      {formatCurrency(producto.valorTotal)}
                    </span>
                  </td>

                  {/* Subtotal */}
                  <td className="px-4 py-4 text-right">
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(producto.valorTotal * producto.cantidad)}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === producto.id ? null : producto.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors group-hover:bg-white"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>

                      {/* Dropdown de acciones */}
                      {showActions === producto.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
                            <button
                              onClick={() => handleView(producto)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-3 text-blue-500" />
                              Ver detalles
                            </button>
                            <button
                              onClick={() => handleEdit(producto)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <Edit className="w-4 h-4 mr-3 text-green-500" />
                              Editar producto
                            </button>
                            <div className="border-t border-gray-100"></div>
                            <button
                              onClick={() => handleDelete(producto)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-3" />
                              Eliminar producto
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer con resumen mejorado */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Mostrando <span className="font-semibold text-gray-900 mx-1">{productos.length}</span> producto(s)
              {selectedProducts.size > 0 && (
                <span className="ml-2 text-blue-600">
                  • <span className="font-semibold">{selectedProducts.size}</span> seleccionado(s)
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                <span className="text-gray-600">Total Costo:</span>
                <p className="font-bold text-gray-900">{formatCurrency(totales.costo)}</p>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                <span className="text-gray-600">Total Presupuesto:</span>
                <p className="font-bold text-blue-600">{formatCurrency(totales.presupuesto)}</p>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
                <span className="text-gray-600">Margen Promedio:</span>
                <p className="font-bold text-green-600">{formatPercentage(margenPromedio)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};