// src/stores/configStore.ts - Versión corregida
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ExcelConfig } from '../types/excel';

interface ConfigStore {
  excelConfig: ExcelConfig;
  updateExcelConfig: (updates: Partial<ExcelConfig>) => void;
  resetConfig: () => void;
  exportConfig: () => string;
  importConfig: (configJson: string) => boolean;
  getPreviewData: () => ExcelConfig;
}

// Configuración por defecto
const defaultConfig: ExcelConfig = {
  // Archivo
  fileName: 'PRESUPUESTO_PIC_ALGECIRAS',
  includeDateInFileName: true,
  orientation: 'landscape',
  scale: 85,

  // Entidad
  includeContract: true,
  contractText: 'SUMINISTRO DE MATERIAL DE PAPELERIA, INSUMOS LOGISTICOS Y OTROS PARA LA EJECUCION DE LAS ACTIVIDADES DEL PLAN DE INTERVENCIONES COLECTIVAS (PIC) MUNICIPAL A CARGO DE LA ESE HOSPITAL MUNICIPAL DE ALGECIRAS HUILA',
  includeEntity: true,
  entityName: 'ESE HOSPITAL MUNICIPAL DE ALGECIRAS HUILA',
  includeCategory: true,
  categoryText: 'MATERIAL DE PAPELERIA Y OTROS',
  includeDate: true,
  documentDate: new Date().toISOString().split('T')[0],
  includeResponsible: false,
  responsibleName: '',

  // Tabla
  includeFormulas: true,
  includeTotals: true,
  currencyFormat: true,
  autoFilters: true,
  autoColumnWidth: true,
  maxColumnWidth: 50,
  autoRowHeight: true,
  centerHeaders: true,

  // Estilos
  headerBgColor: '#4CAF50',
  headerTextColor: '#FFFFFF',
  oddRowColor: '#F8F9FA',
  evenRowColor: '#FFFFFF',
  borderColor: '#DDDDDD',
  borderStyle: 'thin',
  totalRowBgColor: '#E8F5E8',

  // Páginas
  margins: {
    left: 0.7,
    right: 0.7,
    top: 0.75,
    bottom: 0.75,
    header: 0.3,
    footer: 0.3
  },

  lastUpdated: new Date().toISOString(),
  version: '1.0',
  fitToPage: true
};

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      excelConfig: defaultConfig,

      updateExcelConfig: (updates: Partial<ExcelConfig>) => {
        set((state) => ({
          excelConfig: {
            ...state.excelConfig,
            ...updates,
            lastUpdated: new Date().toISOString()
          }
        }));
      },

      resetConfig: () => {
        set({
          excelConfig: {
            ...defaultConfig,
            documentDate: new Date().toISOString().split('T')[0], // Fecha actual
            lastUpdated: new Date().toISOString()
          }
        });
      },

      exportConfig: (): string => {
        const config = get().excelConfig;
        return JSON.stringify(config, null, 2);
      },

      importConfig: (configJson: string): boolean => {
        try {
          const parsedConfig = JSON.parse(configJson);
          
          // Validar que tiene las propiedades esenciales
          if (typeof parsedConfig === 'object' && parsedConfig.fileName) {
            set({
              excelConfig: {
                ...defaultConfig,
                ...(parsedConfig as Partial<ExcelConfig>),
                lastUpdated: new Date().toISOString()
              }
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Error importing config:', error);
          return false;
        }
      },

      getPreviewData: (): ExcelConfig => {
        return get().excelConfig;
      }
    }),
    {
      name: 'excel-config-storage',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        // Migración para versiones futuras
        if (version === 0) {
          return {
            ...defaultConfig,
            ...(persistedState as Partial<ConfigStore>),
            lastUpdated: new Date().toISOString()
          };
        }
        return persistedState as ConfigStore;
      }
    }
  )
);

// Hook para temas predefinidos
export const useThemes = () => {
  const { updateExcelConfig } = useConfigStore();

  const themes = [
    {
      name: 'Verde Corporativo',
      headerBgColor: '#4CAF50',
      headerTextColor: '#FFFFFF',
      oddRowColor: '#F8F9FA',
      evenRowColor: '#FFFFFF',
      borderColor: '#DDDDDD',
      totalRowBgColor: '#E8F5E8'
    },
    {
      name: 'Azul Profesional',
      headerBgColor: '#2196F3',
      headerTextColor: '#FFFFFF',
      oddRowColor: '#F3F8FF',
      evenRowColor: '#FFFFFF',
      borderColor: '#E3F2FD',
      totalRowBgColor: '#E3F2FD'
    },
    {
      name: 'Gris Elegante',
      headerBgColor: '#607D8B',
      headerTextColor: '#FFFFFF',
      oddRowColor: '#F5F5F5',
      evenRowColor: '#FFFFFF',
      borderColor: '#EEEEEE',
      totalRowBgColor: '#ECEFF1'
    },
    {
      name: 'Naranja Vibrante',
      headerBgColor: '#FF9800',
      headerTextColor: '#FFFFFF',
      oddRowColor: '#FFF8F0',
      evenRowColor: '#FFFFFF',
      borderColor: '#FFE0B2',
      totalRowBgColor: '#FFE0B2'
    },
    {
      name: 'Púrpura Moderno',
      headerBgColor: '#9C27B0',
      headerTextColor: '#FFFFFF',
      oddRowColor: '#F8F5FF',
      evenRowColor: '#FFFFFF',
      borderColor: '#E1BEE7',
      totalRowBgColor: '#F3E5F5'
    },
    {
      name: 'Verde Oscuro',
      headerBgColor: '#388E3C',
      headerTextColor: '#FFFFFF',
      oddRowColor: '#F1F8E9',
      evenRowColor: '#FFFFFF',
      borderColor: '#C8E6C9',
      totalRowBgColor: '#DCEDC8'
    }
  ];

  const applyTheme = (theme: typeof themes[0]) => {
    updateExcelConfig({
      headerBgColor: theme.headerBgColor,
      headerTextColor: theme.headerTextColor,
      oddRowColor: theme.oddRowColor,
      evenRowColor: theme.evenRowColor,
      borderColor: theme.borderColor,
      totalRowBgColor: theme.totalRowBgColor
    });
  };

  return { themes, applyTheme };
};

// Utilidades de validación
export const validateConfig = (config: ExcelConfig): string[] => {
  const issues: string[] = [];

  if (!config.fileName.trim()) {
    issues.push('El nombre del archivo es requerido');
  }

  if (config.includeEntity && !config.entityName.trim()) {
    issues.push('El nombre de la entidad está habilitado pero vacío');
  }

  if (config.includeContract && !config.contractText.trim()) {
    issues.push('El objeto del contrato está habilitado pero vacío');
  }

  if (config.includeResponsible && !config.responsibleName.trim()) {
    issues.push('El responsable está habilitado pero no se ha especificado un nombre');
  }

  if (config.includeDate && !config.documentDate) {
    issues.push('La fecha está habilitada pero no se ha seleccionado una fecha');
  }

  if (config.maxColumnWidth < 10 || config.maxColumnWidth > 200) {
    issues.push('El ancho máximo de columnas debe estar entre 10 y 200 caracteres');
  }

  return issues;
};

// Hook para estadísticas de configuración
export const useConfigStats = () => {
  const { excelConfig } = useConfigStore();

  const stats = {
    sectionsEnabled: [
      excelConfig.includeContract,
      excelConfig.includeEntity,
      excelConfig.includeCategory,
      excelConfig.includeDate,
      excelConfig.includeResponsible
    ].filter(Boolean).length,
    
    featuresEnabled: [
      excelConfig.includeFormulas,
      excelConfig.includeTotals,
      excelConfig.currencyFormat,
      excelConfig.autoFilters,
      excelConfig.autoColumnWidth,
      excelConfig.autoRowHeight
    ].filter(Boolean).length,

    hasCustomColors: excelConfig.headerBgColor !== defaultConfig.headerBgColor ||
                     excelConfig.oddRowColor !== defaultConfig.oddRowColor ||
                     excelConfig.totalRowBgColor !== defaultConfig.totalRowBgColor,

    configurationScore: 0,
    validationIssues: validateConfig(excelConfig)
  };

  // Calcular puntuación de configuración (0-100)
  stats.configurationScore = Math.round(
    ((stats.sectionsEnabled / 5) * 40) + 
    ((stats.featuresEnabled / 6) * 40) + 
    (stats.hasCustomColors ? 20 : 0)
  );

  return stats;
};