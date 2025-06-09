import React from 'react';
import { FileText, Calendar } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';

export const FileConfigSection: React.FC = () => {
  const { excelConfig, updateExcelConfig } = useConfigStore();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
        <div className="flex items-center">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg mr-4">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold">📄 Configuración del Archivo</h4>
            <p className="text-white/90">Personaliza el nombre y formato del archivo Excel</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Archivo
            </label>
            <input
              type="text"
              value={excelConfig.fileName}
              onChange={(e) => updateExcelConfig({ fileName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="PRESUPUESTO_PIC_ALGECIRAS"
            />
            <p className="text-xs text-gray-500">
              Nombre del archivo sin extensión (.xlsx se agregará automáticamente)
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Incluir Fecha en Nombre
            </label>
            <div className="relative">
              <select
                value={excelConfig.includeDateInFileName ? 'si' : 'no'}
                onChange={(e) => updateExcelConfig({ includeDateInFileName: e.target.value === 'si' })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
              >
                <option value="si">Sí (Ej: PRESUPUESTO_2025-01-15.xlsx)</option>
                <option value="no">No</option>
              </select>
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Preview del nombre */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-900">Vista previa:</span>
          </div>
          <p className="text-blue-800 font-mono text-sm mt-2">
            {excelConfig.fileName}
            {excelConfig.includeDateInFileName && `_${new Date().toISOString().split('T')[0]}`}
            .xlsx
          </p>
        </div>
      </div>
    </div>
  );
};