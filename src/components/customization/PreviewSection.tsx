import React from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';
import { useProductStore } from '../../stores/productStore';

export const PreviewSection: React.FC = () => {
  const { excelConfig } = useConfigStore();
  const { productos } = useProductStore();

  // Función para formatear moneda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Generar datos de ejemplo si no hay productos
  const getDisplayData = () => {
    if (productos && productos.length > 0) {
      return productos.slice(0, 3); // Solo primeros 3 productos
    }
    
    return [
      {
        item: 1,
        producto: "BANDAS ELASTICAS SILICONADAS DE CAUCHO",
        cantidad: 1,
        presentacion: "BOLSA MEDIANA",
        valorCosto: 800,
        margen: 125,
        valorTotal: 1800
      },
      {
        item: 2,
        producto: "BISTURI ENCAUCHETADO 3 HOJAS",
        cantidad: 1,
        presentacion: "UNIDAD", 
        valorCosto: 5450,
        margen: 137.2,
        valorTotal: 12927.40
      },
      {
        item: 3,
        producto: "CD R TORRE X 100 UNIDADES",
        cantidad: 1,
        presentacion: "TORRE",
        valorCosto: 100000,
        margen: 60,
        valorTotal: 160000
      }
    ];
  };

  const displayData = getDisplayData();

  // Configurar estilos de borde
  const getBorderStyle = () => {
    const borderStyle = excelConfig.borderStyle || 'thin';
    const cssBorderStyle = 'solid';
    let cssBorderWidth = '1px';

    switch (borderStyle) {
      case 'medium':
        cssBorderWidth = '2px';
        break;
      case 'thick':
        cssBorderWidth = '3px';
        break;
      default: // 'thin'
        cssBorderWidth = '1px';
    }

    return {
      borderStyle: cssBorderStyle,
      borderWidth: cssBorderWidth,
      borderColor: excelConfig.borderColor || '#DDDDDD'
    };
  };

  const borderStyles = getBorderStyle();

  const renderPreview = () => {
    return (
      <div 
        className="bg-white rounded-xl border-2 p-6 font-arial text-sm"
        style={{ 
          borderColor: excelConfig.borderColor || '#DDDDDD',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        {/* Encabezados principales */}
        {excelConfig.includeContract && excelConfig.contractText && (
          <div 
            className="font-bold text-sm mb-4 uppercase leading-6"
            style={{ 
              textAlign: excelConfig.centerHeaders ? 'center' : 'left',
              lineHeight: 1.4 
            }}
          >
            OBJETO: {excelConfig.contractText}
          </div>
        )}

        {excelConfig.includeEntity && excelConfig.entityName && (
          <div 
            className="font-bold text-sm mb-3"
            style={{ 
              textAlign: excelConfig.centerHeaders ? 'center' : 'left' 
            }}
          >
            {excelConfig.entityName}
          </div>
        )}

        {excelConfig.includeCategory && excelConfig.categoryText && (
          <div 
            className="font-bold text-xs mb-4 p-2 rounded"
            style={{ 
              textAlign: excelConfig.centerHeaders ? 'center' : 'left',
              backgroundColor: '#f0f0f0'
            }}
          >
            {excelConfig.categoryText}
          </div>
        )}

        {excelConfig.includeDate && excelConfig.documentDate && (
          <div 
            className="text-xs text-gray-600 mb-3"
            style={{ 
              textAlign: excelConfig.centerHeaders ? 'center' : 'left' 
            }}
          >
            Fecha: {new Date(excelConfig.documentDate).toLocaleDateString('es-CO')}
          </div>
        )}

        {excelConfig.includeResponsible && excelConfig.responsibleName && (
          <div 
            className="text-xs text-gray-600 mb-3"
            style={{ 
              textAlign: excelConfig.centerHeaders ? 'center' : 'left' 
            }}
          >
            Responsable: {excelConfig.responsibleName}
          </div>
        )}

        {/* Tabla con datos */}
        <div className="mt-8 rounded-lg overflow-hidden" style={borderStyles}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ 
                backgroundColor: excelConfig.headerBgColor || '#4CAF50', 
                color: excelConfig.headerTextColor || '#FFFFFF' 
              }}>
                <th className="p-3 text-center font-bold text-xs" style={borderStyles}>ITEM</th>
                <th className="p-3 text-center font-bold text-xs" style={borderStyles}>PRODUCTO</th>
                <th className="p-3 text-center font-bold text-xs" style={borderStyles}>CANT.</th>
                <th className="p-3 text-center font-bold text-xs" style={borderStyles}>PRESENTACIÓN</th>
                <th className="p-3 text-center font-bold text-xs" style={borderStyles}>VALOR TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((item, index) => {
                const esImpar = index % 2 === 0;
                const colorFila = esImpar 
                  ? excelConfig.oddRowColor || '#F8F9FA'
                  : excelConfig.evenRowColor || '#FFFFFF';

                return (
                  <tr key={index} style={{ backgroundColor: colorFila }}>
                    <td className="p-3 text-center text-xs" style={borderStyles}>
                      {item.item}
                    </td>
                    <td className="p-3 text-left text-xs" style={borderStyles}>
                      {item.producto}
                    </td>
                    <td className="p-3 text-center text-xs" style={borderStyles}>
                      {item.cantidad}
                    </td>
                    <td className="p-3 text-center text-xs" style={borderStyles}>
                      {item.presentacion}
                    </td>
                    <td className="p-3 text-right text-xs font-bold" style={borderStyles}>
                      {formatCurrency(item.valorTotal)}
                    </td>
                  </tr>
                );
              })}

              {/* Fila de totales si está habilitada */}
              {excelConfig.includeTotals && (
                <tr style={{ 
                  backgroundColor: excelConfig.totalRowBgColor || '#E8F5E8',
                  fontWeight: 'bold' 
                }}>
                  <td className="p-3 text-center text-xs" style={borderStyles}></td>
                  <td className="p-3 text-center text-xs" style={borderStyles}>TOTALES</td>
                  <td className="p-3 text-center text-xs" style={borderStyles}></td>
                  <td className="p-3 text-center text-xs" style={borderStyles}></td>
                  <td className="p-3 text-right text-xs font-bold" style={borderStyles}>
                    {formatCurrency(displayData.reduce((sum, item) => sum + item.valorTotal, 0))}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg mr-4">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold">👀 Vista Previa del Documento</h4>
              <p className="text-white/90">Visualiza cómo se verá tu archivo Excel</p>
            </div>
          </div>
          
          {/* Indicador de estado */}
          <div className="text-right">
            <div className="text-sm opacity-90">
              {productos.length > 0 ? 'Datos reales' : 'Datos de ejemplo'}
            </div>
            <div className="text-xs opacity-75">
              {displayData.length} productos mostrados
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Vista previa */}
        {renderPreview()}

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-start">
            <RefreshCw className="w-5 h-5 text-emerald-600 mr-3 mt-0.5" />
            <div>
              <h6 className="font-semibold text-emerald-900 mb-2">
                💡 Información de Vista Previa
              </h6>
              <ul className="text-sm text-emerald-800 space-y-1">
                <li>• <strong>Actualización automática:</strong> Los cambios se reflejan instantáneamente</li>
                <li>• <strong>Datos mostrados:</strong> {productos.length > 0 ? 'Tus productos reales (máx. 3)' : 'Datos de ejemplo para demostración'}</li>
                <li>• <strong>Estilos aplicados:</strong> Los mismos colores y formato que tendrá el Excel</li>
                <li>• <strong>Responsivo:</strong> La vista se adapta al contenido y configuración</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};