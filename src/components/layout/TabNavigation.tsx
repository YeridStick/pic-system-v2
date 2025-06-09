import React from 'react';
import { 
  FileText, 
  Calculator, 
  Settings, 
  Palette, 
  Database,
  ChevronRight
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import type { TabType } from '../../types/ui';

export interface TabItem {
  id: TabType;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

export const tabs: TabItem[] = [
  {
    id: 'productos',
    label: 'Gestión de Productos',
    shortLabel: 'Productos',
    icon: <FileText className="w-5 h-5" />,
    description: 'Agregar y gestionar productos',
    color: 'bg-gradient-to-r from-blue-500 to-blue-600'
  },
  {
    id: 'formulas',
    label: 'Fórmulas y Cálculos',
    shortLabel: 'Fórmulas',
    icon: <Calculator className="w-5 h-5" />,
    description: 'Calculadoras interactivas',
    color: 'bg-gradient-to-r from-green-500 to-green-600'
  },
  {
    id: 'ajustes',
    label: 'Ajustes de Presupuesto',
    shortLabel: 'Ajustes',
    icon: <Settings className="w-5 h-5" />,
    description: 'Configurar presupuestos',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'personalizacion',
    label: 'Personalización Excel',
    shortLabel: 'Excel',
    icon: <Palette className="w-5 h-5" />,
    description: 'Configurar exportación',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'backup',
    label: 'Respaldo y Restauración',
    shortLabel: 'Backup',
    icon: <Database className="w-5 h-5" />,
    description: 'Gestionar respaldos',
    color: 'from-red-500 to-red-600'
  },
];

export const TabNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useUIStore();

  return (
    <nav className="bg-white shadow-lg border-t border-gray-200">
      <div className="mx-auto px-4 justify-center">
        {/* Navegación principal */}
        <div className="flex items-center justify-between">
          {/* Tabs */}
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    'group relative flex items-center space-x-3 px-6 py-4 rounded-t-xl font-medium text-sm',
                    'transition-all duration-300 whitespace-nowrap min-w-fit',
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform -translate-y-1 border-b-4 border-white z-10`
                      : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b-4 border-transparent z-0'
                  ].join(' ')}
                  style={{
                    boxShadow: activeTab === tab.id
                      ? '0 4px 24px 0 rgba(0,0,0,0.08)'
                      : undefined
                  }}
                >
                  {/* Icono */}
                  <div className={[
                    'p-2 rounded-lg transition-all duration-300',
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 group-hover:bg-gray-200 text-gray-600'
                  ].join(' ')}>
                    {tab.icon}
                  </div>

                  {/* Contenido del tab */}
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">
                      <span className="hidden lg:inline">{tab.label}</span>
                      <span className="lg:hidden">{tab.shortLabel}</span>
                    </span>
                    <span className={`
                      text-xs hidden md:inline
                      ${isActive ? 'text-white/80' : 'text-gray-500'}
                    `}>
                      {tab.description}
                    </span>
                  </div>

                  {/* Indicador activo */}
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-white/70" />
                  )}

                  {/* Borde inferior para tab activo */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>          
        </div>
      </div>
    </nav>
  );
};