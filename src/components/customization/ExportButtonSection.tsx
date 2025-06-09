import React, { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useConfigStore } from "../../stores/configStore";
import { useProductStore } from "../../stores/productStore";
import { ExcelService } from "../../services/excelService";
import toast from "react-hot-toast";

export const ExportButtonSection: React.FC = () => {
  const { excelConfig, updateExcelConfig } = useConfigStore();
  const { productos } = useProductStore();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerateExcel = async (): Promise<void> => {
    if (productos.length === 0) {
      toast.error("❌ No hay productos para exportar");
      return;
    }

    setIsGenerating(true);

    try {
      // Actualizar fecha si está configurado para incluir fecha actual
      if (excelConfig.includeDateInFileName) {
        const today = new Date().toISOString().split("T")[0];
        updateExcelConfig({
          documentDate: today,
        });
      }

      await ExcelService.generateExcel(productos, excelConfig);

      toast.success("🎯 Archivo Excel generado correctamente", {
        duration: 4000,
        icon: "📊",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      console.error("Error generating Excel:", error);
      toast.error(`❌ Error al generar el archivo Excel: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateSample = (): void => {
    try {
      ExcelService.generateSampleFile();
      toast.success("📁 Archivo de ejemplo descargado", {
        duration: 3000,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      toast.error(`❌ Error al generar archivo de ejemplo: ${errorMessage}`);
    }
  };

  const handleSaveConfig = (): void => {
    try {
      // Triggerea el guardado automático
      updateExcelConfig({});
      toast.success("💾 Configuración guardada correctamente", {
        duration: 2000,
      });
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      toast.error("❌ Error al guardar la configuración");
    }
  };

  const getFileName = (): string => {
    let fileName = excelConfig.fileName || "PRESUPUESTO_PIC";
    if (excelConfig.includeDateInFileName) {
      const fecha = new Date().toISOString().split("T")[0];
      fileName += `_${fecha}`;
    }
    return `${fileName}.xlsx`;
  };

  const canExport = productos.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header del componente */}
      <div className="bg-gradient-to-r from-indigo-500 to-teal-400 p-6 text-white">
        <div className="flex items-center">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg mr-4">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold">📥 Generar Archivo Excel</h4>
            <p className="text-white/90">
              Crea y descarga tu archivo Excel personalizado
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Información del archivo a generar */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-semibold text-blue-900">
              📋 Resumen de Configuración
            </h5>
            <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
              {productos.length} producto(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-800">
                <span className="font-medium">Archivo:</span> {getFileName()}
              </p>
              <p className="text-blue-800">
                <span className="font-medium">Orientación:</span>{" "}
                {excelConfig.orientation === "landscape"
                  ? "Horizontal"
                  : "Vertical"}
              </p>
              <p className="text-blue-800">
                <span className="font-medium">Escala:</span> {excelConfig.scale}
                %
              </p>
            </div>
            <div>
              <div className="flex flex-wrap gap-1">
                {excelConfig.includeFormulas && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    ✓ Fórmulas
                  </span>
                )}
                {excelConfig.includeTotals && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    ✓ Totales
                  </span>
                )}
                {excelConfig.currencyFormat && (
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    ✓ Moneda
                  </span>
                )}
                {excelConfig.autoFilters && (
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                    ✓ Filtros
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          {/* Botón principal de generación */}
          <div className="flex-1 w-full sm:w-auto">
            <button
              onClick={handleGenerateExcel}
              disabled={isGenerating || !canExport}
              className={`
        group relative w-full sm:min-w-[240px] inline-flex items-center justify-center 
        px-6 py-3.5 text-base font-semibold rounded-xl 
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-4 focus:ring-offset-2
        ${
          !canExport
            ? "bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300"
            : isGenerating
            ? "bg-blue-600 text-white cursor-wait shadow-lg shadow-blue-500/25 focus:ring-blue-300 scale-[0.98]"
            : `bg-blue-600 text-white shadow-lg shadow-blue-500/25 
               hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 
               hover:scale-105 active:scale-95
               focus:ring-blue-300/50`
        }
      `}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin text-white" />
                  <span className="font-medium text-white">Generando Excel...</span>
                </>
              ) : !canExport ? (
                <>
                  <AlertTriangle className="w-5 h-5 mr-3 text-gray-500" />
                  <span className="font-medium text-gray-500">Sin Productos</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-3 group-hover:animate-bounce transition-transform duration-200 text-white" />
                  <span className="font-semibold tracking-wide text-white">Generar Excel</span>
                </>
              )}

              {/* Efecto shimmer */}
              {!isGenerating && canExport && (
                <div
                   className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                         -skew-x-12 -translate-x-full group-hover:translate-x-full 
                         transition-transform duration-1000 ease-out rounded-xl"
                 />
              )}

              {/* Indicador de estado activo */}
              {canExport && !isGenerating && (
                <div
                   className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-green-500 rounded-full 
                         animate-pulse shadow-md shadow-green-500/50 
                         ring-2 ring-white"
                 />
              )}
            </button>

            {/* Mensaje de ayuda */}
            {!canExport && (
              <p className="text-xs text-gray-500 mt-3 text-center sm:text-left leading-relaxed">
                <svg
                  className="w-4 h-4 inline mr-1 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Agrega productos para habilitar la exportación
              </p>
            )}
          </div>

          {/* Botones secundarios */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleGenerateSample}
              className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium 
                 text-blue-700 bg-blue-50 border border-blue-300 rounded-lg 
                 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-800
                 focus:outline-none focus:ring-4 focus:ring-blue-100
                 transition-all duration-200 group min-w-[140px]"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform text-blue-700" />
              <span>Archivo Ejemplo</span>
            </button>

            <button
              onClick={handleSaveConfig}
              className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium 
                 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg 
                 hover:bg-gray-100 hover:border-gray-400 hover:text-gray-800
                 focus:outline-none focus:ring-4 focus:ring-gray-100
                 transition-all duration-200 group min-w-[140px]"
            >
              <CheckCircle className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform text-gray-700" />
              <span>Guardar Config</span>
            </button>
          </div>
        </div>

        {/* Estado de productos */}
        {productos.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-sm text-green-800">
                <strong>Listo para exportar:</strong> {productos.length}{" "}
                producto(s) configurado(s)
              </p>
            </div>
          </div>
        )}

        {/* Información técnica */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-start">
            <FileSpreadsheet className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
            <div>
              <h6 className="font-semibold text-gray-900 mb-2">
                🔧 Información Técnica
              </h6>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  • <strong>Formato:</strong> Excel (.xlsx) con soporte completo
                  de estilos
                </li>
                <li>
                  • <strong>Compatibilidad:</strong> Excel 2010+, LibreOffice
                  Calc, Google Sheets
                </li>
                <li>
                  • <strong>Características:</strong> Fórmulas activas, formato
                  de moneda, filtros automáticos
                </li>
                <li>
                  • <strong>Configuración:</strong> Se guarda automáticamente en
                  el navegador
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Advertencias si faltan configuraciones importantes */}
        {!excelConfig.includeContract && !excelConfig.includeEntity && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                <strong>Aviso:</strong> No has incluido información de
                encabezado. El archivo solo contendrá la tabla de datos.
              </p>
            </div>
          </div>
        )}

        {/* Funcionalidades avanzadas */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl mb-2">🧮</div>
            <h6 className="font-semibold text-green-900 mb-1">
              Fórmulas Automáticas
            </h6>
            <p className="text-xs text-green-700">
              Cálculos que se actualizan en Excel
            </p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl mb-2">🎨</div>
            <h6 className="font-semibold text-blue-900 mb-1">
              Diseño Personalizado
            </h6>
            <p className="text-xs text-blue-700">
              Colores y estilos profesionales
            </p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl mb-2">💾</div>
            <h6 className="font-semibold text-purple-900 mb-1">
              Configuración Persistente
            </h6>
            <p className="text-xs text-purple-700">
              Tus ajustes se guardan automáticamente
            </p>
          </div>
        </div>

        {/* Shortcut para regenerar con misma config */}
        {productos.length > 0 && (
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h6 className="font-semibold text-indigo-900 mb-1">
                  ⚡ Regeneración Rápida
                </h6>
                <p className="text-sm text-indigo-700">
                  Usa la misma configuración para generar nuevas versiones del
                  archivo
                </p>
              </div>
              <button
                onClick={handleGenerateExcel}
                disabled={isGenerating}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${isGenerating
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
              >
                <RefreshCw className="w-4 h-4 mr-2 text-white" />
                Regenerar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
