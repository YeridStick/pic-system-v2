import React from 'react';
import { Table, Calculator, Filter, Columns, RowsIcon } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';

export const TableConfigSection: React.FC = () => {
  const { excelConfig, updateExcelConfig } = useConfigStore();

  const ConfigToggle: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
    icon?: React.ReactNode;
  }> = ({ checked, onChange, label, description, icon }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <label className="text-sm font-medium text-gray-900 cursor-pointer">
            {label}
          </label>
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6 text-white">
        <div className="flex items-center">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg mr-4">
            <Table className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold">📊 Configuración de la Tabla</h4>
            <p className="text-white/90">Personaliza el formato y comportamiento de la tabla de datos</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna 1: Funcionalidades */}
          <div className="space-y-2">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Funcionalidades</h5>
            
            <ConfigToggle
              checked={excelConfig.includeFormulas}
              onChange={(checked) => updateExcelConfig({ includeFormulas: checked })}
              label="Incluir Fórmulas en Excel"
              description="Las celdas tendrán fórmulas para cálculos automáticos (recomendado)"
              icon={<Calculator className="w-4 h-4 text-purple-500" />}
            />

            <ConfigToggle
              checked={excelConfig.includeTotals}
              onChange={(checked) => updateExcelConfig({ includeTotals: checked })}
              label="Incluir Fila de Totales"
              description="Agrega una fila al final con los totales calculados"
            />

            <ConfigToggle
              checked={excelConfig.currencyFormat}
              onChange={(checked) => updateExcelConfig({ currencyFormat: checked })}
              label="Formato de Moneda Colombiana"
              description="Aplica formato COP a las columnas de valores"
            />

            <ConfigToggle
              checked={excelConfig.autoFilters}
              onChange={(checked) => updateExcelConfig({ autoFilters: checked })}
              label="Filtros Automáticos"
              description="Habilita filtros en los encabezados de la tabla"
              icon={<Filter className="w-4 h-4 text-purple-500" />}
            />
          </div>

          {/* Columna 2: Formato */}
          <div className="space-y-2">
            <h5 className="text-sm font-semibold text-gray-700 mb-3">Formato</h5>
            
            <ConfigToggle
              checked={excelConfig.autoColumnWidth}
              onChange={(checked) => updateExcelConfig({ autoColumnWidth: checked })}
              label="Ajustar Ancho de Columnas"
              description="Ajusta automáticamente el ancho según el contenido"
              icon={<Columns className="w-4 h-4 text-purple-500" />}
            />

            <ConfigToggle
              checked={excelConfig.autoRowHeight}
              onChange={(checked) => updateExcelConfig({ autoRowHeight: checked })}
              label="Ajustar Altura de Filas"
              description="Las filas se expandirán si el texto es muy largo"
              icon={<RowsIcon className="w-4 h-4 text-purple-500" />}
            />

            <ConfigToggle
              checked={excelConfig.centerHeaders}
              onChange={(checked) => updateExcelConfig({ centerHeaders: checked })}
              label="Centrar Encabezados Principales"
              description="Centra el objeto, entidad y categoría en la tabla"
            />

            {/* Ancho máximo de columnas */}
            {excelConfig.autoColumnWidth && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ancho Máximo de Columnas (caracteres)
                </label>
                <input
                  type="number"
                  min="20"
                  max="100"
                  value={excelConfig.maxColumnWidth}
                  onChange={(e) => updateExcelConfig({ maxColumnWidth: parseInt(e.target.value) || 50 })}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="text-xs text-purple-600 mt-1">
                  Valor actual: {excelConfig.maxColumnWidth} caracteres
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <Calculator className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h6 className="font-semibold text-blue-900 mb-2">💡 Sobre las Fórmulas de Excel</h6>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Valor Total:</strong> Se calcula como Costo × (1 + Margen%)</li>
                <li>• <strong>Subtotal:</strong> Se calcula como Valor Total × Cantidad</li>
                <li>• <strong>Totales:</strong> Suma automática de todas las filas</li>
                <li>• <strong>Beneficio:</strong> Los valores se actualizarán automáticamente al editar en Excel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};