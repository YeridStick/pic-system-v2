import React from 'react';
import { Building2, Calendar, User, FileType } from 'lucide-react';
import { useConfigStore } from '../../stores/configStore';

export const HeaderConfigSection: React.FC = () => {
  const { excelConfig, updateExcelConfig } = useConfigStore();

  const toggleSection = (key: keyof typeof excelConfig, enabled: boolean) => {
    updateExcelConfig({ [key]: enabled });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex items-center">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg mr-4">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold">🏢 Información de la Entidad</h4>
            <p className="text-white/90">Configura los encabezados que aparecerán en el documento</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {/* Objeto del Contrato */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={excelConfig.includeContract}
                  onChange={(e) => toggleSection('includeContract', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Incluir Objeto del Contrato
                </span>
              </label>
              <FileType className={`w-5 h-5 ${excelConfig.includeContract ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
            
            {excelConfig.includeContract && (
              <textarea
                value={excelConfig.contractText}
                onChange={(e) => updateExcelConfig({ contractText: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-vertical transition-colors"
                placeholder="Descripción del objeto del contrato..."
              />
            )}
          </div>

          {/* Nombre de la Entidad */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={excelConfig.includeEntity}
                  onChange={(e) => toggleSection('includeEntity', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Incluir Nombre de la Entidad
                </span>
              </label>
              <Building2 className={`w-5 h-5 ${excelConfig.includeEntity ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
            
            {excelConfig.includeEntity && (
              <input
                type="text"
                value={excelConfig.entityName}
                onChange={(e) => updateExcelConfig({ entityName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Nombre de la entidad..."
              />
            )}
          </div>

          {/* Categoría del Material */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={excelConfig.includeCategory}
                  onChange={(e) => toggleSection('includeCategory', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Incluir Categoría de Material
                </span>
              </label>
              <FileType className={`w-5 h-5 ${excelConfig.includeCategory ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
            
            {excelConfig.includeCategory && (
              <input
                type="text"
                value={excelConfig.categoryText}
                onChange={(e) => updateExcelConfig({ categoryText: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Categoría del material..."
              />
            )}
          </div>

          {/* Fecha del Documento */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={excelConfig.includeDate}
                  onChange={(e) => toggleSection('includeDate', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Incluir Fecha de Generación
                </span>
              </label>
              <Calendar className={`w-5 h-5 ${excelConfig.includeDate ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
            
            {excelConfig.includeDate && (
              <input
                type="date"
                value={excelConfig.documentDate}
                onChange={(e) => updateExcelConfig({ documentDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            )}
          </div>

          {/* Responsable */}
          <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={excelConfig.includeResponsible}
                  onChange={(e) => toggleSection('includeResponsible', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Incluir Responsable
                </span>
              </label>
              <User className={`w-5 h-5 ${excelConfig.includeResponsible ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
            
            {excelConfig.includeResponsible && (
              <input
                type="text"
                value={excelConfig.responsibleName}
                onChange={(e) => updateExcelConfig({ responsibleName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Nombre del responsable..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};