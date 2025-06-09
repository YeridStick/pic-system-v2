import React from 'react';
import { Palette, Eye } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';

export const StyleConfigSection: React.FC = () => {
  const { excelConfig, updateExcelConfig } = useConfigStore();

  const ColorPicker: React.FC<{
    label: string;
    value: string;
    onChange: (color: string) => void;
    description?: string;
  }> = ({ label, value, onChange, description }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors"
        />
        <div className="flex-1">
          <input
            type="text"
            value={value.toUpperCase()}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            placeholder="#FFFFFF"
          />
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-6 text-white">
        <div className="flex items-center">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg mr-4">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold">🎨 Estilos y Colores</h4>
            <p className="text-white/90">Personaliza la apariencia visual de tu archivo Excel</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colores de Encabezado */}
          <div className="space-y-6">
            <h5 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
              Encabezados de Tabla
            </h5>
            
            <ColorPicker
              label="Color de Fondo de Encabezado"
              value={excelConfig.headerBgColor}
              onChange={(color) => updateExcelConfig({ headerBgColor: color })}
              description="Color de fondo para los títulos de columnas"
            />

            <ColorPicker
              label="Color de Texto de Encabezado"
              value={excelConfig.headerTextColor}
              onChange={(color) => updateExcelConfig({ headerTextColor: color })}
              description="Color del texto en los encabezados"
            />
          </div>

          {/* Colores de Filas */}
          <div className="space-y-6">
            <h5 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
              Filas de Datos
            </h5>
            
            <ColorPicker
              label="Color de Filas Impares"
              value={excelConfig.oddRowColor}
              onChange={(color) => updateExcelConfig({ oddRowColor: color })}
              description="Color de fondo para filas 1, 3, 5..."
            />

            <ColorPicker
              label="Color de Filas Pares"
              value={excelConfig.evenRowColor}
              onChange={(color) => updateExcelConfig({ evenRowColor: color })}
              description="Color de fondo para filas 2, 4, 6..."
            />
          </div>

          {/* Bordes y Totales */}
          <div className="space-y-6">
            <h5 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
              Bordes y Estructura
            </h5>
            
            <ColorPicker
              label="Color de Borde"
              value={excelConfig.borderColor}
              onChange={(color) => updateExcelConfig({ borderColor: color })}
              description="Color de las líneas de borde de la tabla"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Estilo de Borde
              </label>
              <select
                value={excelConfig.borderStyle}
                onChange={(e) => updateExcelConfig({ borderStyle: e.target.value as 'thin' | 'medium' | 'thick' })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="thin">Delgado</option>
                <option value="medium">Mediano</option>
                <option value="thick">Grueso</option>
              </select>
            </div>
          </div>

          {/* Fila de Totales */}
          <div className="space-y-6">
            <h5 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
              Fila de Totales
            </h5>
            
            <ColorPicker
              label="Color de Fondo de Totales"
              value={excelConfig.totalRowBgColor}
              onChange={(color) => updateExcelConfig({ totalRowBgColor: color })}
              description="Color de fondo para la fila de totales"
            />
          </div>
        </div>

        {/* Vista Previa de Colores */}
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <Eye className="w-5 h-5 text-gray-600 mr-2" />
            <h5 className="text-sm font-semibold text-gray-700">Vista Previa de Colores</h5>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: excelConfig.headerBgColor, color: excelConfig.headerTextColor }}>
                  <th className="px-4 py-3 text-left font-semibold border-r" style={{ borderColor: excelConfig.borderColor }}>
                    ITEM
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border-r" style={{ borderColor: excelConfig.borderColor }}>
                    PRODUCTO
                  </th>
                  <th className="px-4 py-3 text-left font-semibold border-r" style={{ borderColor: excelConfig.borderColor }}>
                    CANTIDAD
                  </th>
                  <th className="px-4 py-3 text-left font-semibold" style={{ borderColor: excelConfig.borderColor }}>
                    VALOR TOTAL
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  style={{ 
                    backgroundColor: excelConfig.oddRowColor,
                    borderColor: excelConfig.borderColor
                  }}
                  className="border-b"
                >
                  <td className="px-4 py-2 border-r" style={{ borderColor: excelConfig.borderColor }}>1</td>
                  <td className="px-4 py-2 border-r" style={{ borderColor: excelConfig.borderColor }}>Producto Ejemplo 1</td>
                  <td className="px-4 py-2 border-r" style={{ borderColor: excelConfig.borderColor }}>5</td>
                  <td className="px-4 py-2">$15,000</td>
                </tr>
                <tr 
                  style={{ 
                    backgroundColor: excelConfig.evenRowColor,
                    borderColor: excelConfig.borderColor
                  }}
                  className="border-b"
                >
                  <td className="px-4 py-2 border-r" style={{ borderColor: excelConfig.borderColor }}>2</td>
                  <td className="px-4 py-2 border-r" style={{ borderColor: excelConfig.borderColor }}>Producto Ejemplo 2</td>
                  <td className="px-4 py-2 border-r" style={{ borderColor: excelConfig.borderColor }}>3</td>
                  <td className="px-4 py-2">$9,500</td>
                </tr>
                {excelConfig.includeTotals && (
                  <tr style={{ backgroundColor: excelConfig.totalRowBgColor }} className="font-semibold">
                    <td className="px-4 py-2 border-r" style={{ borderColor: excelConfig.borderColor }}></td>
                    <td className="px-4 py-2">$24,500</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Presets de Colores */}
        <div className="mt-6">
          <h5 className="text-sm font-semibold text-gray-700 mb-3">🎨 Temas Predefinidos</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                name: 'Verde Corporativo',
                header: '#4CAF50',
                text: '#FFFFFF',
                odd: '#F8F9FA',
                even: '#FFFFFF',
                border: '#DDDDDD',
                total: '#E8F5E8'
              },
              {
                name: 'Azul Profesional',
                header: '#2196F3',
                text: '#FFFFFF',
                odd: '#F3F8FF',
                even: '#FFFFFF',
                border: '#E3F2FD',
                total: '#E3F2FD'
              },
              {
                name: 'Gris Elegante',
                header: '#607D8B',
                text: '#FFFFFF',
                odd: '#F5F5F5',
                even: '#FFFFFF',
                border: '#EEEEEE',
                total: '#ECEFF1'
              },
              {
                name: 'Naranja Vibrante',
                header: '#FF9800',
                text: '#FFFFFF',
                odd: '#FFF8F0',
                even: '#FFFFFF',
                border: '#FFE0B2',
                total: '#FFE0B2'
              }
            ].map((theme, index) => (
              <button
                key={index}
                onClick={() => updateExcelConfig({
                  headerBgColor: theme.header,
                  headerTextColor: theme.text,
                  oddRowColor: theme.odd,
                  evenRowColor: theme.even,
                  borderColor: theme.border,
                  totalRowBgColor: theme.total
                })}
                className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
              >
                <div className="text-xs font-medium text-gray-700 mb-2">{theme.name}</div>
                <div className="flex space-x-1">
                  <div className="w-4 h-4 rounded border border-gray-200" style={{ backgroundColor: theme.header }}></div>
                  <div className="w-4 h-4 rounded border border-gray-200" style={{ backgroundColor: theme.odd }}></div>
                  <div className="w-4 h-4 rounded border border-gray-200" style={{ backgroundColor: theme.total }}></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 