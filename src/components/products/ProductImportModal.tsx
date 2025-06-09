import React, { useRef, useState } from 'react';
import { X, Upload, AlertTriangle, CheckCircle, Download, Info } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useProductStore } from '../../stores/productStore';
import toast from 'react-hot-toast';
import type { Product } from '../../types';

type PartialProduct = {
  [key: string]: unknown;
  id?: unknown;
  producto?: unknown;
  cantidad?: unknown;
  presentacion?: unknown;
  categoria?: unknown;
  valorCosto?: unknown;
  margen?: unknown;
  valorTotal?: unknown;
};

export const ProductImportModal: React.FC = () => {
  const { modal, closeModal } = useUIStore();
  const { addProductsBulk, replaceProducts, productos } = useProductStore();
  const [importMode, setImportMode] = useState<'add' | 'replace'>('add');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<Product[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!modal.isOpen || modal.type !== 'import') return null;

  const validateProductData = (data: unknown[]): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!Array.isArray(data)) {
      errors.push('El archivo debe contener un array de productos');
      return { isValid: false, errors };
    }

    if (data.length === 0) {
      errors.push('El archivo está vacío');
      return { isValid: false, errors };
    }

    // Validar cada producto
    data.forEach((product, index) => {
      if (typeof product !== 'object' || product === null) {
        errors.push(`Producto ${index + 1}: No es un objeto válido`);
        return;
      }
      const p = product as PartialProduct;
      const requiredFields = ['id', 'producto', 'cantidad', 'presentacion', 'categoria', 'valorCosto', 'margen', 'valorTotal'];
      
      for (const field of requiredFields) {
        if (!(field in p)) {
          errors.push(`Producto ${index + 1}: Falta el campo "${field}"`);
        }
      }

      // Validaciones específicas
      if ('cantidad' in p && (typeof p.cantidad !== 'number' || p.cantidad <= 0)) {
        errors.push(`Producto ${index + 1}: Cantidad debe ser un número mayor a 0`);
      }

      if ('valorCosto' in p && (typeof p.valorCosto !== 'number' || p.valorCosto <= 0)) {
        errors.push(`Producto ${index + 1}: Valor costo debe ser un número mayor a 0`);
      }

      if ('margen' in p && (typeof p.margen !== 'number' || p.margen < 0)) {
        errors.push(`Producto ${index + 1}: Margen debe ser un número mayor o igual a 0`);
      }

      if ('categoria' in p && typeof p.categoria === 'string' && !['papeleria', 'alimentos', 'semillas', 'aseo', 'otros'].includes(p.categoria)) {
        errors.push(`Producto ${index + 1}: Categoría inválida`);
      }
    });

    return { isValid: errors.length === 0, errors };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPreviewData(null);
    setIsProcessing(true);
    
    const file = e.target.files?.[0];
    if (!file) {
      setIsProcessing(false);
      return;
    }

    try {
      const text = await file.text();
      let data: Product[];

      try {
        data = JSON.parse(text);
      } catch {
        setError('El archivo no es un JSON válido. Asegúrate de que el formato sea correcto.');
        setIsProcessing(false);
        return;
      }

      // Validar los datos
      const validation = validateProductData(data);
      if (!validation.isValid) {
        setError(`Errores encontrados:\n${validation.errors.slice(0, 5).join('\n')}${validation.errors.length > 5 ? '\n...y más errores' : ''}`);
        setIsProcessing(false);
        return;
      }

      // Asignar nuevos IDs y números de item si es necesario
      const processedData = data.map((product, index) => ({
        ...product,
        id: importMode === 'add' ? `${Date.now()}_${index}` : product.id,
        item: importMode === 'add' ? productos.length + index + 1 : product.item
      }));

      setPreviewData(processedData);
      setError(null);
      
    } catch (err) {
      setError('Error al leer el archivo. Asegúrate de que sea un archivo válido.');
      console.error('Import error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!previewData) return;

    setIsProcessing(true);
    
    try {
      if (importMode === 'replace') {
        await replaceProducts(previewData);
        toast.success(`🔄 ${previewData.length} productos reemplazados correctamente`, {
          duration: 4000,
          icon: '✅'
        });
      } else {
        await addProductsBulk(previewData);
        toast.success(`➕ ${previewData.length} productos agregados correctamente`, {
          duration: 4000,
          icon: '🎉'
        });
      }
      
      closeModal();
      
    } catch (error) {
      toast.error('❌ Error al importar los productos');
      console.error('Import error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setPreviewData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const generateSampleFile = () => {
    const sampleData: Product[] = [
      {
        id: "sample_1",
        item: 1,
        producto: "BANDAS ELASTICAS SILICONADAS DE CAUCHO",
        cantidad: 5,
        presentacion: "BOLSA MEDIANA",
        categoria: "papeleria",
        valorCosto: 2500,
        margen: 25,
        valorTotal: 3125
      },
      {
        id: "sample_2",
        item: 2,
        producto: "ARROZ BLANCO PREMIUM",
        cantidad: 10,
        presentacion: "BOLSA 500G",
        categoria: "alimentos",
        valorCosto: 1800,
        margen: 30,
        valorTotal: 2340
      }
    ];

    const dataStr = JSON.stringify(sampleData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ejemplo_productos.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('📁 Archivo de ejemplo descargado', {
      duration: 3000,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-up transform transition-all duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold flex items-center">
            <Upload className="w-6 h-6 mr-2 text-blue-600" />
            Importar Productos
          </h2>
          <button
            onClick={closeModal}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group"
            title="Cerrar modal"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Información sobre el formato */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">📋 Formato de archivo</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Importa productos desde un archivo JSON. Debe contener un array con la estructura generada por la función "Exportar".
                </p>
                <button
                  onClick={generateSampleFile}
                  className="inline-flex items-center text-sm text-blue-700 hover:text-blue-900 font-medium"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Descargar archivo de ejemplo
                </button>
              </div>
            </div>
          </div>

          {/* Modo de importación */}
          <div>
            <label className="block font-semibold text-gray-700 mb-3">¿Cómo deseas importar los productos?</label>
            <div className="space-y-3">
              <label className="flex items-start cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="importMode"
                  value="add"
                  checked={importMode === 'add'}
                  onChange={() => setImportMode('add')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="font-medium text-gray-900">Agregar al listado existente</span>
                  <p className="text-sm text-gray-600">Los productos importados se agregarán a los existentes</p>
                </div>
              </label>
              
              <label className="flex items-start cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <div className="ml-3">
                  <span className="font-medium text-gray-900">Reemplazar productos existentes</span>
                  <p className="text-sm text-gray-600">Se eliminarán todos los productos actuales</p>
                </div>
              </label>
            </div>
            
            {importMode === 'replace' && productos.length > 0 && (
              <div className="mt-3 flex items-center bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>
                  ⚠️ Esto eliminará los <strong>{productos.length} productos actuales</strong> antes de importar. ¡Esta acción no se puede deshacer!
                </span>
              </div>
            )}
          </div>

          {/* Input de archivo */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Seleccionar archivo</label>
            <div className="relative">
              <input
                type="file"
                accept=".json,application/json"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isProcessing}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors disabled:opacity-50"
              />
              {isProcessing && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Error en el archivo</h4>
                  <pre className="text-sm whitespace-pre-wrap">{error}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Preview de datos */}
          {previewData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-900">
                  ✅ Archivo válido - {previewData.length} producto(s) encontrado(s)
                </h4>
              </div>
              
              {/* Preview de algunos productos */}
              <div className="bg-white rounded-lg p-3 max-h-40 overflow-y-auto">
                <div className="text-sm">
                  <div className="font-medium text-gray-600 mb-2">Vista previa:</div>
                  {previewData.slice(0, 3).map((product, index) => (
                    <div key={index} className="py-1 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium">{product.producto}</span>
                      <span className="text-gray-500 ml-2">
                        ({product.cantidad} {product.presentacion} - {product.categoria})
                      </span>
                    </div>
                  ))}
                  {previewData.length > 3 && (
                    <div className="py-1 text-gray-500 italic">
                      ...y {previewData.length - 3} productos más
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleReset}
            disabled={!previewData && !error}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Limpiar
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={closeModal}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            
            <button
              onClick={handleConfirmImport}
              disabled={!previewData || isProcessing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar {previewData?.length || 0} producto(s)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};