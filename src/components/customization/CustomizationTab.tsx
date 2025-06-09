import React from 'react';
import { Palette, Download, Settings, FileSpreadsheet, RotateCcw } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';
import { useProductStore } from '../../stores/productStore';
import { useExcelExport } from '../../hooks/useExcelExport';
import { ExportButtonSection } from './ExportButtonSection';
import toast from 'react-hot-toast';
import type { ExportSummary } from '../../types/types';
import { PreviewSection } from './PreviewSection';
import { StyleConfigSection } from './StyleConfigSection';
import { TableConfigSection } from './TableConfigSection';
import { HeaderConfigSection } from './HeaderConfigSection';
import { FileConfigSection } from './FileConfigSection';

// Trigger recompilation
export const CustomizationTab: React.FC = () => {
  const { resetConfig } = useConfigStore();
  const { productos } = useProductStore();
  const { 
    generateExcel, 
    generateSample, 
    isGenerating, 
    getExportSummary 
  } = useExcelExport();

  const exportSummary: ExportSummary = getExportSummary();

  const handleResetConfig = (): void => {
    if (window.confirm('¿Estás seguro de que quieres restaurar la configuración por defecto?')) {
      resetConfig();
      toast.success('🔄 Configuración restaurada a valores por defecto', {
        duration: 3000,
      });
    }
  };

  const handleQuickExport = async (): Promise<void> => {
    try {
      const success = await generateExcel();
      if (success) {
        toast.success('🚀 ¡Excel generado exitosamente!', {
          duration: 4000,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(`❌ Error al generar Excel: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header principal con estadísticas */}
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl mr-4">
                  <Palette className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                    🎨 Personalización Excel
                  </h1>
                  <p className="text-white/90 text-lg max-w-2xl">
                    Crea documentos Excel profesionales con diseño personalizado y fórmulas automáticas
                  </p>
                </div>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{exportSummary.productCount}</div>
                <div className="text-sm text-white/80">Productos</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{exportSummary.includesFormulas ? '✓' : '✗'}</div>
                <div className="text-sm text-white/80">Fórmulas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{exportSummary.includesColors ? '🎨' : '⚪'}</div>
                <div className="text-sm text-white/80">Colores</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold">{exportSummary.canExport ? '🟢' : '🔴'}</div>
                <div className="text-sm text-white/80">Estado</div>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleQuickExport}
              disabled={!exportSummary.canExport || isGenerating}
              className={`
                inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200
                ${exportSummary.canExport && !isGenerating
                  ? 'bg-white text-purple-600 hover:bg-white/90 shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-white/20 text-white/60 cursor-not-allowed'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
                  Generando...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Generar Excel
                </>
              )}
            </button>

            <button
              onClick={generateSample}
              className="inline-flex items-center px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Ejemplo
            </button>

            <button
              onClick={handleResetConfig}
              className="inline-flex items-center px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Navegación visual por pasos */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          📋 Proceso de Personalización
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: '📄', title: 'Archivo', desc: 'Nombre y formato', status: 'completed' },
            { icon: '🏢', title: 'Encabezados', desc: 'Info institucional', status: 'completed' },
            { icon: '📊', title: 'Tabla', desc: 'Configuración datos', status: 'completed' },
            { icon: '🎨', title: 'Estilos', desc: 'Colores y formato', status: 'completed' },
            { icon: '🚀', title: 'Exportar', desc: 'Generar archivo', status: exportSummary.canExport ? 'ready' : 'pending' },
          ].map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Línea conectora */}
              {index < 4 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-0.5 bg-gray-300 transform translate-x-1/2 z-0"></div>
              )}
              
              <div className="relative z-10 bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100">
                <div className="text-2xl mb-2">{step.icon}</div>
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
                <div className="text-xs text-gray-600">{step.desc}</div>
                
                {/* Indicador de estado */}
                <div className="mt-2">
                  {step.status === 'completed' && (
                    <div className="w-3 h-3 bg-green-400 rounded-full mx-auto"></div>
                  )}
                  {step.status === 'ready' && (
                    <div className="w-3 h-3 bg-blue-400 rounded-full mx-auto animate-pulse"></div>
                  )}
                  {step.status === 'pending' && (
                    <div className="w-3 h-3 bg-gray-300 rounded-full mx-auto"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contenido principal en grid responsivo */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Columna izquierda - Configuraciones */}
        <div className="space-y-8">
          <FileConfigSection />
          <HeaderConfigSection />
          <TableConfigSection />
        </div>

        {/* Columna derecha - Estilos y Vista Previa */}
        <div className="space-y-8">
          <StyleConfigSection />
          <PreviewSection />
        </div>
      </div>

      {/* Sección de exportación - Ancho completo */}
      <ExportButtonSection />

      {/* Información de ayuda */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-200">
        <div className="flex items-start">
          <div className="p-3 bg-emerald-100 rounded-lg mr-4 flex-shrink-0">
            <Settings className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">
              💡 Guía Rápida de Uso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-emerald-800">
              <div>
                <h4 className="font-medium mb-2 text-emerald-900">⚙️ Configuración</h4>
                <ul className="space-y-1">
                  <li>• Personaliza nombre del archivo</li>
                  <li>• Configura encabezados institucionales</li>
                  <li>• Ajusta colores y estilos</li>
                  <li>• Habilita fórmulas automáticas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-emerald-900">📊 Características Excel</h4>
                <ul className="space-y-1">
                  <li>• Fórmulas que se actualizan automáticamente</li>
                  <li>• Formato de moneda colombiana</li>
                  <li>• Filtros automáticos en encabezados</li>
                  <li>• Ajuste automático de columnas</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-emerald-900">🎯 Consejos</h4>
                <ul className="space-y-1">
                  <li>• Usa la vista previa antes de exportar</li>
                  <li>• Las configuraciones se guardan automáticamente</li>
                  <li>• Prueba con el archivo de ejemplo</li>
                  <li>• Los temas aplican colores coordinados</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estado de validación */}
      {!exportSummary.canExport && productos.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Settings className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-medium text-yellow-900">⚠️ Configuración Incompleta</h4>
              <p className="text-sm text-yellow-800 mt-1">
                Hay {exportSummary.validationIssues.length} problema(s) que debes resolver antes de exportar:
              </p>
              <ul className="text-sm text-yellow-800 mt-2 list-disc list-inside">
                {exportSummary.validationIssues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};