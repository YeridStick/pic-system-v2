import React, { useState, useEffect } from 'react';
import { 
  Database, Download, Upload, Trash2, RefreshCw, FileText, 
  Package, Settings, BarChart3, AlertTriangle, CheckCircle, 
  HardDrive, Shield, Archive, Copy, Eye, X 
} from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';
import { useProductStore } from '../../stores/productStore';
import toast from 'react-hot-toast';

interface StorageItem {
  key: string;
  size: number;
  description: string;
  category: 'config' | 'data' | 'ui' | 'other';
  lastModified?: string;
}

interface BackupData {
  metadata: {
    version: string;
    timestamp: string;
    appName: string;
    totalItems: number;
    totalSize: number;
  };
  config: Record<string, unknown>;
  products: Record<string, unknown>;
  ui: Record<string, unknown>;
  other: Record<string, unknown>;
}

export const BackupTab: React.FC = () => {
  const { excelConfig, resetConfig } = useConfigStore();
  const { productos, productosOriginales, clearAllProducts } = useProductStore();
  
  const [storageStats, setStorageStats] = useState<StorageItem[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<BackupData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Cargar estadísticas del storage
  useEffect(() => {
    loadStorageStats();
  }, []);

  // Efecto para prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (showPreview || showConfirmDialog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup al desmontar
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPreview, showConfirmDialog]);

  const loadStorageStats = () => {
    const items: StorageItem[] = [];
    let total = 0;

    // Categorizar claves del localStorage
    const categories = {
      config: ['pic-excel-config', 'excel-config-storage'],
      data: ['pic-product-store', 'pic-products-store', 'pic_productos'],
      ui: ['pic-ui-store', 'theme-preference'],
      other: []
    };

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const value = localStorage.getItem(key);
      if (!value) continue;

      const size = new Blob([value]).size;
      total += size;

      let category: 'config' | 'data' | 'ui' | 'other' = 'other';
      let description = key;

      // Determinar categoría y descripción
      if (categories.config.some(k => key.includes(k))) {
        category = 'config';
        description = 'Configuración de Excel y ajustes';
      } else if (categories.data.some(k => key.includes(k))) {
        category = 'data';
        description = 'Productos y datos del presupuesto';
      } else if (categories.ui.some(k => key.includes(k))) {
        category = 'ui';
        description = 'Preferencias de interfaz';
      } else if (key.startsWith('pic') || key.includes('iconify') || key.includes('portfolio')) {
        if (key.includes('iconify')) {
          description = 'Cache de iconos';
        } else if (key.includes('portfolio')) {
          description = 'Datos del portafolio';
        } else {
          description = 'Datos de la aplicación';
        }
      }

      items.push({
        key,
        size,
        description,
        category,
        lastModified: new Date().toISOString()
      });
    }

    setStorageStats(items.sort((a, b) => b.size - a.size));
    setTotalSize(total);
  };

  // Formatear tamaño en bytes
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Exportar respaldo completo
  const exportarRespaldoCompleto = async () => {
    setIsProcessing(true);
    
    try {
      const backupData: BackupData = {
        metadata: {
          version: '2.0',
          timestamp: new Date().toISOString(),
          appName: 'Sistema PIC Presupuestos',
          totalItems: storageStats.length,
          totalSize: totalSize
        },
        config: {},
        products: {},
        ui: {},
        other: {}
      };

      // Recopilar todos los datos del localStorage
      storageStats.forEach(item => {
        const value = localStorage.getItem(item.key);
        if (value) {
          let parsedValue;
          try {
            parsedValue = JSON.parse(value);
          } catch {
            parsedValue = value;
          }
          
          switch (item.category) {
            case 'config':
              backupData.config[item.key] = parsedValue;
              break;
            case 'data':
              backupData.products[item.key] = parsedValue;
              break;
            case 'ui':
              backupData.ui[item.key] = parsedValue;
              break;
            default:
              backupData.other[item.key] = parsedValue;
              break;
          }
        }
      });

      // Crear archivo de respaldo
      const dataStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `respaldo_sistema_pic_${new Date().toISOString().split('T')[0]}.json`;
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      toast.success('✅ Respaldo completo exportado correctamente', {
        duration: 4000,
        icon: '💾',
      });

    } catch (error) {
      console.error('Error al exportar respaldo:', error);
      toast.error('❌ Error al generar el respaldo');
    } finally {
      setIsProcessing(false);
    }
  };

  // Importar respaldo
  const importarRespaldo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backupData: BackupData = JSON.parse(e.target?.result as string);
        
        if (!backupData.metadata || !backupData.metadata.version) {
          throw new Error('Archivo de respaldo inválido');
        }

        setPreviewData(backupData);
        setShowPreview(true);

      } catch (error) {
        console.error('Error al leer respaldo:', error);
        toast.error('❌ Archivo de respaldo inválido');
      }
    };

    reader.readAsText(file);
    // Limpiar el input
    event.target.value = '';
  };

  // Aplicar respaldo
  const aplicarRespaldo = (backupData: BackupData) => {
    setIsProcessing(true);
    
    try {
      // Restaurar configuraciones
      Object.entries(backupData.config).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });

      // Restaurar productos
      Object.entries(backupData.products).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });

      // Restaurar UI
      Object.entries(backupData.ui).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });

      // Restaurar otros datos
      Object.entries(backupData.other).forEach(([key, value]) => {
        if (typeof value === 'string') {
          localStorage.setItem(key, value);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      });

      // Recargar estadísticas
      loadStorageStats();
      
      toast.success('✅ Respaldo restaurado correctamente', {
        duration: 4000,
        icon: '🔄',
      });

      // Cerrar modal
      setShowPreview(false);
      setPreviewData(null);

      // Recargar la página para aplicar cambios
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error al restaurar respaldo:', error);
      toast.error('❌ Error al restaurar el respaldo');
    } finally {
      setIsProcessing(false);
    }
  };

  // Exportar solo configuraciones
  const exportarConfiguraciones = () => {
    const config = {
      excelConfig,
      timestamp: new Date().toISOString(),
      version: '2.0'
    };

    const dataStr = JSON.stringify(config, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `configuracion_excel_${new Date().toISOString().split('T')[0]}.json`;
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success('📋 Configuraciones exportadas', { duration: 3000 });
  };

  // Exportar solo productos
  const exportarProductos = () => {
    const data = {
      productos,
      productosOriginales,
      timestamp: new Date().toISOString(),
      version: '2.0'
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `productos_${new Date().toISOString().split('T')[0]}.json`;
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success('📦 Productos exportados', { duration: 3000 });
  };

  // Limpiar cache específico
  const limpiarCache = (categoria: string) => {
    setIsProcessing(true);
    
    try {
      const itemsToRemove = storageStats
        .filter(item => item.category === categoria)
        .map(item => item.key);

      itemsToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      loadStorageStats();
      
      toast.success(`🧹 Cache de ${categoria} limpiado`, { duration: 3000 });

    } catch (error) {
      console.error('Error al limpiar cache:', error);
      toast.error('❌ Error al limpiar cache');
    } finally {
      setIsProcessing(false);
    }
  };

  // Resetear sistema completo
  const resetearSistemaCompleto = () => {
    setIsProcessing(true);
    
    try {
      // Limpiar solo datos relacionados con PIC
      const keysToRemove = storageStats
        .filter(item => 
          item.key.startsWith('pic') || 
          item.key.includes('excel-config') ||
          item.category === 'config' ||
          item.category === 'data'
        )
        .map(item => item.key);

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // Resetear stores
      resetConfig();
      clearAllProducts();

      loadStorageStats();

      toast.success('🔄 Sistema reseteado completamente', {
        duration: 4000,
        icon: '⚡',
      });

      // Recargar página
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error al resetear sistema:', error);
      toast.error('❌ Error al resetear sistema');
    } finally {
      setIsProcessing(false);
      setShowConfirmDialog(null);
    }
  };

  // Componente de confirmación
  const ConfirmDialog: React.FC<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    type: 'warning' | 'danger';
  }> = ({ title, message, onConfirm, onCancel, type }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center mb-4">
          {type === 'danger' ? (
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
          ) : (
            <Shield className="w-6 h-6 text-yellow-500 mr-3" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${
              type === 'danger' 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );

  // Modal de vista previa CORREGIDO
  const PreviewModal: React.FC = () => {
    if (!showPreview || !previewData) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center p-4 h-screen overflow-auto">
        {/* Contenedor principal del modal con flexbox para centrar */}
        <div className="bg-white rounded-2xl w-full max-w-4xl flex flex-col shadow-2xl h-screen">
          {/* Header fijo del modal */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white flex justify-between items-center rounded-t-2xl flex-shrink-0">
            <div>
              <h3 className="text-xl font-bold">Vista Previa del Respaldo</h3>
              <p className="text-blue-100">Revisa los datos antes de restaurar</p>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 p-6 h-100 bg-white">
            {/* Metadata */}
            <div className="mb-6 bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">📋 Información del Respaldo</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Versión:</span> {previewData.metadata.version}
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Fecha:</span> {new Date(previewData.metadata.timestamp).toLocaleString('es-CO')}
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Total items:</span> {previewData.metadata.totalItems}
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Tamaño:</span> {formatSize(previewData.metadata.totalSize)}
                </div>
              </div>
            </div>

            {/* Contenido por categorías */}
            <div className="space-y-4">
              {Object.keys(previewData.config).length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h5 className="font-semibold text-green-800 mb-2">⚙️ Configuraciones ({Object.keys(previewData.config).length})</h5>
                  <ul className="text-sm text-green-700 space-y-1">
                    {Object.keys(previewData.config).map(key => (
                      <li key={key}>• {key}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Object.keys(previewData.products).length > 0 && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h5 className="font-semibold text-purple-800 mb-2">📦 Productos ({Object.keys(previewData.products).length})</h5>
                  <ul className="text-sm text-purple-700 space-y-1">
                    {Object.keys(previewData.products).map(key => (
                      <li key={key}>• {key}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Object.keys(previewData.ui).length > 0 && (
                <div className="bg-orange-50 rounded-lg p-4">
                  <h5 className="font-semibold text-orange-800 mb-2">🎨 Interfaz ({Object.keys(previewData.ui).length})</h5>
                  <ul className="text-sm text-orange-700 space-y-1">
                    {Object.keys(previewData.ui).map(key => (
                      <li key={key}>• {key}</li>
                    ))}
                  </ul>
                </div>
              )}

              {Object.keys(previewData.other).length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-2">📁 Otros datos ({Object.keys(previewData.other).length})</h5>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {Object.keys(previewData.other).map(key => (
                      <li key={key}>• {key}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Footer fijo con botones */}
          <div className="border-t p-6 bg-gray-50 flex justify-end space-x-3 rounded-b-2xl flex-shrink-0">
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => aplicarRespaldo(previewData)}
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Restaurando...' : 'Restaurar Respaldo'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header principal */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-4">
              <Database className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                💾 Gestión de Respaldos
              </h1>
              <p className="text-white/90 text-lg max-w-2xl">
                Respalda, restaura y administra todos los datos de tu sistema de presupuestos
              </p>
            </div>
          </div>

          {/* Stats rápidas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{storageStats.length}</div>
              <div className="text-sm text-white/80">Items Almacenados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{formatSize(totalSize)}</div>
              <div className="text-sm text-white/80">Espacio Usado</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{productos.length}</div>
              <div className="text-sm text-white/80">Productos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">✓</div>
              <div className="text-sm text-white/80">Sistema OK</div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Respaldo completo */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg mr-4">
                <Archive className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">🔄 Respaldo Completo</h3>
                <p className="text-white/90">Exporta e importa todos los datos del sistema</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <button
                onClick={exportarRespaldoCompleto}
                disabled={isProcessing}
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 disabled:opacity-50 group"
              >
                <Download className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                {isProcessing ? 'Generando Respaldo...' : 'Exportar Respaldo Completo'}
              </button>

              <div className="relative">
                <input
                  type="file"
                  id="fileInput"
                  accept=".json"
                  onChange={importarRespaldo}
                  className="hidden"
                />
                <button
                  onClick={() => document.getElementById('fileInput')?.click()}
                  className="w-full inline-flex items-center justify-center px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 group"
                >
                  <Upload className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                  Importar Respaldo
                </button>
              </div>

              <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <strong>Incluye:</strong> Configuraciones de Excel, productos, datos originales, preferencias de UI y otros datos del sistema.
              </div>
            </div>
          </div>
        </div>

        {/* Respaldos parciales */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6 text-white">
            <div className="flex items-center">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg mr-4">
                <Copy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">📋 Respaldos Parciales</h3>
                <p className="text-white/90">Exporta datos específicos por categoría</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              <button
                onClick={exportarConfiguraciones}
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Settings className="w-4 h-4 mr-2" />
                Exportar Solo Configuraciones
              </button>

              <button
                onClick={exportarProductos}
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Package className="w-4 h-4 mr-2" />
                Exportar Solo Productos
              </button>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => limpiarCache('other')}
                  className="inline-flex items-center justify-center px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Limpiar Cache
                </button>

                <button
                  onClick={() => setShowConfirmDialog('reset')}
                  className="inline-flex items-center justify-center px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Reset Sistema
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas de almacenamiento */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mt-6">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white">
          <div className="flex items-center">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg mr-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">📊 Estadísticas de Almacenamiento</h3>
              <p className="text-white/90">Detalles de los datos almacenados en el navegador</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Resumen por categorías */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {['config', 'data', 'ui', 'other'].map(category => {
              const items = storageStats.filter(item => item.category === category);
              const totalSize = items.reduce((sum, item) => sum + item.size, 0);
              
              const categoryInfo = {
                config: { name: 'Configuraciones', icon: Settings, color: 'green' },
                data: { name: 'Productos', icon: Package, color: 'blue' },
                ui: { name: 'Interfaz', icon: Eye, color: 'purple' },
                other: { name: 'Otros', icon: FileText, color: 'gray' }
              };

              const info = categoryInfo[category as keyof typeof categoryInfo];
              const Icon = info.icon;

              return (
                <div key={category} className={`bg-${info.color}-50 border border-${info.color}-200 rounded-lg p-4`}>
                  <div className="flex items-center mb-2">
                    <Icon className={`w-5 h-5 text-${info.color}-600 mr-2`} />
                    <span className={`font-semibold text-${info.color}-800 text-sm`}>{info.name}</span>
                  </div>
                  <div className={`text-2xl font-bold text-${info.color}-700`}>{items.length}</div>
                  <div className={`text-sm text-${info.color}-600`}>{formatSize(totalSize)}</div>
                </div>
              );
            })}
          </div>

          {/* Lista detallada */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 font-semibold text-gray-700">Elemento</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Descripción</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Categoría</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Tamaño</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {storageStats.slice(0, 10).map((item, index) => (
                  <tr key={item.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 font-mono text-xs">{item.key}</td>
                    <td className="p-3 text-gray-600">{item.description}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.category === 'config' ? 'bg-green-100 text-green-800' :
                        item.category === 'data' ? 'bg-blue-100 text-blue-800' :
                        item.category === 'ui' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{formatSize(item.size)}</td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          localStorage.removeItem(item.key);
                          loadStorageStats();
                          toast.success(`Elemento ${item.key} eliminado`);
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {storageStats.length > 10 && (
              <div className="text-center p-4 text-gray-500">
                ... y {storageStats.length - 10} elementos más
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información del sistema */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mt-6">
        <div className="flex items-start">
          <div className="p-3 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
            <HardDrive className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              ℹ️ Información del Sistema de Respaldos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-2 text-blue-900">📦 Qué se Respalda</h4>
                <ul className="space-y-1">
                  <li>• <strong>Configuraciones:</strong> Ajustes de Excel, estilos y preferencias</li>
                  <li>• <strong>Productos:</strong> Todos los productos y sus datos originales</li>
                  <li>• <strong>Interfaz:</strong> Tema, pestañas activas y preferencias de UI</li>
                  <li>• <strong>Metadatos:</strong> Información de versión y timestamps</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-blue-900">🔒 Seguridad y Privacidad</h4>
                <ul className="space-y-1">
                  <li>• Los respaldos se almacenan localmente en tu dispositivo</li>
                  <li>• No se envían datos a servidores externos</li>
                  <li>• Los archivos JSON son legibles y editables</li>
                  <li>• Puedes eliminar datos específicos de forma granular</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <PreviewModal />

      {showConfirmDialog === 'reset' && (
        <ConfirmDialog
          title="⚠️ Resetear Sistema Completo"
          message="Esta acción eliminará TODOS los datos de la aplicación de forma permanente. Esto incluye productos, configuraciones y preferencias. ¿Estás completamente seguro?"
          onConfirm={resetearSistemaCompleto}
          onCancel={() => setShowConfirmDialog(null)}
          type="danger"
        />
      )}

      {/* Tips finales */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mt-6">
        <div className="flex items-start">
          <div className="p-3 bg-green-100 rounded-lg mr-4 flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              💡 Consejos para un Respaldo Efectivo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-green-800">
              <div>
                <h4 className="font-medium mb-2 text-green-900">📅 Frecuencia</h4>
                <ul className="space-y-1">
                  <li>• Haz respaldos antes de cambios importantes</li>
                  <li>• Exporta respaldos semanalmente</li>
                  <li>• Mantén varias versiones de respaldo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-green-900">💾 Almacenamiento</h4>
                <ul className="space-y-1">
                  <li>• Guarda respaldos en múltiples ubicaciones</li>
                  <li>• Usa nombres descriptivos con fechas</li>
                  <li>• Verifica la integridad periódicamente</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-green-900">🚀 Optimización</h4>
                <ul className="space-y-1">
                  <li>• Limpia cache innecesario regularmente</li>
                  <li>• Usa respaldos parciales para cambios menores</li>
                  <li>• Documenta cambios importantes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};